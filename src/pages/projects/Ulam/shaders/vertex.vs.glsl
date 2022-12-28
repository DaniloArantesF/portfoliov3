#ifdef GL_ES
precision mediump float;
#endif

attribute float isPrime;
uniform float uTime;
uniform float waveAmplitude;
uniform float waveFrequency;
varying float elevation;
varying float vPrime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vPrime = isPrime;
  vPosition = position;

  float dist = length(vPosition.xy);
  elevation = waveAmplitude * sin((dist - uTime / 5.) * waveFrequency);

  vPosition.z += smoothstep(.01, .99, abs(elevation));

  vec4 modelViewPosition = modelViewMatrix * vec4( vPosition, 1.0 );

  gl_PointSize = ( 3.5 / -modelViewPosition.z );
  gl_Position = projectionMatrix * modelViewPosition;

}
