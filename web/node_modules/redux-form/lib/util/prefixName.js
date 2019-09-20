"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var formatName = function formatName(_ref, name) {
  var sectionPrefix = _ref._reduxForm.sectionPrefix;
  return sectionPrefix ? sectionPrefix + "." + name : name;
};

var _default = formatName;
exports["default"] = _default;