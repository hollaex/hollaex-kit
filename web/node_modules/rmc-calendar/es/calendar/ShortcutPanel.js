import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import * as React from 'react';

var ShortcutPanel = function (_React$PureComponent) {
    _inherits(ShortcutPanel, _React$PureComponent);

    function ShortcutPanel() {
        _classCallCheck(this, ShortcutPanel);

        var _this = _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));

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

export default ShortcutPanel;