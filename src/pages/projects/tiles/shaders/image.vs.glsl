#ifdef GL_ES
precision mediump float;
#endif

uniform float uTest;
uniform float uTime;
varying float vTest;
varying float vTime;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Pass uv data to fragment shader
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  // vTime = uTime;

  // Update vertex position
  gl_PointSize = 1.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}