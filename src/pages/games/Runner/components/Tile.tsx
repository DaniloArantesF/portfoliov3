import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';
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
import useTiles from '../lib/tileManager';
import { Text } from '@react-three/drei';

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

  const { tiles, addTile, setObstacles, updateTile } = useTiles();
  const [index, setIndex] = useState(-1);
  const [run, setRun] = useState(0);
  const tileData = useMemo(
    () => (index > -1 ? tiles[index] : null),
    [index, tiles, run],
  );

  useEffect(() => {
    if (!ref.current) return;
    const tileData = addTile(ref);
    const obstaclePositions = [getRandomObstacle()];

    setIndex(tileData.index);
    setObstacles(tileData.index, obstaclePositions);
  }, []);

  useFrame((state, delta) => {
    if (!tileData || tileData.index < 0 || !position || status !== 'running')
      return;

    if (position.z > BOUNDS.z * -1) {
      // Scroll tiles
      position.z -= delta * SCROLLING_SPEED;
    } else {
      // Wrap tiles back to start
      position.z = BOUNDS.z;

      updateTile(tileData.index, {
        ...tileData,
        run: tileData.run + 1,
        obstacles: [getRandomObstacle()],
      });
      setRun(tileData.run + 1);
    }

    updateTilePosition();
  });

  function updateTilePosition() {
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

        {tileData &&
          tileData.obstacles.map((obstaclePosition, i) => (
            <Obstacle
              tileIndex={index}
              run={run}
              key={`${index}-${i}`}
              position={obstaclePosition}
              visible={true}
            />
          ))}

        <Text
          rotation={[Math.PI / 2, Math.PI, 0]}
          position={[0, TILE_HEIGHT / 2 + 0.01, 0]}
          fontSize={3}
          children={index.toString()}
          color={'white'}
        />
      </group>
    </>
  );
};
