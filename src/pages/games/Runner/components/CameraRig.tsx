import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useStore } from '../lib/store';

const CAMERA_SPEED = 8;

function CameraRig() {
  const { player, tracks, curTrack, status, tileLength } = useStore();
  const ref = useRef<THREE.PerspectiveCamera>(null);
  const track = tracks[curTrack];

  useLayoutEffect(() => {
    if (!ref.current || !player.current) return;
    ref.current.lookAt(
      player.current.position.x,
      player.current.position.y * 1.5,
      player.current.position.z,
    );
  }, [player]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    let target = track;
    if (status === 'ended') {
      target = track.clone().setX(0);
    }

    if (Math.abs(ref.current.position.x - target.x) < 0.05) return;
    const distance = target.clone().sub(ref.current.position);
    const easedDistance = distance.clone().multiplyScalar(CAMERA_SPEED * delta);
    ref.current.position.x += easedDistance.x;
  });

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      fov={75}
      position={[0, 5.5, (-1 * tileLength) / 4]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

export default CameraRig;
