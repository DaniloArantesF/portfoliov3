import { create } from 'zustand';
import { createRef, RefObject } from 'react';
// import shallow from 'zustand/shallow';
import type { Object3D } from 'three/src/Three';

interface StoreState {
  player: RefObject<Object3D>;
  score: number;
  get: () => StoreState;

  // Actions
  incScore: () => void;
  onStart: () => void;
  onCheckpoint: () => void;
  onFinish: () => void;
  onReset: () => void;
}

const useStore = create<StoreState>((set, get) => ({
  player: createRef<Object3D>(),
  score: 0,

  incScore: () => {
    set((state) => ({ score: state.score + 1 }));
  },
  onStart: () => {},
  onCheckpoint: () => {},
  onFinish: () => {},
  onReset: () => {},
  get,
}));

// const actionNames = ['onStart', 'onCheckpoint', 'onFinish', 'onReset'] as const;
// export type ActionNames = typeof actionNames[number];
