import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useStore } from '../lib/store';
import { TILE_COUNT, TILE_LENGTH } from '../lib/tileSlice';

const o = new THREE.Object3D();

function Track() {
  const { Tiles, ref } = useStore();
  const tilesRef = useRef(useStore.getState().tiles);
  const tiles = tilesRef.current;
  const obstacles = useMemo(
    () =>
      tiles
        .map((tile) => ({
          groupRef: tile.group,
          tileIndex: tile.index,
          obstacles: tile.obstacles,
          wrapCount: tile.wrapCount,
        }))
        .flat(),
    [],
  );

  useLayoutEffect(() => {
    useStore.subscribe(() => {
      tilesRef.current = useStore.getState().tiles;
    });

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
      {obstacles.map(
        ({ tileIndex, obstacles: curObstacles, wrapCount, groupRef }, i) => {
          const setGroupRef = (element: THREE.Group) => {
            (groupRef as React.MutableRefObject<THREE.Group | null>).current = element;
          };

          return (
            <group key={`${i}${wrapCount}`} ref={setGroupRef}>
              {curObstacles.map(
                ({ position, args, type: Obstacle, index }, j) => (
                  <Obstacle
                    key={`${j}`}
                    position={position}
                    tileIndex={tileIndex}
                    wrapCount={wrapCount}
                    args={args}
                    index={index}
                  />
                ),
              )}
            </group>
          );
        },
      )}
    </>
  );
}

export default Track;