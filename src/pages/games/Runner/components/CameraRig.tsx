import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';

const SPEED = 8;

function CameraRig() {
  const { curTrack } = useStore();
  const ref = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const distance = curTrack.clone().sub(ref.current.position);
    const easedDistance = distance.clone().multiplyScalar(SPEED * delta);
    ref.current.position.x += easedDistance.x;
  });

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      fov={75}
      position={[0, 5, -5]}
      rotation={[0, Math.PI, 0]}
      lookAt={() => new THREE.Vector3(0, 2, 0)}
    />
  );
}

export default CameraRig;
