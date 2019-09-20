'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _airbnbPropTypes = require('airbnb-prop-types');

var _direction = require('direction');

var _direction2 = _interopRequireDefault(_direction);

var _direction3 = require('./proptypes/direction');

var _direction4 = _interopRequireDefault(_direction3);

var _DirectionProvider = require('./DirectionProvider');

var _DirectionProvider2 = _interopRequireDefault(_DirectionProvider);

var _withDirection = require('./withDirection');

var _withDirection2 = _interopRequireDefault(_withDirection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var propTypes = (0, _airbnbPropTypes.forbidExtraProps)({
  children: _propTypes2['default'].node.isRequired,
  direction: _direction4['default'].isRequired,
  inline: _propTypes2['default'].bool,
  text: _propTypes2['default'].string.isRequired
});

var defaultProps = {
  inline: false
};

function AutoDirectionProvider(_ref) {
  var children = _ref.children,
      direction = _ref.direction,
      inline = _ref.inline,
      text = _ref.text;

  var textDirection = (0, _direction2['default'])(text);
  var dir = textDirection === 'neutral' ? direction : textDirection;

  return _react2['default'].createElement(
    _DirectionProvider2['default'],
    {
      direction: dir,
      inline: inline
    },
    _react2['default'].Children.only(children)
  );
}

AutoDirectionProvider.propTypes = propTypes;
AutoDirectionProvider.defaultProps = defaultProps;

exports['default'] = (0, _withDirection2['default'])(AutoDirectionProvider);