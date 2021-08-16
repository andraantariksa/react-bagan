export const lerp = (x: number, y: number, a: number): number =>
  x * (1 - a) + y * a;
export const invlerp = (x: number, y: number, a: number): number =>
  clamp((a - x) / (y - x));
export const clamp = (a: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, a));
export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number,
): number => lerp(x2, y2, invlerp(x1, y1, a));

// Transformation
export const rotate2D = (x: number, y: number, r: number) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];

// Vector
export const vecUnit = (vec: Array<number>) => {
  const oneOverNorm =
    1 / Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
  return vec.map(val => val * oneOverNorm);
};
export const vecMul = (vec: Array<number>, scalar: number) =>
  vec.map(val => val * scalar);
export const vecAdd = (vec: Array<number>, otherVec: Array<number>) =>
  vec.map((val, idx) => val + otherVec[idx]);
