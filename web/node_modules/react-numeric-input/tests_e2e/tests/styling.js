const lib = require("../lib");

const PAUSE = 100;

exports.before = (browser, done) => {
    lib.focusWindow(browser);
    lib.openHTML(browser, done);
};

exports.after = browser => {
    browser.pause(PAUSE);
    browser.end();
};

exports.beforeEach = browser => {
    browser.pause(PAUSE);
    lib.clearHTML(browser);
};

function expectComputedStyle(browser, selector, propName, propValue) {
    browser.element('css selector', selector, function(result) {
        let id = result.value.ELEMENT;
        browser.elementIdCssProperty(id, "font-style", result2 => {
            if (result2.value !== propValue) {
                throw `Expected the ${propName} style property of ${selector} to equal ${propValue} but was ${result2.value}`;
            }
        });
    });
}

exports['can set wrapper styles'] = browser => {
    lib.createNumericInput(browser, {
        value: 10,
        style: {
            wrap: {
                fontStyle: 'italic'
            }
        }
    });
    expectComputedStyle(browser, '.react-numeric-input', "font-style", "italic");
};

exports['can set input styles'] = browser => {
    lib.createNumericInput(browser, {
        value: 10,
        style: {
            input: {
                fontStyle: 'italic'
            }
        }
    });
    expectComputedStyle(browser, '.react-numeric-input input', "font-style", 'italic');
};

exports['can set btnUp styles'] = browser => {
    lib.createNumericInput(browser, {
        style: {
            btnUp: {
                fontStyle: 'italic'
            }
        }
    });
    expectComputedStyle(browser, '.react-numeric-input b:first-of-type', "font-style", 'italic');
};

exports['can set btnDown styles'] = browser => {
    lib.createNumericInput(browser, {
        style: {
            btnDown: {
                fontStyle: 'italic'
            }
        }
    });

    expectComputedStyle(browser, '.react-numeric-input b:last-of-type', "font-style", 'italic');
};

exports['can set arrowDown styles'] = browser => {
    lib.createNumericInput(browser, {
        style: {
            arrowDown: {
                fontStyle: 'italic'
            }
        }
    });
    expectComputedStyle(browser, '.react-numeric-input b:last-of-type i', "font-style", 'italic');
};

exports['can set arrowUp styles'] = browser => {
    lib.createNumericInput(browser, {
        style: {
            arrowUp: {
                fontStyle: 'italic'
            }
        }
    });
    expectComputedStyle(browser, '.react-numeric-input b:first-of-type i', "font-style", 'italic');
};

exports['can set btn:state styles'] = browser => {
    const colorNormal = 'rgb(200, 200, 200)';
    const colorHover  = 'rgb(255, 50, 50)';
    const colorActive = 'rgb(50, 255, 50)';
    lib.createNumericInput(browser, {
        style: {
            'btn'         : { background: colorNormal },
            'btn:hover'   : { background: colorHover  },
            'btn:active'  : { background: colorActive },
            'btn:disabled': { background: 'rgb(4, 5, 6)' }
        }
    });

    // normal
    browser.pause(PAUSE);
    expectComputedStyle(browser, '.react-numeric-input b:first-of-type', "background-color", colorNormal);
    expectComputedStyle(browser, '.react-numeric-input b:last-of-type', "background-color", colorNormal );

    // :hover
    browser.pause(PAUSE);
    browser.execute(`$("react-numeric-input b:first-of-type").trigger("mouseenter")`)
    expectComputedStyle(browser, '.react-numeric-input b:first-of-type', "background-color", colorHover);
    expectComputedStyle(browser, '.react-numeric-input b:last-of-type', "background-color", colorNormal);
    browser.pause(PAUSE);
    browser.execute(`$("react-numeric-input b:last-of-type").trigger("mouseenter")`)
    expectComputedStyle(browser, '.react-numeric-input b:first-of-type', "background-color", colorHover);
    expectComputedStyle(browser, '.react-numeric-input b:last-of-type', "background-color", colorHover );

    // :active
    browser.pause(PAUSE);
    browser.execute(`$("react-numeric-input b:first-of-type").trigger("mouseDown")`)
    expectComputedStyle(browser, '.react-numeric-input b:first-of-type', "background-color", colorActive);
    expectComputedStyle(browser, '.react-numeric-input b:last-of-type', "background-color", colorNormal );
    browser.pause(PAUSE);
    browser.execute(`$("react-numeric-input b:last-of-type").trigger("mouseDown")`)
    expectComputedStyle(browser, '.react-numeric-input b:first-of-type', "background-color", colorActive);
    expectComputedStyle(browser, '.react-numeric-input b:last-of-type', "background-color", colorActive );

    // TestUtils.Simulate.mouseDown(btnUpNode);
    // expect(btnUpNode.style.color).toEqual('rgb(3, 4, 5)');
    // TestUtils.Simulate.mouseDown(btnDownNode);
    // expect(btnDownNode.style.color).toEqual('rgb(3, 4, 5)');

    // // :disabled
    // widget = TestUtils.renderIntoDocument(
    //     <NumericInput disabled style={{
    //         'btn'         : { color: 'rgb(1, 2, 3)'},
    //         'btn:hover'   : { color: 'rgb(2, 3, 4)'},
    //         'btn:active'  : { color: 'rgb(3, 4, 5)'},
    //         'btn:disabled': { color: 'rgb(4, 5, 6)'}
    //     }} mobile={false}/>
    // );
    // widgetNode  = ReactDOM.findDOMNode(widget);
    // btnUpNode   = widgetNode.firstChild.nextElementSibling;
    // btnDownNode = widgetNode.lastChild;

    // expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
    // expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
    // TestUtils.Simulate.mouseEnter(btnUpNode);
    // expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
    // TestUtils.Simulate.mouseEnter(btnDownNode);
    // expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
    // TestUtils.Simulate.mouseDown(btnUpNode);
    // expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
    // TestUtils.Simulate.mouseDown(btnDownNode);
    // expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
};
