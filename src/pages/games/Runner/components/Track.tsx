import { useRef } from 'react';
import type { Group } from 'three';
import { Tile } from './Tile';
import { useStore, getRandomObstacle } from '../lib/store';

export function Track() {
  const trackRef = useRef<Group>(null);
  const { tiles, updateTile, tracks } = useStore();

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
            onWrap={(index: number, z) => {
              updateTile(index, {
                ...tiles[index],
                run: tiles[index].run + 1,
                obstacles: [getRandomObstacle(tracks)],
              });
            }}
          />
        ))}
    </group>
  );
}
