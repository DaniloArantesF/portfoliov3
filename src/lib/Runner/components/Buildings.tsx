import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../lib/store';

const buildingMaterial = new THREE.MeshStandardMaterial({
  color: 'red',
  // wireframe: true,
  side: THREE.DoubleSide,
});

const BUILDING_LENGTH = 10;
const MIN_BUILDING_HEIGHT = 5;
const BUILDING_WIDTH = 20;

const buildingGeometry = new THREE.BoxGeometry(
  BUILDING_WIDTH,
  20,
  BUILDING_LENGTH,
);

function Buildings() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const tileCount = useStore((state) => state.tileCount);
  const buildingCount = useMemo(() => 20, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!ref.current) return;

    for (let i = 0; i < buildingCount; i++) {
      const x = 5;
      const y = 0;
      const z = i; // - (buildingCount / 2 * BUILDING_LENGTH);
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }

    // for (let i = buildingCount / 2 + 1; i < buildingCount; i++) {
    //   const x = 20;
    //   const y = 0;
    //   const z = i * BUILDING_LENGTH; // - (buildingCount / 2 * BUILDING_LENGTH);
    //   dummy.position.set(x, y, z);
    //   dummy.updateMatrix();
    //   ref.current.setMatrixAt(i, dummy.matrix);
    // }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[buildingGeometry, buildingMaterial, length]}
    ></instancedMesh>
  );
}

export default Buildings;
