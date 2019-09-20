"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var createIsAsyncValidating = function createIsAsyncValidating(_ref) {
  var getIn = _ref.getIn;
  return function (form, getFormState) {
    return function (state) {
      var nonNullGetFormState = getFormState || function (state) {
        return getIn(state, 'form');
      };

      return !!getIn(nonNullGetFormState(state), form + ".asyncValidating");
    };
  };
};

var _default = createIsAsyncValidating;
exports["default"] = _default;