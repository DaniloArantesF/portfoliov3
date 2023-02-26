import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';
import { useBox } from '@react-three/cannon';
import Obstacle, { SAFE_ZONE } from './Obstacle';
import { Text } from '@react-three/drei';
import { useStore } from '../lib/store';
import useDebug from '../lib/useDebug';
import Coin from './Coin';
import type { TileData } from '../lib/tileSlice';

type TileProps = {
  index: number;
};

export const Tile = (props: TileProps) => {
  const {
    scrollingSpeed,
    status,
    tileCount,
    tileHeight,
    tileLength,
    tileWidth,
    setTileRef,
    randomizeTile,
  } = useStore();
  const debug = useDebug(props.index === 0);
  const tiles = useRef<TileData[]>(useStore.getState().tiles);
  const {
    position: tPosition,
    run,
    color,
  } = useMemo(
    () => tiles.current[props.index],
    [useStore.getState().tiles[props.index].run],
  );

  const args = useMemo<TScene.Vec3>(
    () => [tileWidth, tileHeight, tileLength],
    [],
  );
  const [ref, api] = useBox(
    () => ({
      position: [tPosition.x, 0, tPosition.z],
      rotation: [0, 0, 0],
      args,
      type: 'Static',
    }),
    useRef<Group>(null),
  );
  const position = ref.current?.position;

  useLayoutEffect(() => {
    setTileRef(props.index, ref);
    useStore.subscribe((state) => {
      tiles.current = state.tiles;
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
      randomizeTile(props.index, run + 1);
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

        {tiles.current[props.index].coins.map((coin, i) => (
          <Coin
            key={`${i}-${run}`}
            position={coin}
            tileIndex={props.index}
            tile={ref}
            run={tiles.current[props.index].run}
          />
        ))}

        {tiles.current[props.index].obstacles.map((obstacle, i) => (
          <Obstacle
            key={`${i}-${run}`}
            position={obstacle}
            tileIndex={props.index}
            visible={run > 0 || props.index > SAFE_ZONE}
            run={tiles.current[props.index].run}
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
