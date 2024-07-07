
uniform sampler2D noiseTexture;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 fresnelColor;
uniform float fresnelPower;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vWorldNormal;
uniform float uTime;
uniform float speed;
varying vec2 vNoise;

void main() {
  // vec3 noise = texture2D(noiseTexture, vec2(vUv * 100.0)).rgb;
  float fresnel = 1.0 - dot(vViewPosition, vWorldNormal);
  vec3 primaryColor = vec3(0.02, 0.0, 0.05);
  vec3 dy = dFdy(vViewPosition);

  primaryColor += primaryColor * fresnel;
  // primaryColor += vec3(1.0, 0.0, 1.0);


  gl_FragColor = vec4(primaryColor, .6);
}