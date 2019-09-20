"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _immutable = require("immutable");

var _default = function _default(list, index, removeNum, value) {
  list = _immutable.List.isList(list) ? list : (0, _immutable.List)();

  if (index < list.count()) {
    if (value === undefined && !removeNum) {
      // inserting undefined
      // first insert true and then re-set it to undefined
      return list.splice(index, 0, true) // placeholder
      .set(index, undefined);
    }

    if (value != null) {
      return list.splice(index, removeNum, value); // removing and adding
    } else {
      return list.splice(index, removeNum); // removing
    }
  }

  if (removeNum) {
    // trying to remove non-existant item: return original array
    return list;
  } // trying to add outside of range: just set value


  return list.set(index, value);
};

exports["default"] = _default;