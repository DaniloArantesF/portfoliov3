#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define BIN_COUNT 32.
#define MAX_INTENSITY 255.

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform uint[int(BIN_COUNT)] uData;

void main(){
  vec2 uv = vUv;
  uv *= vec2(BIN_COUNT -1., MAX_INTENSITY + 1.);

  vec2 gv = fract(uv);

  int binIndex = int(mod(floor(uv.x), BIN_COUNT));
  float intensity = float(uData[binIndex]);

  float c = (intensity > 0. && uv.y <= intensity) ? 1. : 0.;

  gl_FragColor = vec4(vec3(c), 1.);
}