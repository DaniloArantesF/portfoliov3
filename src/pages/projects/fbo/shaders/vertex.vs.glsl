
attribute vec2 reference;

uniform sampler2D positionTexture;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = reference;
  vPosition = position;

  vec3 pos = texture2D( positionTexture, reference ).xyz;
  gl_PointSize = 10.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}