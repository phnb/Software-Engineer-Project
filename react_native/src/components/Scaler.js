import React from 'react';
import { Point } from './pointUtils';

// Implemented for chart component
export const startingPoint = Point(0, 10);
const endingPoint = Point(300, 100);

export function vectorTransform(point, maxValue, scaleCount) {
  return Point(
    point.x * (endingPoint.x / scaleCount) + endingPoint.x / scaleCount,
    point.y * (endingPoint.y / maxValue)
  );
}
