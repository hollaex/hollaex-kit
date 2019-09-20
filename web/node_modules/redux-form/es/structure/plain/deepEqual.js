import _isNil from "lodash/isNil";
import _isEqualWith from "lodash/isEqualWith";
import React from 'react';

var isEmpty = function isEmpty(obj) {
  return _isNil(obj) || obj === '' || isNaN(obj);
};

var customizer = function customizer(obj, other) {
  if (obj === other) return true;

  if (!obj && !other) {
    return isEmpty(obj) === isEmpty(other);
  }

  if (obj && other && obj._error !== other._error) return false;
  if (obj && other && obj._warning !== other._warning) return false;
  if (React.isValidElement(obj) || React.isValidElement(other)) return false;
};

var deepEqual = function deepEqual(a, b) {
  return _isEqualWith(a, b, customizer);
};

export default deepEqual;