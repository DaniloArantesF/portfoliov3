varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

void main() {
  // Pass uv data to fragment shader
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  // Update vertex position
  gl_PointSize = 1.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}