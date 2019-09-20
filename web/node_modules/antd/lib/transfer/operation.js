"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _button = _interopRequireDefault(require("../button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var Operation = function Operation(_ref) {
  var disabled = _ref.disabled,
      moveToLeft = _ref.moveToLeft,
      moveToRight = _ref.moveToRight,
      _ref$leftArrowText = _ref.leftArrowText,
      leftArrowText = _ref$leftArrowText === void 0 ? '' : _ref$leftArrowText,
      _ref$rightArrowText = _ref.rightArrowText,
      rightArrowText = _ref$rightArrowText === void 0 ? '' : _ref$rightArrowText,
      leftActive = _ref.leftActive,
      rightActive = _ref.rightActive,
      className = _ref.className,
      style = _ref.style;
  return React.createElement("div", {
    className: className,
    style: style
  }, React.createElement(_button["default"], {
    type: "primary",
    size: "small",
    disabled: disabled || !rightActive,
    onClick: moveToRight,
    icon: "right"
  }, rightArrowText), React.createElement(_button["default"], {
    type: "primary",
    size: "small",
    disabled: disabled || !leftActive,
    onClick: moveToLeft,
    icon: "left"
  }, leftArrowText));
};

var _default = Operation;
exports["default"] = _default;
//# sourceMappingURL=operation.js.map
