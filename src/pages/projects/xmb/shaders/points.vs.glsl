varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform float speed;
varying vec3 vPosition;
uniform sampler2D noiseTexture;

#define TAU 6.28318530718
  // vec3 baseMovement = vec3(
  //   amplitudeX * (sin(angle * frequencyX) * 0.5 + 0.5),
  //   mix(start.y, end.y, 1.0 - fract(progress - position.y / TOTAL_LENGTH)) ,
  //   amplitudeZ * (cos(angle * frequencyZ) * 0.5 + 0.5)
  // );

  // result.y = mix(start.y, end.y, 1.0 - fract(0.05 * progress - position.y / TOTAL_LENGTH));
  // result.x = mod(result.x / 10. - sin(result.y / 5.0) + progress * 0.1, ceiling) - ceiling / 2.0;

  // result.x += normal.y * noise.y * 10.0;
  // vec3 start = vec3(0.0, -1. * TOTAL_LENGTH / 2.0, 0.0);
  // vec3 end = vec3(0.0, TOTAL_LENGTH / 2.0, 0.0);

  // get a 5 unit displacement in the direction of the normal

const   float ceiling = 10.0;

vec3 displace(vec3 position, vec3 normal, float progress) {


  vec3 noise = texture2D(noiseTexture, vUv).xyz;

  progress *= 10.0;


  vec3 start = vec3(position.x, -1. * TOTAL_LENGTH / 2.0, position.z);
  vec3 end = vec3(ceiling, TOTAL_LENGTH / 2.0, position.z);

  float angle = fract(progress - position.y / TOTAL_LENGTH) * TAU;

  float frequencyX = 5.0;
  float frequencyZ = 5.0;
  float amplitudeX = 5.0;
  float amplitudeZ = 2.0;

  vec3 result = vec3(0.0);

  vec3 baseMovement = vec3(position);

  result = baseMovement;


  float direction = sign(normal.y);
  result.x = mod(direction * 10. * progress + position.x, sign(direction) * ceiling) + sign(direction) * ceiling / 2.0;

  return result;
}

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec3 noise = texture2D(noiseTexture, uv).rgb;

  float time = uTime * speed * 0.1;
  vec3 newPosition = displace(position, vNormal, time);

  vPosition = newPosition;
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);

  // Calculate normalized position.y within the TOTAL_LENGTH range
  float normalizedY = (newPosition.x + TOTAL_LENGTH / 2.0) / TOTAL_LENGTH * sign(vNormal.x);

  // Use a sinusoidal function to control the point size
  float sizeFactor = sin(normalizedY * TAU / 2.0);

  // Calculate the desired point size
  float minSize = .1;
  float maxSize = 10.0;
//  gl_PointSize = minSize + sizeFactor * (maxSize - minSize);
  gl_PointSize = 10. * abs(normalizedY);

  gl_Position = projectionMatrix * mvPosition;
}