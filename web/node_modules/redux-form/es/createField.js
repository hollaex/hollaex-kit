import _extends from "@babel/runtime/helpers/extends";
import _createClass from "@babel/runtime/helpers/createClass";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { Component, createElement } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import createConnectedField from './ConnectedField';
import shallowCompare from './util/shallowCompare';
import prefixName from './util/prefixName';
import plain from './structure/plain';
import { withReduxForm } from './ReduxFormContext';
import validateComponentProp from './util/validateComponentProp';

var createField = function createField(structure) {
  var ConnectedField = createConnectedField(structure);
  var setIn = structure.setIn;

  var Field =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(Field, _Component);

    function Field(props) {
      var _this;

      _this = _Component.call(this, props) || this;
      _this.ref = React.createRef();
      _this.ref = React.createRef();

      _this.normalize = function (name, value) {
        var normalize = _this.props.normalize;

        if (!normalize) {
          return value;
        }

        var previousValues = _this.props._reduxForm.getValues();

        var previousValue = _this.value;
        var nextValues = setIn(previousValues, name, value);
        return normalize(value, previousValue, nextValues, previousValues, name);
      };

      if (!props._reduxForm) {
        throw new Error('Field must be inside a component decorated with reduxForm()');
      }

      return _this;
    }

    var _proto = Field.prototype;

    _proto.componentDidMount = function componentDidMount() {
      var _this2 = this;

      this.props._reduxForm.register(this.name, 'Field', function () {
        return _this2.props.validate;
      }, function () {
        return _this2.props.warn;
      });
    };

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    };

    _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
      var oldName = prefixName(this.props, this.props.name);
      var newName = prefixName(nextProps, nextProps.name);

      if (oldName !== newName || // use deepEqual here because they could be a function or an array of functions
      !plain.deepEqual(this.props.validate, nextProps.validate) || !plain.deepEqual(this.props.warn, nextProps.warn)) {
        // unregister old name
        this.props._reduxForm.unregister(oldName); // register new name


        this.props._reduxForm.register(newName, 'Field', function () {
          return nextProps.validate;
        }, function () {
          return nextProps.warn;
        });
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.props._reduxForm.unregister(this.name);
    };

    _proto.getRenderedComponent = function getRenderedComponent() {
      invariant(this.props.forwardRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a forwardRef prop to Field');
      return this.ref.current ? this.ref.current.getRenderedComponent() : undefined;
    };

    _proto.render = function render() {
      return createElement(ConnectedField, _extends({}, this.props, {
        name: this.name,
        normalize: this.normalize,
        ref: this.ref
      }));
    };

    _createClass(Field, [{
      key: "name",
      get: function get() {
        return prefixName(this.props, this.props.name);
      }
    }, {
      key: "dirty",
      get: function get() {
        return !this.pristine;
      }
    }, {
      key: "pristine",
      get: function get() {
        return !!(this.ref.current && this.ref.current.isPristine());
      }
    }, {
      key: "value",
      get: function get() {
        return this.ref.current && this.ref.current.getValue();
      }
    }]);

    return Field;
  }(Component);

  Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: validateComponentProp,
    format: PropTypes.func,
    normalize: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    parse: PropTypes.func,
    props: PropTypes.object,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    warn: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    forwardRef: PropTypes.bool,
    immutableProps: PropTypes.arrayOf(PropTypes.string),
    _reduxForm: PropTypes.object
  };
  polyfill(Field);
  return withReduxForm(Field);
};

export default createField;