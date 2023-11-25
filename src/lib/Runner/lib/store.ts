import { create } from 'zustand';
import { createRef, type RefObject } from 'react';
import type { Mesh } from 'three/src/Three.js';
import { devtools } from 'zustand/middleware';
import { type ConfigSlice, createConfigSlice } from './configSlice';
import { createStateSlice, type StateSlice } from './stateSlice';
import {
  createTileSlice,
  type TileSlice,
  TILE_COUNT,
  TILE_LENGTH,
} from './tileSlice';

export type StoreState = ConfigSlice &
  StateSlice &
  TileSlice & {
    player: RefObject<Mesh>;
    playerVelocity: RefObject<TScene.Vec3>;
    playerJumping: boolean;

    /* Misc. */
    get: () => StoreState;
    set: (
      partial:
        | StoreState
        | Partial<StoreState>
        | ((state: StoreState) => StoreState | Partial<StoreState>),
      replace?: boolean | undefined,
    ) => void;
  };

// Minimum distance between coins
export const COIN_SPACE = 0.5;
export const BOUNDS = {
  x: (TILE_COUNT * TILE_LENGTH) / 2,
  z: (TILE_COUNT * TILE_LENGTH) / 2,
};

export const keyboardControlsMap = [
  { name: 'left', keys: ['ArrowLeft', 'a'] },
  { name: 'right', keys: ['ArrowRight', 'd'] },
  { name: 'up', keys: ['ArrowUp', 'Space'] },
  { name: 'down', keys: ['ArrowDown', 'Shift'] },
];

export const useStore = create<StoreState>()(
  devtools((set, get, store) => {
    return {
      get,
      set,
      player: createRef<Mesh>(),
      playerVelocity: createRef<TScene.Vec3>(),
      playerJumping: false,
      ...createConfigSlice(set, get, store),
      ...createStateSlice(set, get, store),
      ...createTileSlice(set, get, store),
    };
  }),
);
