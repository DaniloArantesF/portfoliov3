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

float Hash21(vec2 p) {
  p = fract(p*vec2(124.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}

void main(){
  vec2 uv = vUV;
  float aspect = uResolution.x / uResolution.y;
  vec3 color = vec3(0.0);

  // Grid
  float resolution = uScale;
  vec2 id = floor(uv*resolution);
  vec2 gridUV = fract(uv*resolution);

  float intensityNormalized = intensity / vAmplitude;

  vec3 color1 = vec3(41./255., 53./255., 131./255.);
  vec3 color2 = vec3(98./255., 37./255., 116./255.);
  vec3 color3 = vec3(25./255., 84./255., 236./255.);



  // float n = step(1. - log(intensityNormalized), Hash21(id*resolution + resolution*sin(vTime/500.)));
  // color = mix(color2, color3, step(.5, n));
  // color = mix(color2, color3, step(.85-step(.8, intensityNormalized)/12., n));


  // float n = noise((vec3(id.x-vTime/2., id.y-vTime,1.))/1.5);
  // color = mix(color2, color3, step(.65+(.3 - log(intensityNormalized)), n));

  float n = noise((vec3(id.x-vTime, id.y-vTime*2.,1.))/1.5);

  // float intensityScale = log(intensityNormalized + 1.);
  float intensityScale = exp(intensityNormalized)-1.;
  color = mix(color2, color3, step(.60 - .05 * step(.4, intensityScale), n));

  // Cut off corners
  color -= step(.49, uv.y);
  color -= 1. - step(.01, uv.y);

  gl_FragColor = vec4(color,1.);
}

