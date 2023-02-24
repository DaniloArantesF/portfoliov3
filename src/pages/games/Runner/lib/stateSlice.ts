import type { StateCreator } from 'zustand';
import type { StoreState } from './store';
import * as THREE from 'three';
import { TRACK_COUNT, getRandomObstacle } from './tileSlice';

export interface StateSlice {
  run: number;
  score: number;
  status: 'idle' | 'running' | 'ended' | 'paused';
  curTrack: number;
  incScore: () => void;
  startGame: () => void;
  pauseGame: () => void;
  endGame: () => void;
  reset: () => void;
}

export const createStateSlice: StateCreator<StoreState, [], [], StateSlice> = (
  set,
  get,
) => ({
  run: 0,
  score: 0,
  status: 'idle',
  curTrack: Math.floor(TRACK_COUNT / 2),
  incScore: () => {
    set((state) => ({ score: state.score + 1 }));
  },
  startGame: () => {
    set(() => ({ status: 'running' }));
  },
  pauseGame: () => {
    set(() => ({ status: 'paused' }));
  },
  endGame: () => {
    set(() => ({ status: 'ended' }));
  },
  reset: () => {
    set((state) => ({
      status: 'running',
      score: 0,
      run: state.run + 1,
      curTrack: 1,
      tiles: [
        ...new Array(state.tileCount).fill(0).map((_, i) => ({
          index: i,
          run: 0,
          obstacles: [getRandomObstacle(state.tracks)],
          coins: [],
          color: 'red',
          position: new THREE.Vector3(0, 0, i * state.tileLength),
          ref: null,
        })),
      ],
    }));
  },
});
