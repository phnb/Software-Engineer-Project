import React from 'react';

// Implemented for chart component
export const Point = (x, y) => {
  return { x, y };
};

export const dist = (pointA, pointB) => {
  return Math.sqrt(
    (pointA.x - pointB.x) * (pointA.x - pointB.x) +
    (pointA.y - pointB.y) * (pointA.y - pointB.y)
  );
};

export const diff = (pointA, pointB) => {
  return Point(pointB.x - pointA.x, pointB.y - pointA.y);
};

export const add = (pointA, pointB) => {
  return Point(pointA.x + pointB.x, pointA.y + pointB.y);
};

export const angle = (pointA, pointB) => {

  const euclideanDistance = dist(pointA, pointB);

  if (!euclideanDistance) {
    return 0;
  }

  return Math.asin((pointB.y - pointA.y) / euclideanDistance);
};