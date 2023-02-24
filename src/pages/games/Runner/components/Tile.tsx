import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';
import { useBox } from '@react-three/cannon';
import type { BoxProps } from '@react-three/cannon';
import {
  SCROLLING_SPEED,
  TILE_LENGTH,
  TILE_WIDTH,
  TILE_HEIGHT,
  TILE_COUNT,
  COLLIDER_HEIGHT,
  TRACK_COUNT,
} from '../config';
import { useGameStateManager } from '../hooks/gameStateManager';
import Obstacle, { SAFE_ZONE } from './Obstacle';
import useTiles, { TileData } from '../lib/tileManager';
import { Text } from '@react-three/drei';
import { useStore } from '../lib/store';

type TileProps = TileData & {
  onWrap: (index: number) => void;
};

export const Tile = ({ onWrap, color, ...props }: TileProps) => {
  const { tracks } = useStore();
  const { status } = useGameStateManager();
  const args = useMemo<TScene.Vec3>(
    () => [TILE_WIDTH, TILE_HEIGHT, TILE_LENGTH],
    [],
  );
  const [ref, api] = useBox(
    () => ({
      position: [props.position.x ?? 0, 0, props.position.z ?? 0],
      rotation: [0, 0, 0],
      args,
      type: 'Static',
    }),
    useRef<Group>(null),
  );
  const position = ref.current?.position;
  const { updateTile } = useTiles();

  useLayoutEffect(() => {
    updateTile(props.index, {
      ...props,
      ref,
      color: 'green',
    });
  }, []);

  useFrame((state, delta) => {
    if (!position || status !== 'running') return;

    if (position.z >= (TILE_LENGTH / 2) * -1) {
      // Scroll tiles
      position.z -= delta * SCROLLING_SPEED;
    } else {
      // Wrap tiles back to start
      position.z += TILE_LENGTH * TILE_COUNT;
      onWrap(props.index);
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

        {props.obstacles?.map((obstacle, i) => (
          <Obstacle
            key={`${i}${props.run}`}
            position={obstacle}
            tileIndex={props.index}
            visible={props.run > 0 || props.index > SAFE_ZONE}
            run={props.run}
          />
        ))}
        <Text
          rotation={[Math.PI / 2, Math.PI, 0]}
          position={[0, TILE_HEIGHT / 2 + 0.01, 0]}
          fontSize={3}
          children={props.index.toString()}
          color={'white'}
        />
      </group>
    </>
  );
};
