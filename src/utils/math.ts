export function lerp(a: number, b: number, t: number) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return a + t * (b - a);
}

export function clamp(n: number, min: number, max: number) {
  return n <= min ? min : n >= max ? max : n;
}

// 0-1-0 for a range between from -> from + distance
export const curve = (
  from: number,
  distance: number,
  margin: number = 0,
  offset: number,
) => {
  return Math.sin(range(from, distance, margin, offset) * Math.PI);
};

// 0-1 for a range between from -> from + distance
export const range = (
  from: number,
  distance: number,
  margin: number = 0,
  offset = 0,
) => {
  const start = from - margin;
  const end = start + distance + margin * 2;
  return offset < start
    ? 0
    : offset > end
    ? 1
    : (offset - start) / (end - start);
};

export const inRange = (s: number, e: number, n: number) => n >= s && n < e;

// basic brute force prime test
export const isPrime = (n: number) => {
  for (let i = 2, s = Math.sqrt(n); i <= s; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return n > 1;
};

export const rand = (a = 0, b = 1) => {
  return Math.random() * (b - a) + a;
};

export function remap(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number,
): number {
  return clamp(
    toLow + ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow),
    toLow,
    toHigh,
  );
}
