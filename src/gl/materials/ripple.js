
class TerrainMaterial extends THREE.MeshBasicMaterial {
  static shader = {
    uniforms: {
      time: { value: performance.now() },
      timeScale: { value: 4 },
      rippleDecay: { value: 0.5 },
      rippleSpeed: { value: 5 },
      rippleRadius: { value: 0.7 },
      uTexture: { value: textureLoader.load(require('./images/matcaps/Warmth5.png'))},
      impactPos: {
        value: [
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3()
        ]
      },
      impactDir: {
        value: [
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3()
        ]
      },
      impactTime: { value: [-10000, -10000, -10000, -10000] }
    },
    /*

11: uniform mat4 modelMatrix;
12: uniform mat4 modelViewMatrix;
13: uniform mat4 projectionMatrix;
14: uniform mat4 viewMatrix;
15: uniform mat3 normalMatrix;
16: uniform vec3 cameraPosition;
    */
    vertexParameters: `
      #define E 2.718281828459045
      #define RIPPLE_COUNT ${RIPPLE_COUNT}
      uniform float time;
      uniform vec3 impactDir[RIPPLE_COUNT];
      uniform vec3 impactPos[RIPPLE_COUNT];
      uniform float impactTime[RIPPLE_COUNT];
      uniform float rippleDecay;
      uniform float rippleSpeed;
      uniform float rippleRadius;
      uniform float timeScale;

      varying vec3 vPosition;
      // varying vec3 vNormal;
      varying float vRipple;
      varying vec3 vCamPos;
    `,
    vertexPosition: `
      vec3 newPosition = transformed;
      vRipple = 0.0;

      for (int i = 0; i < RIPPLE_COUNT; i++) {
          float rippleTime = (time - impactTime[i]) * 0.001;
          rippleTime *= timeScale;
          float impactDistance = distance(newPosition, impactPos[i]);
          float rippleDelayedTime = max(rippleTime - impactDistance, 0.0);
          float ripple = pow(E, -rippleDecay * rippleDelayedTime) * cos(rippleSpeed * rippleDelayedTime - 0.5 * PI);
          float rippleScale = max(1.0 - impactDistance * (1.0 - rippleRadius), 0.0);
          newPosition += impactDir[i] * ripple * rippleScale;
          vRipple += ripple * rippleScale;
      }

      vec4 p = vec4(newPosition, 1.0);

      // gl_Position = projectionMatrix * modelViewMatrix * p;
      transformed = newPosition;
      vPosition = normalize( vec3( modelViewMatrix * p ) );
      // vNormal = normal;
      vCamPos = cameraPosition;
    `,
    fragmentParameters: `
    uniform sampler2D uTexture;

    varying float vRipple;
    varying vec3 vPosition;
    varying vec3 vCamPos;

    vec2 matcap(vec3 eye, vec3 normal) {
      vec3 reflected = reflect(eye, normal);
      float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
      return reflected.xy / m + 0.5;
    }

    vec3 blendOverlay(vec3 base, vec3 blend) {
      return mix(1.0 - 2.0 * (1.0 - base) * (1.0 - blend), 2.0 * base * blend, step(base, vec3(0.5)));
      // with conditionals, may be worth benchmarking
      // return vec3(
      //     base.r < 0.5 ? (2.0 * base.r * blend.r) : (1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r)),
      //     base.g < 0.5 ? (2.0 * base.g * blend.g) : (1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g)),
      //     base.b < 0.5 ? (2.0 * base.b * blend.b) : (1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b))
      // );
    }

    vec3 blendSoftLight(vec3 base, vec3 blend) {
      return mix(
          sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
          2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
          step(base, vec3(0.5))
      );
    }

    `,
    fragmentDiffuse: `

    // vec2 uv = matcap(vPosition, vNormal).xy;
    // vec3 color2 = texture2D(uTexture,uv).rgb;
    // vec3 color1 = gl_FragColor.rgb  * max(1.0 - vRipple, 1.0);
    // gl_FragColor = vec4(mix(color1, color2, 1.), 1.0 );
    // // gl_FragColor.rgb = blendOverlay(gl_FragColor.rgb, color2);
    // gl_FragColor = vec4(dot(normalize(vCamPos), vNormal ));
      `
  };

  impactIndex = -1;

  constructor() {
    super({
      emissive: new THREE.Color(0.2, 0.25, 0.4),
      emissiveIntensity: 0.4,
      roughness: 0.5,
      metalness: 0,
      color: 0xffffff,
      envMap: textureCube,
      envMapIntensity: 3
    });

    this.onBeforeCompile = shader => {
      this.uniforms = shader.uniforms;
      Object.assign(this.uniforms, RippleMaterial.shader.uniforms);

      shader.vertexShader = `
        ${RippleMaterial.shader.vertexParameters}
        ${shader.vertexShader}
      `.replace(
        "#include <project_vertex>",
        `
        ${RippleMaterial.shader.vertexPosition}
        #include <project_vertex>
      `
      );

      shader.fragmentShader = `
        ${RippleMaterial.shader.fragmentParameters}
        ${shader.fragmentShader}
      `.replace(
        "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
        `
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        ${RippleMaterial.shader.fragmentDiffuse}
      `
      );
      if (castShadow) {
        // Create custom material for shadows
        const customMaterial = new THREE.ShaderMaterial({
          vertexShader: shader.vertexShader,
          fragmentShader: THREE.ShaderLib.shadow.fragmentShader,
          uniforms,
        });
        // Turn on shadows
        mesh.castShadow = true;
        mesh.customDepthMaterial = customMaterial;
        mesh.customDistanceMaterial = customMaterial;
      }
    };
  }

  makeImpact(point, direction) {
    this.impactIndex = ++this.impactIndex % RIPPLE_COUNT;
    this.uniforms.impactPos.value[this.impactIndex] = point;
    this.uniforms.impactDir.value[this.impactIndex] = direction;
    this.uniforms.impactTime.value[this.impactIndex] = performance.now();
    console.log(this.uniforms);
  }

  loop = timestamp => {
    window.requestAnimationFrame(this.loop);
    this.uniforms.time.value = timestamp;
  };
}
