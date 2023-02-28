import * as THREE from 'three';
import { useLayoutEffect, createRef, useMemo, RefObject } from 'react';
import { useStore } from '../lib/store';
import { TILE_COUNT, TILE_LENGTH } from '../lib/tileSlice';

const o = new THREE.Object3D();

function Track() {
  const { Tiles, ref, tiles, run } = useStore();
  const obstacles = tiles
    .map((tile) => ({
      groupRef: tile.group,
      tileIndex: tile.index,
      obstacles: tile.obstacles,
      wrapCount: tile.wrapCount,
    }))
    .flat();

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Set initial positions for tiles and objects
    for (let i = 0; i < TILE_COUNT; i++) {
      o.position.set(0, 0, i * TILE_LENGTH);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);

      const tileGroup = tiles[i].group.current;
      if (tileGroup !== null) {
        tileGroup.position.z = o.position.z;
      }
    }

    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      {Tiles}
      {obstacles.map(({ tileIndex, obstacles, wrapCount, groupRef }, i) => {
        return (
          <group key={`${i}${wrapCount}`} ref={groupRef}>
            {obstacles.map(({ position, args, type: Obstacle }, j) => (
              <Obstacle
                key={`${j}${wrapCount}`}
                position={position}
                tileIndex={tileIndex}
                wrapCount={wrapCount}
                args={args}
              />
            ))}
          </group>
        );
      })}
    </>
  );
}

export default Track;
