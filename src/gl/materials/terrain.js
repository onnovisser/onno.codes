// import gui from '../gui';
import anime from 'animejs';
import glsl from 'glslify';
import * as THREE from 'three';
import { lerp } from '../utils/math';

const terrainStates = {
  WIREFRAME: 1,
  TEXTURE: 2,
};

class TerrainMaterial extends THREE.MeshPhongMaterial {
  static shader = {
    uniforms: {
      // tex: { value: loadTexture('/tex.jpg') },
      time: { value: performance.now() / 1000 },
      explodeModifier: { value: 0 },
      fill: { value: new THREE.Color(0xfafafc) },
      // stroke: { value: new THREE.Color(0xd6d8e0) },
      stroke: { value: new THREE.Color(0xbbbccd) },
      // fill: { value: new THREE.Color(0xffffff) },
      // stroke: { value: new THREE.Color(0xaaaaaa) },
      noiseA: { value: false },
      noiseB: { value: false },
      dualStroke: { value: false },
      seeThrough: { value: false },
      insideAltColor: { value: true },
      thickness: { value: 0.01 },
      terrainProgress: { value: 0.99 },
      buildupProgress: { value: 0 },
      dashEnabled: { value: false },
      dashRepeats: { value: 2.0 },
      dashOverlap: { value: false },
      dashLength: { value: 0.55 },
      dashAnimate: { value: false },
      squeeze: { value: true },
      squeezeMin: { value: 0.3 },
      squeezeMax: { value: 1 },
    },
    vertexParameters: glsl`
      uniform float time;
      uniform float buildupProgress;
      uniform float explodeModifier;

      attribute vec3 barycentric;
      attribute vec3 centroid;
      attribute float even;

      varying vec3 vBarycentric;
      varying vec3 vPosition;
      varying float vEven;

      #pragma glslify: rotateY = require(glsl-rotate/rotateY)
      #pragma glslify: rotate = require(glsl-rotate/rotate)

      float linearWithOffset(float x, int index, int total) {
        return clamp(float(total) * x - float(index) / (float(total) - 1.) * 2., 0., 1.);
      }

      float linearOverlappingWithOffset(float x, int index, int total) {
        return clamp(.5 * float(total) * x - (.5 * float(index)) / (float(total) - 1.), 0., 1.);
      }

      float easeInOutWithOffset(float x, int index, int total) {
        float v = linearOverlappingWithOffset(x, index, total);
        return 1. / (1. + pow(3., -1. * (10. * v - 5.)));
      }

      // varying vec2 vUv;
      // uniform mat3 uvTransform;
    `,
    vertexPosition: /* glsl */ `
      vBarycentric = barycentric;
      vPosition = position.xyz;
      vEven = even;

      vec3 worldRight = vec3(295, 114, -40);
      vec3 worldCenter = vec3(345, 114, 56);
      vec3 worldLeft = vec3(215, 114, 166);
      vec3 positionFromCentroid = position.xyz - centroid;
      transformed.xyz = centroid;
      float distanceFromCenter = distance(transformed.xz, worldCenter.xz);
      float distanceFromLeft = distance(transformed.xz, worldLeft.xz);
      float distanceFromRight = distance(transformed.xz, worldRight.xz);
      float explodeMultiplier = clamp(easeInOutWithOffset(explodeModifier, 0, 3) * (1. - distanceFromCenter * .03), 0., 1.);
      explodeMultiplier += clamp(easeInOutWithOffset(explodeModifier, 1, 3) * (1. - distanceFromLeft * .03), 0., 1.);
      explodeMultiplier += clamp(easeInOutWithOffset(explodeModifier, 2, 3) * (1. - distanceFromRight * .03), 0., 1.);
      float explodeMultiplierEaseIn = pow(explodeMultiplier, 4.);
      float explodeMultiplierEaseIn2 = pow(explodeMultiplier, 2.);
      float explodeMultiplierEaseOut = pow(explodeMultiplier - 1., 3.) + 1.;
      positionFromCentroid = rotate(positionFromCentroid, normalize(vec3(1, 0, 1)), ((sin(time + 1000. * normal.x) * .25 + .25)) * explodeMultiplierEaseIn2 * (8. + normal.x * 12.));
      transformed += positionFromCentroid;

      vec3 positionFromExlosion;
      if (position.z > 105.) {
        positionFromExlosion = transformed.xyz - worldLeft;
      } else if (position.z > 5.) {
        positionFromExlosion = transformed.xyz - worldCenter;
      } else {
        positionFromExlosion = transformed.xyz - worldRight;
      }
      transformed -= positionFromExlosion;
      positionFromExlosion = rotateY(positionFromExlosion, explodeMultiplierEaseIn * 8.);
      transformed += positionFromExlosion;


      transformed.y += explodeMultiplierEaseIn * 60.;

      // vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    `,
    fragmentParameters: glsl`
    const float PI = 3.14159265359;

    uniform sampler2D tex;
    uniform float time;
    uniform float thickness;
    uniform float terrainProgress;
    uniform float buildupProgress;

    uniform float dashRepeats;
    uniform float dashLength;
    uniform bool dashOverlap;
    uniform bool dashEnabled;
    uniform bool dashAnimate;

    uniform bool seeThrough;
    uniform bool insideAltColor;
    uniform bool dualStroke;
    uniform bool noiseA;
    uniform bool noiseB;

    uniform bool squeeze;
    uniform float squeezeMin;
    uniform float squeezeMax;

    uniform vec3 stroke;
    uniform vec3 fill;


    varying vec3 vBarycentric;
    varying vec3 vPosition;
    varying float vEven;

    // varying vec2 vUv;

    #pragma glslify: noise = require(glsl-noise/simplex/4d)

    // This is like
    float aastep (float threshold, float dist) {
      float afwidth = fwidth(dist) * 0.5;
      return smoothstep(threshold - afwidth, threshold + afwidth, dist);
    }

      vec4 getStyledWireframe (vec3 barycentric, float thicknesss) {
        // this will be our signed distance for the wireframe edge
        float d = min(min(barycentric.x, barycentric.y), barycentric.z);



        // the thickness of the stroke
        float computedThickness = thicknesss;

        // for dashed rendering, we can use this to get the 0 .. 1 value of the line length
        float positionAlong = max(barycentric.x, barycentric.y);
        if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
          positionAlong = 1.0 - positionAlong;
        }

        // if we want to shrink the thickness toward the center of the line segment
        if (squeeze) {
          computedThickness *= mix(squeezeMin, squeezeMax, (1.0 - sin(positionAlong * PI)));
        }


        // compute the anti-aliased stroke edge
        float edge = 1.0 - aastep(computedThickness, d);


        // now compute the final color of the mesh
        vec4 outColor = vec4(0.0);
        vec3 mainStroke = mix(fill, stroke, edge);
        outColor.a = edge;
        outColor.rgb = mainStroke;

        return outColor;
      }
    `,
    fragmentDiffuse: glsl`

        vec4 col = texture2D( tex, vUv );
        col = mapTexelToLinear( col );
        // diffuseColor *= col;


        float influence = noise(vec4(vPosition * .005, 0.));
        vec4 wireframe = getStyledWireframe(vBarycentric, thickness);
        float mask = getStyledWireframe(vBarycentric, clamp(influence * 4. - 4. + terrainProgress * 8., -1.5, 1.)).a;
        // float mask = getStyledWireframe(vBarycentric, clamp(influence * 4. - 4. + (terrainProgress + sin(time)) * 8., -1.5, 1.)).a;

        // gl_FragColor.rgb = mix(wireframe.rgb, diffuseColor.rgb, 1. - mask); // smoothstep(.4, .401, influence)
        gl_FragColor.rgb = mix(wireframe.rgb * (gl_FragColor.rgb / 4. + .75), col.rgb, 1. - mask); // smoothstep(.4, .401, influence)
        // gl_FragColor.rgb = mix((wireframe.rgb) *  (gl_FragColor.rgb), col.rgb, 1. - mask); // smoothstep(.4, .401, influence)

        gl_FragColor.rgb = mix(#fafafc, gl_FragColor.rgb, clamp(buildupProgress * 3. + ((1. - influence) - 1.), 0., 1.));



        // gl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb, clamp(mask - 1. + terrainProgress * 2., .0, .1)); // smoothstep(.4, .401, influence)
        // gl_FragColor.rgb = diffuseColor.rgb;

        // gl_FragColor.rgb = reflectedLight.directDiffuse;

        // gl_FragColor.rgb = (gl_FragColor.rgb / 2. + .5) * wireframe.rgb;
        // gl_FragColor = vec4(vec3(influence), 1.);

        if (gl_FrontFacing == false && vPosition.x > 150.) {
          gl_FragColor.rgb = vec3(.0);
        }
      `,
  };

