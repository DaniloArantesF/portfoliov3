import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadTexture = (url: string) => {
  return new THREE.TextureLoader().load(url);
};

export function loadGLTF(url: string, onLoad: (model: GLTF) => void) {
  return new GLTFLoader().load(url, onLoad);
}

export function loadGLTFSync(url: string): Promise<GLTF> {
  return new Promise((resolve) => new GLTFLoader().load(url, resolve));
}
