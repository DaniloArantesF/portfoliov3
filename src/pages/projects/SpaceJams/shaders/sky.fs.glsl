#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define GRID_SCALE 10.

uniform float uStarLayerCount;
uniform float uTime;
uniform vec2 uResolution;
varying float intensity;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 vNormal;

mat2 Rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float star = .01/d;

  uv *= 3.;
  float rays =  max(0., 1. - abs(uv.x * uv.y * 700.));
  star += rays * flare;

  // Add second flair
  uv *= Rot(3.1415/4.); // rotate 45 degres
  rays =  max(0., 1. - abs(uv.x * uv.y * 700.));
  star += rays * .3 * flare + .1 * (sin(uTime*2.)/2.+.5)/2.;

  // limit light propagation
  star *= smoothstep(0.4, 0., d);
  return star;
}


float Hash21(vec2 p) {
  p = fract(p*vec2(124.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}

vec3 Stars(vec2 uv) {
  // Get cell grid id and offset star
  vec2 id = floor(uv*GRID_SCALE);
  vec2 gv = fract(uv * GRID_SCALE)-.5;
  vec3 color = vec3(0.);

  for (int y = -1; y <=1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(x,y);
      float n = Hash21(id + offset);

      float intensityScale =  sin(intensity/vAmplitude * 4. - 1.)*.5 + .5;

      float size = fract(n*753.34/intensityScale);

      float star = Star(gv-offset-vec2(n, fract(n*942.73))+.5, size/2.);

      vec3 starColor = mix(vec3(98./255., 37./255., 116./255.), vec3(0.2, .3, .8), fract(n*1354.34));
      color += star*size*starColor;
    }
  }

  return color;
}

void main(){
  vec2 uv = (vUv - .5);
  vec3 color = vec3(0.);
  float NUM_LAYERS = uStarLayerCount;
  uv *= Rot(uTime/50.);

  float scale = 1.;
  for (float  i = 0.; i < 1.; i+= 1./NUM_LAYERS) {
    float depth = fract(i+uTime/15.);
    scale = mix(10., .5, depth);

    float fade = sin(depth * TAU / 2.);
    color += Stars(uv*scale+i)*fade;
  }

  float d = length(uv);
  color *= smoothstep(.01, .2, d);

  gl_FragColor = vec4(color, 1.);
}