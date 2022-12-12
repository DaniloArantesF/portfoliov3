import * as THREE from 'three';

const TextureLoader = (url: string) => {
  const texture = new THREE.TextureLoader().load(url);
  //  TODO: get image dimensions using astro utils?
};

export default TextureLoader;
