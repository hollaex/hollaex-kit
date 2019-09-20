"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _createFieldProps2 = _interopRequireDefault(require("./createFieldProps"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _onChangeValue = _interopRequireDefault(require("./events/onChangeValue"));

var _validateComponentProp = _interopRequireDefault(require("./util/validateComponentProp"));

var propsToNotUpdateFor = ['_reduxForm'];

var createConnectedFields = function createConnectedFields(structure) {
  var deepEqual = structure.deepEqual,
      getIn = structure.getIn,
      size = structure.size;

  var getSyncError = function getSyncError(syncErrors, name) {
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return _plain["default"].getIn(syncErrors, name + "._error") || _plain["default"].getIn(syncErrors, name);
  };

  var getSyncWarning = function getSyncWarning(syncWarnings, name) {
    var warning = getIn(syncWarnings, name); // Because the warning for this field might not be at a level in the warning structure where
    // it can be set directly, it might need to be unwrapped from the _warning property

    return warning && warning._warning ? warning._warning : warning;
  };

  var ConnectedFields =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inheritsLoose2["default"])(ConnectedFields, _React$Component);

    function ConnectedFields(props) {
      var _this;

      _this = _React$Component.call(this, props) || this;
      _this.onChangeFns = {};
      _this.onFocusFns = {};
      _this.onBlurFns = {};
      _this.ref = _react["default"].createRef();

      _this.prepareEventHandlers = function (_ref) {
        var names = _ref.names;
        return names.forEach(function (name) {
          _this.onChangeFns[name] = function (event) {
            return _this.handleChange(name, event);
          };

          _this.onFocusFns[name] = function () {
            return _this.handleFocus(name);
          };

          _this.onBlurFns[name] = function (event) {
            return _this.handleBlur(name, event);
          };
        });
      };

      _this.handleChange = function (name, event) {
        var _this$props = _this.props,
            dispatch = _this$props.dispatch,
            parse = _this$props.parse,
            _reduxForm = _this$props._reduxForm;
        var value = (0, _onChangeValue["default"])(event, {
          name: name,
          parse: parse
        });
        dispatch(_reduxForm.change(name, value)); // call post-change callback

        if (_reduxForm.asyncValidate) {
          _reduxForm.asyncValidate(name, value, 'change');
        }
      };

      _this.handleFocus = function (name) {
        var _this$props2 = _this.props,
            dispatch = _this$props2.dispatch,
            _reduxForm = _this$props2._reduxForm;
        dispatch(_reduxForm.focus(name));
      };

      _this.handleBlur = function (name, event) {
        var _this$props3 = _this.props,
            dispatch = _this$props3.dispatch,
            parse = _this$props3.parse,
            _reduxForm = _this$props3._reduxForm;
        var value = (0, _onChangeValue["default"])(event, {
          name: name,
          parse: parse
        }); // dispatch blur action

        dispatch(_reduxForm.blur(name, value)); // call post-blur callback

        if (_reduxForm.asyncValidate) {
          _reduxForm.asyncValidate(name, value, 'blur');
        }
      };

      _this.prepareEventHandlers(props);

      return _this;
    }

    var _proto = ConnectedFields.prototype;

    _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (this.props.names !== nextProps.names && (size(this.props.names) !== size(nextProps.names) || nextProps.names.some(function (nextName) {
        return !_this2.props._fields[nextName];
      }))) {
        // names has changed. The cached event handlers need to be updated
        this.prepareEventHandlers(nextProps);
      }
    };

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
      var _this3 = this;

      var nextPropsKeys = Object.keys(nextProps);
      var thisPropsKeys = Object.keys(this.props); // if we have children, we MUST update in React 16
      // https://twitter.com/erikras/status/915866544558788608

      return !!(this.props.children || nextProps.children || nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(function (prop) {
        return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(_this3.props[prop], nextProps[prop]);
      }));
    };

    _proto.isDirty = function isDirty() {
      var _fields = this.props._fields;
      return Object.keys(_fields).some(function (name) {
        return _fields[name].dirty;
      });
    };

    _proto.getValues = function getValues() {
      var _fields = this.props._fields;
      return Object.keys(_fields).reduce(function (accumulator, name) {
        return _plain["default"].setIn(accumulator, name, _fields[name].value);
      }, {});
    };

    _proto.getRenderedComponent = function getRenderedComponent() {
      return this.ref.current;
    };

    _proto.render = function render() {
      var _this4 = this;

      var _this$props4 = this.props,
          component = _this$props4.component,
          forwardRef = _this$props4.forwardRef,
          _fields = _this$props4._fields,
          _reduxForm = _this$props4._reduxForm,
          rest = (0, _objectWithoutPropertiesLoose2["default"])(_this$props4, ["component", "forwardRef", "_fields", "_reduxForm"]);
      var sectionPrefix = _reduxForm.sectionPrefix,
          form = _reduxForm.form;

      var _Object$keys$reduce = Object.keys(_fields).reduce(function (accumulator, name) {
        var connectedProps = _fields[name];

        var _createFieldProps = (0, _createFieldProps2["default"])(structure, name, (0, _extends2["default"])({}, connectedProps, rest, {
          form: form,
          onBlur: _this4.onBlurFns[name],
          onChange: _this4.onChangeFns[name],
          onFocus: _this4.onFocusFns[name]
        })),
            custom = _createFieldProps.custom,
            fieldProps = (0, _objectWithoutPropertiesLoose2["default"])(_createFieldProps, ["custom"]);

        accumulator.custom = custom;
        var fieldName = sectionPrefix ? name.replace(sectionPrefix + ".", '') : name;
        return _plain["default"].setIn(accumulator, fieldName, fieldProps);
      }, {}),
          custom = _Object$keys$reduce.custom,
          props = (0, _objectWithoutPropertiesLoose2["default"])(_Object$keys$reduce, ["custom"]);

      if (forwardRef) {
        props.ref = this.ref;
      }

      return _react["default"].createElement(component, (0, _extends2["default"])({}, props, custom));
    };

    return ConnectedFields;
  }(_react["default"].Component);

  ConnectedFields.propTypes = {
    component: _validateComponentProp["default"],
    _fields: _propTypes["default"].object.isRequired,
    props: _propTypes["default"].object
  };
  var connector = (0, _reactRedux.connect)(function (state, ownProps) {
    var names = ownProps.names,
        _ownProps$_reduxForm = ownProps._reduxForm,
        initialValues = _ownProps$_reduxForm.initialValues,
        getFormState = _ownProps$_reduxForm.getFormState;
    var formState = getFormState(state);
    return {
      _fields: names.reduce(function (accumulator, name) {
        var initialState = getIn(formState, "initial." + name);
        var initial = initialState !== undefined ? initialState : initialValues && getIn(initialValues, name);
        var value = getIn(formState, "values." + name);
        var syncError = getSyncError(getIn(formState, 'syncErrors'), name);
        var syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name);
        var submitting = getIn(formState, 'submitting');
        var pristine = value === initial;
        accumulator[name] = {
          asyncError: getIn(formState, "asyncErrors." + name),
          asyncValidating: getIn(formState, 'asyncValidating') === name,
          dirty: !pristine,
          initial: initial,
          pristine: pristine,
          state: getIn(formState, "fields." + name),
          submitError: getIn(formState, "submitErrors." + name),
          submitFailed: getIn(formState, 'submitFailed'),
          submitting: submitting,
          syncError: syncError,
          syncWarning: syncWarning,
          value: value,
          _value: ownProps.value // save value passed in (for radios)

        };
        return accumulator;
      }, {})
    };
  }, undefined, undefined, {
    forwardRef: true
  });
  return connector(ConnectedFields);
};

var _default = createConnectedFields;
exports["default"] = _default;