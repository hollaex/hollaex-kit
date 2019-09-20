"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _isEqualWith2 = _interopRequireDefault(require("lodash/isEqualWith"));

var customizer = function customizer(objectValue, otherValue, indexOrkey, object, other, stack) {
  // https://lodash.com/docs/4.17.4#isEqualWith
  if (stack) {
    // Shallow compares
    // For 1st level, stack === undefined.
    //   -> Do nothing (and implicitly return undefined so that it goes to compare 2nd level)
    // For 2nd level and up, stack !== undefined.
    //   -> Compare by === operator
    return objectValue === otherValue;
  }
};

var shallowCompare = function shallowCompare(instance, nextProps, nextState) {
  var propsEqual = (0, _isEqualWith2["default"])(instance.props, nextProps, customizer);
  var stateEqual = (0, _isEqualWith2["default"])(instance.state, nextState, customizer);
  return !propsEqual || !stateEqual;
};

var _default = shallowCompare;
exports["default"] = _default;