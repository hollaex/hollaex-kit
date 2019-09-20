import _extends from "@babel/runtime/helpers/extends";
import _createClass from "@babel/runtime/helpers/createClass";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { Component, createElement } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import createConnectedFieldArray from './ConnectedFieldArray';
import prefixName from './util/prefixName';
import { withReduxForm } from './ReduxFormContext';
import validateComponentProp from './util/validateComponentProp';

var toArray = function toArray(value) {
  return Array.isArray(value) ? value : [value];
};

var wrapError = function wrapError(fn, key) {
  return fn && function () {
    var validators = toArray(fn);

    for (var i = 0; i < validators.length; i++) {
      var result = validators[i].apply(validators, arguments);

      if (result) {
        var _ref;

        return _ref = {}, _ref[key] = result, _ref;
      }
    }
  };
};

var createFieldArray = function createFieldArray(structure) {
  var ConnectedFieldArray = createConnectedFieldArray(structure);

  var FieldArray =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(FieldArray, _Component);

    function FieldArray(props) {
      var _this;

      _this = _Component.call(this, props) || this;
      _this.ref = React.createRef();

      if (!props._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()');
      }

      return _this;
    }

    var _proto = FieldArray.prototype;

    _proto.componentDidMount = function componentDidMount() {
      var _this2 = this;

      this.props._reduxForm.register(this.name, 'FieldArray', function () {
        return wrapError(_this2.props.validate, '_error');
      }, function () {
        return wrapError(_this2.props.warn, '_warning');
      });
    };

    _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
      var oldName = prefixName(this.props, this.props.name);
      var newName = prefixName(nextProps, nextProps.name);

      if (oldName !== newName) {
        // unregister old name
        this.props._reduxForm.unregister(oldName); // register new name


        this.props._reduxForm.register(newName, 'FieldArray');
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.props._reduxForm.unregister(this.name);
    };

    _proto.getRenderedComponent = function getRenderedComponent() {
      invariant(this.props.forwardRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a forwardRef prop to FieldArray');
      return this.ref && this.ref.current.getRenderedComponent();
    };

    _proto.render = function render() {
      return createElement(ConnectedFieldArray, _extends({}, this.props, {
        name: this.name,
        ref: this.ref
      }));
    };

    _createClass(FieldArray, [{
      key: "name",
      get: function get() {
        return prefixName(this.props, this.props.name);
      }
    }, {
      key: "dirty",
      get: function get() {
        return !this.ref || this.ref.current.dirty;
      }
    }, {
      key: "pristine",
      get: function get() {
        return !!(this.ref && this.ref.current.pristine);
      }
    }, {
      key: "value",
      get: function get() {
        return this.ref ? this.ref.current.value : undefined;
      }
    }]);

    return FieldArray;
  }(Component);

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: validateComponentProp,
    props: PropTypes.object,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    warn: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    forwardRef: PropTypes.bool,
    _reduxForm: PropTypes.object
  };
  polyfill(FieldArray);
  return withReduxForm(FieldArray);
};

export default createFieldArray;