#define BIN_COUNT 16.
#define SCALE 50.

uniform float uTime;
uniform sampler2D fftTexture;
varying float vIntensity;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 normalizedPosition;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  vAmplitude = 30.;
  vNormal = normalize(normalMatrix * normal);

  float dist = distance(vPosition.xz / SCALE, vec2(0.0));
  float gv = fract(dist * BIN_COUNT);
  float gd = floor((dist) * BIN_COUNT) / BIN_COUNT;
  vIntensity = texture2D(fftTexture, vec2(gd, 0.5)).r;

  float yOffset = min(vIntensity * vAmplitude, vAmplitude * .4);

  gl_PointSize = 1. + vIntensity;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y + yOffset, position.z , 1.0 );
}