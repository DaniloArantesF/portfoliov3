
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D noiseTexture;
uniform float frequencyX;
uniform float frequencyY;
uniform float amplitudeX;
uniform float amplitudeY;
uniform float speed;
varying vec2 vNoise;


float tangentFactor = 0.1;


vec3 waves(vec3 position) {
  float time = uTime * speed;
  vec3 offsetPosition = position.xyz;

  vec2 noise = vNoise;
  vec4 worldPosition = modelMatrix * vec4(offsetPosition, 1.0);

  offsetPosition.x += sin(time + position.y * frequencyY) * amplitudeY;

  // one octave down and up
  // offsetPosition.x += sin(time + position.y * frequencyY * 2.0) * amplitudeY * 0.5;
  // offsetPosition.x += sin(time + position.y * frequencyY * 0.5) * amplitudeY * 0.5;


  offsetPosition.x += sin(time + position.z * frequencyX * 2.0) * amplitudeX;

  // one octave down and up
  // offsetPosition.x += sin(time + position.z * frequencyX * 2.0) * amplitudeX * 0.5;
  // offsetPosition.x += sin(time + position.z * frequencyX * 0.5) * amplitudeX * 0.5;



  return offsetPosition;
}

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
  : vec3(0.0, -v.z, v.y));
}

void main() {
  vUv = uv;
  vec2 noise = texture2D(noiseTexture, vec2(vUv)).rg;
  vNoise = noise;

  vNormal = normal;
  vec3 offsetPosition = waves(position);

  // Recalculate normals https://observablehq.com/@k9/calculating-normals-for-distorted-vertices
  vec3 tangent1 = orthogonal(normal);
  vec3 tangent2 = normalize(cross(normal, tangent1));
  vec3 nearby1 = position + tangent1 * tangentFactor;
  vec3 nearby2 = position + tangent2 * tangentFactor;
  vec3 offset2 = waves(nearby1);
  vec3 offset3 = waves(nearby2);

  vec4 mvPosition = modelViewMatrix * vec4(offsetPosition, 1.0);
  vViewPosition = -mvPosition.xyz;

  vNormal = normalize(cross(offset2 - offsetPosition, offset3 - offsetPosition));
  vWorldNormal = normalize(normalMatrix * vNormal);
  vPosition = offsetPosition;

  vec4 worldPosition = modelMatrix * vec4(offsetPosition, 1.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition);
}