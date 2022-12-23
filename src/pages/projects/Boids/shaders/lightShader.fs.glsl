#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
uniform float index;
uniform vec3 randomColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 color = randomColor;
  color *= step(.5, abs(sin(index*200. + uTime)));

  gl_FragColor = vec4(color,1.);
}