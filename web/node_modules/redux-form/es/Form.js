import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import { withReduxForm } from './ReduxFormContext';

var Form =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Form, _Component);

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
        rest = _objectWithoutPropertiesLoose(_this$props, ["_reduxForm"]);

    return React.createElement("form", rest);
  };

  return Form;
}(Component);

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  _reduxForm: PropTypes.object
};
polyfill(Form);
export default withReduxForm(Form);