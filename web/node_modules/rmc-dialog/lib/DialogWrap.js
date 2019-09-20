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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Dialog = require('./Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
var IS_REACT_16 = !!_reactDom2['default'].createPortal;
var CAN_USE_DOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var DialogWrap = function (_React$Component) {
    (0, _inherits3['default'])(DialogWrap, _React$Component);

    function DialogWrap() {
        (0, _classCallCheck3['default'])(this, DialogWrap);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (DialogWrap.__proto__ || Object.getPrototypeOf(DialogWrap)).apply(this, arguments));

        _this.saveRef = function (node) {
            if (IS_REACT_16) {
                _this._component = node;
            }
        };
        _this.getComponent = function (visible) {
            var props = (0, _extends3['default'])({}, _this.props);
            ['visible', 'onAnimateLeave'].forEach(function (key) {
                if (props.hasOwnProperty(key)) {
                    delete props[key];
                }
            });
            return _react2['default'].createElement(_Dialog2['default'], (0, _extends3['default'])({}, props, { visible: visible, onAnimateLeave: _this.removeContainer, ref: _this.saveRef }));
        };
        _this.removeContainer = function () {
            if (_this.container) {
                if (!IS_REACT_16) {
                    _reactDom2['default'].unmountComponentAtNode(_this.container);
                }
                _this.container.parentNode.removeChild(_this.container);
                _this.container = null;
            }
        };
        _this.getContainer = function () {
            if (!_this.container) {
                var container = document.createElement('div');
                var containerId = _this.props.prefixCls + '-container-' + new Date().getTime();
                container.setAttribute('id', containerId);
                document.body.appendChild(container);
                _this.container = container;
            }
            return _this.container;
        };
        return _this;
    }

    (0, _createClass3['default'])(DialogWrap, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.visible) {
                this.componentDidUpdate();
            }
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(_ref) {
            var visible = _ref.visible;

            return !!(this.props.visible || visible);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.props.visible) {
                if (!IS_REACT_16) {
                    this.renderDialog(false);
                } else {
                    // TODO for react@16 createPortal animation
                    this.removeContainer();
                }
            } else {
                this.removeContainer();
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (!IS_REACT_16) {
                this.renderDialog(this.props.visible);
            }
        }
    }, {
        key: 'renderDialog',
        value: function renderDialog(visible) {
            _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, this.getComponent(visible), this.getContainer());
        }
    }, {
        key: 'render',
        value: function render() {
            if (!CAN_USE_DOM) {
                return null;
            }
            var visible = this.props.visible;

            if (IS_REACT_16 && (visible || this._component)) {
                return _reactDom2['default'].createPortal(this.getComponent(visible), this.getContainer());
            }
            return null;
        }
    }]);
    return DialogWrap;
}(_react2['default'].Component);

exports['default'] = DialogWrap;

DialogWrap.defaultProps = {
    visible: false,
    prefixCls: 'rmc-dialog',
    onClose: noop
};
module.exports = exports['default'];