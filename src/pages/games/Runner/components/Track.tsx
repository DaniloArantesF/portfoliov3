import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { TILE_COUNT, TILE_LENGTH } from '../Scene';
import { Tile } from './Tile';

export function Track() {
  const trackRef = useRef<Group>(null);
  const tiles = useMemo(
    () =>
      [...new Array(TILE_COUNT)].map((_, i) => ({
        position: [0, 0, i * TILE_LENGTH - TILE_COUNT / 2] as TScene.Vec3,
        children: null,
        color: ['red', 'green', 'blue'][i % 3],
      })),
    [],
  );

  return (
    <group ref={trackRef} position={[0, 0, 0]}>
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          position={[...tile.position]}
          color={tile.color}
          rotation={[0, 0, 0]}
        />
      ))}
    </group>
  );
}
