function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import * as React from 'react';
import NativePicker from './NativePicker';
var Item = NativePicker.Item;

var Picker =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Picker, _React$Component);

  function Picker() {
    _classCallCheck(this, Picker);

    return _possibleConstructorReturn(this, _getPrototypeOf(Picker).apply(this, arguments));
  }

  _createClass(Picker, [{
    key: "getValue",
    value: function getValue() {
      if ('selectedValue' in this.props) {
        return this.props.selectedValue;
      }

      var children = React.Children.toArray(this.props.children);
      return children && children[0] && children[0].props.value;
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.selectedValue !== nextProps.selectedValue || this.props.children !== nextProps.children;
    }
  }, {
    key: "render",
    value: function render() {
      var children = React.Children.map(this.props.children, function (c) {
        return React.createElement(Item, {
          label: c.props.children + '',
          value: c.props.value + '',
          key: c.key
        });
      });
      return React.createElement(NativePicker, this.props, children);
    }
  }], [{
    key: "Item",
    value: function Item() {}
  }]);

  return Picker;
}(React.Component);

Picker.defaultProps = {
  children: []
};
export default Picker;