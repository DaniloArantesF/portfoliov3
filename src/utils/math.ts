import * as THREE from 'three';

export function clamp(n: number, min: number, max: number) {
  return n <= min ? min : n >= max ? max : n;
}

export const damp = THREE.MathUtils.damp;

// 0-1-0 for a range between from -> from + distance
export const curve = (from: number, distance: number, margin: number = 0) => {
  return Math.sin(range(from, distance, margin) * Math.PI);
};

// 0-1 for a range between from -> from + distance
export const range = (from: number, distance: number, margin: number = 0) => {
  const offset = 0;
  const start = from - margin;
  const end = start + distance + margin * 2;
  return offset < start
    ? 0
    : offset > end
    ? 1
    : (offset - start) / (end - start);
};
