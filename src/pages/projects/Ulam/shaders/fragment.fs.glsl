#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec2 gridSize;
uniform bool[961] numbers;

void main() {
  vec2 uv = vUv * gridSize;

  vec2 gv = fract(uv);
  vec2 id = floor(uv);

  // Start from top to bottom
  float index = (gridSize[0] - id[1] - 1.) * gridSize[0] + id[0];
  bool isPrime = numbers[int(index)];

  vec3 color = vec3(isPrime ? 1. : 0., 0., 0.);

  float lineWidth = .05;

  if (!isPrime && (gv.x < lineWidth || gv.y < lineWidth)) {
    color = vec3(.3);
  }
  gl_FragColor = vec4(color ,1.);
}
