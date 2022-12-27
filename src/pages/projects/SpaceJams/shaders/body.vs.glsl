#define BIN_COUNT 32.

uniform float uTime;
uniform uint[int(BIN_COUNT)] uData;
varying float intensity;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 normalizedPosition;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vAmplitude = 2.;

  float freq = BIN_COUNT *smoothstep(0.2, 0.5, vUv.y);
  intensity = sin(float(uData[int(round(freq))])) * vAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}