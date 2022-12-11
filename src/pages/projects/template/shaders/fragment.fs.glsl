#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
uniform float uTest;

float plot(vec2 st, float pct) {
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main(){
  // normalized screen coords
  vec2 st = gl_FragCoord.xy/uResolution;
  // float pct = smoothstep(0.55, 0.5, distance(st, vec2(0.5)));

  // vec3 color = vec3(st + (sin(uTime)+1.)/2., 0.);
  // vec3 color = vec3(sin(3.1*vUv) - (sin(uTime)+1.)/2., 0.);
  vec3 color = vec3(sin(3.1*vUv.x), vUv.y, 0.);

  gl_FragColor = vec4(vec3(uTest),1.);
}