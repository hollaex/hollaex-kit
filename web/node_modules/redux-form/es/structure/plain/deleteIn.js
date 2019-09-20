import _extends from "@babel/runtime/helpers/extends";
import _toPath from "lodash/toPath";

function deleteInWithPath(state, first) {
  if (state === undefined || state === null || first === undefined || first === null) {
    return state;
  }

  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  if (rest.length) {
    if (Array.isArray(state)) {
      if (isNaN(first)) {
        throw new Error("Must access array elements with a number, not \"" + String(first) + "\".");
      }

      var firstIndex = Number(first);

      if (firstIndex < state.length) {
        var result = deleteInWithPath.apply(void 0, [state && state[firstIndex]].concat(rest));

        if (result !== state[firstIndex]) {
          var copy = [].concat(state);
          copy[firstIndex] = result;
          return copy;
        }
      }

      return state;
    }

    if (first in state) {
      var _extends2;

      var _result = deleteInWithPath.apply(void 0, [state && state[first]].concat(rest));

      return state[first] === _result ? state : _extends({}, state, (_extends2 = {}, _extends2[first] = _result, _extends2));
    }

    return state;
  }

  if (Array.isArray(state)) {
    if (isNaN(first)) {
      throw new Error("Cannot delete non-numerical index from an array. Given: \"" + String(first));
    }

    var _firstIndex = Number(first);

    if (_firstIndex < state.length) {
      var _copy = [].concat(state);

      _copy.splice(_firstIndex, 1);

      return _copy;
    }

    return state;
  }

  if (first in state) {
    var _copy2 = _extends({}, state);

    delete _copy2[first];
    return _copy2;
  }

  return state;
}

var deleteIn = function deleteIn(state, field) {
  return deleteInWithPath.apply(void 0, [state].concat(_toPath(field)));
};

export default deleteIn;