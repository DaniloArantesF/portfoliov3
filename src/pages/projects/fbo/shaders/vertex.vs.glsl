
attribute vec2 reference;

uniform sampler2D positionTexture;

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
varying float vMaxParticleHeight;
varying float vParticleY;
uniform vec2 uResolution;


void main() {
  vUv = reference;
  vPosition = position;

  vec3 pos = texture2D( positionTexture, reference ).xyz;
  vParticleY = pos.y + 3.5;

  gl_PointSize = 5.5 - vParticleY;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}