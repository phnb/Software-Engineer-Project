import React from 'react';
import {
  View,
} from 'react-native';
import { dist, angle, pointPropTypes, add } from './pointUtils';
import { keyGen } from './keyUtils';


// Implemented for chart component
function toLine(pointA, pointB, color, opacity) {
  return (
    <View
      key={keyGen(pointA, pointB)}
      style={[
        createLine(
          dist(pointA, pointB),
          angle(pointA, pointB),
          color,
          opacity,
          pointA
        )
      ]}
    />
  );
}

function drawPoint(point, color) {
  return (
    <View
      key={keyGen(point, color)}
      style={createPoint(point, color)}
    />
  );
}

function PointsPath({ color, pointList, opacity, startingPoint }) {
  return (
    <View>
      {[...pointList.map((elem, i) => {
        if (i === pointList.length - 1) {
          return null;
        }
        return toLine(
          add(pointList[i], startingPoint),
          add(pointList[i + 1], startingPoint),
          color,
          opacity
        );
      }),
        ...pointList.map((elem) => {
          return drawPoint(add(elem, startingPoint), color);
        })]}
    </View>
  );
}

export const createLine = (dist, angle, color, opacity, startingPoint) => {
  return {
    backgroundColor: color,
    height: 4,
    width: dist,
    bottom: dist * Math.sin(angle) / 2 + startingPoint.y,
    left: -dist * (1 - Math.cos(angle)) / 2 + startingPoint.x,
    position: 'absolute',
    opacity,
    transform: [
      { rotate: `${(-1) * angle} rad` }
    ]
  };
};

export const createPoint = (coordinates, color, size = 8) => {
  return {
    backgroundColor: color,
    left: coordinates.x - 3,
    bottom: coordinates.y - 2,
    position: 'absolute',
    borderRadius: 50,
    width: size,
    height: size
  };
};

export default PointsPath;
