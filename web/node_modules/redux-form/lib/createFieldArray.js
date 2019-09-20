"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var _ConnectedFieldArray = _interopRequireDefault(require("./ConnectedFieldArray"));

var _prefixName = _interopRequireDefault(require("./util/prefixName"));

var _ReduxFormContext = require("./ReduxFormContext");

var _validateComponentProp = _interopRequireDefault(require("./util/validateComponentProp"));

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
  var ConnectedFieldArray = (0, _ConnectedFieldArray["default"])(structure);

  var FieldArray =
  /*#__PURE__*/
  function (_Component) {
    (0, _inheritsLoose2["default"])(FieldArray, _Component);

    function FieldArray(props) {
      var _this;

      _this = _Component.call(this, props) || this;
      _this.ref = _react["default"].createRef();

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
      var oldName = (0, _prefixName["default"])(this.props, this.props.name);
      var newName = (0, _prefixName["default"])(nextProps, nextProps.name);

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
      (0, _invariant["default"])(this.props.forwardRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a forwardRef prop to FieldArray');
      return this.ref && this.ref.current.getRenderedComponent();
    };

    _proto.render = function render() {
      return (0, _react.createElement)(ConnectedFieldArray, (0, _extends2["default"])({}, this.props, {
        name: this.name,
        ref: this.ref
      }));
    };

    (0, _createClass2["default"])(FieldArray, [{
      key: "name",
      get: function get() {
        return (0, _prefixName["default"])(this.props, this.props.name);
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
  }(_react.Component);

  FieldArray.propTypes = {
    name: _propTypes["default"].string.isRequired,
    component: _validateComponentProp["default"],
    props: _propTypes["default"].object,
    validate: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].arrayOf(_propTypes["default"].func)]),
    warn: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].arrayOf(_propTypes["default"].func)]),
    forwardRef: _propTypes["default"].bool,
    _reduxForm: _propTypes["default"].object
  };
  (0, _reactLifecyclesCompat.polyfill)(FieldArray);
  return (0, _ReduxFormContext.withReduxForm)(FieldArray);
};

var _default = createFieldArray;
exports["default"] = _default;