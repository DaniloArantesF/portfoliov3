import type { StateCreator } from 'zustand';
import { StoreState, useStore } from './store';
import { addEffect } from '@react-three/fiber';
import { createRef, RefObject } from 'react';
import * as THREE from 'three';
import Obstacle from '../components/Obstacle';
import Coin from '../components/Coin';
import { lerp } from '@utils/math';

export const SCROLLING_SPEED = 15;
export const MAX_SCROLLING_SPEED = 45;
export const TILE_LENGTH = 10;
export const TILE_WIDTH = 15;
export const TILE_HEIGHT = 2;
export const TILE_COUNT = 20;
export const TRACK_COUNT = 3;
export const TRACK_WIDTH = TILE_WIDTH / TRACK_COUNT;
export const COLLIDER_HEIGHT = 2;
const o = new THREE.Object3D();

const tileGeometry = new THREE.BoxGeometry(
  TILE_WIDTH,
  TILE_HEIGHT,
  TILE_LENGTH,
);
const tileMaterial = new THREE.MeshLambertMaterial({
  color: '#2a0c3a',
});

interface ObstacleData {
  args: [number, number, number];
  index: number;
  position: THREE.Vector3;
  type: (...args: any) => JSX.Element;
}

interface TileData {
  index: number;
  group: RefObject<THREE.Group>;
  obstacles: ObstacleData[];
  wrapCount: number;
}

export interface TileSlice {
  Tiles: JSX.Element;
  ref: React.RefObject<THREE.InstancedMesh>;
  tiles: TileData[];
  tracks: THREE.Vector3[];
  randomizeTile: (i: number, run: number) => void;
  resetTiles: () => void;
}

const OBSTACLE_ARGS: [number, number, number][] = [
  [4, 3, 1],
  [TRACK_WIDTH, 3, 1],
  [4, 6, 1],
];

const TILE_ROWS = 3;
const TILE_COLS = TRACK_COUNT;

// Create list of available spots for obstacles and coins in one tile
// This list is cloned every time a tile is created or randomized
export const availableSpots: THREE.Vector3[] = [];
for (let i = 0; i < TILE_ROWS; i++) {
  for (let j = 0; j < TILE_COLS; j++) {
    availableSpots.push(
      new THREE.Vector3(
        (TILE_WIDTH / TILE_COLS) * (j - Math.floor(TILE_COLS / 2)),
        COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2,
        (TILE_LENGTH / TILE_ROWS) * (i - Math.floor(TILE_ROWS / 2)),
      ),
    );
  }
}

function getTile(i = 0, curSpots: THREE.Vector3[]) {
  return {
    index: i,
    group: createRef<THREE.Group>(),
    obstacles: [...getRandomObstacles()],
    wrapCount: 0,
  };
}

function getRandomObstacles() {
  const curSpots = [...availableSpots];

  // Create obstacles
  const obstacles = [] as ObstacleData[];
  const obstacleCount = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push({
      position: getRandomObstacle(curSpots),
      args: OBSTACLE_ARGS[Math.floor(Math.random() * OBSTACLE_ARGS.length)],
      type: Obstacle,
      index: i,
    });
  }

  // Create coins
  const coins = [] as ObstacleData[];
  const coinCount = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < coinCount; i++) {
    coins.push({
      position: getRandomCoin(curSpots),
      args: [0.5, 0.5, 0.5],
      type: Coin,
      index: obstacleCount - 1 + i,
    });
  }

  return [...obstacles, ...coins];
}

function getTiles() {
  return [
    ...new Array(TILE_COUNT).fill(0).map((_, i) => {
      return {
        index: i,
        group: createRef<THREE.Group>(),
        obstacles: [...getRandomObstacles()],
        wrapCount: 0,
      };
    }),
  ];
}

// Get random position for obstacle
// Removes position from available spots in place
export function getRandomObstacle(availableSpots: THREE.Vector3[]) {
  const index = Math.floor(Math.random() * availableSpots.length);
  const position = availableSpots[index].clone();
  availableSpots.splice(index, 1);
  return position;
}

export function getRandomCoin(availableSpots: THREE.Vector3[]) {
  const index = Math.floor(Math.random() * availableSpots.length);
  const position = availableSpots[index].clone();
  availableSpots.splice(index, 1);
  return position;
}

export const createTileSlice: StateCreator<StoreState, [], [], TileSlice> = (
  set,
  get,
  store,
) => {
  const ref = createRef<THREE.InstancedMesh>();
  const Tiles = (
    <instancedMesh
      ref={ref}
      args={[tileGeometry, tileMaterial, TILE_COUNT]}
      receiveShadow
    />
  );

  // Create tracks based on track count
  const trackWidth = TILE_WIDTH / TRACK_COUNT;
  const tracks = [
    ...new Array(TRACK_COUNT).fill(0).map((_, i) => {
      return new THREE.Vector3(
        trackWidth * (i - Math.floor(TRACK_COUNT / 2)),
        3,
        0,
      );
    }),
  ];

  // Move tiles based on game state
  const clock = new THREE.Clock();
  let scrollingSpeed = SCROLLING_SPEED || 0;

  addEffect(() => {
    const state = useStore.getState();
    if (!ref.current || state.status !== 'running') {
      clock.stop();
      return;
    }

    if (!clock.running) clock.start();
    const delta = clock.getDelta();

    for (let i = 0; i < TILE_COUNT; i++) {
      ref.current.getMatrixAt(i, o.matrix);
      o.matrix.decompose(o.position, o.quaternion, o.scale);

      if (o.position.z >= (state.tileLength / 2) * -1) {
        // Scroll tiles
        o.position.z -= delta * scrollingSpeed;
      } else {
        // Wrap tiles back to start
        o.position.z += state.tileLength * state.tileCount;
        state.randomizeTile(i, state.tiles[i].wrapCount + 1);
      }

      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);

      const tileGroup = state.tiles[i].group.current;
      if (tileGroup !== null) {
        // Update tile group position
        tileGroup.position.z = o.position.z;
        tileGroup.position.y = o.position.y;
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;

    // Update scrolling speed
    scrollingSpeed = THREE.MathUtils.damp(
      scrollingSpeed,
      MAX_SCROLLING_SPEED,
      0.01,
      delta,
    );

    // Updates the state once every second
    if ((clock.elapsedTime * 1000) % 1000 <= delta * 1000) {
      store.setState({ scrollingSpeed });
    }
  });

  return {
    ref,
    Tiles,
    tiles: getTiles(),
    tracks: tracks,
    randomizeTile: (i: number, run: number) =>
      set((state: StoreState) => {
        state.tiles[i].wrapCount = run;
        state.tiles[i].obstacles = [...getRandomObstacles()];
        return {
          tiles: state.tiles,
        };
      }),
    resetTiles: () =>
      set((state: StoreState) => {
        state.tiles = getTiles();
        scrollingSpeed = SCROLLING_SPEED;
        state.scrollingSpeed = scrollingSpeed;
        return state;
      }),
  };
};
