import * as THREE from 'three';

interface MinimapProps {
  count: number;
}

const Minimap = ({ count }: MinimapProps) => {
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
