import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
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
import { useStore } from '../store';

function getRandomObstacle() {
  return [track1, track2, track3][Math.floor(Math.random() * 3)]
    .clone()
    .setComponent(1, COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2);
}

export const Tile = ({ color, ...props }: BoxProps & { color: string }) => {
  const { gameOver, status, incScore } = useStore();
  const position = useRef<TScene.Vec3>(props.position ?? [0, 0, 0]);
  const args = useMemo<TScene.Vec3>(
    () => [TILE_WIDTH, TILE_HEIGHT, TILE_LENGTH],
    [],
  );

  // Obstacles & Collision
  const obstacleArgs = useMemo<TScene.Vec3>(() => [3, COLLIDER_HEIGHT, 1], []);
  const colliderPosition = useRef(getRandomObstacle());

  /* Tile */
  const [ref, api] = useBox(
    () => ({
      ...props,
      args,
      type: 'Static',
    }),
    useRef<Group>(null),
  );

  const [, checkpointApi] = useBox(
    () => ({
      args: [10, 5, 1],
      position: colliderPosition.current.toArray(),
      isTrigger: true,
      onCollideBegin: () => {
        if (status === 'running' && spawnObstacle.current) incScore();
      },
    }),
    useRef<Mesh>(null),
  );

  /* Obstacle */
  const spawnObstacle = useRef(false);
  const [obstacleRef, obstacleApi] = useBox(
    () => ({
      args: obstacleArgs,
      position: colliderPosition.current.toArray(),
      isTrigger: true,
      onCollideBegin: () => {
        if (spawnObstacle.current) gameOver();
      },
    }),
    useRef<Mesh>(null),
  );

  useEffect(() => {
    if (obstacleRef.current) {
      obstacleRef.current.visible = false;
      updateTile();
    }
  }, []);

  useFrame((state) => {
    if (!position.current || status !== 'running') return;

    if (position.current[2] > BOUNDS.z * -1) {
      // Scroll tiles
      position.current[2] -= SCROLLING_SPEED;
    } else {
      // Wrap tiles back to start
      position.current[2] = BOUNDS.z;

      // Randomize collider position
      colliderPosition.current = getRandomObstacle();
      spawnObstacle.current = true;
      obstacleRef.current!.visible = true;
    }

    updateTile();
  });

  function updateTile() {
    // Update collider position
    colliderPosition.current.z = position.current[2];

    // Update physics
    api.position.set(
      position.current[0],
      position.current[1],
      position.current[2],
    );

    obstacleApi.position.set(
      colliderPosition.current.x,
      colliderPosition.current.y,
      colliderPosition.current.z,
    );

    checkpointApi.position.set(
      0,
      colliderPosition.current.y,
      colliderPosition.current.z,
    );
  }

  return (
    <>
      {/* Tile */}
      <group ref={ref} name={'tile'}>
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
      <mesh ref={obstacleRef} name={'obstacle'}>
        <boxGeometry attach="geometry" args={obstacleArgs} />
        <meshPhongMaterial
          attach="material"
          color="yellow"
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};
