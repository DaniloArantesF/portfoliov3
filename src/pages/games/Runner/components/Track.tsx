import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { BOUNDS, TILE_COUNT, TILE_LENGTH } from '../config';
import { useGameStateManager } from '../hooks/gameStateManager';
import { Tile } from './Tile';

export function Track() {
  const trackRef = useRef<Group>(null);
  const [tiles, setTiles] = useState(
    [...new Array(TILE_COUNT)].map((_, i) => ({
      key: i,
      position: [0, 0, i * TILE_LENGTH - TILE_COUNT / 2] as TScene.Vec3,
      children: null,
      color: ['red', 'green', 'blue'][i % 3],
    })),
  );

  return (
    <group ref={trackRef}>
      {tiles.map((tile) => (
        <Tile
          key={tile.key}
          position={[...tile.position]}
          color={tile.color}
          rotation={[0, 0, 0]}
        />
      ))}
    </group>
  );
}
