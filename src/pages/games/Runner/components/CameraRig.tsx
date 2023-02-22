import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../lib/store';

const SPEED = 8;

function CameraRig() {
  const { curTrack, status } = useStore();
  const ref = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    let target = curTrack;
    if (status === 'ended') {
      target = curTrack.clone().setX(0);
    }

    if (Math.abs(ref.current.position.x - target.x) < 0.05) return;

    const distance = target.clone().sub(ref.current.position);
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
