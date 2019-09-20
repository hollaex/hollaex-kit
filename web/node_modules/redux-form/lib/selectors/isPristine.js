"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var createIsPristine = function createIsPristine(_ref) {
  var deepEqual = _ref.deepEqual,
      empty = _ref.empty,
      getIn = _ref.getIn;
  return function (form, getFormState) {
    return function (state) {
      var nonNullGetFormState = getFormState || function (state) {
        return getIn(state, 'form');
      };

      var formState = nonNullGetFormState(state);

      for (var _len = arguments.length, fields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        fields[_key - 1] = arguments[_key];
      }

      if (fields && fields.length) {
        return fields.every(function (field) {
          var fieldInitial = getIn(formState, form + ".initial." + field);
          var fieldValue = getIn(formState, form + ".values." + field);
          return deepEqual(fieldInitial, fieldValue);
        });
      }

      var initial = getIn(formState, form + ".initial") || empty;
      var values = getIn(formState, form + ".values") || initial;
      return deepEqual(initial, values);
    };
  };
};

var _default = createIsPristine;
exports["default"] = _default;