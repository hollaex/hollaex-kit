/* global $, hljs, NumericInput */
import React    from "react"
import ReactDOM from "react-dom"
import Demo     from "./Demo"
// import NumericInput from '../index.js';


$(function() {
    $('script.jsx').each(function(i, s) {
        var div   = $('<div/>'),
            props = Function('return (' + $(s).text() + ')')();
        $(s).replaceWith(div);
        var widget = ReactDOM.render(
            React.createElement(NumericInput, props),
            div[0]
        );
        div.data("widget", widget)
    });

    ReactDOM.render(<Demo/>, $('.demo')[0]);

    hljs.configure({ useBR : false });

    $('.code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
});
