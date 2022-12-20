import * as THREE from 'three';

export const getBoundingBox = (object: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(object);
  return box.getSize(new THREE.Vector3());
};

export function createDebugBounds(bounds: [number, number, number]) {
  const box = new THREE.Box3();
  box.setFromCenterAndSize(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(...bounds),
  );
  return new THREE.Box3Helper(box, new THREE.Color(0.5, 0.5, 0.5));
}
