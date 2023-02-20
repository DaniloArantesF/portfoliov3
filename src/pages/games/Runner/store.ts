import { create } from 'zustand';
import { createRef, RefObject } from 'react';
// import shallow from 'zustand/shallow';
import type { Mesh } from 'three/src/Three';

export interface StoreState {
  player: RefObject<Mesh>;
  score: number;
  status: 'idle' | 'running' | 'finished' | 'ended' | 'paused';
  debug: boolean;
  run: number;
  orbitControls: boolean;

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
  onStart: () => void;
  onCheckpoint: () => void;
  onFinish: () => void;
  onReset: () => void;
  gameOver: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  player: createRef<Mesh>(),
  status: 'idle',
  score: 0,
  debug: true,
  orbitControls: true,
  run: 0,
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
  onStart: () => {},
  onCheckpoint: () => {},
  onFinish: () => {},
  onReset: () => {},
  get,
  set,
}));

// const actionNames = ['onStart', 'onCheckpoint', 'onFinish', 'onReset'] as const;
// export type ActionNames = typeof actionNames[number];
