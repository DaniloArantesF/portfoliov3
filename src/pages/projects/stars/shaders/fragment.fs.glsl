#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
varying float vStarId;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D fftTexture;
uniform float fft;
varying vec3 vPosition;

#define INSTANCE_COUNT 1024.0
#define BIN_COUNT 32.0

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  // get fraag dist to center of mesh
  vec3 center = vec3(0.);
  float dist = distance(vPosition, center);


  float intensityOffset = sin(uTime + vStarId) * 0.5 + 0.5;
  float minIntensity = 0.2;
  float normalizedStarId = vStarId / INSTANCE_COUNT;
  vec2 fftIndex = vec2(floor(normalizedStarId * BIN_COUNT) /  BIN_COUNT + intensityOffset * 0.5, 0.5);
  float fftTex = texture2D(fftTexture,fftIndex).r;
  float intensity = (1.0 - dist) * (intensityOffset / 2.0 + fftTex * 3.) + minIntensity;
  gl_FragColor = vec4(vec3(intensity * 0.8, intensity * 0.8, intensity), 1.0);
}