#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
uniform float index;
uniform vec3 color;
uniform float frequency;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 vColor = color;
  vColor *= step(.5, abs(sin((index * 1./frequency) + frequency * uTime)));

  gl_FragColor = vec4(vColor,1.);
}