#ifdef GL_ES
precision mediump float;
#endif

#define BIN_COUNT 8.
#define MAX_INTENSITY 255.

uniform float foldFrequency;
uniform float foldHeight;
uniform float uTime;
uniform float waveAmplitude;
uniform float waveFrequency;
uniform vec2 uResolution;
uniform vec3 color1;
uniform vec3 color2;

varying float elevation;
varying float foldElevation;
varying float isTopFace;
varying vec2 scale;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 modelPosition;
uniform sampler2D fftTexture;

void main(){
  vec2 uv = vUv;
  vec3 color = vec3(isTopFace);

  vec2 gd =  floor(uv * scale) / scale;
  int binIndex = int((gd.y) * BIN_COUNT / 2.);
  float intensity = 10. * texture2D(fftTexture, vec2(binIndex, 0.5)).r;

  vec3 colorSurface = vec3(.0, .6, 1.);
  vec3 colorBottom = vec3(.0, .0, .05);
  vec3 positionNormalized = normalize(vPosition + 1.);

  // Color sides, bottom not included
  color = mix(colorBottom, colorSurface, positionNormalized.y);
  if (!bool(isTopFace)) {
  }

  gl_FragColor = vec4(color, 1.0);
}