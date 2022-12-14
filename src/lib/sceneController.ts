import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

type useFrame = (state: BaseSceneState) => void;

interface BaseSceneProps {
  canvas: HTMLCanvasElement;
  onReady?: () => void;
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
    };

interface Uniforms {
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

const defaultSceneParams = {
  cameraPosition: [0, 0, 1],
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  fov: 75,
};

// TODO: Allow base functions to be overwritten or hooked into
// TODO: Support custom canvas events

const BaseScene = ({ canvas }: BaseSceneProps) => {
  let scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    composer: EffectComposer,
    renderScene: RenderPass;
  let clock: THREE.Clock, time: number, delta: number;
  let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  let orbitControls: OrbitControls;
  let stats: Stats;

  // Render loop subscribers
  const subscribers: useFrame[] = [];

  const settings = {
    orbitControls: false,
  };

  const uniforms: Uniforms = {
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uTime: {
      value: 0,
    },
    uMouse: { value: { x: 0, y: 0 } },
  };

  const {
    cameraPosition: defaultCameraPosition,
    fov,
    aspect,
    near,
    far,
  } = defaultSceneParams;

  function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
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

    return { state: getSceneState(), ...getSceneHooks() };
  }

  function initScene() {
    /* --------- Camera --------- */
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    resetCamera();

    /* ---------- Lights ---------- */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    /* ---------- Utils ---------- */
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = settings.orbitControls;
    orbitControls.autoRotateSpeed = 0.5;

    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.rotateX(Math.PI / 2);
    scene.add(gridHelper);

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
    }

    window.addEventListener('resize', function () {
      clearTimeout(resizeEvent);
      resizeEvent = setTimeout(resizeHandler, 100);
    });

    // window.addEventListener('wheel', (ev) => console.log(ev))
  }

  function resetCamera() {
    const [x, y, z] = defaultCameraPosition;
    camera.position.set(x, y, z);
  }

  function initGUI() {}

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

    stats.begin();
    composer.render();
    stats.end();
  }

  function effects() {
    renderScene = new RenderPass(scene, camera);
    composer.addPass(renderScene);
  }

  // TODO
  function cleanup() {}

  function registerAnimationCallback(cb: useFrame) {
    subscribers.push(cb);
  }

  function unregisterAnimationCallback(cb: useFrame) {
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
    return { registerAnimationCallback, unregisterAnimationCallback };
  }

  return init();
};

export default BaseScene;
