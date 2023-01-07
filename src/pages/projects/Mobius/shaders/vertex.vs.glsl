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
  // Wrap uvs along strip
  float angle = atan(position.x, position.y);
  angle = mod(angle, TAU);
  vUv = vec2(sin(angle) * .5 + .5, cos(angle) * .5 + .5);

  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;

  vec3 e = normalize(mvPosition.xyz);
  vRim = pow(abs(dot(e, vNormal)), 2.);
  vDepth = 8. - 1.5 * abs(gl_Position.z);

  vReflection= reflect(e, vNormal);
  float m = 2.82842712474619 * sqrt( vReflection.z + 1.0 );
  vN = vReflection.xy / m + .5;
}