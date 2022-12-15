#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define PI TAU / 2.
#define SCALE 64.

uniform vec2 uResolution;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

varying float vAmplitude;
varying float intensity;

float lines(vec2 uv, float offset) {
  return smoothstep(.5, .5 + offset, uv.x);
}

float circle(vec2 uv, float radius, float blur) {
  return smoothstep( radius + blur, radius, length(uv-vec2(.5)));
}

void main(){
  // normalized screen coords
  vec3 normalizedPosition = abs(vPosition/SCALE);
  float linePatterns = lines(normalizedPosition.xy, .01);
  float alpha = circle(gl_PointCoord, .3, .33);

  vec3 color1 = vec3(2./255., 189./255., 225./255.);
  vec3 color2 = vec3(98./255., 37./255., 116./255.);
  vec3 color3 = vec3(25./255., 84./255., 236./255.);

  float intensityNormalized = abs(intensity / vAmplitude);
  float cutoff = step(.05, vPosition.y);

  float freq = 128. - (128. * normalizedPosition.y);

  gl_FragColor = vec4(cutoff*color2*intensityNormalized,alpha);
  if (freq < 2.*128. / 3.) {
    gl_FragColor = vec4(cutoff*color1 / 2. *intensityNormalized,alpha);
  }
  if (freq < 128. / 3.) {
    gl_FragColor = vec4(cutoff*color3*intensityNormalized,alpha);
  }
}