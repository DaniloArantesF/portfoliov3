
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
uniform float uTime;
uniform vec2 uResolution;

uniform float offset;
const float spacing = 1.0;

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;

  // Calculate distance from mesh
  vec3 point = position.xyz + (normalize(normal) * offset * spacing);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( point, 1.0 );
}