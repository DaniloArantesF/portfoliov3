varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
attribute float isPrime;
varying float vNumber;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vNumber = isPrime;

  // Update vertex position
  gl_PointSize = 3.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
