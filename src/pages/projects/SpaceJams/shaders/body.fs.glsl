#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uScale;
varying vec2 vUV;
varying vec3 vNormal;
uniform float uTest;
varying vec3 vPosition;
varying float intensity;
varying float vAmplitude;
varying float vTime;


// Noise
// taken from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}


float grid(vec2 uv, float res){
    vec2 grid = fract(uv*res);
    return 1.-(step(res,grid.x) * step(res,grid.y));
}


void main(){
  vec2 st = vUV;
  float aspect = uResolution.x / uResolution.y;
  vec3 color = vec3(0.0);

  // Grid
  float resolution = uScale;
  vec2 gridUV = fract(st*resolution);

  float intensityNormalized = intensity;
  vec3 n = vec3(noise(vPosition*10. + vTime/2.));

  vec3 color1 = vec3(41./255., 53./255., 131./255.);
  vec3 color2 = vec3(98./255., 37./255., 116./255.);
  vec3 color3 = vec3(25./255., 84./255., 236./255.);

  gl_FragColor = vec4(mix(color2, color3, step(.65, n)),1.);
}

