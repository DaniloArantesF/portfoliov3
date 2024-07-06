
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D noiseTexture;



float tangentFactor = 0.1;


vec3 waves(vec3 position) {
  float speed = 0.1;
  float time = uTime * speed;

  float frequencyY = 5.0;
  float frequencyX = .5;
  float amplitudeY = 12.0;
  float amplitudeX = 1.0;
  float amplitudeZ = .5;
  float frequencyZ = 5.0;
  vec3 offsetPosition = position.xyz;
  float offsetX1 = (sin(offsetPosition.y * frequencyX + time) * 0.5 + 1.0) * amplitudeX;
  float offsetZ1 = (sin(offsetPosition.z * frequencyZ + time) * 0.5 + 1.0) * amplitudeZ;

  offsetPosition.x += offsetX1;
  offsetPosition.x += offsetZ1;

  offsetPosition.y += offsetZ1;
  offsetPosition.x += offsetZ1;

  offsetPosition.x -= amplitudeX + amplitudeZ;

  return offsetPosition;
}

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
  : vec3(0.0, -v.z, v.y));
}

void main() {
  vec3 noise = texture2D(noiseTexture, vec2(vUv.x, 0.0)).rgb;
  vUv = uv;

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