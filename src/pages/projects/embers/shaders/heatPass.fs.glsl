#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D tDiffuse;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(color.rgb, color.a);
}