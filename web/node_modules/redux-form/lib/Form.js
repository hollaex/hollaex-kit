"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ReduxFormContext = require("./ReduxFormContext");

var Form =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2["default"])(Form, _Component);

  function Form(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    if (!props._reduxForm) {
      throw new Error('Form must be inside a component decorated with reduxForm()');
    }

    return _this;
  }

  var _proto = Form.prototype;

  _proto.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    this.props._reduxForm.registerInnerOnSubmit(this.props.onSubmit);
  };

  _proto.render = function render() {
    var _this$props = this.props,
        _reduxForm = _this$props._reduxForm,
        rest = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["_reduxForm"]);
    return _react["default"].createElement("form", rest);
  };

  return Form;
}(_react.Component);

Form.propTypes = {
  onSubmit: _propTypes["default"].func.isRequired,
  _reduxForm: _propTypes["default"].object
};
(0, _reactLifecyclesCompat.polyfill)(Form);

var _default = (0, _ReduxFormContext.withReduxForm)(Form);

exports["default"] = _default;