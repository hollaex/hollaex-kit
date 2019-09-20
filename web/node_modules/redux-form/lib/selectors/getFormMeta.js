"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var createGetFormMeta = function createGetFormMeta(_ref) {
  var getIn = _ref.getIn,
      empty = _ref.empty;
  return function (form, getFormState) {
    return function (state) {
      var nonNullGetFormState = getFormState || function (state) {
        return getIn(state, 'form');
      };

      return getIn(nonNullGetFormState(state), form + ".fields") || empty;
    };
  };
};

var _default = createGetFormMeta;
exports["default"] = _default;