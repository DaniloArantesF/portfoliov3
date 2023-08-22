#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define PI TAU / 2.
#define BIN_COUNT 16.
#define SCALE 50.

uniform vec2 uResolution;
varying float vIntensity;
varying float vAmplitude;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform float fft;

float lines(vec2 uv, float offset) {
  return smoothstep(.5, .5 + offset, uv.x);
}

float circle(vec2 uv, float radius, float blur) {
  return smoothstep( radius + blur, radius, length(uv-vec2(.5)));
}

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
    vec3 color = vec3(vIntensity);
    color = palette(
      vIntensity,
      vec3(0.5),
      vec3(.5),
      vec3(1.0, 1., 1.0),
      vec3(.5, 0.3, 0.85));

    gl_FragColor = vec4(color, step(.1, vIntensity));
}