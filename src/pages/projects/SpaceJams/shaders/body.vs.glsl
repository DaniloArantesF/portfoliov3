varying vec2 vUV;
varying vec3 vNormal;
uniform float uTime;
varying vec3 vPosition;
varying float intensity;
uniform float[128] uData;
varying float vAmplitude;
#define BIN_COUNT 128.
varying vec3 normalizedPosition;

void main() {
  // Pass uv data to fragment shader
  vUV = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vAmplitude = 2.;
  float freq = 120. *smoothstep(0., 1., vUV.y);
  intensity = sin(uData[int(round(freq))] / 1.) * vAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}