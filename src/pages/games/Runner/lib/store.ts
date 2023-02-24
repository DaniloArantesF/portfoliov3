import { create } from 'zustand';
import { createRef, RefObject } from 'react';
import type { Mesh } from 'three/src/Three';
import * as THREE from 'three';
import {
  TRACK_COUNT,
  TILE_WIDTH,
  TILE_COUNT,
  COLLIDER_HEIGHT,
  TILE_HEIGHT,
  TILE_LENGTH,
} from '../config';
import { devtools } from 'zustand/middleware';

type TileRef = RefObject<THREE.Mesh | THREE.Group> | null;

export interface TileData {
  coins: THREE.Vector3[];
  color: string;
  index: number;
  obstacles: THREE.Vector3[];
  position: THREE.Vector3;
  ref: TileRef;
  run: number;
}

export interface StoreState {
  curTrack: number;
  debug: boolean;
  orbitControls: boolean;
  player: RefObject<Mesh>;
  run: number;
  score: number;
  status: 'idle' | 'running' | 'ended' | 'paused';
  tiles: TileData[];
  trackCount: number;
  tracks: THREE.Vector3[];

  // Actions
  incScore: () => void;
  addTile: (data: TileData) => void;
  updateTile: (index: number, update: TileData) => void;
  resetTiles: () => void;

  startGame: () => void;
  pauseGame: () => void;
  endGame: () => void;
  reset: () => void;

  get: () => StoreState;
  set: (
    partial:
      | StoreState
      | Partial<StoreState>
      | ((state: StoreState) => StoreState | Partial<StoreState>),
    replace?: boolean | undefined,
  ) => void;
}

export function getRandomObstacle(tracks: THREE.Vector3[]) {
  return tracks[Math.floor(Math.random() * TRACK_COUNT)]
    .clone()
    .setComponent(1, COLLIDER_HEIGHT / 2 + TILE_HEIGHT / 2);
}

export const useStore = create<StoreState>()(
  devtools((set, get) => {
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
      player: createRef<Mesh>(),
      status: 'idle',
      score: 0,
      debug: true,
      orbitControls: false,
      run: 0,
      trackCount: TRACK_COUNT,
      curTrack: Math.floor(TRACK_COUNT / 2),
      tracks,
      incScore: () => {
        set((state) => ({ score: state.score + 1 }));
      },
      endGame: () => {
        set(() => ({ status: 'ended' }));
      },
      tiles: [
        ...new Array(TILE_COUNT).fill(0).map((_, i) => ({
          index: i,
          run: 0,
          obstacles: [getRandomObstacle(tracks)],
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
      resetTiles: () => {
        set((state) => {
          const tiles = [...state.tiles];
          tiles.forEach((tile, i) => {
            tile.position.set(0, 0, i * TILE_LENGTH);
            tile.run = 0;
            tile.obstacles = [getRandomObstacle(tracks)];
            tile.coins = [];
          });
          return { tiles };
        });
      },
      startGame: () => {
        set(() => ({ status: 'running' }));
      },
      pauseGame: () => {
        set(() => ({ status: 'paused' }));
      },
      reset: () => {
        set((state) => ({
          status: 'running',
          score: 0,
          run: state.run + 1,
          curTrack: 1,
          tiles: [
            ...new Array(TILE_COUNT).fill(0).map((_, i) => ({
              index: i,
              run: 0,
              obstacles: [getRandomObstacle(tracks)],
              coins: [],
              color: 'red',
              position: new THREE.Vector3(0, 0, i * TILE_LENGTH),
              ref: null,
            })),
          ],
        }));
      },
      get,
      set,
    };
  }),
);
