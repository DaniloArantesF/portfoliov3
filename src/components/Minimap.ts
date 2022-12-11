'use client';
import * as THREE from 'three';
// const urls = [1, 2, 3, 4, 5];

// urls.forEach((url, i) => {
//   const geometry = new THREE.BufferGeometry().setFromPoints([
//     new THREE.Vector3(0, -0.5, 0),
//     new THREE.Vector3(0, 0.5, 0),
//   ]);
//   const material = new THREE.LineBasicMaterial({
//     color: 0xff0000,
//   });
//   const line = new THREE.Line(geometry, material);

//   line.position.set(i * 0.06 - urls.length * 0.03, 0 / 2 + 0.6, 0.1);
//   scene.add(line);
// });

interface MinimapProps {
  position: number;
  count: number;
}

// ref.current.children.forEach((child, index) => {
// Give me a value between 0 and 1
//   starting at the position of my item
//   ranging across 4 / total length
//   make it a sine, so the value goes from 0 to 1 to 0.
//   const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
//   child.scale.y = damp(child.scale.y, 0.1 + y / 6, 8, delta)
// })

const Minimap = ({ position, count }: MinimapProps) => {
  const minimap = new THREE.Group();
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -0.05, 0),
    new THREE.Vector3(0, 0.05, 0),
  ]);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < count; i++) {
    const line = new THREE.Line(geometry, material);
    line.position.set(i * 0.05 - count * 0.01, -1 / 2 - 0.01, 0.1);

    minimap.add(line);
  }

  return minimap;
};

export default Minimap;
