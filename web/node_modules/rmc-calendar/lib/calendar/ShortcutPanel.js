'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ShortcutPanel = function (_React$PureComponent) {
    (0, _inherits3['default'])(ShortcutPanel, _React$PureComponent);

    function ShortcutPanel() {
        (0, _classCallCheck3['default'])(this, ShortcutPanel);

        var _this = (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.apply(this, arguments));

        _this.onClick = function (type) {
            var onSelect = _this.props.onSelect;

            var today = new Date();
            switch (type) {
                case 'today':
                    onSelect(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0), new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12));
                    break;
                case 'yesterday':
                    onSelect(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0), new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12));
                    break;
                case 'lastweek':
                    onSelect(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 0), new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12));
                    break;
                case 'lastmonth':
                    onSelect(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29, 0), new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12));
                    break;
            }
        };
        return _this;
    }

    ShortcutPanel.prototype.render = function render() {
        var _this2 = this;

        var locale = this.props.locale;

        return React.createElement(
            'div',
            { className: 'shortcut-panel' },
            React.createElement(
                'div',
                { className: 'item', onClick: function onClick() {
                        return _this2.onClick('today');
                    } },
                locale.today
            ),
            React.createElement(
                'div',
                { className: 'item', onClick: function onClick() {
                        return _this2.onClick('yesterday');
                    } },
                locale.yesterday
            ),
            React.createElement(
                'div',
                { className: 'item', onClick: function onClick() {
                        return _this2.onClick('lastweek');
                    } },
                locale.lastWeek
            ),
            React.createElement(
                'div',
                { className: 'item', onClick: function onClick() {
                        return _this2.onClick('lastmonth');
                    } },
                locale.lastMonth
            )
        );
    };

    return ShortcutPanel;
}(React.PureComponent);

exports['default'] = ShortcutPanel;
module.exports = exports['default'];