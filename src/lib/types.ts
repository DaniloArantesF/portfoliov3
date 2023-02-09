import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type Stats from 'three/examples/jsm/libs/stats.module';
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import type { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

export type useFrame = (state: BaseSceneState) => void;

export interface Scene {
  init: () => void;
  setupGUI: () => void;
  handleEvents: () => void;
  postProcessing: () => void;
  loadAssets: () => void;
  animationLoop: useFrame;
}

export interface BaseSceneSettings {
  antialias: boolean;
  aspect: number;
  autoRotate: boolean;
  axesHelper: boolean;
  cameraPosition: [number, number, number] | number[];
  far: number;
  fov: number;
  gridHelper: boolean;
  near: number;
  orbitControls: boolean;
  sceneDebugControls: boolean;
  zoom: number;
}

export interface BaseSceneProps {
  canvas: HTMLCanvasElement;
  settings?: Partial<BaseSceneSettings>;
  onResize?: () => void;
}
// uniform group ?
export interface Uniforms {
  [key: string]: THREE.IUniform;
  uMouse: { type?: 'v2'; value: { x: number; y: number } };
  uResolution: { type?: 'v2'; value: THREE.Vector2 };
  uTime: { type?: 'f'; value: number };
}
export type SceneHook = 'onResize';

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
