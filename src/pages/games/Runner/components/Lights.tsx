import { useHelper } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { TILE_COUNT, TILE_LENGTH } from '../lib/tileSlice';
import { useStore } from '../lib/store';
const origin = new THREE.Vector3(0, 0, 0);

function Lights() {
  const { debug } = useStore();
  const light1 = useRef<THREE.PointLight>(null!);
  const light2 = useRef<THREE.PointLight>(null!);
  debug && useHelper(light1, THREE.PointLightHelper, 1, 'yellow');
  debug && useHelper(light2, THREE.PointLightHelper, 1, 'yellow');

  return (
    <>
      <ambientLight args={[0xffffff]} intensity={0.1} />
      <pointLight
        ref={light1}
        args={[0xffffff]}
        intensity={0.3}
        position={[0, 30, -20]}
        lookAt={() => origin}
      />
      <pointLight
        ref={light2}
        args={[0xdddddd]}
        intensity={0.1}
        position={[20, 30, (TILE_COUNT * TILE_LENGTH) / 3]}
      />
    </>
  );
}

export default Lights;
