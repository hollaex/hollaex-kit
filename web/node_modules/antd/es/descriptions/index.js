function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import * as React from 'react';
import classNames from 'classnames';
import warning from '../_util/warning';
import ResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import { ConfigConsumer } from '../config-provider';
import Col from './Col';

var DescriptionsItem = function DescriptionsItem(_ref) {
  var children = _ref.children;
  return children;
};
/**
 * Convert children into `column` groups.
 * @param cloneChildren: DescriptionsItem
 * @param column: number
 */


var generateChildrenRows = function generateChildrenRows(cloneChildren, column) {
  var childrenArray = [];
  var columnArray = [];
  var totalRowSpan = 0;
  React.Children.forEach(cloneChildren, function (node) {
    columnArray.push(node);

    if (node.props.span) {
      totalRowSpan += node.props.span;
    } else {
      totalRowSpan += 1;
    }

    if (totalRowSpan >= column) {
      warning(totalRowSpan <= column, 'Descriptions', 'Sum of column `span` in a line exceeds `column` of Descriptions.');
      childrenArray.push(columnArray);
      columnArray = [];
      totalRowSpan = 0;
    }
  });

  if (columnArray.length > 0) {
    childrenArray.push(columnArray);
    columnArray = [];
  }

  return childrenArray;
};

var renderRow = function renderRow(children, index, _ref2, bordered, layout, colon) {
  var prefixCls = _ref2.prefixCls,
      column = _ref2.column,
      isLast = _ref2.isLast;

  // copy children,prevent changes to incoming parameters
  var childrenArray = _toConsumableArray(children);

  var lastChildren = childrenArray.pop();
  var span = column - childrenArray.length;

  if (isLast) {
    lastChildren = React.cloneElement(lastChildren, {
      span: span
    });
  }

  childrenArray.push(lastChildren);

  var renderCol = function renderCol(childrenItem, type, idx) {
    return React.createElement(Col, {
      child: childrenItem,
      bordered: bordered,
      colon: colon,
      type: type,
      key: "".concat(type, "-").concat(idx),
      layout: layout
    });
  };

  var cloneChildren = [];
  var cloneContentChildren = [];
  React.Children.forEach(childrenArray, function (childrenItem, idx) {
    cloneChildren.push(renderCol(childrenItem, 'label', idx));

    if (layout === 'vertical') {
      cloneContentChildren.push(renderCol(childrenItem, 'content', idx));
    } else if (bordered) {
      cloneChildren.push(renderCol(childrenItem, 'content', idx));
    }
  });

  if (layout === 'vertical') {
    return [React.createElement("tr", {
      className: "".concat(prefixCls, "-row"),
      key: "label-".concat(index)
    }, cloneChildren), React.createElement("tr", {
      className: "".concat(prefixCls, "-row"),
      key: "content-".concat(index)
    }, cloneContentChildren)];
  }

  return React.createElement("tr", {
    className: "".concat(prefixCls, "-row"),
    key: index
  }, cloneChildren);
};

var defaultColumnMap = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};

var Descriptions =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Descriptions, _React$Component);

  function Descriptions() {
    var _this;

    _classCallCheck(this, Descriptions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Descriptions).apply(this, arguments));
    _this.state = {
      screens: {}
    };
    return _this;
  }

  _createClass(Descriptions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var column = this.props.column;
      this.token = ResponsiveObserve.subscribe(function (screens) {
        if (_typeof(column) !== 'object') {
          return;
        }

        _this2.setState({
          screens: screens
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      ResponsiveObserve.unsubscribe(this.token);
    }
  }, {
    key: "getColumn",
    value: function getColumn() {
      var column = this.props.column;

      if (_typeof(column) === 'object') {
        for (var i = 0; i < responsiveArray.length; i++) {
          var breakpoint = responsiveArray[i];

          if (this.state.screens[breakpoint] && column[breakpoint] !== undefined) {
            return column[breakpoint] || defaultColumnMap[breakpoint];
          }
        }
      } // If the configuration is not an object, it is a number, return number


      if (typeof column === 'number') {
        return column;
      } // If it is an object, but no response is found, this happens only in the test.
      // Maybe there are some strange environments


      return 3;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement(ConfigConsumer, null, function (_ref3) {
        var _classNames;

        var getPrefixCls = _ref3.getPrefixCls;
        var _this3$props = _this3.props,
            className = _this3$props.className,
            customizePrefixCls = _this3$props.prefixCls,
            title = _this3$props.title,
            size = _this3$props.size,
            children = _this3$props.children,
            _this3$props$bordered = _this3$props.bordered,
            bordered = _this3$props$bordered === void 0 ? false : _this3$props$bordered,
            _this3$props$layout = _this3$props.layout,
            layout = _this3$props$layout === void 0 ? 'horizontal' : _this3$props$layout,
            _this3$props$colon = _this3$props.colon,
            colon = _this3$props$colon === void 0 ? true : _this3$props$colon,
            style = _this3$props.style;
        var prefixCls = getPrefixCls('descriptions', customizePrefixCls);

        var column = _this3.getColumn();

        var cloneChildren = React.Children.map(children, function (child) {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              prefixCls: prefixCls
            });
          }

          return child;
        });
        var childrenArray = generateChildrenRows(cloneChildren, column);
        return React.createElement("div", {
          className: classNames(prefixCls, className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(size), size !== 'default'), _defineProperty(_classNames, "".concat(prefixCls, "-bordered"), !!bordered), _classNames)),
          style: style
        }, title && React.createElement("div", {
          className: "".concat(prefixCls, "-title")
        }, title), React.createElement("div", {
          className: "".concat(prefixCls, "-view")
        }, React.createElement("table", null, React.createElement("tbody", null, childrenArray.map(function (child, index) {
          return renderRow(child, index, {
            prefixCls: prefixCls,
            column: column,
            isLast: index + 1 === childrenArray.length
          }, bordered, layout, colon);
        })))));
      });
    }
  }]);

  return Descriptions;
}(React.Component);

Descriptions.defaultProps = {
  size: 'default',
  column: defaultColumnMap
};
Descriptions.Item = DescriptionsItem;
export default Descriptions;
//# sourceMappingURL=index.js.map
