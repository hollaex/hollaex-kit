'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

var _getDataAttr = require('../_util/getDataAttr');

var _getDataAttr2 = _interopRequireDefault(_getDataAttr);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Tag = function (_React$Component) {
    (0, _inherits3['default'])(Tag, _React$Component);

    function Tag(props) {
        (0, _classCallCheck3['default'])(this, Tag);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Tag.__proto__ || Object.getPrototypeOf(Tag)).call(this, props));

        _this.onClick = function () {
            var _this$props = _this.props,
                disabled = _this$props.disabled,
                onChange = _this$props.onChange;

            if (disabled) {
                return;
            }
            var isSelect = _this.state.selected;
            _this.setState({
                selected: !isSelect
            }, function () {
                if (onChange) {
                    onChange(!isSelect);
                }
            });
        };
        _this.onTagClose = function () {
            if (_this.props.onClose) {
                _this.props.onClose();
            }
            _this.setState({
                closed: true
            }, _this.props.afterClose);
        };
        _this.state = {
            selected: props.selected,
            closed: false
        };
        return _this;
    }

    (0, _createClass3['default'])(Tag, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.selected !== nextProps.selected) {
                this.setState({
                    selected: nextProps.selected
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _classnames;

            var _props = this.props,
                children = _props.children,
                className = _props.className,
                prefixCls = _props.prefixCls,
                disabled = _props.disabled,
                closable = _props.closable,
                small = _props.small,
                style = _props.style;

            var wrapCls = (0, _classnames3['default'])(className, prefixCls, (_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls + '-normal', !disabled && (!this.state.selected || small || closable)), (0, _defineProperty3['default'])(_classnames, prefixCls + '-small', small), (0, _defineProperty3['default'])(_classnames, prefixCls + '-active', this.state.selected && !disabled && !small && !closable), (0, _defineProperty3['default'])(_classnames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classnames, prefixCls + '-closable', closable), _classnames));
            var closableDom = closable && !disabled && !small ? _react2['default'].createElement(
                _rmcFeedback2['default'],
                { activeClassName: prefixCls + '-close-active' },
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-close', role: 'button', onClick: this.onTagClose, 'aria-label': 'remove tag' },
                    _react2['default'].createElement(_icon2['default'], { type: 'cross-circle', size: 'xs', 'aria-hidden': 'true' })
                )
            ) : null;
            return !this.state.closed ? _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({}, (0, _getDataAttr2['default'])(this.props), { className: wrapCls, onClick: this.onClick, style: style }),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-text' },
                    children
                ),
                closableDom
            ) : null;
        }
    }]);
    return Tag;
}(_react2['default'].Component);

exports['default'] = Tag;

Tag.defaultProps = {
    prefixCls: 'am-tag',
    disabled: false,
    selected: false,
    closable: false,
    small: false,
    onChange: function onChange() {},
    onClose: function onClose() {},
    afterClose: function afterClose() {}
};
module.exports = exports['default'];