#ifdef GL_ES
precision mediump float;
#endif

#define BIN_COUNT 32.

uniform float uStarLayerCount;
uniform float uTime;
uniform float fft;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vAmplitude = 2.;

  float freq = BIN_COUNT * .6 - vUv.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z+vUv.y, 1.0 );
}