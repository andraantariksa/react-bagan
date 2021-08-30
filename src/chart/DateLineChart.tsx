import { Circle, G, Line, Path, Rect, Svg, Text, } from 'react-native-svg';
import * as React from 'react';
import * as d3 from 'd3';
import * as d3s from 'd3-shape';
import { PanResponder, PanResponderInstance } from 'react-native';
import { clamp } from '../math';
import { Color, Dimension } from "../type";
import { useCallback, useEffect, useRef, useState } from "react";

export type DateLineNodeData<T> = {
  x: number;
  y: number;
  value: DateLineData & T;
  index: number;
};

export type DateLineData = {
  date: Date;
  value: number;
};

export type DateLineChartProps<T> = {
  data: Array<DateLineData & T>;
  dimension: Dimension;
  padding?: [number, number, number, number];
  cursorRadius: number;
  rectOpacity?: number;
  formerPathColor?: Color;
  formerPathOpacity?: number;
  latterPathColor?: Color;
  latterPathOpacity?: number;
  pathWidth?: number;
  cursorLineColor?: Color;
  rectText: (val: DateLineNodeData<T>) => string;
  textProps?: object;
  cursorColor?: Color;
  textRectGap: Color;
  rectXSize: number;
  rectRadius?: [number, number];
  textRectColor?: Color;
  cursorOutlineColor?: Color;
  cursorOutlineWidth?: number;
  cursorLineWidth?: number;
  cursorCallback?: (val: DateLineNodeData<T>) => void;
};

export function DateLineChart<T>({
                                   dimension: {width, height},
                                   data,
                                   padding = [50, 20, 0, 20],
                                   cursorRadius = 10,
                                   rectOpacity = 1,
                                   formerPathColor = 'red',
                                   formerPathOpacity,
                                   latterPathColor = 'black',
                                   latterPathOpacity,
                                   pathWidth = 1,
                                   rectText = () => '',
                                   textProps,
                                   cursorColor = 'blue',
                                   textRectGap = 10,
                                   rectXSize = 100,
                                   rectRadius = [0, 0],
                                   textRectColor = 'gray',
                                   cursorLineColor = 'black',
                                   cursorOutlineColor,
                                   cursorOutlineWidth,
                                   cursorLineWidth,
                                   cursorCallback
                                 }: DateLineChartProps<T>) {
  const [showInfo, setShowInfo] = useState(false);
  const x = useCallback(
    d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([padding[3], width - padding[1]]),
    [data, width, padding],
  );
  const y = useCallback(
    d3
      .scaleLinear()
      .domain([0, d3.max(data, d => +d.value)])
      .range([height - padding[2], padding[0]]),
    [data, height, padding],
  );
  const [pos, setPos] = useState<DateLineNodeData<T>>({
    x: x(data[data.length - 1].date),
    y: y(data[data.length - 1].value),
    value: data[data.length - 1],
    index: data.length - 1,
  });
  useEffect(() => {
    setPos({
      x: x(data[data.length - 1].date),
      y: y(data[data.length - 1].value),
      value: data[data.length - 1],
      index: data.length - 1,
    });
  }, [data, x, y]);

  const xMapper = useCallback(
    d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([padding[3], width - padding[1]]),
    [data, padding, width],
  );
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      const mappedX = clamp(
        Math.round(xMapper.invert(gestureState.moveX)),
        0,
        data.length - 1,
      );
      const selectedData = data[mappedX];
      setPos({
        x: x(selectedData.date),
        y: y(selectedData.value),
        value: selectedData,
        index: mappedX,
      });
      setShowInfo(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      const mappedX = clamp(
        Math.round(xMapper.invert(gestureState.moveX)),
        0,
        data.length - 1,
      );
      const selectedData = data[mappedX];
      setPos({
        x: x(selectedData.date),
        y: y(selectedData.value),
        value: selectedData,
        index: mappedX,
      });
    },
    onPanResponderEnd: (evt, gestureState) => {
      const index = data.length - 1;
      const selectedData = data[index];
      setPos({
        x: x(selectedData.date),
        y: y(selectedData.value),
        value: selectedData,
        index,
      });
      setShowInfo(false);
    },
  }));
  useEffect(() => {
    panResponder.current = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const mappedX = clamp(
          Math.round(xMapper.invert(gestureState.moveX)),
          0,
          data.length - 1,
        );
        const selectedData = data[mappedX];
        setPos({
          x: x(selectedData.date),
          y: y(selectedData.value),
          value: selectedData,
          index: mappedX,
        });
        setShowInfo(true);
      },
      onPanResponderMove: (evt, gestureState) => {
        const mappedX = clamp(
          Math.round(xMapper.invert(gestureState.moveX)),
          0,
          data.length - 1,
        );
        const selectedData = data[mappedX];
        setPos({
          x: x(selectedData.date),
          y: y(selectedData.value),
          value: selectedData,
          index: mappedX,
        });
      },
      onPanResponderEnd: (evt, gestureState) => {
        const index = data.length - 1;
        const selectedData = data[index];
        setPos({
          x: x(selectedData.date),
          y: y(selectedData.value),
          value: selectedData,
          index,
        });
        setShowInfo(false);
      },
    });
  }, [data, x, xMapper, y]);

  useEffect(() => {
    cursorCallback?.(pos);
  }, [pos]);

  const lineGenerator = d3s
    .line()
    .curve(d3s.curveBumpX)
    .x(d => x(d.date))
    .y(d => y(d.value));
  const dLatter = lineGenerator(data.slice(pos.index, data.length));
  const dFormer = lineGenerator(data.slice(0, pos.index + 1));

  return (
    <Svg width={width} height={height} {...panResponder.current.panHandlers}>
      <G x={0} y={0}>
        <Path
          d={dLatter}
          stroke={latterPathColor}
          strokeOpacity={latterPathOpacity}
          strokeWidth={pathWidth}
        />
        <Path
          d={dFormer}
          stroke={formerPathColor}
          strokeOpacity={formerPathOpacity}
          strokeWidth={pathWidth}
        />
        { showInfo && <>
        <Line
          x1={pos.x}
          y1={padding[0] - textRectGap}
          x2={pos.x}
          y2={height - padding[2]}
          strokeWidth={cursorLineWidth}
          stroke={cursorLineColor}
        />
        <Rect
          x={pos.x}
          y={padding[0] / 2}
          translateX={-rectXSize / 2}
          translateY={-padding[0] / 2}
          rx={rectRadius[0]}
          ry={rectRadius[1]}
          width={rectXSize}
          height={padding[0] - textRectGap}
          fill={textRectColor}
          fillOpacity={rectOpacity}
        />
        <Text
          x={pos.x}
          y={padding[0] / 2 - textRectGap / 2}
          fill="black"
          textAnchor="middle"
          alignmentBaseline="central"
          dominantBaseline="middle"
          {...textProps}>
          {rectText(pos)}
        </Text>
        </>}
        <Circle
          cx={pos.x}
          cy={pos.y}
          r={cursorRadius}
          fill={cursorColor}
          stroke={cursorOutlineColor}
          strokeWidth={cursorOutlineWidth}
        />
      </G>
    </Svg>
  );
}
