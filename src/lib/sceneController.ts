import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { atom } from 'nanostores';
import { Pane } from 'tweakpane';

export type useFrame = (state: BaseSceneState) => void;

export interface BaseSceneSettings {
  antialias: boolean;
  aspect: number;
  autoRotate: boolean;
  cameraPosition: [number, number, number] | number[];
  far: number;
  fov: number;
  gridHelper: boolean;
  near: number;
  orbitControls: boolean;
  sceneDebugControls: boolean;
  zoom: number;
  axesHelper: boolean;
}

interface BaseSceneProps {
  canvas: HTMLCanvasElement;
  settings?: Partial<BaseSceneSettings>;
}

export interface Uniforms {
  [key: string]: THREE.IUniform;
  uMouse: { type?: 'v2'; value: { x: number; y: number } };
  uResolution: { type?: 'v2'; value: THREE.Vector2 };
  uTime: { type?: 'f'; value: number };
}

export interface BaseSceneState {
  camera: THREE.PerspectiveCamera; //THREE.OrthographicCamera | ;
  clock: THREE.Clock;
  composer: EffectComposer;
  delta: number;
  orbitControls: OrbitControls;
  ready: boolean;
  renderer: THREE.WebGLRenderer;
  renderScene: RenderPass;
  scene: THREE.Scene;
  stats: Stats;
  time: number;
  uniforms: Uniforms;
}

export const isReady = atom(false);
export const loadingProgress = atom(-1);

let settings: BaseSceneSettings = {
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
  axesHelper: false,
};

// TODO: Allow all base functions to be overwritten or hooked into
const BaseScene = ({ canvas, settings: customSettings }: BaseSceneProps) => {
  if (!canvas) throw new Error('Canvas is undefined!');

  let scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    composer: EffectComposer,
    renderScene: RenderPass;
  let clock: THREE.Clock, time: number, delta: number;
  let camera: THREE.PerspectiveCamera;
  let orbitControls: OrbitControls;
  let stats: Stats;
  let gui: Pane;

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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    composer = new EffectComposer(renderer);
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

    if (settings.axesHelper) {
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
    }

    if (settings.gridHelper) {
      const gridHelper = new THREE.GridHelper(10, 10);
      // gridHelper.rotateX(Math.PI / 2);
      scene.add(gridHelper);
    }

    stats = Stats();
    stats.dom.style.display = 'inline-block';
    document.querySelector('#gui_container')!.appendChild(stats.dom);

    handleEvents();
  }

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
      resetCamera();
      // TODO: need to resize custom post processing effects as well
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
    gui = new Pane({
      title: 'Debug Settings',
      container: document.getElementById('gui_container')!,
    });
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

    gui
      .addInput(settings, 'zoom', { min: 0.1, max: 3, step: 0.001 })
      .on('change', ({ value }) => {
        camera.zoom = value;
        camera.updateProjectionMatrix();
      });

    gui.disabled = !settings.sceneDebugControls;
    gui.hidden = gui.disabled;
  }

  function render() {
    requestAnimationFrame(render);
    time = clock.getElapsedTime();
    delta = clock.getDelta();

    // Update uniforms
    uniforms.uTime.value = time;

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
    composer.addPass(renderScene);
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
      registerRenderCallback,
      unregisterRenderCallback,
    };
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
    V extends typeof settings[S],
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

export default BaseScene;
