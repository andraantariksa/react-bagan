import * as React from 'react';
import {
  Dimension
} from '../type';
import {View, StyleSheet} from 'react-native';
import {Svg, Rect, Text, Line, Path, Circle} from 'react-native-svg';
import {lerp, rotate2D} from '../math';

export type DataSingle = {
  color: string | number;
  value: number;
}

export type SpikePieChartProps = {
  data: Array<DataSingle>,
  dimension: Dimension,
  rOuterCircle: number,
  r: number,
  outerCircleClear: number,
  textClear: number,
  textColor?: number | string,
  textSize?: number,
  lineStrokeWidth?: number,
  textWeight?: string | number
}

const SpikePieChart = ({ dimension: { width, height }, data, rOuterCircle, r, outerCircleClear, textWeight = 'normal', textClear, lineStrokeWidth = 1, textSize = 20, textColor = 'black' }: SpikePieChartProps) => {
  const center = width / 2;
  const perimeter = Math.PI * r * 2;
  const innerCircles = [];
  const sum = data.reduce((a, b) => a + b.value, 0);
  let prevPos = 0;
  for (const dataSingle of data) {
    const size = Math.ceil(dataSingle.value / sum * perimeter);
    const rotationDeg = ((size / 2 - prevPos) / perimeter) * 360;
    const outerCircleCoord = rotate2D(center - rOuterCircle - outerCircleClear, 0, ((size / 2 - prevPos) / perimeter) * 2 * Math.PI);
    const textOuterCircleCoord = rotate2D(center - rOuterCircle - outerCircleClear + textClear, 0, ((size / 2 - prevPos) / perimeter) * 2 * Math.PI);
    const textRotation = `rotate(${rotationDeg + 90 + (outerCircleCoord[1] > 0 ? 180 : 0)} ${center + textOuterCircleCoord[0]} ${center + textOuterCircleCoord[1]})`;
    // Without + 10 there will be a gap between the pie section
    innerCircles.push(<>
        <Circle
          r={r}
          cx="50%"
          cy="50%"
          strokeDasharray={`${size + 10} 99999999`}
          strokeDashoffset={prevPos + 10}
          fill="none"
          stroke={dataSingle.color}
          strokeWidth={r * 2}
        />
        <Line
          x1={center}
          y1={center}
          x2={center + outerCircleCoord[0]}
          y2={center + outerCircleCoord[1]}
          strokeWidth={lineStrokeWidth}
          stroke={dataSingle.color}
        />
        <Circle
          r={rOuterCircle}
          cx={center + outerCircleCoord[0]}
          cy={center + outerCircleCoord[1]}
          fill={dataSingle.color}
          stroke={dataSingle.color}
        />
        <Text
          fill={textColor}
          x={center + textOuterCircleCoord[0]}
          y={center + textOuterCircleCoord[1]}
          textAnchor="middle"
          fontSize={textSize}
          fontWeight={textWeight}
          dominantBaseline="middle"
          transform={textRotation}
        >
          { dataSingle.value + '%'}
        </Text>
      </>
    );
    prevPos -= size;
  }

  return (
    <View style={{width}}>
      <Svg height={height} style={{ borderRadius: center }}>
        {innerCircles}
      </Svg>
    </View>);
};

export default SpikePieChart;
