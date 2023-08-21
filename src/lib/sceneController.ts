import * as THREE from 'three';
// import { PCFSoftShadowMap } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass';
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';

import { atom } from 'nanostores';
import { Pane } from 'tweakpane';
import type {
  BaseSceneProps,
  BaseSceneSettings,
  BaseSceneState,
  SceneHook,
  Uniforms,
  useFrame,
} from './types';
import { usePlayer } from '~/components/Player';

export const useGUI = atom(
  new Pane({
    title: 'Settings',
    container: document.getElementById('gui_container')!,
  }),
);

const gui = useGUI.get();
export const isReady = atom(false);
export const loadingProgress = atom(-1);

let settings: BaseSceneSettings = {
  axesHelper: false,
  cameraPosition: [0, 0, 1],
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  fov: 75,
  orbitControls: false,
  autoRotate: false,
  gridHelper: false,
  antialias: true,
  sceneDebugControls: true,
  zoom: 1,
};

const BaseScene = ({
  canvas,
  settings: customSettings,
  onResize = () => {},
}: BaseSceneProps) => {
  if (!canvas) throw new Error('Canvas is undefined!');

  const player = usePlayer?.get();

  let scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    composer: EffectComposer,
    renderScene: RenderPass;
  let clock: THREE.Clock, time: number, delta: number;
  let camera: THREE.PerspectiveCamera;
  let orbitControls: OrbitControls;
  let stats: Stats;
  let sceneRenderTarget: THREE.WebGLRenderTarget;

  // Render loop subscribers
  const subscribers: useFrame[] = [];

  const uniforms: Uniforms = {
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uTime: {
      value: 0,
    },
    uMouse: { value: { x: 0, y: 0 } },
    fftTexture: { value: null },
    fft: { value: 0 },
  };

  // Overwrite settings
  settings = { ...settings, ...customSettings };

  function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: settings.antialias,
      alpha: true,
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // renderer.sortObjects = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;

    composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    clock = new THREE.Clock();

    initScene();
    effects();
    initGUI();
    render();

    return { state: getSceneState(), ...getSceneHooks(), utils: getUtils() };
  }

  function initScene() {
    /* --------- Camera --------- */
    const { fov, aspect, near, far } = settings;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    resetCamera();

    /* ---------- Utils ---------- */
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = settings.orbitControls;
    orbitControls.autoRotateSpeed = 0.5;
    orbitControls.autoRotate = settings.autoRotate;

    if (settings.axesHelper) {
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
    }

    if (settings.gridHelper) {
      const gridHelper = new THREE.GridHelper(10, 10);
      scene.add(gridHelper);
    }

    stats = new Stats();
    stats.dom.style.display = 'inline-block';
    document.querySelector('#gui_container')!.appendChild(stats.dom);

    handleEvents();
  }

  /* ---------- Events ---------- */
  function handleEvents() {
    canvas.addEventListener('mousemove', (event) => {
      uniforms.uMouse.value.x = (event.clientX - window.innerWidth / 2) * 0.01;
      uniforms.uMouse.value.y = (event.clientY - window.innerHeight / 2) * 0.01;
    });

    let resizeEvent: NodeJS.Timeout;
    function resizeHandler() {
      uniforms.uResolution.value = new THREE.Vector2(
        window.innerWidth,
        window.innerHeight,
      );
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);

      // Call resize hook
      onResize();
      resetCamera();
    }

    window.addEventListener('resize', function () {
      clearTimeout(resizeEvent);
      resizeEvent = setTimeout(resizeHandler, 100);
    });

    // Loading events
    THREE.DefaultLoadingManager.onProgress = function (
      url,
      itemsLoaded,
      itemsTotal,
    ) {
      loadingProgress.set(~~((itemsLoaded / itemsTotal) * 100));
    };
  }

  function resetCamera() {
    const [x, y, z] = settings.cameraPosition;
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();
  }

  function initGUI() {
    gui.expanded = false;
    const debugFolder = gui.addFolder({ title: 'Debug' });
    debugFolder.addInput(settings, 'orbitControls').on('change', () => {
      orbitControls.enabled = settings.orbitControls;
      if (!settings.orbitControls) {
        settings.autoRotate = false;
        gui.refresh();
        camera.lookAt(scene.position);
        resetCamera();
      }
    });

    debugFolder.addInput(settings, 'autoRotate').on('change', () => {
      if (settings.autoRotate) {
        orbitControls.enabled = true;
        settings.orbitControls = true;
        gui.refresh();
      }
      orbitControls.autoRotate = settings.autoRotate;
    });

    debugFolder
      .addInput(settings, 'zoom', { min: 0.1, max: 3, step: 0.001 })
      .on('change', ({ value }) => {
        camera.zoom = value;
        camera.updateProjectionMatrix();
      });

    if (player) player.setupGUI();
    gui.disabled = !settings.sceneDebugControls;
    gui.hidden = gui.disabled;
  }

  function render() {
    requestAnimationFrame(render);
    time = clock.getElapsedTime();
    delta = clock.getDelta();

    // update fft data
    player.update();

    // Update uniforms
    uniforms.uTime.value = time;
    uniforms.fftTexture.value = player.fftTexture;
    uniforms.fft.value = player.fftNormalized;

    // Execute render callbacks i.e. useFrame
    const state = getSceneState();
    for (let i = 0; i < subscribers.length; i++) {
      subscribers[i](state);
    }

    // Update orbit controls
    if (settings.orbitControls) {
      orbitControls.update();
    }

    stats.begin();
    composer.render();
    stats.end();
  }

  function effects() {
    renderScene = new RenderPass(scene, camera);

    const renderTargetParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
    };

    const savePass = new SavePass(
      new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight,
        renderTargetParameters,
      ),
    );

    const blendPass = new ShaderPass(BlendShader, 'tDiffuse1');
    blendPass.uniforms['tDiffuse2'].value = savePass.renderTarget.texture;
    blendPass.uniforms['mixRatio'].value = 0.015;

    const outputPass = new ShaderPass(CopyShader);
    outputPass.renderToScreen = true;

    composer.addPass(renderScene);
    composer.addPass(blendPass);
    composer.addPass(savePass);
    composer.addPass(outputPass);
  }

  function registerRenderCallback(cb: useFrame) {
    subscribers.push(cb);
  }

  function unregisterRenderCallback(cb: useFrame) {
    subscribers.splice(subscribers.indexOf(cb), 1);
  }

  function getSceneState(): BaseSceneState {
    return {
      camera,
      clock,
      composer,
      delta,
      orbitControls,
      ready: false,
      renderer,
      renderScene,
      scene,
      stats,
      time,
      uniforms,
    };
  }

  function getSceneHooks() {
    return {
      setSceneHook,
      registerRenderCallback,
      unregisterRenderCallback,
    };
  }

  function setSceneHook(hook: SceneHook, handler: () => void) {
    switch (hook) {
      case 'onResize':
        onResize = handler;
        break;
    }
  }

  function getViewport() {
    if (camera instanceof THREE.OrthographicCamera)
      return { width: 1, height: 1 }; // ???

    // Convert vertical fov to radians
    const vfov = (settings.fov * Math.PI) / 180;

    // Calculate viewport height from camera perspective
    const height = 2 * Math.tan(vfov / 2) * camera.position.z;
    const width = height * camera.aspect;
    return { height, width };
  }

  function updateSetting<
    S extends keyof typeof settings,
    V extends (typeof settings)[S],
  >(key: S, value: V) {
    settings[key] = value;
  }

  function getSettings() {
    return settings;
  }

  function getUtils() {
    return {
      gui,
      getSettings,
      updateSetting,
      resetCamera,
      getViewport,
    };
  }

  // TODO
  function cleanup() {}

  return init();
};

class TextureBufferManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private sceneScreen: THREE.Scene;
  public sceneRenderTarget!: THREE.WebGLRenderTarget;

  private camera: THREE.OrthographicCamera;
  private geometry: THREE.PlaneGeometry;
  private baseMaterial: THREE.ShaderMaterial;
  private materialScreen: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private quad: THREE.Mesh;

  vertexShader = `
  varying vec2 vUv;

  void main() {

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  }`;

  fragShaderPass = `
  varying vec2 vUv;
  uniform float time;

  void main() {

    float r = vUv.x;
    if( vUv.y < 0.5 ) r = 0.0;
    float g = vUv.y;
    if( vUv.x < 0.5 ) g = 0.0;

    gl_FragColor = vec4( r, g, time, 1.0 );

  }`;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.sceneScreen = new THREE.Scene();
    // this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // this.geometry = new THREE.PlaneGeometry(2, 2);
    this.geometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight,
    );
    // this.baseMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.baseMaterial = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0.0 } },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragShaderPass,
    });

    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -10000,
      10000,
    );
    this.camera.position.z = 100;
    this.mesh = new THREE.Mesh(this.geometry, this.baseMaterial);
    this.scene.add(this.mesh);

    this.materialScreen = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: this.vertexShader,
      fragmentShader: `
      varying vec2 vUv;
			uniform sampler2D tDiffuse;

			void main() {

				gl_FragColor = texture2D( tDiffuse, vUv );
				//#include <colorspace_fragment>
        #include <encodings_fragment>
			}`,
      depthWrite: false,
    });
    this.quad = new THREE.Mesh(this.geometry, this.materialScreen);
    this.quad.position.z = -100;
    this.sceneScreen.add(this.quad);
  }

  public static getBufferKey(id: number) {
    return `prgm${id}Texture`;
  }

  setSceneTexture(
    texture: THREE.Texture,
    renderTarget: THREE.WebGLRenderTarget,
  ) {
    this.sceneRenderTarget = renderTarget;
    // this.baseMaterial.map = texture;
    this.materialScreen.uniforms.tDiffuse.value = texture;
  }

  addBuffer() {}

  public renderTextures() {
    // Render scene texture
    // this.mesh.material = this.baseMaterial;
    // this.renderer.setRenderTarget(this.sceneRenderTarget);
    // this.renderer.render(this.scene, this.camera);
    // this.renderer.setRenderTarget(null);

    // Render first scene into texture
    this.renderer.setRenderTarget(this.sceneRenderTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    // Render full screen quad with generated texture
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.sceneScreen, this.camera);

    // Render second scene to screen
    // (using first scene as regular texture)
    // this.renderer.render(scene, camera);
  }
}

export default BaseScene;
