"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var WeekPanel = function (_React$PureComponent) {
    (0, _inherits3["default"])(WeekPanel, _React$PureComponent);

    function WeekPanel(props) {
        (0, _classCallCheck3["default"])(this, WeekPanel);
        return (0, _possibleConstructorReturn3["default"])(this, _React$PureComponent.call(this, props));
    }

    WeekPanel.prototype.render = function render() {
        var locale = this.props.locale;
        var week = locale.week;

        return React.createElement(
            "div",
            { className: "week-panel" },
            React.createElement(
                "div",
                { className: "cell cell-grey" },
                week[0]
            ),
            React.createElement(
                "div",
                { className: "cell" },
                week[1]
            ),
            React.createElement(
                "div",
                { className: "cell" },
                week[2]
            ),
            React.createElement(
                "div",
                { className: "cell" },
                week[3]
            ),
            React.createElement(
                "div",
                { className: "cell" },
                week[4]
            ),
            React.createElement(
                "div",
                { className: "cell" },
                week[5]
            ),
            React.createElement(
                "div",
                { className: "cell cell-grey" },
                week[6]
            )
        );
    };

    return WeekPanel;
}(React.PureComponent);

exports["default"] = WeekPanel;
module.exports = exports['default'];