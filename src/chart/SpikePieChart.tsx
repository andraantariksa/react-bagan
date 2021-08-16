import {Circle, G, Line, Path, Svg, Text} from 'react-native-svg';
import * as React from 'react';
import * as d3s from 'd3-shape';
import { vecAdd, vecMul, vecUnit } from '../math';
import { Dimension, Color } from "../type";

export type SpikePieChartData = {
  value: number;
  color: string;
  label: string;
  labelColor?: Color;
  labelSize?: number;
};

export type SpikePieChartProps = {
  dimensions: Dimension;
  data: Array<SpikePieChartData>;
  outerCircleRadius: number;
  innerCircleRadius: number;
  innerCircleInnerRadius: number;
};

export const SpikePieChart = ({
  dimensions: {width, height},
  data,
  outerCircleRadius,
  innerCircleRadius,
  innerCircleInnerRadius,
}: SpikePieChartProps) => {
  const pieData = d3s.pie().value(data_ => data_.value)(data);
  const arcGenerator = d3s
    .arc()
    .innerRadius(innerCircleInnerRadius)
    .outerRadius(innerCircleRadius);
  const arcsData = pieData.map(arcData => ({
    d: arcGenerator(arcData),
    data: arcData,
  }));

  return (
    <Svg width={width} height={height}>
      <G x={width / 2} y={height / 2}>
        {arcsData.map((arc, idx) => {
          // Centroid is like vector from the center of pie
          const centroid = arcGenerator.centroid(arc.data).map(x => x * 3);
          const centroidUnit = vecUnit(centroid);
          const lineStartingPos = vecMul(centroidUnit, innerCircleInnerRadius);
          const labelPos = vecAdd(
            centroid,
            vecMul(
              centroidUnit,
              outerCircleRadius * 2 + (arc.data.data.labelSize ?? 20) / 10,
            ),
          );
          // atan2 very common in game programming
          // https://gamedev.stackexchange.com/questions/14602/what-are-atan-and-atan2-used-for-in-games
          const labelRotation =
            Math.atan2(centroid[1], centroid[0]) * (180 / Math.PI) +
            90 +
            (centroid[1] > 0 ? 180 : 0); // Flip if vector pointing bottom
          return (
            <React.Fragment key={idx}>
              {/* Arc */}
              <Path d={arc.d} fill={arc.data.data.color} />
              {/* Line to outer circle */}
              <Line
                stroke={arc.data.data.color}
                x1={lineStartingPos[0]}
                y1={lineStartingPos[1]}
                x2={centroid[0]}
                y2={centroid[1]}
              />
              {/* Outer circle */}
              <Circle
                cx={centroid[0]}
                cy={centroid[1]}
                r={outerCircleRadius}
                fill={arc.data.data.color}
              />
              {/* Label */}
              <Text
                fontSize={arc.data.data.labelSize ?? 20}
                fill={arc.data.data.labelColor ?? 'black'}
                textAnchor="middle"
                alignmentBaseline="central"
                dominantBaseline="middle"
                x={labelPos[0]}
                y={labelPos[1]}
                originX={labelPos[0]}
                originY={labelPos[1]}
                rotation={labelRotation}>
                {arc.data.data.label}
              </Text>
            </React.Fragment>
          );
        })}
      </G>
    </Svg>
  );
};
