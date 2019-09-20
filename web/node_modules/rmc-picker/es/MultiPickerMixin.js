function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import * as React from 'react';
export default function (ComposedComponent) {
  var _a;

  return _a =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_a, _React$Component);

    function _a() {
      var _this;

      _classCallCheck(this, _a);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_a).apply(this, arguments));

      _this.getValue = function () {
        var _this$props = _this.props,
            children = _this$props.children,
            selectedValue = _this$props.selectedValue;

        if (selectedValue && selectedValue.length) {
          return selectedValue;
        } else {
          if (!children) {
            return [];
          }

          return React.Children.map(children, function (c) {
            var cc = React.Children.toArray(c.children || c.props.children);
            return cc && cc[0] && cc[0].props.value;
          });
        }
      };

      _this.onChange = function (i, v, cb) {
        var value = _this.getValue().concat();

        value[i] = v;

        if (cb) {
          cb(value, i);
        }
      };

      _this.onValueChange = function (i, v) {
        _this.onChange(i, v, _this.props.onValueChange);
      };

      _this.onScrollChange = function (i, v) {
        _this.onChange(i, v, _this.props.onScrollChange);
      };

      return _this;
    }

    _createClass(_a, [{
      key: "render",
      value: function render() {
        return React.createElement(ComposedComponent, _extends({}, this.props, {
          getValue: this.getValue,
          onValueChange: this.onValueChange,
          onScrollChange: this.props.onScrollChange && this.onScrollChange
        }));
      }
    }]);

    return _a;
  }(React.Component), _a.defaultProps = {
    prefixCls: 'rmc-multi-picker',
    onValueChange: function onValueChange() {}
  }, _a;
}
;