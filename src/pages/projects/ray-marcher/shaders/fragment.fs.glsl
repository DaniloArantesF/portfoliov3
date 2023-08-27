#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

#define MAX_STEPS 64
#define MIN_DIST 0.001
#define MAX_DIST 100.0

//uniform vec3 cameraPos;
//uniform vec3 cameraDir;
uniform float fov;
uniform float uTime;
//uniform vec3 spherePos;
//uniform float sphereRadius;
uniform float fft;

uniform vec2 uResolution;

uniform vec3 bgColor;
varying vec2 vUv;
uniform vec2 uMouse;

vec3 light = vec3(1., 1., -1.);

// https://iquilezles.org/articles/palettes/
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float hash21(vec2 p) {
  p = fract(p*vec2(124.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}

float sphereSDF(vec3 p, float radius) {
  return length(p) - radius;
}

float squareSDF(vec3 p, vec3 size) {
  vec3 d = abs(p) - size;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float displacement(vec3 p) {
  return (sin(p.x) + sin(p.y) + sin(p.z));
}

// Aggregate of objects in the scene
float scene(vec3 p) {
  vec4 spherePos = vec4(0., 1., 6., 1.);
  float displacementScale = 20. + 10. * sin(uTime/8.);
  vec3 rP = rotate(p - spherePos.xyz, vec3(1., 1., 1.), uTime/10.);

  float sphere1 = sphereSDF(rP, spherePos.w);
  // float sphere2 = sphereSDF(rP, spherePos.w - .5);
  // float carvedSphere = max(sphere1, -sphere2);

  return max(displacement(rP * displacementScale * (.5 * smoothstep(1., .32, fft))) / (displacementScale), sphere1);
}

vec3 getNormal(vec3 p){
  vec2 o = vec2(0.001,0.);
  // 0.001,0,0
  return normalize(
    vec3(
      scene(p + o.xyy) - scene(p - o.xyy),
      scene(p + o.yxy) - scene(p - o.yxy),
      scene(p + o.yyx) - scene(p - o.yyx)
    )
  );
}

void main() {
  vec2 uv = vUv - .5;
  vec3 cameraPos = vec3(0., 1., .2);
  cameraPos.x += (uMouse.x / 10. - cameraPos.x) * 1.;
  cameraPos.y += (-uMouse.y / 15. - cameraPos.y + 1.) * 1.5;

  // vector pointing from camera
  vec3 rayDir = normalize(vec3(uv, 1.));
  vec3 rayPos = cameraPos;

  // distance from origin
  float curDist = 0.;
  float rayLength = 0.;

  vec3 color = vec3(0.);

  // marching
  for (int i = 0; i < MAX_STEPS; i++) {
    // get closest distance to objects in the scene
    curDist = scene(rayPos);
    rayLength += curDist;

    // move ray forward
    rayPos = cameraPos + rayDir * rayLength;

    if (abs(curDist) < MIN_DIST) {
      // hit
      vec3 normal = getNormal(rayPos);

      // simple diffuse lighting
      float diffuse = dot(normal, light);
      color *= vec3(diffuse);
      color /= 1.5;
      break;
    } else if (rayLength > MAX_DIST) {
      color /= 8.;
      break;
    }
    color += .03 * palette(rayLength + .5 * smoothstep(.7, .3, fft), vec3(.5, 0.1, 0.9), vec3(.5, 0.0, .5), vec3(1., 0.0, 1.), vec3(0.1));
  }

  gl_FragColor = vec4(color, 1.0);
}