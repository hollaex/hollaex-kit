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

var _Indexed = require('./Indexed');

var _Indexed2 = _interopRequireDefault(_Indexed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ListView = function (_React$Component) {
    (0, _inherits3['default'])(ListView, _React$Component);

    function ListView() {
        (0, _classCallCheck3['default'])(this, ListView);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).apply(this, arguments));

        _this.scrollTo = function () {
            var _this$listviewRef;

            return (_this$listviewRef = _this.listviewRef).scrollTo.apply(_this$listviewRef, arguments);
        };
        _this.getInnerViewNode = function () {
            return _this.listviewRef.getInnerViewNode();
        };
        return _this;
    }

    (0, _createClass3['default'])(ListView, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _handleProps = (0, _handleProps3['default'])(this.props, false),
                restProps = _handleProps.restProps,
                extraProps = _handleProps.extraProps;

            return _react2['default'].createElement(_rmcListView2['default'], (0, _extends3['default'])({ ref: function ref(el) {
                    return _this2.listviewRef = el;
                } }, restProps, extraProps));
        }
    }]);
    return ListView;
}(_react2['default'].Component);

exports['default'] = ListView;

ListView.defaultProps = {
    prefixCls: 'am-list-view',
    listPrefixCls: 'am-list'
};
ListView.DataSource = _rmcListView2['default'].DataSource;
ListView.IndexedList = _Indexed2['default'];
module.exports = exports['default'];