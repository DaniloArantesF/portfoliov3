#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define BIN_COUNT 33.
#define MAX_INTENSITY 255.

uniform float uTime;
uniform float waveAmplitude;
uniform float waveFrequency;
uniform vec2 uResolution;
varying float elevation;
varying float vPrime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform sampler2D fftTexture;

void main() {
  vec3 position = vPosition + .5;
  vec2 uv = vUv - .5;
  float d = distance(uv, vec2(0));

  float rv = fract(d * BIN_COUNT);
  float rd = floor(d * BIN_COUNT);  // radius id
  vec3 color = vec3(rd);

  float binIndex = rd + cos(elevation);
  float intensity = texture2D(fftTexture, vec2(binIndex / BIN_COUNT, 0)).r;

  color = mix(vec3(0.4, 0.1, .8), vec3(.8, 0.1, 0.4), (elevation/waveAmplitude - (rd*step(.8, intensity))/4.));

  color *= mix(.7, 1., step(.4, intensity));

  // Crop circle
  float radius = .44;
  float w = smoothstep(radius, radius - .05, d);
  float alpha = bool(vPrime) && bool(w > 0.) ? 1. : 0.;

  gl_FragColor = vec4(color, alpha);
}
