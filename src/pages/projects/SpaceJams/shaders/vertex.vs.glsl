varying vec2 vUv;
varying vec3 vNormal;
varying float vAmplitude;
uniform float uTime;
varying vec3 vPosition;

varying float intensity;
varying vec3 normalizedPosition;

#define BIN_COUNT 128.
#define SCALE 64.

attribute vec3 translate;
uniform float[128] uData;

void main() {
  // Pass uv data to fragment shader
  vUv = uv;
  vPosition = position;
  vAmplitude = 15.;
  vNormal = normalize(normalMatrix * normal);
  // Update vertex position
  float scale = 50.;

  normalizedPosition = abs(position/SCALE);
  // float freq = 64. - (64. * normalizedPosition.y);
  float freq = (64. * normalizedPosition.y);
  // intensity = sin(uData[int(round(abs(position.x)))] / 32.0 + uData[] / 16.0 + uData[int(round(abs(position.z)))] / 32.0) * vAmplitude;
  intensity = sin(uData[int(round(freq))] / 24.) * vAmplitude;

  gl_PointSize = 1. + 1.5 * smoothstep(0.2, .8, (1. - normalizedPosition.y)) + .5 * (1. - intensity/vAmplitude);

  //

  float hOffset = 2.5 * (exp(1.-normalizedPosition.y)-.8)/2.;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + hOffset, position.y + (vAmplitude - intensity), position.z + hOffset, 1.0 );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y + max(0., vAmplitude - intensity), position.z , 1.0 );
}