import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import classnames from 'classnames';
import React from 'react';
import TouchFeedback from 'rmc-feedback';
import getDataAttr from '../_util/getDataAttr';
import Icon from '../icon';

var Tag = function (_React$Component) {
    _inherits(Tag, _React$Component);

    function Tag(props) {
        _classCallCheck(this, Tag);

        var _this = _possibleConstructorReturn(this, (Tag.__proto__ || Object.getPrototypeOf(Tag)).call(this, props));

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

    _createClass(Tag, [{
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

            var wrapCls = classnames(className, prefixCls, (_classnames = {}, _defineProperty(_classnames, prefixCls + '-normal', !disabled && (!this.state.selected || small || closable)), _defineProperty(_classnames, prefixCls + '-small', small), _defineProperty(_classnames, prefixCls + '-active', this.state.selected && !disabled && !small && !closable), _defineProperty(_classnames, prefixCls + '-disabled', disabled), _defineProperty(_classnames, prefixCls + '-closable', closable), _classnames));
            var closableDom = closable && !disabled && !small ? React.createElement(
                TouchFeedback,
                { activeClassName: prefixCls + '-close-active' },
                React.createElement(
                    'div',
                    { className: prefixCls + '-close', role: 'button', onClick: this.onTagClose, 'aria-label': 'remove tag' },
                    React.createElement(Icon, { type: 'cross-circle', size: 'xs', 'aria-hidden': 'true' })
                )
            ) : null;
            return !this.state.closed ? React.createElement(
                'div',
                _extends({}, getDataAttr(this.props), { className: wrapCls, onClick: this.onClick, style: style }),
                React.createElement(
                    'div',
                    { className: prefixCls + '-text' },
                    children
                ),
                closableDom
            ) : null;
        }
    }]);

    return Tag;
}(React.Component);

export default Tag;

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