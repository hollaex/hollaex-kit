const lib = require("../lib");

const PAUSE = 50;

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

// =============================================================================
// TESTS
// =============================================================================

exports["Allow initial value above `max`"] = browser => {
    lib.createNumericInput(browser, { max: 10, value: 50 });
    browser.assert.value(".react-numeric-input input", "50");
};

exports["Disallow initial value above `max` in strict mode"] = browser => {
    lib.createNumericInput(browser, { max: 10, value: 50, strict: true });
    browser.assert.value(".react-numeric-input input", "10");
};

exports["Allow initial value below `min`"] = browser => {
    lib.createNumericInput(browser, { min: -10, value: -50 });
    browser.assert.value(".react-numeric-input input", "-50");
};

exports["Disallow initial value below `min` in strict mode"] = browser => {
    lib.createNumericInput(browser, { min: -10, value: -50, strict: true });
    browser.assert.value(".react-numeric-input input", "-10");
};

exports["If below `min` and the down button is clicked jump to min"] = browser => {
    lib.createNumericInput(browser, { min: -10, value: -50 });
    browser.click(".react-numeric-input b:last-of-type");
    browser.assert.value(".react-numeric-input input", "-10");
};

exports["If below `min` and the down button is clicked in strict mode stay at min"] = browser => {
    lib.createNumericInput(browser, { min: -10, value: -50, strict: true });
    browser.click(".react-numeric-input b:last-of-type");
    browser.assert.value(".react-numeric-input input", "-10");
};

exports["If below `min` and the up button is clicked jump to min"] = browser => {
    lib.createNumericInput(browser, { min: -10, value: -50 });
    browser.click(".react-numeric-input b:first-of-type");
    browser.assert.value(".react-numeric-input input", "-10");
};

exports["If below `min` and the up button is clicked in strict mode jump to min + step"] = browser => {
    lib.createNumericInput(browser, { min: -10, value: -50, strict: true });
    browser.click(".react-numeric-input b:first-of-type");
    // browser.getValue(".react-numeric-input input", result => console.log(result))
    browser.assert.value(".react-numeric-input input", "-9");
};

exports["If above `max` and the down button is clicked jump to max"] = browser => {
    lib.createNumericInput(browser, { max: 10, value: 50 });
    browser.click(".react-numeric-input b:last-of-type");
    browser.assert.value(".react-numeric-input input", "10");
};

exports["If above `max` and the down button is clicked in strict jump to max - step"] = browser => {
    lib.createNumericInput(browser, { max: 10, value: 50, strict: true });
    browser.click(".react-numeric-input b:last-of-type");
    browser.assert.value(".react-numeric-input input", "9");
};

exports["If above `max` and the up button is clicked jump to max"] = browser => {
    lib.createNumericInput(browser, { max: 10, value: 50 });
    browser.click(".react-numeric-input b:first-of-type");
    browser.assert.value(".react-numeric-input input", "10");
};

exports["If above `max` and the up button is clicked in strict mode stay at max"] = browser => {
    lib.createNumericInput(browser, { max: 10, value: 50, strict: true });
    browser.click(".react-numeric-input b:first-of-type");
    browser.assert.value(".react-numeric-input input", "10");
};

