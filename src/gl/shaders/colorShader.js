import glsl from 'glslify';
import * as THREE from 'three';

function createColorShader(canvasWidth, canvasHeight) {
  return {
    shaderID: 'color',

    uniforms: {
      tDiffuse: { type: 't', value: null },
      uBrightness: { value: 1 },
      uContrast: { value: 1 },
      uColor: { value: new THREE.Vector3(1, 1, 1) },
      uSaturation: { value: 1 },
      uResolution: {
        value: new THREE.Vector2(canvasWidth, canvasHeight),
      },

      scale: { value: new THREE.Vector2(1, 1) },
      offset: { value: new THREE.Vector2(-0.05, -0.15) },
      coloredNoise: { value: true },

      smoothing: { value: new THREE.Vector2(-0.5, 1) },
      noiseAlpha: { value: 0.15 },

      color1: { value: new THREE.Color(0xffffff) },
      color2: { value: new THREE.Color(0x888888) },
    },

    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
    fragmentShader: glsl`
    uniform sampler2D tDiffuse;
    uniform float uBrightness;
    uniform float uContrast;
    uniform vec3 uColor;
    uniform float uSaturation;
    uniform vec2 uResolution;


    #pragma glslify: random = require('glsl-random')
    #pragma glslify: blend = require('glsl-blend-overlay')

    uniform vec2 scale;
    uniform vec2 offset;
    uniform bool coloredNoise;

    uniform vec2 smoothing;
    uniform float noiseAlpha;

    uniform vec3 color1;
    uniform vec3 color2;

    varying vec2 vUv;

    #pragma glslify: ca = require('glsl-chromatic-aberration')


    // https://taylorpetrick.com/portfolio/webgl/lense
    vec4 ca6(sampler2D tex_sampler, vec2 tex_coord, vec2 res, vec2 dir) {
      vec2 delta = tex_coord - vec2(.5);
      float dist = distance(tex_coord, vec2(.5));
      vec3 norm = normalize(vec3(delta.x, delta.y, sqrt(0.5 - pow(delta.x, 4.) - pow(delta.y, 4.))   ));// * sqrt(0.7 - pow(delta.x, 4.) - pow(delta.y, 4.)) ));

      float factor = .4;//smoothstep(dist, 0.502, 0.5) * step(dist, 0.5);
      vec3 refr_r = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.150));
      vec3 refr_y = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.153));
      vec3 refr_g = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.156));
      vec3 refr_c = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.159));
      vec3 refr_b = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.162));
      vec3 refr_p = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.165));

      float r = texture2D(tex_sampler, refr_r.xy + tex_coord).x * 0.5;
      float y = (texture2D(tex_sampler, refr_y.xy + tex_coord).x * 2.0 +
      texture2D(tex_sampler, refr_y.xy + tex_coord).y * 2.0 -
      texture2D(tex_sampler, refr_y.xy + tex_coord).z)/6.0;
      float g = texture2D(tex_sampler, refr_g.xy + tex_coord).y * 0.5;
      float c = (texture2D(tex_sampler, refr_c.xy + tex_coord).y * 2.0 +
      texture2D(tex_sampler, refr_c.xy + tex_coord).z * 2.0 -
      texture2D(tex_sampler, refr_c.xy + tex_coord).x)/6.0;
      float b = texture2D(tex_sampler, refr_b.xy + tex_coord).z * 0.5;
      float p = (texture2D(tex_sampler, refr_p.xy + tex_coord).z * 2.0 +
      texture2D(tex_sampler, refr_p.xy + tex_coord).x * 2.0 -
      texture2D(tex_sampler, refr_p.xy + tex_coord).y)/6.0;

      float R = r + (2.0*p + 2.0*y - c)/3.0;
      float G = g + (2.0*y + 2.0*c - p)/3.0;
      float B = b + (2.0*c + 2.0*p - y)/3.0;

      // vec3 color = texture2D(tex_sampler, tex_coord).xyz * (1.0 - factor);
      // color += vec3(R,G,B) * (factor);
      vec3 color = vec3(R,G,B);

      return vec4(color,1.0);
    }







    void main() {
      // vec2 uv = gl_FragCoord.xy / uResolution;
      vec2 direction = ( vUv - .5 ) * 6.0;

      gl_FragColor = ca( tDiffuse, vUv, uResolution.xy, direction );











      // // vec4 texel = texture2D( tDiffuse, vUv );
      // // gl_FragColor = texel * adj;

      // float aspect = uResolution.x / uResolution.y;
      // float radius = max(uResolution.x, uResolution.y) * 1.05;
      // vec2 scal = vec2(1. / uResolution.x * radius, 1. / uResolution.y * radius);
      // vec2 pos = vUv;
      // pos -= 0.5;

      // pos.x *= aspect;
      // pos /= scale;
      // pos -= offset;

      // float dist = length(pos);
      // dist = smoothstep(smoothing.x, smoothing.y, 1.-dist);

      // vec4 color = vec4(1.0);
      // color.rgb = mix(color2, color1, dist);

      // if (noiseAlpha > 0.0) {
        //   vec3 noise = coloredNoise ? vec3(random(vUv * 1.5), random(vUv * 2.5), random(vUv)) : vec3(random(vUv));
        //   color.rgb = mix(color.rgb, blend(color.rgb, noise), noiseAlpha);
        // }

        // gl_FragColor *= color;
      }
      `,
  };
}

export default createColorShader;
