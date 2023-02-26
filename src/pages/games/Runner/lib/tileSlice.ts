import type { RefObject } from 'react';
import type { StateCreator } from 'zustand';
import { COLLIDER_HEIGHT, StoreState } from './store';
import * as THREE from 'three';

export const SCROLLING_SPEED = 15;
export const TILE_LENGTH = 10;
export const TILE_WIDTH = 15;
export const TILE_HEIGHT = 2;
export const TILE_COUNT = 20;
export const TRACK_COUNT = 5;
export const TRACK_WIDTH = TILE_WIDTH / TRACK_COUNT;

type TileRef = RefObject<THREE.Mesh | THREE.Group> | null;

export interface TileData {
  coins: THREE.Vector3[];
  color: string;
  index: number;
  obstacles: THREE.Vector3[];
  position: THREE.Vector3;
  ref: TileRef;
  run: number; // TODO: rename this
}

export interface TileSlice {
  tiles: TileData[];
  trackCount: number;
  tracks: THREE.Vector3[];
  addTile: (data: TileData) => void;
  updateTile: (index: number, update: TileData) => void;
  resetTiles: () => void;
  setTileRef: (index: number, ref: TileRef) => void;
  randomizeTile: (index: number, run: number) => void;
}

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

const TILE_ROWS = 3;
const TILE_COLS = TRACK_COUNT;

export const createTileSlice: StateCreator<StoreState, [], [], TileSlice> = (
  set,
  get,
) => {
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

  const availableSpots: THREE.Vector3[] = [];
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

  const tiles = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    const curAvailableSpots = [...availableSpots];
    tiles.push({
      index: i,
      run: 0,
      obstacles: [getRandomObstacle(curAvailableSpots)],
      coins: [getRandomCoin(curAvailableSpots)],
      color: 'purple',
      position: new THREE.Vector3(0, 0, i * TILE_LENGTH),
      ref: null,
    });

    if (Math.random() > 0.5) {
      tiles[i].obstacles = [
        ...tiles[i].obstacles,
        getRandomObstacle(curAvailableSpots),
      ];
    }
  }

  return {
    trackCount: TRACK_COUNT,
    tracks,
    tiles: [...tiles],
    addTile: (tile: TileData) => {
      set((state) => ({
        tiles: [...state.tiles, tile],
      }));
    },
    updateTile: (index: number, update: TileData) => {
      set((state) => {
        const tiles = [...state.tiles];
        tiles[index] = update;
        return { tiles };
      });
    },
    setTileRef: (index: number, ref: TileRef) => {
      set((state) => {
        const tiles = [...state.tiles];
        tiles[index].ref = ref;
        return { tiles };
      });
    },
    randomizeTile: (index: number, run: number) => {
      set((state) => {
        const tiles = [...state.tiles];
        const tile = tiles[index];
        const curAvailableSpots = [...availableSpots];
        tile.run = run;
        tile.coins = [getRandomCoin(curAvailableSpots)];

        if (Math.random() > 0.5) {
          tile.obstacles = [
            ...tile.obstacles,
            getRandomObstacle(curAvailableSpots),
          ];
        } else {
          tile.obstacles = [getRandomObstacle(curAvailableSpots)];
        }

        return { tiles };
      });
    },
    resetTiles: () => {
      set((state) => {
        const tiles = [...state.tiles];
        tiles.forEach((tile, i) => {
          const curAvailableSpots = [...availableSpots];
          tile.position.set(0, 0, i * TILE_LENGTH);
          tile.run = 0;
          tile.obstacles = [getRandomObstacle(curAvailableSpots)];
          tile.coins = [getRandomCoin(curAvailableSpots)];
          if (Math.random() > 0.5) {
            tiles[i].obstacles = [
              ...tiles[i].obstacles,
              getRandomObstacle(curAvailableSpots),
            ];
          }
        });

        return { tiles };
      });
    },
  };
};
