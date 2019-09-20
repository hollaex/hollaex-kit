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

var _ConnectedField = _interopRequireDefault(require("./ConnectedField"));

var _shallowCompare = _interopRequireDefault(require("./util/shallowCompare"));

var _prefixName = _interopRequireDefault(require("./util/prefixName"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _ReduxFormContext = require("./ReduxFormContext");

var _validateComponentProp = _interopRequireDefault(require("./util/validateComponentProp"));

var createField = function createField(structure) {
  var ConnectedField = (0, _ConnectedField["default"])(structure);
  var setIn = structure.setIn;

  var Field =
  /*#__PURE__*/
  function (_Component) {
    (0, _inheritsLoose2["default"])(Field, _Component);

    function Field(props) {
      var _this;

      _this = _Component.call(this, props) || this;
      _this.ref = _react["default"].createRef();
      _this.ref = _react["default"].createRef();

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
      return (0, _shallowCompare["default"])(this, nextProps, nextState);
    };

    _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
      var oldName = (0, _prefixName["default"])(this.props, this.props.name);
      var newName = (0, _prefixName["default"])(nextProps, nextProps.name);

      if (oldName !== newName || // use deepEqual here because they could be a function or an array of functions
      !_plain["default"].deepEqual(this.props.validate, nextProps.validate) || !_plain["default"].deepEqual(this.props.warn, nextProps.warn)) {
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
      (0, _invariant["default"])(this.props.forwardRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a forwardRef prop to Field');
      return this.ref.current ? this.ref.current.getRenderedComponent() : undefined;
    };

    _proto.render = function render() {
      return (0, _react.createElement)(ConnectedField, (0, _extends2["default"])({}, this.props, {
        name: this.name,
        normalize: this.normalize,
        ref: this.ref
      }));
    };

    (0, _createClass2["default"])(Field, [{
      key: "name",
      get: function get() {
        return (0, _prefixName["default"])(this.props, this.props.name);
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
  }(_react.Component);

  Field.propTypes = {
    name: _propTypes["default"].string.isRequired,
    component: _validateComponentProp["default"],
    format: _propTypes["default"].func,
    normalize: _propTypes["default"].func,
    onBlur: _propTypes["default"].func,
    onChange: _propTypes["default"].func,
    onFocus: _propTypes["default"].func,
    onDragStart: _propTypes["default"].func,
    onDrop: _propTypes["default"].func,
    parse: _propTypes["default"].func,
    props: _propTypes["default"].object,
    validate: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].arrayOf(_propTypes["default"].func)]),
    warn: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].arrayOf(_propTypes["default"].func)]),
    forwardRef: _propTypes["default"].bool,
    immutableProps: _propTypes["default"].arrayOf(_propTypes["default"].string),
    _reduxForm: _propTypes["default"].object
  };
  (0, _reactLifecyclesCompat.polyfill)(Field);
  return (0, _ReduxFormContext.withReduxForm)(Field);
};

var _default = createField;
exports["default"] = _default;