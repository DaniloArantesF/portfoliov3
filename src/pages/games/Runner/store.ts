import { create } from 'zustand';
import { createRef, RefObject } from 'react';
// import shallow from 'zustand/shallow';
import type { Object3D } from 'three/src/Three';
import { useTweaks, makeButton } from 'use-tweaks';

interface StoreState {
  player: RefObject<Object3D>;
  score: number;
  debug: boolean;
  get: () => StoreState;
  set: (newState: Partial<StoreState>) => void;
  // Actions
  incScore: () => void;
  onStart: () => void;
  onCheckpoint: () => void;
  onFinish: () => void;
  onReset: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  player: createRef<Object3D>(),
  score: 0,
  debug: true,
  incScore: () => {
    set((state) => ({ score: state.score + 1 }));
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
