#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

uniform vec3 color1;
uniform vec3 color2;
uniform float foldFrequency;
uniform float foldHeight;
uniform float waveFrequency;
uniform float waveAmplitude;

varying vec4 vModelPositon;
varying float vElevation;
varying float vFoldElevation;

void main(){
  vec2 uv = vUv - .5;
  vec3 color3 = vec3(0., 1., 0.);

  float elevation = vElevation / waveAmplitude - .5;
  vec3 blend1 = mix(color2, color1, vec3(uv.x + uv.y));
  vec3 blend2 = mix(blend1, color1, sin(elevation + vModelPositon.y) * .5 + .5);
  vec3 color = blend2;
  gl_FragColor = vec4(color, 1.0);
}