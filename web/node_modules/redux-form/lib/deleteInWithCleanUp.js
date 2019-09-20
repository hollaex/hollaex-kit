"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _toPath2 = _interopRequireDefault(require("lodash/toPath"));

function createDeleteInWithCleanUp(structure) {
  var shouldDeleteDefault = function shouldDeleteDefault(structure) {
    return function (state, path) {
      return structure.getIn(state, path) !== undefined;
    };
  };

  var deepEqual = structure.deepEqual,
      empty = structure.empty,
      getIn = structure.getIn,
      deleteIn = structure.deleteIn,
      setIn = structure.setIn;
  return function (shouldDelete) {
    if (shouldDelete === void 0) {
      shouldDelete = shouldDeleteDefault;
    }

    var deleteInWithCleanUp = function deleteInWithCleanUp(state, path) {
      if (path[path.length - 1] === ']') {
        // array path
        var pathTokens = (0, _toPath2["default"])(path);
        pathTokens.pop();
        var parent = getIn(state, pathTokens.join('.'));
        return parent ? setIn(state, path) : state;
      }

      var result = state;

      if (shouldDelete(structure)(state, path)) {
        result = deleteIn(state, path);
      }

      var dotIndex = path.lastIndexOf('.');

      if (dotIndex > 0) {
        var parentPath = path.substring(0, dotIndex);

        if (parentPath[parentPath.length - 1] !== ']') {
          var _parent = getIn(result, parentPath);

          if (deepEqual(_parent, empty)) {
            return deleteInWithCleanUp(result, parentPath);
          }
        }
      }

      return result;
    };

    return deleteInWithCleanUp;
  };
}

var _default = createDeleteInWithCleanUp;
exports["default"] = _default;