  terrainState = terrainStates.WIREFRAME;
  explodeModifierTarget = 0;
  visible = false;

  constructor(props, uniforms, app) {
    super({
      ...props,
      // map: loadTexture('/white.png'),
      color: new THREE.Color(0xfafafc),
      flatShading: true,
      side: THREE.DoubleSide,
    });
    this.app = app;
    this.addedUniforms = uniforms;
    this.extensions = {
      derivatives: true,
    };
  }
  onBeforeCompile = shader => {
    this.uniforms = shader.uniforms;
    Object.assign(
      this.uniforms,
      TerrainMaterial.shader.uniforms,
      this.addedUniforms
    );

    shader.vertexShader = `
        ${TerrainMaterial.shader.vertexParameters}
        ${shader.vertexShader}
      `.replace(
      '#include <project_vertex>',
      `
        ${TerrainMaterial.shader.vertexPosition}
        #include <project_vertex>
      `
    );

    shader.fragmentShader = `
        ${TerrainMaterial.shader.fragmentParameters}
        ${shader.fragmentShader}
      `.replace(
      'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      `
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        ${TerrainMaterial.shader.fragmentDiffuse}
      `
    );

    // if (castShadow) {
    //   // Create custom material for shadows
    //   const customMaterial = new THREE.ShaderMaterial({
    //     vertexShader: shader.vertexShader,
    //     fragmentShader: THREE.ShaderLib.shadow.fragmentShader,
    //     uniforms,
    //   })
    //   // Turn on shadows
    //   mesh.castShadow = true
    //   mesh.customDepthMaterial = customMaterial
    //   mesh.customDistanceMaterial = customMaterial
    // }
    this.app.emitter.on('update', this.update);
    this.app.emitter.onWithLast('changePage', this.setState);
    this.app.emitter.onWithLast(
      'changeExplodeModifier',
      this.setExplodeModifier
    );

    // gui
    //   .addNew('terrain', 0.99, 0, 1)
    //   .onChange(v => (this.uniforms.terrainProgress.value = v));
  };

  update = ({ time, delta }) => {
    this.uniforms.time.value = time;
    const terrainProgressTarget =
      this.terrainState === terrainStates.WIREFRAME ? 1 : 0;
    this.uniforms.terrainProgress.value = lerp(
      this.uniforms.terrainProgress.value,
      terrainProgressTarget,
      delta * 0.5
    );

    this.uniforms.buildupProgress.value = lerp(
      this.uniforms.buildupProgress.value,
      this.visible ? 1 : 0,
      delta * 0.5
    );

    this.uniforms.explodeModifier.value = this.explodeModifierTarget;
  };

  setState = state => {
    if (state === 0) {
      this.terrainState = terrainStates.WIREFRAME;
    } else {
      this.terrainState = terrainStates.TEXTURE;
    }
  };

  setExplodeModifier = value => {
    anime({
      targets: this,
      explodeModifierTarget: value,
      duration: 1500,
      easing: 'easeOutQuad',
    });
  };

  show() {
    this.visible = true;
  }

  dispose() {
    super.dispose();

    // this.app.emitter.off('update', this.update);
  }
}

export default TerrainMaterial;
