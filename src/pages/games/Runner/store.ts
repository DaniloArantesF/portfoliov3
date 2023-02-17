import { create } from 'zustand';
import { createRef, RefObject } from 'react';
// import shallow from 'zustand/shallow';
import type { Mesh } from 'three/src/Three';
import { useTweaks, makeButton } from 'use-tweaks';

export interface StoreState {
  player: RefObject<Mesh>;
  score: number;
  status: 'idle' | 'running' | 'finished' | 'gameover';
  debug: boolean;

  orbitControls: boolean;

  get: () => StoreState;
  set: (newState: Partial<StoreState>) => void;
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
  status: 'running',
  score: 0,
  debug: true,
  orbitControls: true,
  incScore: () => {
    set((state) => ({ score: state.score + 1 }));
  },
  gameOver: () => {
    set((state) => ({ score: 0, status: 'finished' }));
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
