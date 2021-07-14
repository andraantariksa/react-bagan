import * as React from 'react';
import {
  Dimension
} from '../type';
import {View, StyleSheet} from 'react-native';
import {Svg, Rect, Text, Line, Path} from 'react-native-svg';
import {lerp} from '../math';
import {months} from '../const';
import {monthDiff, daysInMonth, dateDiffInDays} from '../date';

export type DateLineChartProps = {
  startDate: Date,
  endDate: Date,
  data: Array<number>,
  dimensionChart: Dimension,
  axisHeight: number,
  lineStrokeWidth?: number,
  lineStrokeColor?: string,
  textColor?: number | string,
  textSize?: number,
  textWeight?: string | number
}

export type XAxisProps = {
  startDate: Date,
  endDate: Date,
  dimension: Dimension,
  localeId?: string,
  textColor?: number | string,
  textSize?: number,
  textWeight?: string | number
}

const XAxis = ({ startDate, endDate, dimension: { width, height}, textSize = 10, textWeight = 'normal', textColor = 'black', localeId = 'en-US' }: XAxisProps) => {
  const dayRange = dateDiffInDays(startDate, endDate);
  const startDateCopy = new Date(startDate);
  startDateCopy.setDate(1);
  const months = [];
  while(
    startDateCopy.getMonth() !== endDate.getMonth() ||
    startDateCopy.getFullYear() !== endDate.getFullYear()) {
    const startDateCopyCopy = new Date(startDateCopy);
    startDateCopyCopy.setDate(daysInMonth(startDateCopy) / 2);
    months.push({
      name: startDateCopy.toLocaleString(localeId, {month: 'short'}),
      dayDiff: dateDiffInDays(startDate, startDateCopyCopy)
    });
    startDateCopy.setMonth(startDateCopy.getMonth() + 1);
  }
  const startDateCopyCopy = new Date(startDateCopy);
  startDateCopyCopy.setDate(daysInMonth(startDateCopy) / 2);
  months.push({
    name: startDateCopy.toLocaleString(localeId, {month: 'short'}),
    dayDiff: dateDiffInDays(startDate, startDateCopyCopy)
  });
  startDateCopy.setMonth(startDateCopy.getMonth() + 1);
  const monthLabels = months.map((item, index) => {
    return (<Text
      key={index}
      x={lerp(0, width, item.dayDiff / dayRange)}
      y={5}
      fill={textColor}
      fontSize={textSize}
      fontWeight={textWeight}
      textAnchor="middle"
      alignmentBaseline="hanging"
    >{item.name}</Text>);
  });
  return (<View style={{width}}>
    <Svg height={height}>
      {monthLabels}
    </Svg>
  </View>);
};

type DateLineChartInternalProps = {
  data: Array<number>;
  dimension: Dimension;
  lineStrokeWidth?: number;
  lineStrokeColor?: string;
};

const DateLineChartInternal = ({ data, dimension: { width, height }, lineStrokeWidth = 1, lineStrokeColor = 'black' }: DateLineChartInternalProps) => {
  const maxValue = data.reduce((a,b) => Math.max(a,b), -Infinity);
  let d = "";
  data.forEach((dataSingle, index) => {
    const yPos = lerp(
      0,
      height - 10,
      dataSingle / maxValue,
    );
    const xPos = index / data.length * width;
    if (index !== 0) {
      d += ` L${xPos},${height - yPos}`;
    } else {
      d += `M${xPos},${height - yPos}`;
    }
  });
  return (
    <View style={{width}}>
      <Svg height={height}>
        <Path
          strokeWidth={lineStrokeWidth}
          d={d}
          fill="none"
          stroke={lineStrokeColor}
        />
      </Svg>
    </View>
  );
};

const DateLineChart = ({ startDate, endDate, data, dimensionChart, axisHeight, textColor, textWeight, lineStrokeWidth, lineStrokeColor, textSize }: DateLineChartProps) => {
  return (
    <View>
      <DateLineChartInternal
        lineStrokeColor={lineStrokeColor}
        lineStrokeWidth={lineStrokeWidth}
        data={data}
        dimension={dimensionChart}
      />
      <XAxis
        textColor={textColor}
        startDate={startDate}
        endDate={endDate}
        dimension={{
          height: axisHeight,
          width: dimensionChart.width
        }}
        textWeight={textWeight}
        textSize={textSize}
      />
    </View>
  );
};

export default DateLineChart;
