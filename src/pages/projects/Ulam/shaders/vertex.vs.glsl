varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  // Update vertex position
  gl_PointSize = 55.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
