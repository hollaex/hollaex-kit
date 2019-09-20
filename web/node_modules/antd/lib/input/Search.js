"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Input = _interopRequireDefault(require("./Input"));

var _icon = _interopRequireDefault(require("../icon"));

var _button = _interopRequireDefault(require("../button"));

var _configProvider = require("../config-provider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var Search =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search() {
    var _this;

    _classCallCheck(this, Search);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Search).apply(this, arguments));

    _this.saveInput = function (node) {
      _this.input = node;
    };

    _this.onSearch = function (e) {
      var onSearch = _this.props.onSearch;

      if (onSearch) {
        onSearch(_this.input.input.value, e);
      }

      _this.input.focus();
    };

    _this.renderSuffix = function (prefixCls) {
      var _this$props = _this.props,
          suffix = _this$props.suffix,
          enterButton = _this$props.enterButton;
      if (enterButton) return suffix;
      var node = React.createElement(_icon["default"], {
        className: "".concat(prefixCls, "-icon"),
        type: "search",
        key: "searchIcon",
        onClick: _this.onSearch
      });

      if (suffix) {
        var cloneSuffix = suffix;

        if (React.isValidElement(cloneSuffix) && !cloneSuffix.key) {
          cloneSuffix = React.cloneElement(cloneSuffix, {
            key: 'originSuffix'
          });
        }

        return [cloneSuffix, node];
      }

      return node;
    };

    _this.renderAddonAfter = function (prefixCls) {
      var _this$props2 = _this.props,
          enterButton = _this$props2.enterButton,
          size = _this$props2.size,
          disabled = _this$props2.disabled,
          addonAfter = _this$props2.addonAfter;
      if (!enterButton) return addonAfter;
      var btnClassName = "".concat(prefixCls, "-button");
      var button;
      var enterButtonAsElement = enterButton;

      if (enterButtonAsElement.type === _button["default"] || enterButtonAsElement.type === 'button') {
        button = React.cloneElement(enterButtonAsElement, _extends({
          onClick: _this.onSearch,
          key: 'enterButton'
        }, enterButtonAsElement.type === _button["default"] ? {
          className: btnClassName,
          size: size
        } : {}));
      } else {
        button = React.createElement(_button["default"], {
          className: btnClassName,
          type: "primary",
          size: size,
          disabled: disabled,
          key: "enterButton",
          onClick: _this.onSearch
        }, enterButton === true ? React.createElement(_icon["default"], {
          type: "search"
        }) : enterButton);
      }

      if (addonAfter) {
        return [button, addonAfter];
      }

      return button;
    };

    _this.renderSearch = function (_ref) {
      var getPrefixCls = _ref.getPrefixCls;

      var _a = _this.props,
          customizePrefixCls = _a.prefixCls,
          customizeInputPrefixCls = _a.inputPrefixCls,
          size = _a.size,
          enterButton = _a.enterButton,
          className = _a.className,
          restProps = __rest(_a, ["prefixCls", "inputPrefixCls", "size", "enterButton", "className"]);

      delete restProps.onSearch;
      var prefixCls = getPrefixCls('input-search', customizePrefixCls);
      var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);
      var inputClassName;

      if (enterButton) {
        var _classNames;

        inputClassName = (0, _classnames["default"])(prefixCls, className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-enter-button"), !!enterButton), _defineProperty(_classNames, "".concat(prefixCls, "-").concat(size), !!size), _classNames));
      } else {
        inputClassName = (0, _classnames["default"])(prefixCls, className);
      }

      return React.createElement(_Input["default"], _extends({
        onPressEnter: _this.onSearch
      }, restProps, {
        size: size,
        prefixCls: inputPrefixCls,
        addonAfter: _this.renderAddonAfter(prefixCls),
        suffix: _this.renderSuffix(prefixCls),
        ref: _this.saveInput,
        className: inputClassName
      }));
    };

    return _this;
  }

  _createClass(Search, [{
    key: "focus",
    value: function focus() {
      this.input.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.input.blur();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderSearch);
    }
  }]);

  return Search;
}(React.Component);

exports["default"] = Search;
Search.defaultProps = {
  enterButton: false
};
//# sourceMappingURL=Search.js.map
