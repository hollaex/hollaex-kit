"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var createGetFormInitialValues = function createGetFormInitialValues(_ref) {
  var getIn = _ref.getIn;
  return function (form, getFormState) {
    return function (state) {
      var nonNullGetFormState = getFormState || function (state) {
        return getIn(state, 'form');
      };

      return getIn(nonNullGetFormState(state), form + ".initial");
    };
  };
};

var _default = createGetFormInitialValues;
exports["default"] = _default;