import { useRef } from 'react';
import type { Group } from 'three';
import { Tile } from './Tile';
import { useStore } from '../lib/store';

export function Track() {
  const trackRef = useRef<Group>(null);
  const { tiles, run } = useStore();

  return (
    <group ref={trackRef}>
      {tiles &&
        tiles.map((tile, i) => <Tile key={`${i}-${run}`} index={tile.index} />)}
    </group>
  );
}
