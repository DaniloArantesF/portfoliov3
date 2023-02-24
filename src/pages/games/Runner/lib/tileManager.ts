import { create } from 'zustand';
import type { RefObject } from 'react';
import {
  COLLIDER_HEIGHT,
  TILE_COUNT,
  TILE_HEIGHT,
  TILE_LENGTH,
  TRACK_COUNT,
} from '../config';
import * as THREE from 'three';
import { useStore } from './store';

// Minimum distance between coins
const COIN_SPACE = 0.5;

type TileRef = RefObject<THREE.Mesh | THREE.Group> | null;

export interface TileData {
  ref: TileRef;
  position: THREE.Vector3;
  index: number;
  obstacles: THREE.Vector3[];
  coins: THREE.Vector3[];
  run: number;
  color: string;
}

interface TileStoreState {
  tiles: TileData[];
  addTile: (data: TileData) => void;
  setTiles: (tiles: TileData[]) => void;
  updateTile: (index: number, update: TileData) => void;
  set: (
    partial:
      | TileStoreState
      | Partial<TileStoreState>
      | ((state: TileStoreState) => TileStoreState | Partial<TileStoreState>),
  ) => void;
  get: () => TileStoreState;

  resetTiles: () => void;
}

export function getRandomObstacle(z: number) {
  const tracks = useStore.getState().tracks;
  return tracks[Math.floor(Math.random() * TRACK_COUNT)]
    .clone()
    .setComponent(1, COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2);
}

const useTiles = create<TileStoreState>((set, get) => ({
  tiles: [
    ...new Array(TILE_COUNT).fill(0).map((_, i) => ({
      index: i,
      run: 0,
      obstacles: [getRandomObstacle(i * TILE_LENGTH)],
      coins: [],
      color: 'red',
      position: new THREE.Vector3(0, 0, i * TILE_LENGTH),
      ref: null,
    })),
  ],
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
  setObstacles: (index: number, obstacles: THREE.Vector3[]) => {},
  setTiles: (tiles: TileData[]) => {},
  resetTiles: () => {
    set((state) => {
      const tiles = [...state.tiles];
      tiles.forEach((tile, i) => {
        tile.position.set(0, 0, i * TILE_LENGTH);
        tile.run = 0;
        tile.obstacles = [getRandomObstacle(i * TILE_LENGTH)];
        tile.coins = [];
      });
      return { tiles };
    });
  },
  set,
  get,
}));

export default useTiles;
