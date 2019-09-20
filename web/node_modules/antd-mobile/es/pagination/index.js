import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getComponentLocale } from '../_util/getLocale';
import Button from '../button';
import Flex from '../flex';

var Pagination = function (_React$Component) {
    _inherits(Pagination, _React$Component);

    function Pagination(props) {
        _classCallCheck(this, Pagination);

        var _this = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, props));

        _this.state = {
            current: props.current
        };
        return _this;
    }

    _createClass(Pagination, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.current !== this.state.current) {
                this.setState({
                    current: nextProps.current
                });
            }
        }
    }, {
        key: 'onChange',
        value: function onChange(p) {
            this.setState({
                current: p
            });
            if (this.props.onChange) {
                this.props.onChange(p);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                className = _props.className,
                style = _props.style,
                mode = _props.mode,
                total = _props.total,
                simple = _props.simple;
            var current = this.state.current;

            var locale = getComponentLocale(this.props, this.context, 'Pagination', function () {
                return require('./locale/zh_CN');
            });
            var prevText = locale.prevText,
                nextText = locale.nextText;

            var markup = React.createElement(
                Flex,
                null,
                React.createElement(
                    Flex.Item,
                    { className: prefixCls + '-wrap-btn ' + prefixCls + '-wrap-btn-prev' },
                    React.createElement(
                        Button,
                        { inline: true, disabled: current <= 1, onClick: function onClick() {
                                return _this2.onChange(current - 1);
                            } },
                        prevText
                    )
                ),
                this.props.children ? React.createElement(
                    Flex.Item,
                    null,
                    this.props.children
                ) : !simple && React.createElement(
                    Flex.Item,
                    { className: prefixCls + '-wrap', 'aria-live': 'assertive' },
                    React.createElement(
                        'span',
                        { className: 'active' },
                        current
                    ),
                    '/',
                    React.createElement(
                        'span',
                        null,
                        total
                    )
                ),
                React.createElement(
                    Flex.Item,
                    { className: prefixCls + '-wrap-btn ' + prefixCls + '-wrap-btn-next' },
                    React.createElement(
                        Button,
                        { inline: true, disabled: current >= total, onClick: function onClick() {
                                return _this2.onChange(_this2.state.current + 1);
                            } },
                        nextText
                    )
                )
            );
            if (mode === 'number') {
                markup = React.createElement(
                    'div',
                    { className: prefixCls + '-wrap' },
                    React.createElement(
                        'span',
                        { className: 'active' },
                        current
                    ),
                    '/',
                    React.createElement(
                        'span',
                        null,
                        total
                    )
                );
            } else if (mode === 'pointer') {
                var arr = [];
                for (var i = 0; i < total; i++) {
                    arr.push(React.createElement(
                        'div',
                        { key: 'dot-' + i, className: classnames(prefixCls + '-wrap-dot', _defineProperty({}, prefixCls + '-wrap-dot-active', i + 1 === current)) },
                        React.createElement('span', null)
                    ));
                }
                markup = React.createElement(
                    'div',
                    { className: prefixCls + '-wrap' },
                    arr
                );
            }
            var cls = classnames(prefixCls, className);
            return React.createElement(
                'div',
                { className: cls, style: style },
                markup
            );
        }
    }]);

    return Pagination;
}(React.Component);

export default Pagination;

Pagination.defaultProps = {
    prefixCls: 'am-pagination',
    mode: 'button',
    current: 1,
    total: 0,
    simple: false,
    onChange: function onChange() {}
};
Pagination.contextTypes = {
    antLocale: PropTypes.object
};