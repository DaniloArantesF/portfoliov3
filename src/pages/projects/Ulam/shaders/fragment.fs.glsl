#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying float vNumber;

void main() {
  vec3 color = vec3(vNumber);
  gl_FragColor = vec4(color, vNumber);
}
