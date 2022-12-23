#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 color = vec3(0., 1., 0.);
  color *= step(.5, abs(sin(uTime * 2.)));

  gl_FragColor = vec4(color,1.);
}