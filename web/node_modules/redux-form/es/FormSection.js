import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import prefixName from './util/prefixName';
import { withReduxForm, ReduxFormContext } from './ReduxFormContext';
import validateComponentProp from './util/validateComponentProp';

var FormSection =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(FormSection, _Component);

  function FormSection(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    if (!props._reduxForm) {
      throw new Error('FormSection must be inside a component decorated with reduxForm()');
    }

    return _this;
  }

  var _proto = FormSection.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        _reduxForm = _this$props._reduxForm,
        children = _this$props.children,
        name = _this$props.name,
        component = _this$props.component,
        rest = _objectWithoutPropertiesLoose(_this$props, ["_reduxForm", "children", "name", "component"]);

    if (React.isValidElement(children)) {
      return createElement(ReduxFormContext.Provider, {
        value: _extends({}, this.props._reduxForm, {
          sectionPrefix: prefixName(this.props, name)
        }),
        children: children
      });
    }

    return createElement(ReduxFormContext.Provider, {
      value: _extends({}, this.props._reduxForm, {
        sectionPrefix: prefixName(this.props, name)
      }),
      children: createElement(component, _extends({}, rest, {
        children: children
      }))
    });
  };

  return FormSection;
}(Component);

FormSection.propTypes = {
  name: PropTypes.string.isRequired,
  component: validateComponentProp
};
FormSection.defaultProps = {
  component: 'div'
};
export default withReduxForm(FormSection);