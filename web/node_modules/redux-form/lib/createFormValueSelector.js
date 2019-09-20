"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _invariant = _interopRequireDefault(require("invariant"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var createFormValueSelector = function createFormValueSelector(_ref) {
  var getIn = _ref.getIn;
  return function (form, getFormState) {
    (0, _invariant["default"])(form, 'Form value must be specified');

    var nonNullGetFormState = getFormState || function (state) {
      return getIn(state, 'form');
    };

    return function (state) {
      for (var _len = arguments.length, fields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        fields[_key - 1] = arguments[_key];
      }

      (0, _invariant["default"])(fields.length, 'No fields specified');
      return fields.length === 1 ? // only selecting one field, so return its value
      getIn(nonNullGetFormState(state), form + ".values." + fields[0]) : // selecting many fields, so return an object of field values
      fields.reduce(function (accumulator, field) {
        var value = getIn(nonNullGetFormState(state), form + ".values." + field);
        return value === undefined ? accumulator : _plain["default"].setIn(accumulator, field, value);
      }, {});
    };
  };
};

var _default = createFormValueSelector;
exports["default"] = _default;