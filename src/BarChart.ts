import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Rect, Text, Line } from 'react-native-svg';
import useDimensions from './external/react-cool-dimensions';

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number
) => lerp(x2, y2, invlerp(x1, y1, a));

type YAxisProps = {
  paddingRight?: number,
  datas: Array<Data>
}

const YAxis = (props: YAxisProps) => {
  const { observe, unobserve, width, height, entry } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
    },
  });

  const { observe2, unobserve2, width2, height2, entry2 } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
    },
  });

  const {
    datas,
    paddingRight = 5
  } = props;

  const startX = width - paddingRight;
  let maxValue = -Infinity;
  for (const data of datas) {
    maxValue = Math.max(data.value, maxValue);
  }

  return (
    <View ref={observe} style={{ width: 15*3, backgroundColor: 'green' }}>
      <Svg>
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValue);
          return <Text
            fill="white"
            fontSize="15"
            x={startX}
            y={height - barHeight}
            alignmentBaseline="middle"
            textAnchor="end">
            {data.value}
          </Text>;
        })}
      </Svg>
    </View>
  );
};

type Data = {
  value: number,
  bar: object
};

type BarChartInternalProps = {
  datas: Array<Data>,
  gridLine: object
};

const BarChartInternal = (props: BarChartInternalProps) => {
  const { observe, unobserve, width, height, entry } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
    },
  });

  const {
    datas,
    gridLine = { fill: 'black' }
  } = props;

  let maxValue = -Infinity;
  for (const data of datas) {
    maxValue = Math.max(data.value, maxValue);
  }
  const widthItem = (width) / (datas.length * 2 + 1);

  return (
    <View ref={observe} style={{ flex: 1, backgroundColor: 'yellow' }}>
      <Svg>
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValue);
          return <Line
            x1={0}
            y1={height - barHeight}
            x2={width}
            y2={height - barHeight}
            stroke={'black'}
          />;
        })}
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValue);
          const { bar = {} } = data;
          const { barFill = 'red' } = bar;
          return <Rect
            x={widthItem + widthItem * index * 2}
            y={height - barHeight}
            width={widthItem}
            height={barHeight}
            fill={barFill}
          />;
        })}
      </Svg>
    </View>
  );
};

type BarChartProps = {

};

export default (props: BarChartProps) => {
  const datas = [
    { value: 100 },
    { value: 500 },
    { value: 200 },
    { value: 400 },
    { value: 300 },
  ];

  return (
    <View>
      <View style={styles.containerChart}>
        <YAxis datas={datas} />
        <BarChartInternal datas={datas} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerChart: {
    flexDirection: 'row'
  },
});
