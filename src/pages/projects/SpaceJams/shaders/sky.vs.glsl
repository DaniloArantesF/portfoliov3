varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
varying float vTime;
varying float vAmplitude;
varying float intensity;
uniform float[128] uData;
uniform float uStarLayerCount;
varying float vStarLayerCount;

void main() {
  // Pass uv data to fragment shader
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vAmplitude = 2.;
  vTime = uTime;
  vStarLayerCount = uStarLayerCount;

  float freq = 120. * .6 - vUv.y;
  intensity = sin(uData[int(round(freq))] / 1.) * vAmplitude;
  // Update vertex position
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z+vUv.y, 1.0 );
}