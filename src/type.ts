import { rgbaArray } from 'react-native-svg';

export type Dimension = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};
export type Color = string | number | rgbaArray | undefined;
