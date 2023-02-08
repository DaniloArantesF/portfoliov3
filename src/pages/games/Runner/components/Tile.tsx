import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';
import { useBox } from '@react-three/cannon';
import type { BoxProps } from '@react-three/cannon';
import {
  SCROLLING_SPEED,
  TILE_LENGTH,
  TILE_WIDTH,
  BOUNDS,
  COLLIDER_HEIGHT,
  TILE_HEIGHT,
  track1,
  track2,
  track3,
} from '../Scene';

function getRandomObstacle() {
  return [track1, track2, track3][Math.floor(Math.random() * 3)]
    .clone()
    .setComponent(1, COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2);
}

export const Tile = ({ color, ...props }: BoxProps & { color: string }) => {
  const position = useRef<TScene.Vec3>(props.position ?? [0, 0, 0]);
  const args = useMemo<TScene.Vec3>(
    () => [TILE_WIDTH, TILE_HEIGHT, TILE_LENGTH],
    [],
  );
  const [ref, api] = useBox(
    () => ({
      ...props,
      args,
      type: 'Static',
    }),
    useRef<Group>(null),
  );

  const colliderPosition = useRef(getRandomObstacle());

  const obstacleArgs = useMemo<TScene.Vec3>(() => [3, COLLIDER_HEIGHT, 1], []);
  const [_, colliderApi] = useBox(
    () => ({
      args: obstacleArgs,
      isTrigger: true,
      onCollide: (e) => {
        console.log(e);
      },
      position: colliderPosition.current.toArray(),
    }),
    useRef<Mesh>(null),
  );
  const [obstacleRef, obstacleApi] = useBox(
    () => ({
      args: obstacleArgs,
      position: colliderPosition.current.toArray(),
    }),
    useRef<Mesh>(null),
  );

  useFrame((state) => {
    if (!position.current) return;

    if (position.current[2] > BOUNDS.z * -1) {
      // Scroll tiles
      position.current[2] -= SCROLLING_SPEED;
    } else {
      // Wrap tiles back to start
      position.current[2] = BOUNDS.z;

      // Randomize collider position
      colliderPosition.current = getRandomObstacle();
    }

    // Update collider position
    colliderPosition.current.z = position.current[2];

    // Update physics
    api.position.set(
      position.current[0],
      position.current[1],
      position.current[2],
    );
    colliderApi.position.set(
      colliderPosition.current.x,
      colliderPosition.current.y,
      colliderPosition.current.z,
    );
    obstacleApi.position.set(
      colliderPosition.current.x,
      colliderPosition.current.y,
      colliderPosition.current.z,
    );
  });

  return (
    <>
      {/* Tile */}
      <group ref={ref}>
        <mesh>
          <boxGeometry attach="geometry" args={args} />
          <meshPhongMaterial
            attach="material"
            color={color}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Obstacle */}
      <mesh ref={obstacleRef}>
        <boxGeometry attach="geometry" args={obstacleArgs} />
        <meshPhongMaterial
          attach="material"
          color="red"
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};
