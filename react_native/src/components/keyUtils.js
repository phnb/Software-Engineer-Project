import React from 'react';

export const keyGen = (serializable, anotherSerializable) => {
  return `${JSON.stringify(serializable)}-${JSON.stringify(
    anotherSerializable,
  )}`;
};
