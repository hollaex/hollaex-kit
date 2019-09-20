/* global __dirname */
const path = require("path");
const MAIN_ID = "main";

let key = 0;
exports.createNumericInput = function(browser, props={}) {
    props.key = key++;
    browser.execute(
        `ReactDOM.render(
            React.createElement(NumericInput, ${JSON.stringify(props)}),
            document.getElementById("${MAIN_ID}")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
}

exports.focusWindow = browser => {
    browser.window_handles(function(result) {
        var handle = result.value[0];
        browser.switchWindow(handle);
    });
};

exports.openHTML = (browser, done) => {
    browser.url("file://" + path.resolve(__dirname, "../tests/index.html"), () => {
        browser.waitForElementPresent(`"#${MAIN_ID}"`, 500, true, done);
    });

};

exports.clearHTML = browser => {
    browser.execute(`document.getElementById("${MAIN_ID}").innerHTML = "";`, []);
};