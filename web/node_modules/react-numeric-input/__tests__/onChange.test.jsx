/* global describe, it */
import expect       from 'expect'
import NumericInput from '../src/NumericInput.jsx'
import React        from 'react'
import TestUtils    from 'react-dom/test-utils'

const KEYCODE_UP   = 38;
const KEYCODE_DOWN = 40;

describe('NumericInput', function() {

    it('calls onChange when user types in something valid', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        // Press "5"
        widget.refsInput.value = "5"
        TestUtils.Simulate.change(widget.refsInput)

        // Rendering must bring the focus to the input
        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(5)
            done()
        }, 50)
    })

    it('does not call onChange when user types in something invalid', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        // Press "r"
        TestUtils.Simulate.keyDown(widget.refsInput, { keyCode: 114 })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(0)
            expect(lastChange).toEqual(undefined)
            done()
        }, 50)
    })

    it('calls onChange when user the up arrow key', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, { keyCode: KEYCODE_UP })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(1)
            done()
        }, 50)
    })

    it('calls onChange when user the Ctrl+up', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } precision={2} />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, {
            keyCode: KEYCODE_UP,
            ctrlKey: true
        })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(0.1)
            done()
        }, 50)
    })

    it('calls onChange when user the Command+up', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } precision={2} />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, {
            keyCode: KEYCODE_UP,
            metaKey: true
        })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(0.1)
            done()
        }, 50)
    })

    it('calls onChange when user the Shift+up', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } precision={2} />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, {
            keyCode : KEYCODE_UP,
            shiftKey: true
        })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(10)
            done()
        }, 50)
    })

    it('calls onChange when user the down arrow key', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, { keyCode: KEYCODE_DOWN })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(-1)
            done()
        }, 50)
    })

    it('calls onChange when user the Ctrl+down', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } precision={2} />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, {
            keyCode: KEYCODE_DOWN,
            ctrlKey: true
        })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(-0.1)
            done()
        }, 50)
    })

    it('calls onChange when user the Command+down', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } precision={2} />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, {
            keyCode: KEYCODE_DOWN,
            metaKey: true
        })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(-0.1)
            done()
        }, 50)
    })

    it('calls onChange when user the Shift+down', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } precision={2} />
        )

        TestUtils.Simulate.keyDown(widget.refsInput, {
            keyCode : KEYCODE_DOWN,
            shiftKey: true
        })

        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(-10)
            done()
        }, 50)
    })

    it('calls onChange when user hits the up button', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        // Press "5"
        TestUtils.Simulate.mouseDown(widget.refsInput.nextElementSibling)

        // Rendering must bring the focus to the input
        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(1)
            done()
        }, 50)
    })

    it('calls onChange when user hits the down button', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        // Press "5"
        TestUtils.Simulate.mouseDown(widget.refsInput.nextElementSibling.nextElementSibling)

        // Rendering must bring the focus to the input
        setTimeout(() => {
            expect(onChangeCalls).toEqual(1)
            expect(lastChange).toEqual(-1)
            done()
        }, 50)
    })

    it('calls onChange due to auto-increase', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        TestUtils.Simulate.mouseDown(widget.refsInput.nextElementSibling)

        setTimeout(() => {
            expect(onChangeCalls).toEqual(2)
            expect(lastChange).toEqual(2)
            done()
        }, NumericInput.DELAY + Math.round(NumericInput.SPEED/2))
    })

    it('calls onChange due to auto-decrease', (done) => {
        let onChangeCalls = 0
        let lastChange

        function onChange(x) {
            onChangeCalls += 1
            lastChange = x
        }

        let widget = TestUtils.renderIntoDocument(
            <NumericInput onChange={ onChange } />
        )

        TestUtils.Simulate.mouseDown(widget.refsInput.nextElementSibling.nextElementSibling)

        setTimeout(() => {
            expect(onChangeCalls).toEqual(2)
            expect(lastChange).toEqual(-2)
            done()
        }, NumericInput.DELAY + Math.round(NumericInput.SPEED/2))
    })
})
