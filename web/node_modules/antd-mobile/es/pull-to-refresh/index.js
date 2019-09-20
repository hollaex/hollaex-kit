import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import RPullToRefresh from 'rmc-pull-to-refresh';
import { getComponentLocale } from '../_util/getLocale';
import Icon from '../icon';

var PullToRefresh = function (_React$Component) {
    _inherits(PullToRefresh, _React$Component);

    function PullToRefresh() {
        _classCallCheck(this, PullToRefresh);

        return _possibleConstructorReturn(this, (PullToRefresh.__proto__ || Object.getPrototypeOf(PullToRefresh)).apply(this, arguments));
    }

    _createClass(PullToRefresh, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:variable-name
            var _getComponentLocale = getComponentLocale(this.props, this.context, 'PullToRefresh', function () {
                return require('./locale/zh_CN');
            }),
                activateText = _getComponentLocale.activateText,
                deactivateText = _getComponentLocale.deactivateText,
                finishText = _getComponentLocale.finishText;

            var ind = _extends({ activate: activateText, deactivate: deactivateText, release: React.createElement(Icon, { type: 'loading' }), finish: finishText }, this.props.indicator);
            return React.createElement(RPullToRefresh, _extends({}, this.props, { indicator: ind }));
        }
    }]);

    return PullToRefresh;
}(React.Component);

export default PullToRefresh;

PullToRefresh.defaultProps = {
    prefixCls: 'am-pull-to-refresh'
};
PullToRefresh.contextTypes = {
    antLocale: PropTypes.object
};