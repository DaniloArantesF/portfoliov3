#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
varying vec3 vPosition;

void main() {
  // Pass uv data to fragment shader
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;

  // Update vertex position
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}