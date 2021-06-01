import * as React from 'react';
import {
  AxisType,
  BarChartInternalProps,
  BarChartProps,
  Data,
  YAxisProps,
} from 'react-bagan';
import {View, StyleSheet} from 'react-native';
import {Svg, Rect, Text, Line} from 'react-native-svg';
import useDimensions from '../external/react-cool-dimentions';
import {lerp} from '../math';

const oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const YAxis = (props: YAxisProps) => {
  const {observe, width, height} = useDimensions();

  const {datas, type, paddingRight = 5} = props;

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
  } else if (type === AxisType.Tenth) {
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
              textAnchor="end">
              {data * maxValueTenthDiv10}
            </Text>
          );
        })}
      </>
    );
  } else if (type === AxisType.Value) {
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
              textAnchor="end">
              {data * maxValueDiv10}
            </Text>
          );
        })}
      </>
    );
  }
  return (
    <View ref={observe} style={{width: 15 * 3}}>
      <Svg>{innerElement}</Svg>
    </View>
  );
};

const BarChartInternal = (props: BarChartInternalProps) => {
  const {observe, width, height} = useDimensions();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {datas, gridLine = {fill: 'black'}, type} = props;

  let maxValue = -Infinity;
  for (const data of datas) {
    maxValue = Math.max(data.value, maxValue);
  }
  const widthItem = width / (datas.length * 2 + 1);
  const maxValueTenth = Math.pow(10, Math.floor(Math.log10(maxValue) + 1));
  const maxValueDiv10 = maxValue / 10;
  const maxValueTenthDiv10 = maxValueTenth / 10;

  let innerElement;
  if (type === AxisType.Tenth) {
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
  } else if (type === AxisType.Value) {
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
    <View ref={observe} style={{flex: 1}}>
      <Svg>{innerElement}</Svg>
    </View>
  );
};

const BarChart = (props: BarChartProps): JSX.Element => {
  const {axisType = AxisType.ValueTenth, datas} = props;

  return (
    <View>
      <View style={styles.containerChart}>
        <YAxis datas={datas} type={axisType} />
        <BarChartInternal datas={datas} type={axisType} />
      </View>
    </View>
  );
};

export default BarChart;

const styles = StyleSheet.create({
  containerChart: {
    flexDirection: 'row',
  },
});
