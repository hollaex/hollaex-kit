'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcListView = require('rmc-list-view');

var _rmcListView2 = _interopRequireDefault(_rmcListView);

var _handleProps2 = require('./handleProps');

var _handleProps3 = _interopRequireDefault(_handleProps2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var IndexedList = _rmcListView2['default'].IndexedList;

var MIndexedList = function (_React$Component) {
    (0, _inherits3['default'])(MIndexedList, _React$Component);

    function MIndexedList() {
        (0, _classCallCheck3['default'])(this, MIndexedList);
        return (0, _possibleConstructorReturn3['default'])(this, (MIndexedList.__proto__ || Object.getPrototypeOf(MIndexedList)).apply(this, arguments));
    }

    (0, _createClass3['default'])(MIndexedList, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                listPrefixCls = _props.listPrefixCls;

            var _handleProps = (0, _handleProps3['default'])(this.props, true),
                restProps = _handleProps.restProps,
                extraProps = _handleProps.extraProps;

            return _react2['default'].createElement(
                IndexedList,
                (0, _extends3['default'])({ ref: function ref(el) {
                        return _this2.indexedListRef = el;
                    }, sectionHeaderClassName: prefixCls + '-section-header ' + listPrefixCls + '-body', sectionBodyClassName: prefixCls + '-section-body ' + listPrefixCls + '-body' }, restProps, extraProps),
                this.props.children
            );
        }
    }]);
    return MIndexedList;
}(_react2['default'].Component);

exports['default'] = MIndexedList;

MIndexedList.defaultProps = {
    prefixCls: 'am-indexed-list',
    listPrefixCls: 'am-list',
    listViewPrefixCls: 'am-list-view'
};
module.exports = exports['default'];