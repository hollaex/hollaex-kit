"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.withReduxForm = exports.renderChildren = exports.ReduxFormContext = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var ReduxFormContext = React.createContext(null);
exports.ReduxFormContext = ReduxFormContext;

var renderChildren = function renderChildren(Component, _ref) {
  var forwardedRef = _ref.forwardedRef,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["forwardedRef"]);
  return function (_reduxForm) {
    return React.createElement(Component, (0, _extends2["default"])({}, rest, {
      _reduxForm: _reduxForm,
      ref: forwardedRef
    }));
  };
};

exports.renderChildren = renderChildren;

var withReduxForm = function withReduxForm(Component) {
  var Hoc =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inheritsLoose2["default"])(Hoc, _React$Component);

    function Hoc() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = Hoc.prototype;

    _proto.render = function render() {
      return React.createElement(ReduxFormContext.Consumer, {
        children: renderChildren(Component, this.props)
      });
    };

    return Hoc;
  }(React.Component);

  var ref = React.forwardRef(function (props, ref) {
    return React.createElement(Hoc, (0, _extends2["default"])({}, props, {
      forwardedRef: ref
    }));
  });
  ref.displayName = Component.displayName || Component.name || 'Component';
  return ref;
};

exports.withReduxForm = withReduxForm;