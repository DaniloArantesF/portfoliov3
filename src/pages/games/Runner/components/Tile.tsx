import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';
import { useBox } from '@react-three/cannon';
import Obstacle, { SAFE_ZONE } from './Obstacle';
import { Text } from '@react-three/drei';
import { useStore } from '../lib/store';
import type { TileData } from '../lib/tileSlice';
import Coin from './Coin';

type TileProps = TileData & {
  onWrap: (index: number, z: number) => void;
};

export const Tile = ({ onWrap, color, ...props }: TileProps) => {
  const {
    scrollingSpeed,
    status,
    tileCount,
    tileHeight,
    tileLength,
    tileWidth,
    updateTile,
  } = useStore();

  const args = useMemo<TScene.Vec3>(
    () => [tileWidth, tileHeight, tileLength],
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

  useLayoutEffect(() => {
    updateTile(props.index, {
      ...props,
      ref,
      color: 'purple',
    });
  }, []);

  useFrame((state, delta) => {
    if (!position || status !== 'running') return;

    if (position.z >= (tileLength / 2) * -1) {
      // Scroll tiles
      position.z -= delta * scrollingSpeed;
    } else {
      // Wrap tiles back to start
      position.z += tileLength * tileCount;
      onWrap(props.index, position.z);
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
        {props.coins?.map((coin, i) => (
          <Coin
            key={`${i}:${props.run}`}
            position={coin}
            tileIndex={props.index}
            tile={ref}
            run={props.run}
          />
        ))}

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
          position={[0, tileHeight / 2 + 0.01, 0]}
          fontSize={3}
          children={props.index.toString()}
          color={'white'}
        />
      </group>
    </>
  );
};
