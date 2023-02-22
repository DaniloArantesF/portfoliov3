import { create } from 'zustand';
import { createRef, RefObject } from 'react';
// import shallow from 'zustand/shallow';
import type { Mesh } from 'three/src/Three';
import * as THREE from 'three';

export interface StoreState {
  player: RefObject<Mesh>;
  score: number;
  status: 'idle' | 'running' | 'finished' | 'ended' | 'paused';
  debug: boolean;
  run: number;
  orbitControls: boolean;
  curTrack: THREE.Vector3;
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

export const useStore = create<StoreState>((set, get) => ({
  player: createRef<Mesh>(),
  status: 'idle',
  score: 0,
  debug: true,
  orbitControls: false,
  run: 0,
  curTrack: new THREE.Vector3(0, 0, 0),
  incScore: () => {
    set((state) => ({ score: state.score + 1 }));
  },
  gameOver: () => {
    set(() => ({ status: 'finished' }));
  },
  reset: () => {
    set(() => ({
      status: 'running',
      score: 0,
    }));
  },
  get,
  set,
}));
