varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vec4 modelViewPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = 1. * ( 300.0 / -modelViewPosition.z );
  gl_Position = projectionMatrix * modelViewPosition;
}