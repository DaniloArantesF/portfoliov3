#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

#define MAX_STEPS 1000
#define MIN_DIST 0.001
#define MAX_DIST 100.0

uniform vec3 cameraPos;
uniform vec3 cameraDir;
uniform float fov;

uniform vec3 spherePos;
uniform float sphereRadius;

uniform vec2 uResolution;

uniform vec3 bgColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspectRatio = uResolution.y / uResolution.x;
  float tanFov = tan(radians(fov / 2.0));
  vec3 rayDir = normalize(vec3(uv.x * tanFov * aspectRatio, uv.y * tanFov, -1.0));

  vec3 rayPos = cameraPos;

  // Marching
  for (int i = 0; i < MAX_STEPS; i++) {
    float dist = distance(rayPos, spherePos) - sphereRadius;
    if (dist < MIN_DIST) {
      // Hit
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      return;
    }
    if (dist > MAX_DIST) {
      // Ray missed
      gl_FragColor = vec4(bgColor, 1.0);
      return;
    }

    // Forward
    rayPos += rayDir * dist;
  }
}