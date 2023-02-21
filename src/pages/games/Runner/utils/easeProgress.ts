export function round(n: number, digits: number) {
  return Number(n.toFixed(digits));
}

export function ease(target: number, n: number, factor: number) {
  return round((target - n) * factor, 5);
}

export function easeProgress(
  progress: number,
  easingFunction: (progress: number) => number,
) {
  return easingFunction(progress);
}
