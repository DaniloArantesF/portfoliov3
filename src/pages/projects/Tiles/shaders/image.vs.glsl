varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
varying float vTime;
uniform float uTest;
varying float vTest;

void main() {
  // Pass uv data to fragment shader
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  // vTime = uTime;

  // Update vertex position
  gl_PointSize = 1.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}