declare module 'react-bagan' {
  type BarProps = {
    fill: string;
  };

  type Data = {
    value: number;
    bar?: BarProps;
  };

  enum AxisType {
    ValueTenth,
    Value,
    Tenth,
  }

  type BarChartProps = {
    axisType: AxisType;
    datas: Array<Data>;
  };

  type YAxisProps = {
    datas: Array<Data>;
    paddingRight?: number;
    type: AxisType;
  };

  type BarChartInternalProps = {
    datas: Array<Data>;
    gridLine?: Record<string, unknown>;
    type: AxisType;
  };
}
