import { addEffect } from '@react-three/fiber';
import type { StateCreator } from 'zustand';
import type { StoreState } from './store';
import { SCROLLING_SPEED, TRACK_COUNT } from './tileSlice';


export interface StateSlice {
  run: number;
  score: number;
  status: 'idle' | 'running' | 'ended' | 'paused';
  curTrack: number;
  time: number;
  incScore: () => void;
  startGame: () => void;
  pauseGame: () => void;
  endGame: () => void;
  resetState: () => void;
}

// TODO: target for camera
// TODO: functions to move camera

export const createStateSlice: StateCreator<StoreState, [], [], StateSlice> = (
  set,
  get,
  store
) => {

  return {
    run: 0,
    score: 0,
    status: 'idle',
    time: 0,
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
    resetState: () => {
      set((state) => ({
        status: 'running',
        score: 0,
        run: state.run + 1,
        curTrack: Math.floor(TRACK_COUNT / 2),
      }));
    },
  };
};
