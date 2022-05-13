import React from 'react';

// Implemented for chart component
export const keyGen = (serializable, anotherSerializable) => {
  return `${JSON.stringify(serializable)}-${JSON.stringify(
    anotherSerializable,
  )}`;
};
