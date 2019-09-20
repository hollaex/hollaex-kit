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

var _util = require('../util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ConfirmPanel = function (_React$PureComponent) {
    (0, _inherits3['default'])(ConfirmPanel, _React$PureComponent);

    function ConfirmPanel() {
        (0, _classCallCheck3['default'])(this, ConfirmPanel);

        var _this = (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.apply(this, arguments));

        _this.onConfirm = function () {
            var _this$props = _this.props,
                onConfirm = _this$props.onConfirm,
                disableBtn = _this$props.disableBtn;

            !disableBtn && onConfirm();
        };
        return _this;
    }

    ConfirmPanel.prototype.formatDate = function formatDate(date) {
        var _props = this.props,
            _props$formatStr = _props.formatStr,
            formatStr = _props$formatStr === undefined ? '' : _props$formatStr,
            locale = _props.locale;

        return (0, _util.formatDate)(date, formatStr, locale);
    };

    ConfirmPanel.prototype.render = function render() {
        var _props2 = this.props,
            type = _props2.type,
            locale = _props2.locale,
            disableBtn = _props2.disableBtn;
        var _props3 = this.props,
            startDateTime = _props3.startDateTime,
            endDateTime = _props3.endDateTime;

        if (startDateTime && endDateTime && +startDateTime > +endDateTime) {
            var tmp = startDateTime;
            startDateTime = endDateTime;
            endDateTime = tmp;
        }
        var startTimeStr = startDateTime ? this.formatDate(startDateTime) : locale.noChoose;
        var endTimeStr = endDateTime ? this.formatDate(endDateTime) : locale.noChoose;
        var btnCls = disableBtn ? 'button button-disable' : 'button';
        if (type === 'one') {
            btnCls += ' button-full';
        }
        return React.createElement(
            'div',
            { className: 'confirm-panel' },
            type === 'range' && React.createElement(
                'div',
                { className: 'info' },
                React.createElement(
                    'p',
                    null,
                    locale.start,
                    ': ',
                    React.createElement(
                        'span',
                        { className: !startDateTime ? 'grey' : '' },
                        startTimeStr
                    )
                ),
                React.createElement(
                    'p',
                    null,
                    locale.end,
                    ': ',
                    React.createElement(
                        'span',
                        { className: !endDateTime ? 'grey' : '' },
                        endTimeStr
                    )
                )
            ),
            React.createElement(
                'div',
                { className: btnCls, onClick: this.onConfirm },
                locale.confirm
            )
        );
    };

    return ConfirmPanel;
}(React.PureComponent);

exports['default'] = ConfirmPanel;

ConfirmPanel.defaultProps = {
    formatStr: 'yyyy-MM-dd hh:mm'
};
module.exports = exports['default'];