#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
  vec2 st = gl_FragCoord.xy/uResolution;
  gl_FragColor = vec4(vec3(1.),1.);
}