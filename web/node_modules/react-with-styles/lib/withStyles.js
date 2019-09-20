'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withStylesPropTypes = exports.css = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.withStyles = withStyles;

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _constants = require('react-with-direction/dist/constants');

var _brcast = require('react-with-direction/dist/proptypes/brcast');

var _brcast2 = _interopRequireDefault(_brcast);

var _ThemedStyleSheet = require('./ThemedStyleSheet');

var _ThemedStyleSheet2 = _interopRequireDefault(_ThemedStyleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint react/forbid-foreign-prop-types: off */

// Add some named exports to assist in upgrading and for convenience
var css = exports.css = _ThemedStyleSheet2['default'].resolveLTR;
var withStylesPropTypes = exports.withStylesPropTypes = {
  styles: _propTypes2['default'].object.isRequired, // eslint-disable-line react/forbid-prop-types
  theme: _propTypes2['default'].object.isRequired, // eslint-disable-line react/forbid-prop-types
  css: _propTypes2['default'].func.isRequired
};

var EMPTY_STYLES = {};
var EMPTY_STYLES_FN = function EMPTY_STYLES_FN() {
  return EMPTY_STYLES;
};

var START_MARK = 'react-with-styles.createStyles.start';
var END_MARK = 'react-with-styles.createStyles.end';

function baseClass(pureComponent) {
  if (pureComponent) {
    if (!_react2['default'].PureComponent) {
      throw new ReferenceError('withStyles() pureComponent option requires React 15.3.0 or later');
    }

    return _react2['default'].PureComponent;
  }

  return _react2['default'].Component;
}

var contextTypes = _defineProperty({}, _constants.CHANNEL, _brcast2['default']);

var defaultDirection = _constants.DIRECTIONS.LTR;

function withStyles(styleFn) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$stylesPropName = _ref.stylesPropName,
      stylesPropName = _ref$stylesPropName === undefined ? 'styles' : _ref$stylesPropName,
      _ref$themePropName = _ref.themePropName,
      themePropName = _ref$themePropName === undefined ? 'theme' : _ref$themePropName,
      _ref$cssPropName = _ref.cssPropName,
      cssPropName = _ref$cssPropName === undefined ? 'css' : _ref$cssPropName,
      _ref$flushBefore = _ref.flushBefore,
      flushBefore = _ref$flushBefore === undefined ? false : _ref$flushBefore,
      _ref$pureComponent = _ref.pureComponent,
      pureComponent = _ref$pureComponent === undefined ? false : _ref$pureComponent;

  var styleDefLTR = void 0;
  var styleDefRTL = void 0;
  var currentThemeLTR = void 0;
  var currentThemeRTL = void 0;
  var BaseClass = baseClass(pureComponent);

  function getResolveMethod(direction) {
    return direction === _constants.DIRECTIONS.LTR ? _ThemedStyleSheet2['default'].resolveLTR : _ThemedStyleSheet2['default'].resolveRTL;
  }

  function getCurrentTheme(direction) {
    return direction === _constants.DIRECTIONS.LTR ? currentThemeLTR : currentThemeRTL;
  }

  function getStyleDef(direction, wrappedComponentName) {
    var currentTheme = getCurrentTheme(direction);
    var styleDef = direction === _constants.DIRECTIONS.LTR ? styleDefLTR : styleDefRTL;

    var registeredTheme = _ThemedStyleSheet2['default'].get();

    // Return the existing styles if they've already been defined
    // and if the theme used to create them corresponds to the theme
    // registered with ThemedStyleSheet
    if (styleDef && currentTheme === registeredTheme) {
      return styleDef;
    }

    if (process.env.NODE_ENV !== 'production' && typeof performance !== 'undefined' && performance.mark !== undefined && typeof performance.clearMarks === 'function') {
      performance.clearMarks(START_MARK);
      performance.mark(START_MARK);
    }

    var isRTL = direction === _constants.DIRECTIONS.RTL;

    if (isRTL) {
      styleDefRTL = styleFn ? _ThemedStyleSheet2['default'].createRTL(styleFn) : EMPTY_STYLES_FN;

      currentThemeRTL = registeredTheme;
      styleDef = styleDefRTL;
    } else {
      styleDefLTR = styleFn ? _ThemedStyleSheet2['default'].createLTR(styleFn) : EMPTY_STYLES_FN;

      currentThemeLTR = registeredTheme;
      styleDef = styleDefLTR;
    }

    if (process.env.NODE_ENV !== 'production' && typeof performance !== 'undefined' && performance.mark !== undefined && typeof performance.clearMarks === 'function') {
      performance.clearMarks(END_MARK);
      performance.mark(END_MARK);

      var measureName = '\uD83D\uDC69\u200D\uD83C\uDFA8 withStyles(' + String(wrappedComponentName) + ') [create styles]';

      performance.measure(measureName, START_MARK, END_MARK);
      performance.clearMarks(measureName);
    }

    return styleDef;
  }

  function getState(direction, wrappedComponentName) {
    return {
      resolveMethod: getResolveMethod(direction),
      styleDef: getStyleDef(direction, wrappedComponentName)
    };
  }

  return function () {
    function withStylesHOC(WrappedComponent) {
      var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

      // NOTE: Use a class here so components are ref-able if need be:
      // eslint-disable-next-line react/prefer-stateless-function

      var WithStyles = function (_BaseClass) {
        _inherits(WithStyles, _BaseClass);

        function WithStyles(props, context) {
          _classCallCheck(this, WithStyles);

          var _this = _possibleConstructorReturn(this, (WithStyles.__proto__ || Object.getPrototypeOf(WithStyles)).call(this, props, context));

          var direction = _this.context[_constants.CHANNEL] ? _this.context[_constants.CHANNEL].getState() : defaultDirection;

          _this.state = getState(direction, wrappedComponentName);
          return _this;
        }

        _createClass(WithStyles, [{
          key: 'componentDidMount',
          value: function () {
            function componentDidMount() {
              var _this2 = this;

              if (this.context[_constants.CHANNEL]) {
                // subscribe to future direction changes
                this.channelUnsubscribe = this.context[_constants.CHANNEL].subscribe(function (direction) {
                  _this2.setState(getState(direction, wrappedComponentName));
                });
              }
            }

            return componentDidMount;
          }()
        }, {
          key: 'componentWillUnmount',
          value: function () {
            function componentWillUnmount() {
              if (this.channelUnsubscribe) {
                this.channelUnsubscribe();
              }
            }

            return componentWillUnmount;
          }()
        }, {
          key: 'render',
          value: function () {
            function render() {
              var _ref2;

              // As some components will depend on previous styles in
              // the component tree, we provide the option of flushing the
              // buffered styles (i.e. to a style tag) **before** the rendering
              // cycle begins.
              //
              // The interfaces provide the optional "flush" method which
              // is run in turn by ThemedStyleSheet.flush.
              if (flushBefore) {
                _ThemedStyleSheet2['default'].flush();
              }

              var _state = this.state,
                  resolveMethod = _state.resolveMethod,
                  styleDef = _state.styleDef;


              return _react2['default'].createElement(WrappedComponent, _extends({}, this.props, (_ref2 = {}, _defineProperty(_ref2, themePropName, _ThemedStyleSheet2['default'].get()), _defineProperty(_ref2, stylesPropName, styleDef()), _defineProperty(_ref2, cssPropName, resolveMethod), _ref2)));
            }

            return render;
          }()
        }]);

        return WithStyles;
      }(BaseClass);

      WithStyles.WrappedComponent = WrappedComponent;
      WithStyles.displayName = 'withStyles(' + String(wrappedComponentName) + ')';
      WithStyles.contextTypes = contextTypes;
      if (WrappedComponent.propTypes) {
        WithStyles.propTypes = (0, _object2['default'])({}, WrappedComponent.propTypes);
        delete WithStyles.propTypes[stylesPropName];
        delete WithStyles.propTypes[themePropName];
        delete WithStyles.propTypes[cssPropName];
      }
      if (WrappedComponent.defaultProps) {
        WithStyles.defaultProps = (0, _object2['default'])({}, WrappedComponent.defaultProps);
      }

      return (0, _hoistNonReactStatics2['default'])(WithStyles, WrappedComponent);
    }

    return withStylesHOC;
  }();
}