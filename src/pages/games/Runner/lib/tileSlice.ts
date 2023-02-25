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

  // available spots
}

export interface TileSlice {
  tiles: TileData[];
  trackCount: number;
  tracks: THREE.Vector3[];
  addTile: (data: TileData) => void;
  updateTile: (index: number, update: TileData) => void;
  resetTiles: () => void;
}

export function getRandomObstacle(tracks: THREE.Vector3[]) {
  return tracks[Math.floor(Math.random() * TRACK_COUNT)]
    .clone()
    .setComponent(1, COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2);
}

export function getRandomCoin(tracks: THREE.Vector3[]) {
  return tracks[Math.floor(Math.random() * TRACK_COUNT)]
    .clone()
    .setComponent(1, COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2);
}

export const createTileSlice: StateCreator<StoreState, [], [], TileSlice> = (
  set,
  get,
) => {
  const tracks = [
    ...new Array(TRACK_COUNT).fill(0).map((_, i) => {
      const trackWidth = TILE_WIDTH / TRACK_COUNT;
      return new THREE.Vector3(
        trackWidth * (i - Math.floor(TRACK_COUNT / 2)),
        3,
        0,
      );
    }),
  ];

  return {
    trackCount: TRACK_COUNT,
    tracks,
    tiles: [
      ...new Array(TILE_COUNT).fill(0).map((_, i) => ({
        index: i,
        run: 0,
        obstacles: [getRandomObstacle(tracks)],
        coins: [getRandomCoin(tracks)],
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
    resetTiles: () => {
      set((state) => {
        const tiles = [...state.tiles];
        tiles.forEach((tile, i) => {
          tile.position.set(0, 0, i * TILE_LENGTH);
          tile.run = 0;
          tile.obstacles = [getRandomObstacle(tracks)];
          tile.coins = [getRandomCoin(tracks)];
        });
        return { tiles };
      });
    },
  };
};
