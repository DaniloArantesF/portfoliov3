#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define BIN_COUNT 32.
#define MAX_INTENSITY 255.

uniform float uTime;
uniform float waveAmplitude;
uniform float waveFrequency;
uniform uint[int(BIN_COUNT)] uData;
uniform vec2 uResolution;
varying float elevation;
varying float vPrime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 position = vPosition + .5;
  vec2 uv = vUv - .5;
  vec3 color = vec3(1.);


  // uv *= vec2(BIN_COUNT -1., MAX_INTENSITY + 1.);
  // vec2 gv = fract(uv);
  // int binIndex = int(mod(floor(uv.x), BIN_COUNT));
  // float intensity = float(uData[binIndex]);
  color = mix(vec3(0.4, 0.1, .8), vec3(.8, 0.1, 0.4), elevation/waveAmplitude);
  gl_FragColor = vec4(color, vPrime);
}
