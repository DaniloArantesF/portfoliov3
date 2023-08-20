#define BIN_COUNT 32.
#define SCALE 64.

uniform float uTime;
uniform float fft;
varying float intensity;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 normalizedPosition;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Pass uv data to fragment shader
  vUv = uv;
  vPosition = position;
  vAmplitude = 15.;
  vNormal = normalize(normalMatrix * normal);

  float scale = 50.;
  normalizedPosition = abs(position/SCALE);
  float freq = (BIN_COUNT * normalizedPosition.y);
  intensity = sin(fft) * vAmplitude;

  gl_PointSize = 1. + 1.5 * smoothstep(0.2, .8, (1. - normalizedPosition.y)) + .5 * (1. - intensity/vAmplitude);

  float hOffset = 2.5 * (exp(1.-normalizedPosition.y)-.8)/2.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y + max(0., vAmplitude - intensity), position.z , 1.0 );
}