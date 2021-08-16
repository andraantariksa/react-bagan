import * as React from 'react';
import {
  Dimension,
  Position
} from '../type';
import {View, StyleSheet} from 'react-native';
import {Svg, Rect, Text, Line} from 'react-native-svg';
import {lerp} from '../math';
import {oneToTen} from '../const';

export type BarChartBarProps = {
  fill: string;
};

export type BarChartAxisType = 'valueTenth' | 'value' | 'tenth';

export type BarChartData = {
  value: number;
  bar?: BarChartBarProps;
  label?: (leftBottomPosition: Position, value: number, index: number) => JSX.Element;
};

export type BarChartProps = {
  axisType: BarChartAxisType;
  datas: Array<BarChartData>;
  axis?: BarChartYAxisProps;
  topPadding?: number;
  showLine?: boolean;
  dimension: Dimension;
};

export type BarChartYAxisProps = {
  dimension: Dimension;
};

type YAxisInternalProps = {
  datas: Array<BarChartData>;
  topPadding: number;
  paddingRight?: number;
  type: BarChartAxisType;
  dimension: Dimension;
};

type BarChartInternalProps = {
  datas: Array<BarChartData>;
  showLine?: boolean;
  topPadding: number;
  gridLine?: Record<string, unknown>;
  type: BarChartAxisType;
  dimension: Dimension;
};

const YAxis = ({
                 datas,
                 type,
                 paddingRight = 5,
                 dimension: {width, height},
                 topPadding
               }: YAxisInternalProps) => {
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
            height - topPadding,
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
        {datas.map((data: BarChartData, index: number) => {
          const barHeight = lerp(0, height - topPadding, data.value / maxValue);
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
            height - topPadding,
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

const BarChartInternal = ({
  datas,
  gridLine = {fill: 'black'},
  type,
  dimension: {width, height},
  showLine = false,
  topPadding
}: BarChartInternalProps) => {
  let maxValue = -Infinity;
  for (const data of datas) {
    maxValue = Math.max(data.value, maxValue);
  }
  if (maxValue === 0) {
    maxValue = 10;
  }
  const widthItem = width / (datas.length * 2 + 1);
  const maxValueTenth = Math.pow(10, Math.floor(Math.log10(maxValue) + 1));
  const maxValueDiv10 = maxValue / 10;
  const maxValueTenthDiv10 = maxValueTenth / 10;
  const marginBottomLabel = 10;

  let innerElement;
  if (type === 'tenth') {
    innerElement = (
      <>
        {showLine && oneToTen.map((data: number, index: number) => {
          const barHeight = lerp(
            0,
            height - topPadding,
            (data * maxValueTenthDiv10) / maxValueTenth,
          );
          return (
            <Line
              key={3 * index + 1}
              x1={0}
              y1={height - barHeight}
              x2={width}
              y2={height - barHeight}
              stroke={'black'}
            />
          );
        })}
        {datas.map((data: BarChartData, index: number) => {
          const barHeight = lerp(0, height - topPadding, data.value / maxValueTenth);
          const {bar = {fill: 'red'}} = data;
          const position = {
            x: widthItem + widthItem * index * 2,
            y: height - barHeight - marginBottomLabel
          };
          return (
            <>
              {data.label?.(position, data.value, index)}
              <Rect
                key={3 * index + 2}
                x={position.x}
                y={position.y + marginBottomLabel}
                width={widthItem}
                height={barHeight}
                fill={bar.fill}
              />
            </>
          );
        })}
      </>
    );
  } else if (type === 'value') {
    innerElement = (
      <>
        {showLine && datas.map((data: BarChartData, index: number) => {
          const barHeight = lerp(0, height - topPadding, data.value / maxValue);
          return (
            <Line
              key={3 * index + 1}
              x1={0}
              y1={height - barHeight}
              x2={width}
              y2={height - barHeight}
              stroke={'black'}
            />
          );
        })}
        {datas.map((data: BarChartData, index: number) => {
          const barHeight = lerp(0, height - topPadding, data.value / maxValue);
          const {bar = {fill: 'red'}} = data;
          const position = {
            x: widthItem + widthItem * index * 2,
            y: height - barHeight - marginBottomLabel
          };
          return (
            <>
              {data.label?.(position, data.value, index)}
              <Rect
                key={3 * index + 2}
                x={position.x}
                y={position.y + marginBottomLabel}
                width={widthItem}
                height={barHeight}
                fill={bar.fill}
              />
            </>
          );
        })}
      </>
    );
  } else {
    innerElement = (
      <>
        {showLine && oneToTen.map((data: number, index: number) => {
          const barHeight = lerp(
            0,
            height - topPadding,
            (data * maxValueDiv10) / maxValue,
          );
          return (
            <Line
              key={3 * index + 1}
              x1={0}
              y1={height - barHeight}
              x2={width}
              y2={height - barHeight}
              stroke={'black'}
            />
          );
        })}
        {datas.map((data: BarChartData, index: number) => {
          const barHeight = lerp(0, height - topPadding, data.value / maxValue);
          const {bar = {fill: 'red'}} = data;
          const position = {
            x: widthItem + widthItem * index * 2,
            y: height - barHeight - marginBottomLabel
          };
          return (
            <>
              {data.label?.(position, data.value, index)}
              <Rect
                key={3 * index + 2}
                x={position.x}
                y={position.y + marginBottomLabel}
                width={widthItem}
                height={barHeight}
                fill={bar.fill}
              />
            </>
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

const BarChart = ({axisType = 'valueTenth', datas, dimension, axis, showLine, topPadding = 10}: BarChartProps): JSX.Element => {
  return (
    <View>
      <View style={styles.containerChart}>
        {axis && <YAxis datas={datas} type={axisType} dimension={axis.dimension} topPadding={topPadding} />}
        <BarChartInternal
          topPadding={topPadding}
          showLine={showLine}
          datas={datas}
          type={axisType}
          dimension={dimension}
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
