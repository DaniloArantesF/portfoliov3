import { create } from 'zustand';
import { createRef, RefObject } from 'react';
// import shallow from 'zustand/shallow';
import type { Mesh } from 'three/src/Three';
import * as THREE from 'three';
import { TRACK_COUNT, TILE_WIDTH } from '../config';
import { devtools } from 'zustand/middleware';

export interface StoreState {
  player: RefObject<Mesh>;
  score: number;
  status: 'idle' | 'running' | 'finished' | 'ended' | 'paused';
  debug: boolean;
  run: number;
  orbitControls: boolean;
  curTrack: number;
  trackCount: number;
  tracks: THREE.Vector3[];
  get: () => StoreState;
  set: (
    partial:
      | StoreState
      | Partial<StoreState>
      | ((state: StoreState) => StoreState | Partial<StoreState>),
    replace?: boolean | undefined,
  ) => void;
  // Actions
  incScore: () => void;
}

export const useStore = create<StoreState>()(
  devtools((set, get) => ({
    player: createRef<Mesh>(),
    status: 'idle',
    score: 0,
    debug: true,
    orbitControls: false,
    run: 0,
    trackCount: TRACK_COUNT,
    curTrack: Math.floor(TRACK_COUNT / 2),
    tracks: [
      ...new Array(TRACK_COUNT).fill(0).map((_, i) => {
        const trackWidth = TILE_WIDTH / TRACK_COUNT;
        return new THREE.Vector3(
          trackWidth * (i - Math.floor(TRACK_COUNT / 2)),
          3,
          0,
        );
      }),
    ],
    incScore: () => {
      set((state) => ({ score: state.score + 1 }));
    },
    gameOver: () => {
      set(() => ({ status: 'finished' }));
    },

    get,
    set,
  })),
);
