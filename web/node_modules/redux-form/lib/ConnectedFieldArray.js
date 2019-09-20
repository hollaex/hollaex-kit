"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _mapValues2 = _interopRequireDefault(require("lodash/mapValues"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _createFieldArrayProps = _interopRequireDefault(require("./createFieldArrayProps"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _validateComponentProp = _interopRequireDefault(require("./util/validateComponentProp"));

var propsToNotUpdateFor = ['_reduxForm', 'value'];

var createConnectedFieldArray = function createConnectedFieldArray(structure) {
  var deepEqual = structure.deepEqual,
      getIn = structure.getIn,
      size = structure.size,
      equals = structure.equals,
      orderChanged = structure.orderChanged;

  var getSyncError = function getSyncError(syncErrors, name) {
    // For an array, the error can _ONLY_ be under _error.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return _plain["default"].getIn(syncErrors, name + "._error");
  };

  var getSyncWarning = function getSyncWarning(syncWarnings, name) {
    // For an array, the warning can _ONLY_ be under _warning.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return getIn(syncWarnings, name + "._warning");
  };

  var ConnectedFieldArray =
  /*#__PURE__*/
  function (_Component) {
    (0, _inheritsLoose2["default"])(ConnectedFieldArray, _Component);

    function ConnectedFieldArray() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.ref = _react["default"].createRef();

      _this.getValue = function (index) {
        return _this.props.value && getIn(_this.props.value, String(index));
      };

      return _this;
    }

    var _proto = ConnectedFieldArray.prototype;

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      // Update if the elements of the value array was updated.
      var thisValue = this.props.value;
      var nextValue = nextProps.value;

      if (thisValue && nextValue) {
        var nextValueItemsSame = equals(nextValue, thisValue); //.every(val => ~thisValue.indexOf(val))

        var nextValueItemsOrderChanged = orderChanged(thisValue, nextValue);
        var thisValueLength = thisValue.length || thisValue.size;
        var nextValueLength = nextValue.length || nextValue.size;

        if (thisValueLength !== nextValueLength || nextValueItemsSame && nextValueItemsOrderChanged || nextProps.rerenderOnEveryChange && thisValue.some(function (val, index) {
          return !deepEqual(val, nextValue[index]);
        })) {
          return true;
        }
      }

      var nextPropsKeys = Object.keys(nextProps);
      var thisPropsKeys = Object.keys(this.props); // if we have children, we MUST update in React 16
      // https://twitter.com/erikras/status/915866544558788608

      return !!(this.props.children || nextProps.children || nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(function (prop) {
        // useful to debug rerenders
        // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
        //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
        // }
        return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(_this2.props[prop], nextProps[prop]);
      }));
    };

    _proto.getRenderedComponent = function getRenderedComponent() {
      return this.ref.current;
    };

    _proto.render = function render() {
      var _this$props = this.props,
          component = _this$props.component,
          forwardRef = _this$props.forwardRef,
          name = _this$props.name,
          _reduxForm = _this$props._reduxForm,
          validate = _this$props.validate,
          warn = _this$props.warn,
          rerenderOnEveryChange = _this$props.rerenderOnEveryChange,
          rest = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["component", "forwardRef", "name", "_reduxForm", "validate", "warn", "rerenderOnEveryChange"]);
      var props = (0, _createFieldArrayProps["default"])(structure, name, _reduxForm.form, _reduxForm.sectionPrefix, this.getValue, rest);

      if (forwardRef) {
        props.ref = this.ref;
      }

      return (0, _react.createElement)(component, props);
    };

    (0, _createClass2["default"])(ConnectedFieldArray, [{
      key: "dirty",
      get: function get() {
        return this.props.dirty;
      }
    }, {
      key: "pristine",
      get: function get() {
        return this.props.pristine;
      }
    }, {
      key: "value",
      get: function get() {
        return this.props.value;
      }
    }]);
    return ConnectedFieldArray;
  }(_react.Component);

  ConnectedFieldArray.propTypes = {
    component: _validateComponentProp["default"],
    props: _propTypes["default"].object,
    rerenderOnEveryChange: _propTypes["default"].bool
  };
  ConnectedFieldArray.defaultProps = {
    rerenderOnEveryChange: false
  };
  var connector = (0, _reactRedux.connect)(function (state, ownProps) {
    var name = ownProps.name,
        _ownProps$_reduxForm = ownProps._reduxForm,
        initialValues = _ownProps$_reduxForm.initialValues,
        getFormState = _ownProps$_reduxForm.getFormState;
    var formState = getFormState(state);
    var initial = getIn(formState, "initial." + name) || initialValues && getIn(initialValues, name);
    var value = getIn(formState, "values." + name);
    var submitting = getIn(formState, 'submitting');
    var syncError = getSyncError(getIn(formState, 'syncErrors'), name);
    var syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name);
    var pristine = deepEqual(value, initial);
    return {
      asyncError: getIn(formState, "asyncErrors." + name + "._error"),
      dirty: !pristine,
      pristine: pristine,
      state: getIn(formState, "fields." + name),
      submitError: getIn(formState, "submitErrors." + name + "._error"),
      submitFailed: getIn(formState, 'submitFailed'),
      submitting: submitting,
      syncError: syncError,
      syncWarning: syncWarning,
      value: value,
      length: size(value)
    };
  }, function (dispatch, ownProps) {
    var name = ownProps.name,
        _reduxForm = ownProps._reduxForm;
    var arrayInsert = _reduxForm.arrayInsert,
        arrayMove = _reduxForm.arrayMove,
        arrayPop = _reduxForm.arrayPop,
        arrayPush = _reduxForm.arrayPush,
        arrayRemove = _reduxForm.arrayRemove,
        arrayRemoveAll = _reduxForm.arrayRemoveAll,
        arrayShift = _reduxForm.arrayShift,
        arraySplice = _reduxForm.arraySplice,
        arraySwap = _reduxForm.arraySwap,
        arrayUnshift = _reduxForm.arrayUnshift;
    return (0, _mapValues2["default"])({
      arrayInsert: arrayInsert,
      arrayMove: arrayMove,
      arrayPop: arrayPop,
      arrayPush: arrayPush,
      arrayRemove: arrayRemove,
      arrayRemoveAll: arrayRemoveAll,
      arrayShift: arrayShift,
      arraySplice: arraySplice,
      arraySwap: arraySwap,
      arrayUnshift: arrayUnshift
    }, function (actionCreator) {
      return (0, _redux.bindActionCreators)(actionCreator.bind(null, name), dispatch);
    });
  }, undefined, {
    forwardRef: true
  });
  return connector(ConnectedFieldArray);
};

var _default = createConnectedFieldArray;
exports["default"] = _default;