export type BarProps = {
  fill: string;
};

export type Data = {
  value: number;
  bar?: BarProps;
};

export type AxisType = 'valueTenth' | 'value' | 'tenth';

export type Dimension = {
  width: number;
  height: number;
};

export type BarChartProps = {
  axisType: AxisType;
  datas: Array<Data>;
  dimensionAxis: Dimension;
  dimensionChart: Dimension;
};

export type YAxisProps = {
  datas: Array<Data>;
  paddingRight?: number;
  type: AxisType;
  dimension: Dimension;
};

export type BarChartInternalProps = {
  datas: Array<Data>;
  gridLine?: Record<string, unknown>;
  type: AxisType;
  dimension: Dimension;
};
