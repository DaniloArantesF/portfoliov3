import { useBox } from '@react-three/cannon';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { clamp } from '@utils/math';
import { useLayoutEffect, useRef } from 'react';
import type { Mesh } from 'three';
import * as THREE from 'three';
import { useStore } from '../lib/store';

const HORIZONTAL_SPEED = 10;
const JUMP_VELOCITY = 20;
const DOWN_VELOCITY = -JUMP_VELOCITY / 2;
const GRAVITY = 70;
const initialPosition = new THREE.Vector3(0, 3, 0);

export function Player() {
  const { set, tracks, trackCount } = useStore();
  const [sub, getKeyboard] = useKeyboardControls();
  const curTrack = useRef(Math.floor(trackCount / 2));
  const position = useRef<THREE.Vector3>(initialPosition.clone());
  const velocity = useRef<TScene.Vec3>([0, 0, 0]);
  const isJumping = useRef(false);
  const [ref, api] = useBox(
    () => ({
      mass: 1,
      position: position.current.toArray(),
      type: 'Kinematic',
      args: [1, 2, 1],
      rotation: [0, Math.PI, 0],
    }),
    useRef<Mesh>(null),
  );

  useLayoutEffect(
    () => api.position.subscribe((p) => position.current.set(...p)),
    [],
  );
  useLayoutEffect(
    () => api.velocity.subscribe((v) => (velocity.current = v)),
    [],
  );

  useLayoutEffect(() => {
    set({ player: ref });

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        curTrack.current = clamp(curTrack.current + 1, 0, tracks.length - 1);
        set({ curTrack: curTrack.current });
      } else if (event.key === 'ArrowRight') {
        curTrack.current = clamp(curTrack.current - 1, 0, tracks.length - 1);
        set({ curTrack: curTrack.current });
      } else if (event.code === 'Space' && !isJumping.current) {
        velocity.current[1] = JUMP_VELOCITY;
        isJumping.current = true;
      } else if (event.key === 'ArrowDown' && isJumping.current) {
        velocity.current[1] = DOWN_VELOCITY;
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);

  useFrame((state, delta) => {
    const { up, down } = getKeyboard();

    if (isJumping.current) {
      velocity.current[1] -= GRAVITY * delta;

      if (position.current.y < initialPosition.y) {
        position.current.y = initialPosition.y;
        velocity.current[1] = 0;
        isJumping.current = false;
      }
    }

    if (up && !isJumping.current) {
      velocity.current[1] = JUMP_VELOCITY;
      isJumping.current = true;
    }

    if (down && isJumping.current && velocity.current[1] > 0) {
      velocity.current[1] = DOWN_VELOCITY;
    }

    const distance = tracks[curTrack.current].clone().sub(position.current);
    const easedDistance = distance
      .clone()
      .multiplyScalar(HORIZONTAL_SPEED * delta);

    position.current.x += easedDistance.x;
    position.current.z += easedDistance.z;

    api.position.set(...position.current.toArray());
    api.velocity.set(...velocity.current);
  });

  return (
    <mesh ref={ref} name={'player'}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
