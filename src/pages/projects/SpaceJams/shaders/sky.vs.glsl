#define BIN_COUNT 32.

uniform float uStarLayerCount;
uniform float uTime;
uniform uint[int(BIN_COUNT)] uData;
varying float intensity;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vAmplitude = 2.;

  float freq = BIN_COUNT * .6 - vUv.y;
  intensity = sin(float(uData[int(round(freq))])) * vAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z+vUv.y, 1.0 );
}