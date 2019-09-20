import _isNil from "lodash/isNil";
import _isEqualWith from "lodash/isEqualWith";
import { Iterable } from 'immutable';

var isEmpty = function isEmpty(obj) {
  return _isNil(obj) || obj === '' || isNaN(obj);
};

var customizer = function customizer(obj, other) {
  if (obj === other) return true;

  if (!obj && !other) {
    return isEmpty(obj) === isEmpty(other);
  }

  if (Iterable.isIterable(obj) && Iterable.isIterable(other)) {
    return obj.count() === other.count() && obj.every(function (value, key) {
      return other.has(key) && _isEqualWith(value, other.get(key), customizer);
    });
  }

  return void 0;
};

var deepEqual = function deepEqual(a, b) {
  return _isEqualWith(a, b, customizer);
};

export default deepEqual;