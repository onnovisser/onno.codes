#define E 2.718281828459045
#define PI 3.141592653589793

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;
uniform float time;
// uniform vec3 impactDir[RIPPLE_COUNT];
uniform vec3 impactPos[RIPPLE_COUNT];
uniform float impactTime[RIPPLE_COUNT];
uniform float rippleDecay;
uniform float rippleSpeed;

varying vec3 vPosition;

#pragma glslify: nosie = require(glsl-noise/simplex/2d)
#pragma glslify: nosie3 = require(glsl-noise/simplex/3d)

void main() {
    vec3 newPosition = position;
    float brightness = nosie(position.xy);
    vec3 col = #ff0000;

    for (int i = 0; i < RIPPLE_COUNT; i++) {
        float rippleTime = (time - impactTime[i]) * 0.001;
        rippleTime *= 4.;
        float impactDistance = distance(newPosition, impactPos[i]);
        float rippleDelayedTime = max(rippleTime - impactDistance, 0.0);
        float ripple = pow(E, -rippleDecay * rippleDelayedTime) * cos(rippleSpeed * rippleDelayedTime - .5 * PI);
        float rippleScale = max(1. - impactDistance * .2, 0.0);
        newPosition += ripple * rippleScale;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vPosition = newPosition;
}
