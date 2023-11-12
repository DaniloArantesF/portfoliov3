
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 gravity;

uniform float offset;
const float spacing = 1.0;

void main() {
  // Calculate the effect of gravity and wind on the fur.
  vec3 displacement = gravity; /* + vec3(
      sin(globalTime+position.x*0.05)*0.4,
      cos(globalTime*0.7+position.y*0.04)*0.4,
      sin(globalTime*0.7+position.y*0.04)*0.4
  );*/

  vec3 displacedNormal = normal;
  displacedNormal += displacement * pow(offset, 4.0);

  vPosition = position;
  vNormal = normalize(normalMatrix * displacedNormal );
  vUv = uv;

  // Calculate distance from mesh
  vec3 point = position.xyz + (normalize(displacedNormal) * offset * spacing);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( point, 1.0 );
}