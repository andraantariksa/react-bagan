import * as React from 'react';
import {
  BarChartInternalProps,
  BarChartProps,
  Data,
  YAxisProps,
} from 'react-bagan';
import {View, StyleSheet} from 'react-native';
import {Svg, Rect, Text, Line} from 'react-native-svg';
import {lerp} from '../math';

const oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const YAxis = (props: YAxisProps) => {
  const {
    datas,
    type,
    paddingRight = 5,
    dimension: {width, height},
  } = props;

  const startX = width - paddingRight;
  let maxValue = -Infinity;
  for (const data of datas) {
    maxValue = Math.max(data.value, maxValue);
  }
  const maxValueTenth = Math.pow(10, Math.floor(Math.log10(maxValue) + 1));
  const maxValueTenthDiv10 = maxValueTenth / 10;
  const maxValueDiv10 = maxValue / 10;

  let innerElement;
  if (maxValue === 0) {
    innerElement = <></>;
  } else if (type === 'tenth') {
    innerElement = (
      <>
        {oneToTen.map((data: number, index: number) => {
          const barHeight = lerp(
            0,
            height - 10,
            (data * maxValueTenthDiv10) / maxValueTenth,
          );
          return (
            <Text
              key={index}
              fontSize="15"
              x={startX}
              y={height - barHeight}
              alignmentBaseline="middle"
              fill="black"
              textAnchor="end">
              {data * maxValueTenthDiv10}
            </Text>
          );
        })}
      </>
    );
  } else if (type === 'value') {
    innerElement = (
      <>
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValue);
          return (
            <Text
              key={index}
              fontSize="15"
              x={startX}
              y={height - barHeight}
              alignmentBaseline="middle"
              fill="black"
              textAnchor="end">
              {data.value}
            </Text>
          );
        })}
      </>
    );
  } else {
    innerElement = (
      <>
        {oneToTen.map((data: number, index: number) => {
          const barHeight = lerp(
            0,
            height - 10,
            (data * maxValueDiv10) / maxValue,
          );
          return (
            <Text
              key={index}
              fontSize="15"
              x={startX}
              y={height - barHeight}
              alignmentBaseline="middle"
              fill="black"
              textAnchor="end">
              {data * maxValueDiv10}
            </Text>
          );
        })}
      </>
    );
  }
  return (
    <View style={{width: 15 * 3}}>
      <Svg height={height}>{innerElement}</Svg>
    </View>
  );
};

const BarChartInternal = (props: BarChartInternalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    datas,
    gridLine = {fill: 'black'},
    type,
    dimension: {width, height},
  } = props;

  let maxValue = -Infinity;
  for (const data of datas) {
    maxValue = Math.max(data.value, maxValue);
  }
  const widthItem = width / (datas.length * 2 + 1);
  const maxValueTenth = Math.pow(10, Math.floor(Math.log10(maxValue) + 1));
  const maxValueDiv10 = maxValue / 10;
  const maxValueTenthDiv10 = maxValueTenth / 10;

  let innerElement;
  if (type === 'tenth') {
    innerElement = (
      <>
        {oneToTen.map((data: number, index: number) => {
          const barHeight = lerp(
            0,
            height - 10,
            (data * maxValueTenthDiv10) / maxValueTenth,
          );
          return (
            <Line
              key={index}
              x1={0}
              y1={height - barHeight}
              x2={width}
              y2={height - barHeight}
              stroke={'black'}
            />
          );
        })}
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValueTenth);
          const {bar = {fill: 'red'}} = data;
          return (
            <Rect
              key={index}
              x={widthItem + widthItem * index * 2}
              y={height - barHeight}
              width={widthItem}
              height={barHeight}
              fill={bar.fill}
            />
          );
        })}
      </>
    );
  } else if (type === 'value') {
    innerElement = (
      <>
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValue);
          return (
            <Line
              key={index}
              x1={0}
              y1={height - barHeight}
              x2={width}
              y2={height - barHeight}
              stroke={'black'}
            />
          );
        })}
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValue);
          const {bar = {fill: 'red'}} = data;
          return (
            <Rect
              key={index}
              x={widthItem + widthItem * index * 2}
              y={height - barHeight}
              width={widthItem}
              height={barHeight}
              fill={bar.fill}
            />
          );
        })}
      </>
    );
  } else {
    innerElement = (
      <>
        {oneToTen.map((data: number, index: number) => {
          const barHeight = lerp(
            0,
            height - 10,
            (data * maxValueDiv10) / maxValue,
          );
          return (
            <Line
              key={index}
              x1={0}
              y1={height - barHeight}
              x2={width}
              y2={height - barHeight}
              stroke={'black'}
            />
          );
        })}
        {datas.map((data: Data, index: number) => {
          const barHeight = lerp(0, height - 10, data.value / maxValue);
          const {bar = {fill: 'red'}} = data;
          return (
            <Rect
              key={index}
              x={widthItem + widthItem * index * 2}
              y={height - barHeight}
              width={widthItem}
              height={barHeight}
              fill={bar.fill}
            />
          );
        })}
      </>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Svg height={height}>{innerElement}</Svg>
    </View>
  );
};

const BarChart = (props: BarChartProps): JSX.Element => {
  const {axisType = 'valueTenth', datas, dimensionAxis, dimensionChart} = props;

  return (
    <View>
      <View style={styles.containerChart}>
        <YAxis datas={datas} type={axisType} dimension={dimensionAxis} />
        <BarChartInternal
          datas={datas}
          type={axisType}
          dimension={dimensionChart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerChart: {
    flexDirection: 'row',
  },
});

export default BarChart;
