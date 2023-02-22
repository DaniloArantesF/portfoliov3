import { create } from 'zustand';
import type { RefObject } from 'react';

// Minimum distance between coins
const COIN_SPACE = 0.5;

type TileRef = RefObject<THREE.Mesh | THREE.Group>;

interface TileData {
  ref: TileRef;
  index: number;
  obstacles: THREE.Vector3[];
  coins: THREE.Vector3[];
  run: number;
}

interface TileStoreState {
  tiles: TileData[];
  addTile: (ref: TileRef) => TileData;
  setTiles: (tiles: TileData[]) => void;
  setObstacles: (index: number, obstacles: THREE.Vector3[]) => void;
  set: (
    partial:
      | TileStoreState
      | Partial<TileStoreState>
      | ((state: TileStoreState) => TileStoreState | Partial<TileStoreState>),
  ) => void;
  updateTile: (index: number, update: TileData) => void;
}

const useTiles = create<TileStoreState>((set, get) => ({
  tiles: [],
  addTile: (ref: TileRef) => {
    const index = get().tiles.length;
    const tile = { ref, index, obstacles: [], coins: [], run: 0 };
    set((state) => ({ tiles: [...state.tiles, tile] }));
    return tile;
  },
  setObstacles: (index: number, obstacles: THREE.Vector3[]) => {
    set((state) => {
      const tiles = [...state.tiles];
      tiles[index].obstacles = obstacles;
      return { tiles };
    });
  },
  setTiles: (tiles: TileData[]) => {
    set(() => ({ tiles }));
  },
  updateTile: (index: number, update: TileData) => {
    set((state) => {
      state.tiles[index] = update;
      return { tiles: state.tiles };
    });
  },
  set,
}));

export default useTiles;
