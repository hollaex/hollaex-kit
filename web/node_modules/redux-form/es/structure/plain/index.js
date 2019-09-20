import splice from './splice';
import getIn from './getIn';
import setIn from './setIn';
import deepEqual from './deepEqual';
import deleteIn from './deleteIn';
import keys from './keys';
var structure = {
  allowsArrayErrors: true,
  empty: {},
  emptyList: [],
  getIn: getIn,
  setIn: setIn,
  deepEqual: deepEqual,
  deleteIn: deleteIn,
  forEach: function forEach(items, callback) {
    return items.forEach(callback);
  },
  fromJS: function fromJS(value) {
    return value;
  },
  keys: keys,
  size: function size(array) {
    return array ? array.length : 0;
  },
  some: function some(items, callback) {
    return items.some(callback);
  },
  splice: splice,
  equals: function equals(a, b) {
    return b.every(function (val) {
      return ~a.indexOf(val);
    });
  },
  orderChanged: function orderChanged(a, b) {
    return b.some(function (val, index) {
      return val !== a[index];
    });
  },
  toJS: function toJS(value) {
    return value;
  }
};
export default structure;