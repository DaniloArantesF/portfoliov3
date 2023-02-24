export const SCROLLING_SPEED = 15;
export const TILE_LENGTH = 10;
export const TILE_WIDTH = 15;
export const TILE_HEIGHT = 2;
export const TILE_COUNT = 20;
export const BOUNDS = {
  x: (TILE_COUNT * TILE_LENGTH) / 2,
  z: (TILE_COUNT * TILE_LENGTH) / 2,
};
export const COLLIDER_HEIGHT = 2;
export const TRACK_COUNT = 3;
export const TRACK_WIDTH = TILE_WIDTH / TRACK_COUNT;

export const keyboardControlsMap = [
  { name: 'left', keys: ['ArrowLeft', 'a'] },
  { name: 'right', keys: ['ArrowRight', 'd'] },
  { name: 'up', keys: ['ArrowUp', 'Space'] },
  { name: 'down', keys: ['ArrowDown', 'Shift'] },
];
