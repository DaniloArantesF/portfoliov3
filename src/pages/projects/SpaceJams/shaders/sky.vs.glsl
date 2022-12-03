varying vec2 vUV;
varying vec3 vNormal;
uniform float uTime;
varying float vTime;
varying float vAmplitude;
varying float intensity;
uniform float[128] uData;

void main() {
  // Pass uv data to fragment shader
  vUV = uv;
  vNormal = normalize(normalMatrix * normal);
  vAmplitude = 2.;
  vTime = uTime;
  float freq = 120. * .6 - vUV.y;
  intensity = sin(uData[int(round(freq))] / 1.) * vAmplitude;

  // Update vertex position
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z+vUV.y, 1.0 );
}