exports["Fire onChange for correcting the values onBlur"] = browser => {
    browser.execute(
        `
        function onChange(num, text) {
            document.getElementById("log").value += "[" + num + "," + text + "]";
        }
        ReactDOM.render(
            React.createElement(
                "div",
                null,
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        onChange: onChange,
                        min: 100,
                        className: "form-control"
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.pause(PAUSE);
    browser.keys(["1"]);
    browser.expect.element('#log').value.to.equal('[1,1]');
    browser.pause(PAUSE);
    browser.keys(["0"]);
    browser.expect.element('#log').value.to.equal('[1,1][10,10]');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.TAB]);
    browser.expect.element('#log').value.to.equal('[1,1][10,10][100,100]');
};

(function() {
    const map = [
        {
            propName: "name",
            map: [
                { in: ""       , out: ""    },
                { in: "a"      , out: "a"   },
                { in: "b"      , out: "b"   },
                { in: null     , out: ""    },
                { in: undefined, out: ""    },
                { in: 123      , out: "123" }
            ]
        },
        {
            propName: "disabled",
            bool: true,
            map: [
                { in: null     , out: false },
                { in: undefined, out: false },
                { in: true     , out: true  },
                { in: false    , out: false }
            ]
        },
        {
            propName: "required",
            bool: true,
            map: [
                { in: null     , out: false },
                { in: undefined, out: false },
                { in: true     , out: true  },
                { in: false    , out: false }
            ]
        },
        {
            propName: "maxLength",
            attrName: "maxlength",
            map: [
                { in: 1        , out: 1      },
                { in: 2        , out: 2      }
            ]
        },
        {
            propName: "className",
            attrName: "class",
            map: [
                { in: ""       , out: ""    },
                { in: "a"      , out: "a"   },
                { in: "b"      , out: "b"   },
                { in: null     , out: ""    },
                { in: undefined, out: ""    }
            ]
        },
        {
            propName: "readOnly",
            attrName: "readonly",
            bool: true,
            map: [
                { in: null     , out: false },
                { in: undefined, out: false },
                { in: true     , out: true  },
                { in: false    , out: false }
            ]
        },
        {
            propName: "noValidate",
            bool: true,
            map: [
                { in: "novalidate", out: true },
                { in: "whatever-string", out: true },
                { in: null     , out: false },
                { in: undefined, out: false },
                { in: true     , out: true  },
                { in: false    , out: false }
            ]
        },
        {
            propName: "pattern",
            map: [
                { in: ""       , out: ".*"  },
                { in: "a"      , out: "a"   },
                { in: "b"      , out: "b"   },
                { in: null     , out: ".*"  },
                { in: undefined, out: ".*"  }
            ]
        },
        {
            propName: "title",
            map: [
                { in: ""       , out: ""    },
                { in: "a"      , out: "a"   },
                { in: "b"      , out: "b"   },
                { in: null     , out: ""    },
                { in: undefined, out: ""    },
                { in: 123      , out: "123" }
            ]
        },
        {
            propName: "size",
            map: [
                { in: 1        , out: 1    },
                { in: 2        , out: 2    }
            ]
        },
        {
            propName: "value",
            map: [
                { in: ""       , out: ""    },
                { in: "a"      , out: ""    },
                { in: "b"      , out: ""    },
                { in: null     , out: ""    },
                { in: undefined, out: ""    },
                { in: 123      , out: "123" }
            ]
        },
        {
            propName: "defaultValue",
            attrName: "value",
            map: [
                { in: ""       , out: ""    },
                { in: "a"      , out: ""    },
                { in: "b"      , out: ""    },
                { in: null     , out: ""    },
                { in: undefined, out: ""    },
                { in: 123      , out: "123" }
            ]
        }
    ];

    map.forEach(meta => {
        meta.map.forEach(data => {
            let field =  meta.attrName || meta.propName;
            exports["props." + meta.propName] = browser => {
                lib.createNumericInput(browser, { [meta.propName]: data.in });
                // browser.getValue(".react-numeric-input input", result => console.log(result))
                if ("disabled" == field) {
                    if (meta.out) {
                        browser.expect.element('#main').to.not.be.enabled;
                    }
                    else {
                        browser.expect.element('#main').to.be.enabled;
                    }
                }
                else if (meta.bool) {
                    if (meta.out) {
                        browser.expect.element(".react-numeric-input input")
                            .to.have.attribute(field)
                    }
                    else {
                        browser.expect.element(".react-numeric-input input")
                            .to.not.have.attribute(field)
                    }
                }
                else {
                    browser.expect.element(".react-numeric-input input")
                        .to.have.attribute(field).equals(data.out);
                }
            };
        });
    });
})();

exports['prop.step'] = browser => {
    // console.log(browser.Keys)
    lib.createNumericInput(browser, { precision: 2, value: 5, step: 0.25 });
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.assert.value(".react-numeric-input input", "5.00");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.assert.value(".react-numeric-input input", "5.25");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.assert.value(".react-numeric-input input", "5.50");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.assert.value(".react-numeric-input input", "5.25");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.assert.value(".react-numeric-input input", "5.00");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.assert.value(".react-numeric-input input", "4.75");
};

exports['prop.min in strict mode'] = browser => {
    lib.createNumericInput(browser, { min: 2, value: 3, strict: true });
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.assert.value(".react-numeric-input input", "3");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.assert.value(".react-numeric-input input", "2");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.assert.value(".react-numeric-input input", "2");
};

exports['prop.min in loose mode'] = browser => {
    lib.createNumericInput(browser, { min: 2, value: 3 });
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.assert.value(".react-numeric-input input", "3");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.assert.value(".react-numeric-input input", "2");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.assert.value(".react-numeric-input input", "2");
};

exports['prop.max in strict mode'] = browser => {
    lib.createNumericInput(browser, { max: 4, value: 3, strict: true });
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.assert.value(".react-numeric-input input", "3");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.assert.value(".react-numeric-input input", "4");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.assert.value(".react-numeric-input input", "4");
};

exports['prop.max in loose mode'] = browser => {
    lib.createNumericInput(browser, { max: 4, value: 3 });
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.assert.value(".react-numeric-input input", "3");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.assert.value(".react-numeric-input input", "4");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.assert.value(".react-numeric-input input", "4");
};

exports['prop.precision prop in loose mode'] = browser => {
    lib.createNumericInput(browser, { precision: 2, value: 5 });
    browser.assert.value(".react-numeric-input input", "5.00");
};

exports['prop.precision prop in strict mode'] = browser => {
    lib.createNumericInput(browser, { precision: 2, value: 5, strict: true });
    browser.assert.value(".react-numeric-input input", "5.00");
};

exports['Can disable inline styles'] = browser => {
    lib.createNumericInput(browser, { style: false });
    browser.execute(
        `return document.getElementById("main").innerHTML`,
        [],
        html => {
            // console.log(html)
            if (html.value.search(/\bstyle=\b/) > -1) {
                throw new Error("style=false did not work as expected");
            }
        }
    )
};

exports['props.autoFocus'] = browser => {
    lib.createNumericInput(browser, { autoFocus: true });
    browser.elementActive(activeElement => {
        browser.element('css selector', ".react-numeric-input input", input => {
            if (input.value.ELEMENT !== activeElement.value.ELEMENT) {
                throw new Error("The element was not auto-focused");
            }
        });
    });
};

exports['props.snap'] = browser => {
    const tests = [
        [0.2  , browser.Keys.ARROW_UP  , "0.5"  ], //  0.2  + 0.5 =  0.5
        [0.3  , browser.Keys.ARROW_UP  , "1.0"  ], //  0.3  + 0.5 =  1.0
        [0.5  , browser.Keys.ARROW_UP  , "1.0"  ], //  0.5  + 0.5 =  1.0
        [0.6  , browser.Keys.ARROW_UP  , "1.0"  ], //  0.6  + 0.5 =  1.0
        [0.9  , browser.Keys.ARROW_UP  , "1.5"  ], //  0.9  + 0.5 =  1.5
        [1.1  , browser.Keys.ARROW_UP  , "1.5"  ], //  1.1  + 0.5 =  1.5
        [9.1  , browser.Keys.ARROW_UP  , "9.5"  ], //  9.1  + 0.5 =  9.5
        [9.3  , browser.Keys.ARROW_UP  , "10.0" ], //  9.3  + 0.5 =  10.0
        [11.1 , browser.Keys.ARROW_UP  , "10.0" ], //  11.1 + 0.5 =  10.0 (<= max)
        [11.1 , browser.Keys.ARROW_DOWN, "10.0" ], //  11.1 - 0.5 =  10.0 (<= max)
        [1.1  , browser.Keys.ARROW_DOWN, "0.5"  ], //  1.1  - 0.5 =  0.5
        [0.3  , browser.Keys.ARROW_DOWN, "0.0"  ], //  0.3  - 0.5 =  0.0
        [0.1  , browser.Keys.ARROW_DOWN, "-0.5" ], //  0.1  - 0.5 = -0.5
        [-1.1 , browser.Keys.ARROW_DOWN, "-1.5" ], // -1.1  - 0.5 = -1.5
        [-1.4 , browser.Keys.ARROW_DOWN, "-2.0" ], // -1.4  - 0.5 = -2.0
        [-10.4, browser.Keys.ARROW_DOWN, "-10.0"], // -10.4 - 0.5 = -2.0 (>= min)
        [-10.4, browser.Keys.ARROW_UP  , "-10.0"], // -10.4 + 0.5 = -2.0 (>= min)
        [-8.4 , browser.Keys.ARROW_UP  , "-8.0" ]  // -8.4  + 0.5 = -8.0
    ];

    tests.forEach(([inputValue, key, result]) => {
        lib.createNumericInput(browser, {
            min: -10,
            max: 10,
            step: 0.5,
            precision: 1,
            value: inputValue,
            snap: true,
            strict: false
        });
        browser.execute('$(".react-numeric-input input").focus();', [])
        browser.pause(PAUSE);
        browser.keys([key]);
        browser.assert.value(".react-numeric-input input", result);

        lib.createNumericInput(browser, {
            min: -10,
            max: 10,
            step: 0.5,
            precision: 1,
            value: inputValue,
            snap: true,
            strict: true
        });
        browser.execute('$(".react-numeric-input input").focus();', []);
        browser.pause(PAUSE);
        browser.keys([key]);
        browser.assert.value(".react-numeric-input input", result);
    });
};

exports['props.onFocus'] = browser => {
    browser.execute(
        `
        function onFocus(e) {
            document.getElementById("log").value += e.target.name + ",";
        }

        ReactDOM.render(
            React.createElement(
                "div",
                null,
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        onFocus: onFocus,
                        name: "test"
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.expect.element('#log').value.to.equal('');
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.expect.element('#log').value.to.equal('test,');
    browser.pause(PAUSE);
    browser.execute('$(".react-numeric-input input").blur();', []);
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.expect.element('#log').value.to.equal('test,test,');
};

exports['props.onBlur'] = browser => {
    browser.execute(
        `
        function onBlur(e) {
            document.getElementById("log").value += e.target.name + ",";
        }

        ReactDOM.render(
            React.createElement(
                "div",
                null,
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        onBlur: onBlur,
                        name: "test"
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.pause(PAUSE);
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.expect.element('#log').value.to.equal('');
    browser.execute('$(".react-numeric-input input").blur();', []);
    browser.pause(PAUSE);
    browser.expect.element('#log').value.to.equal('test,');
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.execute('$(".react-numeric-input input").blur();', []);
    browser.pause(PAUSE);
    browser.expect.element('#log').value.to.equal('test,test,');
};

exports["Should not fire onChange when re-rendered with different value"] = browser => {
    browser.execute(
        `
        function onChange() {
            document.getElementById("log").value += "*";
        }

        class ParentComponent extends React.Component {
            constructor(props) {
                super(props)
                this.state = { value: 1 };
            }
            render() {
                return React.createElement(
                    "div",
                    null,
                    [
                        React.createElement("input", {
                            type: "text",
                            id: "log",
                            onClick: () => {
                                this.setState({ value: this.state.value + 1 });
                            }
                        }),
                        React.createElement(NumericInput, {
                            value: this.state.value,
                            onChange: onChange
                        })
                    ]
                );
            }
        }

        ReactDOM.render(
            React.createElement(ParentComponent, {}),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    // browser.execute('$(".react-numeric-input input").focus();', [])
    browser.expect.element('#log').value.to.equal('');
    browser.pause(PAUSE);
    browser.click("#log");
    browser.assert.value(".react-numeric-input input", "2");
    browser.expect.element('#log').value.to.equal('');
};

exports["Calls it's onKeyDown callback and makes the event cancelable"] = browser => {
    browser.execute(
        `
        var hits = 0;
        function onKeyDown(e) {
            document.getElementById("log").value += e.target.name + ",";
            if (++hits > 2) {
                e.preventDefault();
            }
        }

        ReactDOM.render(
            React.createElement(
                "div",
                null,
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        value: 0,
                        onKeyDown: onKeyDown,
                        name: "test"
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.expect.element('#log').value.to.equal('');
    browser.expect.element('.react-numeric-input input').value.to.equal('0');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('#log').value.to.equal('test,');
    browser.expect.element('.react-numeric-input input').value.to.equal('1');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('#log').value.to.equal('test,test,');
    browser.expect.element('.react-numeric-input input').value.to.equal('2');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('#log').value.to.equal('test,test,test,');
    browser.expect.element('.react-numeric-input input').value.to.equal('2');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('#log').value.to.equal('test,test,test,test,');
    browser.expect.element('.react-numeric-input input').value.to.equal('2');
};

exports["supports dynamic max"] = browser => {
    browser.execute(
        `
        window.max = 3;
        ReactDOM.render(
            React.createElement(NumericInput, {
                max: function() { return max; },
                value: 1
            }),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.expect.element('.react-numeric-input input').value.to.equal('1');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('.react-numeric-input input').value.to.equal('2');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('.react-numeric-input input').value.to.equal('3');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('.react-numeric-input input').value.to.equal('3');
    browser.execute('window.max = 4;', []);
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('.react-numeric-input input').value.to.equal('4');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_UP]);
    browser.expect.element('.react-numeric-input input').value.to.equal('4');
};

// =============================================================================
// CUSTOM TESTS FOR ISSUES AND BUG FIXES
// =============================================================================

/**
 * Assert that the user can type a value lower than the current "min" (or
 * higher than the current max).
 * @see https://github.com/vlad-ignatov/react-numeric-input/issues/19
 */
exports['Can type in out of bounds value'] = browser => {
    lib.createNumericInput(browser, { min: 100, max: 200 });
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.pause(PAUSE);
    browser.keys(["1"]);
    browser.assert.value(".react-numeric-input input", "1");
    browser.pause(PAUSE);
    browser.keys(["0"]);
    browser.assert.value(".react-numeric-input input", "10");
    browser.pause(PAUSE);
    browser.keys(["0"]);
    browser.assert.value(".react-numeric-input input", "100");
    browser.pause(PAUSE);
    browser.keys(["0"]);
    browser.assert.value(".react-numeric-input input", "1000");
};

/**
 * "There is also a bug when using min property with onChange event. When
 * you have for ex. min=100 and type 1 into input - it gets changed to 100
 * but onChange is fired only for typing 1, not on changing to 100."
 * @see https://github.com/vlad-ignatov/react-numeric-input/issues/19
 */
exports['onChange gets called properly with `min`'] = browser => {

    // LOOSE
    browser.execute(
        `
        function onChange(num, text) {
            document.getElementById("log").value += "[" + num + "," + text + "]";
        }
        ReactDOM.render(
            React.createElement(
                "div",
                { key: "test-19-1" },
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        onChange: onChange,
                        min: 100,
                        className: "form-control"
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.pause(PAUSE);
    browser.keys(["1"]);
    browser.expect.element('#log').value.to.equal('[1,1]');

    // STRICT
    browser.execute(
        `
        function onChange(num, text) {
            document.getElementById("log").value += "[" + num + "," + text + "]";
        }
        ReactDOM.render(
            React.createElement(
                "div",
                { key: "test-19-2" },
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        onChange: onChange,
                        min: 100,
                        className: "form-control",
                        strict: true
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.pause(PAUSE);
    browser.keys(["1"]);
    // browser.getValue("#log", result => console.log(result))
    browser.expect.element('#log').value.to.equal('[100,100]');
};

/**
 * onChange gets called when input content is deleted
 * @see https://github.com/vlad-ignatov/react-numeric-input/issues/27
 */
exports['onChange gets called when input content is deleted'] = browser => {
    browser.execute(
        `
        function onChange(num, text) {
            document.getElementById("log").value += "[" + num + "," + text + "]";
        }
        ReactDOM.render(
            React.createElement(
                "div",
                null,
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        onChange: onChange
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.pause(PAUSE);
    browser.keys(["1"]);
    browser.expect.element('#log').value.to.equal('[1,1]');
    browser.pause(PAUSE);
    browser.keys(["0"]);
    browser.expect.element('#log').value.to.equal('[1,1][10,10]');
    browser.pause(PAUSE);
    browser.execute('$(".react-numeric-input input").select();', [])
    browser.keys([browser.Keys.DELETE]);
    // browser.getValue("#log", result => console.log(result))
    browser.expect.element('#log').value.to.equal('[1,1][10,10][null,]');
};

/**
 * The field should accept "-.", "+.", ".", "-", and "+" at beginning of input value.
 * @see https://github.com/vlad-ignatov/react-numeric-input/pull/48/commits/b01f1f9b61c86a9f3a72088f4f82279370e7155a
 */
exports['The field should accept "-.", "+.", ".", "-", and "+" at beginning of input value'] = browser => {
    lib.createNumericInput(browser, { min: -10, max: 10 });
    browser.execute('$(".react-numeric-input input").focus();', []);
    ["-.", "+.", ".", "-", "+"].forEach(value => {
        browser.clearValue(".react-numeric-input input");
        browser.pause(PAUSE);
        browser.keys([value]);
        browser.assert.value(".react-numeric-input input", value);
    });
};

exports["If initialized with out of bounds value and changed to another one must trigger onChange only once"] = browser => {
    browser.execute(
        `
        function onChange(num, text) {
            document.getElementById("log").value += "[" + num + "," + text + "]";
        }
        ReactDOM.render(
            React.createElement(
                "div",
                null,
                [
                    React.createElement("input", { type: "text", id: "log" }),
                    React.createElement(NumericInput, {
                        onChange: onChange,
                        min: -10,
                        max: 10,
                        value: 50
                    })
                ]
            ),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.expect.element('#log').value.to.equal('');
    browser.expect.element('.react-numeric-input input').value.to.equal('50');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.expect.element('#log').value.to.equal('[10,10]');
    browser.expect.element('.react-numeric-input input').value.to.equal('10');
    browser.pause(PAUSE);
    browser.keys([browser.Keys.ARROW_DOWN]);
    browser.expect.element('#log').value.to.equal('[10,10][9,9]');
    browser.expect.element('.react-numeric-input input').value.to.equal('9');
};

exports["Can type arbitrary text in loose mode"] = browser => {
    lib.createNumericInput(browser, {});
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.pause(PAUSE);
    browser.keys(["t", "e", "s", "t"]);
    browser.assert.value(".react-numeric-input input", "test");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.TAB]);
    browser.assert.value(".react-numeric-input input", "");
};

exports["Can NOT type arbitrary text in strict mode"] = browser => {
    lib.createNumericInput(browser, { strict: true });
    browser.execute('$(".react-numeric-input input").focus();', [])
    browser.pause(PAUSE);
    browser.keys(["t", "e", "s", "t"]);
    // browser.getValue(".react-numeric-input input", result => console.log(result))
    browser.assert.value(".react-numeric-input input", "0");
    browser.pause(PAUSE);
    browser.keys([browser.Keys.TAB]);
    browser.assert.value(".react-numeric-input input", "0");
};

/**
 * @see https://github.com/vlad-ignatov/react-numeric-input/issues/41
 */
exports["Does not reset the input value on re-render"] = browser => {
    browser.execute(
        `
        function onChange() {
            document.getElementById("log").value += "*";
        }

        class ParentComponent extends React.Component {
            constructor(props) {
                super(props)
                this.state = { value: 1 };
            }
            render() {
                return React.createElement(
                    "div",
                    null,
                    [
                        React.createElement("input", {
                            type: "text",
                            id: "log",
                            onClick: () => {
                                this.setState({ value: this.state.value + 1 });
                            }
                        }),
                        React.createElement(NumericInput)
                    ]
                );
            }
        }

        ReactDOM.render(
            React.createElement(ParentComponent),
            document.getElementById("main")
        )`,
        []
    );
    browser.waitForElementPresent(".react-numeric-input", 500);
    browser.execute('$(".react-numeric-input input").focus();', []);
    browser.pause(PAUSE);
    browser.keys(browser.Keys.ARROW_UP);
    browser.assert.value(".react-numeric-input input", "1");
    browser.click("#log");
    browser.assert.value(".react-numeric-input input", "1");
};

/**
 * @see https://github.com/vlad-ignatov/react-numeric-input/issues/21
 * Answer: dynamic precision (no precision) as bad idea since for example
 * in JS 0.2 + 0.4 = 0.6000000000000001
 * For better results use something like:
 * <NumericInput format={ parseFloat } precision={10}/>
 */
// exports['supports dynamic precision'] = browser => {
//     browser.execute(
//         `
//         ReactDOM.render(
//             React.createElement(NumericInput, {}),
//             document.getElementById("main")
//         )`,
//         []
//     );
//     browser.execute('$(".react-numeric-input input").focus();', []);
//     // console.log(browser.Keys)
//     browser.setValue(".react-numeric-input input", "1.25");
//     browser.getValue(".react-numeric-input input", result => console.log(result))
//     // browser.assert.value(".react-numeric-input input", "1.25");
//     // browser.clearValue(".react-numeric-input input");
//     // browser.getValue(".react-numeric-input input", result => console.log(result))
//     // browser.keys(["1", ".", "5"]);
//     // browser.getValue(".react-numeric-input input", result => console.log(result))
//     // browser.assert.value(".react-numeric-input input", "1.5");
// };
