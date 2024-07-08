

#define TAU 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform sampler2D sphereNormalTexture;
uniform sampler2D noiseTexture;


float cutCorners(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  float radius = 0.5;
  float softness = 0.1;
  float distance = distance(center, uv);
  float mask = smoothstep(radius, radius + softness, 1.0 - distance);
  return mask;
}



void main(){
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);

  vec3 normalTexture = texture2D(sphereNormalTexture, uv).xyz;
  vec3 noise = texture2D(noiseTexture, gl_PointCoord).xyz;
  vec3 normal = vec3(normalTexture.rg * 2.0 - 1.0, 0.0);
  // normal.z = sqrt(1.0 - normal.x * normal.x - normal.y * normal.y);
  // normal = normalize(normal);

  vec3 lightPosition = vec3(0.0, 1.0, 1.0);
  float diffuse = max(0.0, dot(normal, lightPosition)) * 2.0;

  vec3 color = vec3(diffuse);

  color += vec3(0.0, 0.0, 0.5);


  // Make the color shine randomly
  color += noise * 10.1;


  float corner = cutCorners(uv);
  color *= corner;
  gl_FragColor = vec4(color,corner);
}