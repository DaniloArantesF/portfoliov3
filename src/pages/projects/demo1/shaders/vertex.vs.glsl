varying vec2 vUV;
varying vec3 vNormal;
uniform float uTime;

void main() {
  // Pass uv data to fragment shader
  vUV = uv;
  vNormal = normalize(normalMatrix * normal);

  // Update vertex position
  gl_PointSize = 2.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}