#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}