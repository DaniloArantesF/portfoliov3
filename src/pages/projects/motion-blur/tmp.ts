let mesh: THREE.Mesh,
material: THREE.ShaderMaterial,
geometry: THREE.BufferGeometry;

/**
*  need to :
* 1) render contents of framebuffer 1 to framebuffer 2
* 2) render the threejs scene that holds the meshes to framebuffer 2
* 3) render the contents of framebuffer 2 to the screen
* 4) swap the framebuffers
*/

let framebuffer1 = new THREE.WebGLRenderTarget(
window.innerWidth,
window.innerHeight,
);
let framebuffer2 = new THREE.WebGLRenderTarget(
window.innerWidth,
window.innerHeight,
);

// Before we start using these framebuffers by rendering to them,
// let's explicitly clear their pixel contents to #111111
// If we don't do this, our persistence effect will end up wrong,
// due to how accumulation between step 1 and 3 works.
// The first frame will never fade out when we mix Framebuffer 1 to
// Framebuffer 2 and will be always visible.
// This bug is better observed, rather then explained, so please
// make sure to comment out these lines and see the change for yourself.
renderer.setClearColor(0x111111);
renderer.setRenderTarget(framebuffer1);
renderer.clearColor();
renderer.setRenderTarget(framebuffer2);
renderer.clearColor();

const screenBorders = {
left: -window.innerWidth / 2,
right: window.innerWidth / 2,
top: -window.innerHeight / 2,
bottom: window.innerHeight / 2,
};

const rttNear = -100;
const rttFar = 100;
const rttCamera = new THREE.OrthographicCamera(
screenBorders.left,
screenBorders.right,
screenBorders.top,
screenBorders.bottom,
rttNear,
rttFar,
);

rttCamera.position.z = -10;
rttCamera.lookAt(new THREE.Vector3(0, 0, 0));

const fullScreenQuadGeometry = new THREE.PlaneGeometry(
window.innerWidth,
window.innerHeight,
);

// Create quads
const fadeMaterial = new THREE.ShaderMaterial({
// texture result of rendering to framebuffer 1
uniforms: {
  inputTexture: { value: null },
},
vertexShader: `
// Declare a varying variable for texture coordinates
varying vec2 vUv;

void main () {
// Set each vertex position according to the
// orthographic camera position and projection
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

// Pass the plane texture coordinates as interpolated varying
// variable to the fragment shader
vUv = uv;
}
`,
fragmentShader: `
// Pass the texture from Framebuffer 1
uniform sampler2D inputTexture;

// Consume the interpolated texture coordinates
varying vec2 vUv;

void main () {
// Get pixel color from texture
vec4 texColor = texture2D(inputTexture, vUv);

// Our fade-out color
vec4 fadeColor = vec4(0.0, 0.0, 0.0, 1.0);

// this step achieves the actual fading out
// mix texColor into fadeColor by a factor of 0.05
// you can change the value of the factor and see
// the result will change accordingly
gl_FragColor = mix(texColor, fadeColor, 0.05);
}
`,
});
const fadePlane = new THREE.Mesh(fullScreenQuadGeometry, fadeMaterial);

const resultMaterial = new THREE.MeshBasicMaterial({ map: null });
const resultPlane = new THREE.Mesh(fullScreenQuadGeometry, resultMaterial);

function animationLoop(state: BaseSceneState) {
mesh.position.y = Math.sin(state.time * 2) / 2;

renderer.autoClearColor = false;

// 1) Render framebuffer 1 to framebuffer 2
fadePlane.material.uniforms.inputTexture.value = framebuffer1.texture;
renderer.setRenderTarget(framebuffer2);
renderer.render(fadePlane, rttCamera);

// 2) Render the threejs scene that holds the meshes to framebuffer 2
renderer.render(scene, rttCamera);

// Set default render target back to screen
renderer.setRenderTarget(null);

// 3) Render the contents of framebuffer 2 to the screen
resultPlane.material.map = framebuffer2.texture;
renderer.render(resultPlane, rttCamera);

// 4) Swap the framebuffers
swapBuffers();
}

function swapBuffers() {
let temp = framebuffer1;
framebuffer1 = framebuffer2;
framebuffer2 = temp;
}

function init() {
geometry = new THREE.SphereGeometry(0.25, 30, 30);
material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
});
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

registerRenderCallback(animationLoop);
isReady.set(true);
}

init();
}
