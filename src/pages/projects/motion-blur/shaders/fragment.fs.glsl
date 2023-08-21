#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D fftTexture;
uniform float fft;

void main(){
  vec2 uv = vUv - .5;
  float numShades = 16.;
  float dist = distance(uv, vec2(0.));

  float distId = floor((dist)* numShades) / numShades;
  float fftTex = texture2D(fftTexture, vec2(distId , 0.5)).r;

  gl_FragColor = vec4(distId + fftTex, 0., fft,1.);
  // gl_FragColor = vec4(color.rgb, 1.);
}