import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { atom } from 'nanostores';
import { Pane } from 'tweakpane';

export type useFrame = (state: BaseSceneState) => void;

export interface BaseSceneSettings {
  cameraPosition: [number, number, number] | number[];
  aspect: number;
  near: number;
  far: number;
  fov: number;
  orbitControls: boolean;
  autoRotate: boolean;
  gridHelper: boolean;
  antialias: boolean;
  sceneDebugControls: boolean;
}

interface BaseSceneProps {
  canvas: HTMLCanvasElement;
  settings?: Partial<BaseSceneSettings>;
}

type UniformValue =
  | {
      type?: 'f';
      value: number;
    }
  | {
      type?: 'v2';
      value: THREE.Vector2 | { x: number; y: number };
    }
  | {
      type?: 'v3';
      value: THREE.Vector3 | { x: number; y: number; z: number };
    }
  | {
      type?: `uint[${number}]`;
      value: Uint8Array;
    }
  | {
      type?: `float[${number}]`;
      value: Float32Array;
    };

export interface Uniforms {
  uTime: { type?: 'f'; value: number };
  uResolution: { type?: 'v2'; value: THREE.Vector2 };
  uMouse: { type?: 'v2'; value: { x: number; y: number } };
  [key: string]: UniformValue;
}

export interface BaseSceneState {
  ready: boolean;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  renderScene: RenderPass;
  clock: THREE.Clock;
  time: number;
  delta: number;
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  orbitControls: OrbitControls;
  stats: Stats;
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
};

// TODO: Allow all base functions to be overwritten or hooked into
const BaseScene = ({ canvas, settings: customSettings }: BaseSceneProps) => {
  if (!canvas) throw new Error('Canvas is undefined!');

  let scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    composer: EffectComposer,
    renderScene: RenderPass;
  let clock: THREE.Clock, time: number, delta: number;
  let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
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

    if (settings.gridHelper) {
      const gridHelper = new THREE.GridHelper(10, 10);
      gridHelper.rotateX(Math.PI / 2);
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
      camera.updateProjectionMatrix();
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

    // THREE.DefaultLoadingManager.onError = function (url) {
    //   console.log('There was an error loading ' + url);
    // };
  }

  function resetCamera() {
    const [x, y, z] = settings.cameraPosition;
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
  }

  function initGUI() {
    gui = new Pane({
      title: 'Debug Settings',
      container: document.getElementById('gui_container')!,
    });
    gui.expanded = false;
    const debugFolder = gui.addFolder({ title: 'Debug' });
    // debugFolder.expanded = true;
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
      ready: false,
      scene,
      renderer,
      composer,
      renderScene,
      clock,
      time,
      delta,
      camera,
      orbitControls,
      stats,
      uniforms,
    };
  }

  function getSceneHooks() {
    return { registerRenderCallback, unregisterRenderCallback };
  }

  function getViewport() {
    if (camera instanceof THREE.OrthographicCamera)
      return { width: 1, height: 1 }; // ???

    // Convert vertical fov to radians
    const vfov = (settings.fov * Math.PI) / 180;
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

  function getUtils() {
    return { gui, updateSetting, resetCamera, getViewport };
  }

  // TODO
  function cleanup() {}

  return init();
};

export default BaseScene;
