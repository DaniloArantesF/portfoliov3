#ifdef GL_ES
precision mediump float;
#endif

#define BIN_COUNT 32.

uniform float uTime;
varying float intensity;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 normalizedPosition;
varying vec3 vNormal;
varying vec3 vPosition;
uniform float fft;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vAmplitude = 2.;

  float freq = BIN_COUNT *smoothstep(0.2, 0.5, vUv.y);
  intensity = sin(fft) * vAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}