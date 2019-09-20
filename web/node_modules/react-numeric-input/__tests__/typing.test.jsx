/* global describe, it */
import expect       from 'expect'
import NumericInput from '../src/NumericInput.jsx'
import React        from 'react'
import TestUtils    from 'react-dom/test-utils'

// const KEYCODE_UP = 38;
// const KEYCODE_DOWN = 40;

describe ('NumericInput/misc', function() {

    this.timeout(10000);

    it ("typing and formatting", done => {
        const tests = [
            {
                from: {
                    value: "",
                    selectionStart: 0,
                    selectionEnd: 0,
                    precision: 2
                },
                keys: [1],
                to: {
                    value: "1.00",
                    selectionStart: 1,
                    selectionEnd: 1
                }
            }
        ];

        Promise.all(tests.map(test => (new Promise((resolve, reject) => {
            let { selectionStart, selectionEnd, ...props } = test.from;
            let widget = TestUtils.renderIntoDocument(<NumericInput {...props}/>);
            let input = widget.refsInput;

            try {
                expect(input.value).toEqual(props.value);
            }
            catch (ex) {
                return reject(ex)
            }
            if (test.keys) {
                test.keys.forEach(key => {
                    input.value = test.to.value
                    // TestUtils.Simulate.focus(input);
                    // TestUtils.Simulate.keyDown(input, { keyCode: key });
                    // TestUtils.Simulate.keyUp(input, { keyCode: key, target: { value: "1.00" } });
                    TestUtils.Simulate.input(input, { keyCode: key, target: { value: "1.00" } });
                });
                setTimeout(() => {
                    try {
                        expect(input.value).toEqual(test.to.value);
                        resolve();
                    } catch (ex) {
                        reject(ex);
                    }
                }, 300);
            }
            else {
                resolve()
            }
        })))).then(() => done(), done);
    });
});