
varying vec2 vUv;
uniform vec2 uResolution;
varying vec3 vPosition;
varying float vParticleY;
uniform float fft;
varying float vHeight;
uniform sampler2D hairMap;
varying vec3 vNormal;
uniform float offset;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}


float hash21(vec2 p) {
  p = fract(p*vec2(124.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}


void main() {
  vec2 uv = vUv;

  vec4 hairProperties = texture2D(hairMap, uv);
  vec3 hairColor = vec3(1.0, 0., 0.5);

  if (hairProperties.a <= 0.0 || hairProperties.g < offset) {
    discard;
  }

  float shadow = mix(0.0, hairProperties.b * 1.0, offset);
  vec3 light = vec3(-0.1,1.0,0.3);

  float diffuse = pow(max(0.2, dot(vNormal.xyz, light))*2.5, 1.4);

  gl_FragColor = vec4(hairColor * hairColor.xyz * diffuse * shadow, 1.1-offset);
}