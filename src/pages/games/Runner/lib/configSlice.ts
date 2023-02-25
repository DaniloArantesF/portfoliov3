import type { StateCreator } from 'zustand';
import { COIN_SPACE, COLLIDER_HEIGHT, StoreState } from './store';
import {
  SCROLLING_SPEED,
  TILE_COUNT,
  TILE_HEIGHT,
  TILE_LENGTH,
  TILE_WIDTH,
  TRACK_COUNT,
  TRACK_WIDTH,
} from './tileSlice';

export interface ConfigSlice {
  debug: boolean;
  orbitControls: boolean;
  flyControls: boolean;
  coinSpace: number;
  scrollingSpeed: number;
  tileLength: number;
  tileWidth: number;
  tileHeight: number;
  tileCount: number;
  colliderHeight: number;
  trackCount: number;
  trackWidth: number;
}

export const createConfigSlice: StateCreator<
  StoreState,
  [],
  [],
  ConfigSlice
> = (set) => ({
  debug: true,
  orbitControls: false,
  flyControls: false,
  coinSpace: COIN_SPACE,
  scrollingSpeed: SCROLLING_SPEED,
  tileLength: TILE_LENGTH,
  tileWidth: TILE_WIDTH,
  tileHeight: TILE_HEIGHT,
  tileCount: TILE_COUNT,
  colliderHeight: COLLIDER_HEIGHT,
  trackCount: TRACK_COUNT,
  trackWidth: TRACK_WIDTH,
});
