#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718

// Shader pass input texture
uniform sampler2D tDiffuse;

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

uniform float uPower;
uniform float uSize;
uniform float uScale;
uniform float uProgress;
uniform bool uActive;
uniform vec3 uBackgroundColor;

#define BIN_COUNT 33.
#define MAX_INTENSITY 255.
uniform uint[int(BIN_COUNT)] uData;

void main() {
  float aspect = uResolution.y / uResolution.x;

  float intensity = float(uData[int(BIN_COUNT/2. - 1.)])/MAX_INTENSITY;
  vec2 dist = vec2(.5);
  float fullRadius = sqrt(dist.x * dist.x + dist.y * dist.y);

  // Center and normalize uv
  vec2 uv = vUv * 2. -1.0;
  uv /= fullRadius * 2.0;
  uv.y *= aspect;

  float d = length(uv - sin(uTime + intensity/200.));

  // Use the distance wavy distortion
  d = sin(
    pow(d,2.)
    - uSize
    * uProgress
    * (TAU/2.)
    ) * -uPower;

  // Scale and offset the texture coordinates based on the distortion
  vec2 tUv = vUv - .5;
  tUv /= uScale;
  tUv *= (d * fullRadius);

  // Adjust for smaller resolutions
  if (uResolution.x < 1000.) {
    tUv /= aspect;
  }
  tUv += vec2(0.5);

  float c = smoothstep(0.0,.8,d);
  vec4 tColor = texture2D(tDiffuse,tUv);
  vec4 color = mix(vec4(uBackgroundColor.rgb,1.0),tColor,c);

  if (uActive) {
    gl_FragColor = vec4(color.rgb ,1.0);
  }else{
    gl_FragColor = texture2D(tDiffuse,vUv);
  }
}
