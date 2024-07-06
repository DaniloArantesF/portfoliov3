
/**
  Start of MeshPhong
*/
#define PHONG

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
/**
  End of MeshPhong
*/
// varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D noiseTexture;


float waves() {
  return 0.0;
}




void main() {
  /**
    Start of MeshPhong
  */
  	#include <uv_vertex>
    #include <color_vertex>
    #include <morphcolor_vertex>

    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
    #include <normal_vertex>

    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>

    vViewPosition = - mvPosition.xyz;

    #include <worldpos_vertex>
    #include <envmap_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
  /**
    End of MeshPhong
  */

  // Pass uv data to fragment shader
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec3 noise = texture2D(noiseTexture, vec2(vUv.x, 0.0)).rgb;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  float speed = .5;
  float time = uTime * speed;

  float frequencyY = 1.0;
  float frequencyX = .5;
  float amplitudeY = 10.0;
  float amplitudeX = 10.0;

  float offsetX01 = sin(time * frequencyX + worldPosition.x * 0.5) * 0.1;
  float offsetX02 = sin(time * frequencyX / 2.0 + worldPosition.x * 0.5) * 0.1;

  float offsetY01 = sin(time * frequencyY + worldPosition.x * 0.5) * 0.05;
  float offsetY02 = cos(time * frequencyY / 2.0 + worldPosition.z * 0.5) * 0.05;
  vec3 offsetPosition = vec3(worldPosition);

  offsetPosition.x += amplitudeX * offsetX01;

  offsetPosition.y -= amplitudeY * offsetY01;
  offsetPosition.y += amplitudeY * offsetY02;

  // gl_Position = projectionMatrix * viewMatrix * worldPosition;
  gl_Position = projectionMatrix * viewMatrix * vec4(offsetPosition, 1.0);
}