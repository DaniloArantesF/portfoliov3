import {
  RefObject,
  createRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { Group } from 'three';
import {
  COLLIDER_HEIGHT,
  TILE_COUNT,
  TILE_HEIGHT,
  TILE_LENGTH,
  TRACK_COUNT,
} from '../config';
import { Tile } from './Tile';
import useTiles, { getRandomObstacle } from '../lib/tileManager';
// import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../lib/store';

export function Track() {
  const trackRef = useRef<Group>(null);
  const { tiles, updateTile } = useTiles();

  return (
    <group ref={trackRef}>
      {tiles &&
        tiles.map((tile, i) => (
          <Tile
            key={`${i}`}
            position={tile.position}
            color={tile.color}
            index={i}
            obstacles={tile.obstacles}
            ref={null}
            coins={tile.coins}
            run={0}
            onWrap={(index) => {
              updateTile(index, {
                ...tiles[index],
                run: tiles[index].run + 1,
                obstacles: [
                  getRandomObstacle(tile.ref?.current?.position.z ?? 0),
                ],
              });
            }}
          />
        ))}
    </group>
  );
}
