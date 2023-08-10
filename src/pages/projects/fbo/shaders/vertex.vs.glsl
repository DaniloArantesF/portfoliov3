
attribute vec2 reference;

uniform sampler2D positionTexture;

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;


void main() {
  vUv = reference;
  vPosition = position;

  vec3 pos = texture2D( positionTexture, reference ).xyz;

  vec3 position = pos;// + noise * 1.;

  gl_PointSize = 3.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}