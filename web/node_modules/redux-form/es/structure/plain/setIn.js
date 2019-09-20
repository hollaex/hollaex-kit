import _extends from "@babel/runtime/helpers/extends";
import _toPath from "lodash/toPath";

var setInWithPath = function setInWithPath(state, value, path, pathIndex) {
  var _extends2;

  if (pathIndex >= path.length) {
    return value;
  }

  var first = path[pathIndex];
  var firstState = state && (Array.isArray(state) ? state[Number(first)] : state[first]);
  var next = setInWithPath(firstState, value, path, pathIndex + 1);

  if (!state) {
    if (isNaN(first)) {
      var _ref;

      return _ref = {}, _ref[first] = next, _ref;
    }

    var initialized = [];
    initialized[parseInt(first, 10)] = next;
    return initialized;
  }

  if (Array.isArray(state)) {
    var copy = [].concat(state);
    copy[parseInt(first, 10)] = next;
    return copy;
  }

  return _extends({}, state, (_extends2 = {}, _extends2[first] = next, _extends2));
};

var setIn = function setIn(state, field, value) {
  return setInWithPath(state, value, _toPath(field), 0);
};

export default setIn;