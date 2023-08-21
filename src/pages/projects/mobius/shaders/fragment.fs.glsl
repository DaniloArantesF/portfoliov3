#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform float uTime;
uniform vec2 uResolution;
varying float vDepth;
varying float vRim;
varying vec2 vN;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vReflection;

float RV(vec2 uv, float offset, float t, float speed){
  return .05 + .95* mod(uv.x+t+offset+speed*uTime,1.);
}

void main(){
  vec2 scale = vec2(12., 12.);
  vec2 uv = floor(vUv * scale) / scale;
  vec2 gv = fract(vUv*scale*vec2(1.,1.));

  float phaseOffset = 1./3.;
  float speed = .1;
  float time = uTime * speed;
  float i = floor(mod((vUv.x + time/2.) * scale.y * 3., 3.));

  float r1 = RV(uv, 0., time/3.,.1);
  float r2 = RV(uv, phaseOffset, time/3.,.2);
  float r3  = RV(uv, -phaseOffset, time/3.,.3);

  float stripe1 = .5 + .5 * sin((5.* vUv.x + 2. * sin((3.*uv.y + time) * TAU) - 2. * time) * TAU);
  float stripe2 = .5 + .5 * sin((5. * vUv.y + 4. * sin((9. * uv.x + time) * TAU) - 2. * (time + .5 * phaseOffset)) * TAU);

  float stripe = step(.5, stripe1 - stripe2 * stripe1);
  vec3 color = vec3(stripe * vRim * (r1 + r2 + r3));

  if(i==0.) color.yz *= 0.;
  if(i==1.) color.xz *= 0.;
  if(i==2.) color.xy *= 0.;

  gl_FragColor = vec4(vec3(color), 1.);
}