import { useBox } from '@react-three/cannon';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { clamp } from '@utils/math';
import { useEffect, useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { track1, track2, track3 } from '../Scene';
import * as THREE from 'three';

const SPEED = 0.1;
const PLAYER_BOUNDS = {
  x: 3,
  y: 5,
};

export function Player() {
  const [sub, get] = useKeyboardControls();
  const tracks = useMemo(() => [track1, track2, track3], []);
  const curTrack = useRef(1);
  const position = useRef<THREE.Vector3>(new THREE.Vector3(0, 3, 0));
  const velocity = useRef<TScene.Vec3>([0, 0, 0]);
  const [ref, api] = useBox(
    () => ({
      mass: 1,
      position: position.current.toArray(),
      type: 'Kinematic',
      args: [1, 2, 1],
    }),
    useRef<Mesh>(null),
  );

  useEffect(
    () => api.position.subscribe((p) => position.current.set(...p)),
    [],
  );
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), []);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        curTrack.current = clamp(curTrack.current + 1, 0, tracks.length - 1);
      } else if (event.key === 'ArrowRight') {
        curTrack.current = clamp(curTrack.current - 1, 0, tracks.length - 1);
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);

  useFrame((state) => {
    position.current.lerp(tracks[curTrack.current], 0.05);
    api.position.set(...position.current.toArray());
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}