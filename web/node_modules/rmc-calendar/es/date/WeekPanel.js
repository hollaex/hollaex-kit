import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import * as React from 'react';

var WeekPanel = function (_React$PureComponent) {
    _inherits(WeekPanel, _React$PureComponent);

    function WeekPanel(props) {
        _classCallCheck(this, WeekPanel);

        return _possibleConstructorReturn(this, _React$PureComponent.call(this, props));
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

export default WeekPanel;