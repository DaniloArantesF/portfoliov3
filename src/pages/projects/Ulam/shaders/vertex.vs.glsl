#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
attribute float isPrime;
varying float vPrime;

uniform float waveFrequency;
uniform float waveAmplitude;

varying float elevation;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vPrime = isPrime;
  vPosition = position;

  float dist = length(vPosition.xy);
  elevation = waveAmplitude * sin((dist - uTime / 5.) * waveFrequency);

  vPosition.z += smoothstep(.01, .99, abs(elevation));

  gl_PointSize = 3.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.);
}
