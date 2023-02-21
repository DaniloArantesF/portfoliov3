import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect, useState } from 'react';
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
} from '../config';
import { useGameStateManager } from '../hooks/gameStateManager';
import Obstacle from './Obstacle';

function getRandomObstacle() {
  return [track1, track2, track3][Math.floor(Math.random() * 3)]
    .clone()
    .setComponent(1, COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2);
}

type TileProps = BoxProps & {
  color: string;
  position: TScene.Vec3;
};

export const Tile = ({ color, ...props }: TileProps) => {
  const { status } = useGameStateManager();
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
  const position = ref.current?.position;
  const [obstaclePositions, setObstaclePositions] = useState([
    getRandomObstacle(),
  ]);

  useFrame((state, delta) => {
    if (!position || status !== 'running') return;

    if (position.z > BOUNDS.z * -1) {
      // Scroll tiles
      position.z -= delta * SCROLLING_SPEED;
    } else {
      // Wrap tiles back to start
      position.z = BOUNDS.z;
    }

    updateTile();
  });

  function updateTile() {
    if (!position) return;
    api.position.set(position.x, position.y, position.z);
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

        {obstaclePositions.map((obstaclePosition, index) => (
          <Obstacle key={index} position={obstaclePosition} visible={true} />
        ))}
      </group>
    </>
  );
};
