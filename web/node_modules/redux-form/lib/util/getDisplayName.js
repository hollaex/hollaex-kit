"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var getDisplayName = function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
};

var _default = getDisplayName;
exports["default"] = _default;