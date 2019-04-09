import glsl from 'glslify';
import * as THREE from 'three';
import emitter from '../../utils/emitter';
import gui from '../gui';
import loadTexture from '../utils/loadTexture';

class TerrainMaterial extends THREE.MeshPhongMaterial {
  static shader = {
    uniforms: {
      tex: { value: loadTexture('/tex.jpg') },
      time: { value: performance.now() / 1000 },
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
      dashEnabled: { value: false },
      dashRepeats: { value: 2.0 },
      dashOverlap: { value: false },
      dashLength: { value: 0.55 },
      dashAnimate: { value: false },
      squeeze: { value: true },
      squeezeMin: { value: 0.3 },
      squeezeMax: { value: 1 },
    },
    vertexParameters: /* glsl */ `
      uniform float time;

      attribute vec3 barycentric;
      attribute float even;

      varying vec3 vBarycentric;
      varying vec3 vPosition;
      varying float vEven;

      // varying vec2 vUv;
      // uniform mat3 uvTransform;
    `,
    vertexPosition: /* glsl */ `
      vBarycentric = barycentric;
      vPosition = position.xyz;
      vEven = even;
      // vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    `,
    fragmentParameters: glsl`
    const float PI = 3.14159265359;

    uniform sampler2D tex;
    uniform float time;
    uniform float thickness;
    uniform float terrainProgress;

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

      // This function returns the fragment color for our styled wireframe effect
      // based on the barycentric coordinates for this fragment
      // vec4 getStyledWireframe (vec3 barycentric) {
      //   // this will be our signed distance for the wireframe edge
      //   float d = min(min(barycentric.x, barycentric.y), barycentric.z);

      //   // we can modify the distance field to create interesting effects & masking
      //   float noiseOff = 0.0;
      //   if (noiseA) noiseOff += noise(vec4(vPosition.xyz * 1.0, time * 0.35)) * 0.15;
      //   if (noiseB) noiseOff += noise(vec4(vPosition.xyz * 80.0, time * 0.5)) * 0.12;
      //   d += noiseOff;

      //   // for dashed rendering, we can use this to get the 0 .. 1 value of the line length
      //   float positionAlong = max(barycentric.x, barycentric.y);
      //   if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
      //     positionAlong = 1.0 - positionAlong;
      //   }

      //   // the thickness of the stroke
      //   float computedThickness = thickness;

      //   // if we want to shrink the thickness toward the center of the line segment
      //   if (squeeze) {
      //     computedThickness *= mix(squeezeMin, squeezeMax, (1.0 - sin(positionAlong * PI)));
      //   }

      //   // if we should create a dash pattern
      //   if (dashEnabled) {
      //     // here we offset the stroke position depending on whether it
      //     // should overlap or not
      //     float offset = 1.0 / dashRepeats * dashLength / 2.0;
      //     if (!dashOverlap) {
      //       offset += 1.0 / dashRepeats / 2.0;
      //     }

      //     // if we should animate the dash or not
      //     if (dashAnimate) {
      //       offset += time * 0.22;
      //     }

      //     // create the repeating dash pattern
      //     float pattern = fract((positionAlong + offset) * dashRepeats);
      //     computedThickness *= 1.0 - aastep(dashLength, pattern);
      //   }

      //   // compute the anti-aliased stroke edge
      //   float edge = 1.0 - aastep(computedThickness, d);

      //   // now compute the final color of the mesh
      //   vec4 outColor = vec4(0.0);
      //   if (seeThrough) {
      //     outColor = vec4(stroke, edge);
      //     if (insideAltColor && !gl_FrontFacing) {
      //       outColor.rgb = fill;
      //     }
      //   } else {
      //     vec3 mainStroke = mix(fill, stroke, edge);
      //     outColor.a = 1.0;
      //     if (dualStroke) {
      //       float inner = 1.0 - aastep(terrainProgress, d);
      //       vec3 wireColor = mix(fill, stroke, abs(inner - edge));
      //       outColor.rgb = wireColor;
      //     } else {
      //       outColor.rgb = mainStroke;
      //     }
      //   }

      //   return outColor;
      // }

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
    fragmentDiffuse: /* glsl */ `

        vec4 col = texture2D( tex, vUv );
        col = mapTexelToLinear( col );
        // diffuseColor *= col;




        float influence = noise(vec4(vPosition * .005, 0.));
        vec4 wireframe = getStyledWireframe(vBarycentric, thickness);
        float mask = getStyledWireframe(vBarycentric, clamp(influence * 4. - 4. + (terrainProgress) * 8., -1.5, 1.)).a;

        // gl_FragColor.rgb = mix(wireframe.rgb, diffuseColor.rgb, 1. - mask); // smoothstep(.4, .401, influence)
        gl_FragColor.rgb = mix(wireframe.rgb *  (gl_FragColor.rgb / 4. + .75), col.rgb, 1. - mask); // smoothstep(.4, .401, influence)
        // gl_FragColor.rgb = mix((wireframe.rgb) *  (gl_FragColor.rgb), col.rgb, 1. - mask); // smoothstep(.4, .401, influence)




        // gl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb, clamp(mask - 1. + terrainProgress * 2., .0, .1)); // smoothstep(.4, .401, influence)
        // gl_FragColor.rgb = diffuseColor.rgb;

        // gl_FragColor.rgb = reflectedLight.directDiffuse;

        // gl_FragColor.rgb = (gl_FragColor.rgb / 2. + .5) * wireframe.rgb;
        // gl_FragColor = vec4(vec3(influence), 1.);
      `,
  };

  constructor(props) {
    super({
      ...props,
      map: loadTexture('/white.png'),
      color: new THREE.Color(0xfafafc),
    });
    this.extensions = {
      derivatives: true,
    };
  }
  onBeforeCompile = shader => {
    console.log(shader);
    this.uniforms = shader.uniforms;
    Object.assign(this.uniforms, TerrainMaterial.shader.uniforms);

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

    emitter.on('update', this.update);

    gui
      .addNew('terrain', .99, 0, 1)
      .onChange(v => (this.uniforms.terrainProgress.value = v));
  };

  update = ({ time }) => {
    this.uniforms.time.value = time;
  };

  dispose() {
    super.dispose();

    emitter.off('update', this.update);
  }
}

export default TerrainMaterial;
