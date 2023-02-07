#define PI 3.1415926535897932384626433832795
#define TAU 6.28318530718

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
varying vec3 vPosition;
varying float vRim;
varying float vDepth;
varying vec2 vN;
varying vec3 vReflection;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  
  gl_Position = projectionMatrix * mvPosition;
}