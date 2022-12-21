#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying float vPrime;

varying vec3 vPosition;
uniform float waveFrequency;
uniform float waveAmplitude;
varying float elevation;

void main() {
  vec3 position = vPosition + .5;
  vec2 uv = vUv - .5;
  vec3 color = vec3(1.);

  color = mix(vec3(0.4, 0.1, .8), vec3(.8, 0.1, 0.4), elevation/waveAmplitude);
  gl_FragColor = vec4(color, vPrime);
}
