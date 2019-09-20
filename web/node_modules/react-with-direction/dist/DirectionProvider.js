'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DIRECTIONS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _airbnbPropTypes = require('airbnb-prop-types');

var _brcast = require('brcast');

var _brcast2 = _interopRequireDefault(_brcast);

var _brcast3 = require('./proptypes/brcast');

var _brcast4 = _interopRequireDefault(_brcast3);

var _direction = require('./proptypes/direction');

var _direction2 = _interopRequireDefault(_direction);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // This component provides a string to React context that is consumed by the
// withDirection higher-order component. We can use this to give access to
// the current layout direction for components to use.

var propTypes = (0, _airbnbPropTypes.forbidExtraProps)({
  children: _propTypes2['default'].node.isRequired,
  direction: _direction2['default'].isRequired,
  inline: _propTypes2['default'].bool
});

var defaultProps = {
  inline: false
};

var childContextTypes = _defineProperty({}, _constants.CHANNEL, _brcast4['default']);

exports.DIRECTIONS = _constants.DIRECTIONS;

var DirectionProvider = function (_React$Component) {
  _inherits(DirectionProvider, _React$Component);

  function DirectionProvider(props) {
    _classCallCheck(this, DirectionProvider);

    var _this = _possibleConstructorReturn(this, (DirectionProvider.__proto__ || Object.getPrototypeOf(DirectionProvider)).call(this, props));

    _this.broadcast = (0, _brcast2['default'])(props.direction);
    return _this;
  }

  _createClass(DirectionProvider, [{
    key: 'getChildContext',
    value: function () {
      function getChildContext() {
        return _defineProperty({}, _constants.CHANNEL, this.broadcast);
      }

      return getChildContext;
    }()
  }, {
    key: 'componentWillReceiveProps',
    value: function () {
      function componentWillReceiveProps(nextProps) {
        if (this.props.direction !== nextProps.direction) {
          this.broadcast.setState(nextProps.direction);
        }
      }

      return componentWillReceiveProps;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _props = this.props,
            children = _props.children,
            direction = _props.direction,
            inline = _props.inline;

        var Tag = inline ? 'span' : 'div';
        return _react2['default'].createElement(
          Tag,
          { dir: direction },
          _react2['default'].Children.only(children)
        );
      }

      return render;
    }()
  }]);

  return DirectionProvider;
}(_react2['default'].Component);

exports['default'] = DirectionProvider;


DirectionProvider.propTypes = propTypes;
DirectionProvider.defaultProps = defaultProps;
DirectionProvider.childContextTypes = childContextTypes;