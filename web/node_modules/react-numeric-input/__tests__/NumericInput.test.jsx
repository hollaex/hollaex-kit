/* global describe, it */
import expect       from 'expect'
import NumericInput from '../src/NumericInput.jsx'
import React        from 'react'
import ReactDOM     from 'react-dom'
import TestUtils    from 'react-dom/test-utils'

const KEYCODE_UP   = 38;
const KEYCODE_DOWN = 40;
const DELAY        = NumericInput.DELAY;


describe('NumericInput', function() {
    this.timeout(20000);

    it('works like inpit[type="number"] by default', () => {
        var widget = TestUtils.renderIntoDocument(<NumericInput />);
        expect(widget.refsInput.value).toEqual('');
        expect(widget.refsInput.type).toEqual('text');
    });

    it('accepts all the props', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput
                    value={5}
                    min={4.9}
                    max={5.3}
                    step={0.2}
                    precision={2}
                    className="form-control"
                />
            ),
            inputNode  = widget.refsInput;

        // Test the precision
        expect(inputNode.value).toEqual('5.00');
        expect(inputNode.className).toEqual('form-control');

        // Test the step
        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });
        expect(inputNode.value).toEqual('5.20');

        // Test the max
        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });
        expect(inputNode.value).toEqual('5.30');

        // Test the min
        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_DOWN });
        expect(inputNode.value).toEqual('5.10');
        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_DOWN });
        expect(inputNode.value).toEqual('4.90');
    });

    it('accepts value of 0', () => {
        var widget = TestUtils.renderIntoDocument(<NumericInput value={0}/>),
            inputNode = widget.refsInput;
        expect(inputNode.value).toEqual('0');
    });

    it('accepts value of "0"', () => {
        var widget = TestUtils.renderIntoDocument(<NumericInput value="0"/>),
            inputNode = widget.refsInput;
        expect(inputNode.value).toEqual('0');
    });

    it('accepts value of ""', () => {
        var widget = TestUtils.renderIntoDocument(<NumericInput value=""/>),
            inputNode = widget.refsInput;
        expect(inputNode.value).toEqual('');
    });

    it('can auto-increase', (done) => {
        this.timeout
        var widget     = TestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnUp      = inputNode.nextElementSibling;

        TestUtils.Simulate.mouseDown(btnUp);
        expect(inputNode.value).toEqual('1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('2');
            TestUtils.Simulate.mouseUp(btnUp);
            setTimeout(() => {
                expect(inputNode.value).toEqual('2');
                done();
            }, DELAY);
        }, DELAY);
    });

    it('can auto-decrease', (done) => {
        var widget     = TestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnDown    = widgetNode.lastChild;

        TestUtils.Simulate.mouseDown(btnDown);
        expect(inputNode.value).toEqual('-1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('-2');
            TestUtils.Simulate.mouseUp(btnDown);
            setTimeout(() => {
                expect(inputNode.value).toEqual('-2');
                done();
            }, NumericInput.SPEED);
        }, DELAY);
    });

    it('will stop increasing on mouseleave', (done) => {
        var widget     = TestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnUp      = inputNode.nextElementSibling;

        TestUtils.Simulate.mouseDown(btnUp);
        expect(inputNode.value).toEqual('1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('2');
            // TestUtils.Simulate.mouseLeave(widgetNode);
            TestUtils.Simulate.mouseLeave(btnUp);
            setTimeout(() => {
                expect(inputNode.value).toEqual('2');
                done();
            }, DELAY);
        }, DELAY);
    });

    it('will stop decreasing on mouseleave', (done) => {
        var widget     = TestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnDown    = widgetNode.lastChild;

        TestUtils.Simulate.mouseDown(btnDown);
        expect(inputNode.value).toEqual('-1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('-2');
            // TestUtils.Simulate.mouseLeave(widgetNode);
            TestUtils.Simulate.mouseLeave(btnDown);
            setTimeout(() => {
                expect(inputNode.value).toEqual('-2');
                done();
            }, DELAY);
        }, DELAY);
    });

    it('uses "format" and "parse" methods', () => {

        function format(n) {
            return `That was ${n} days ago`;
        }
        function parse(s) {
            return parseFloat(s.replace(/That\swas\s(\d+)\sdays\sago/gi, '$1'));
        }

        var widget = TestUtils.renderIntoDocument(
                <NumericInput
                    value={5}
                    step={2}
                    format={format}
                    parse={parse}
                />
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild;

        expect(inputNode.value).toEqual('That was 5 days ago');
        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_DOWN });
        expect(inputNode.value).toEqual('That was 3 days ago');
        inputNode.value = 'That was 13 days ago';
        TestUtils.Simulate.change(inputNode);
        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });
        expect(inputNode.value).toEqual('That was 15 days ago');
    });

    it('uses the "disabled" prop to disable the UI', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput disabled readOnly/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnUp      = inputNode.nextElementSibling;

        expect(inputNode.disabled).toEqual(true);
        expect(inputNode.readOnly).toEqual(true);
        // expect(widgetNode.className).toMatch(/\bdisabled\b/);
        // expect(widgetNode.className).toMatch(/\breadonly\b/);
        TestUtils.Simulate.mouseDown(btnUp);
        expect(inputNode.value).toEqual('');
    });

    // setValue() and getValueAsNumber() ---------------------------------------
    it('exposes setValue() and getValueAsNumber() on the input', () => {
        var widget = TestUtils.renderIntoDocument(<NumericInput />);
        expect(widget.refsInput.getValueAsNumber()).toEqual(0);
        widget.refsInput.setValue(123.56);
        expect(widget.refsInput.getValueAsNumber()).toEqual(123.56);
    });

    // Testing styles ----------------------------------------------------------
    it('can set wrapper styles', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput style={{
                    wrap: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget);

        expect(widgetNode.style.fontStyle).toEqual('italic');
    });

    it('can set input styles', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput style={{
                    input: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild;

        expect(inputNode.style.fontStyle).toEqual('italic');
    });

    it('can set btnUp styles', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput style={{
                    btnUp: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            btnNode    = widgetNode.firstChild.nextElementSibling;

        expect(btnNode.style.fontStyle).toEqual('italic');
    });

    it('can set btnDown styles', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput style={{
                    btnDown: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            btnNode    = widgetNode.lastChild;

        expect(btnNode.style.fontStyle).toEqual('italic');
    });

    it('can set arrowDown styles', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput style={{
                    arrowDown: {
                        fontStyle: 'italic'
                    }
                }} mobile={false}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            arrowDown  = widgetNode.lastChild.firstChild;

        expect(arrowDown.style.fontStyle).toEqual('italic');
    });

    it('can set arrowUp styles', () => {
        var widget = TestUtils.renderIntoDocument(
                <NumericInput style={{
                    arrowUp: {
                        fontStyle: 'italic'
                    }
                }} mobile={false}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            arrowUp    = widgetNode.firstChild.nextElementSibling.firstChild;

        expect(arrowUp.style.fontStyle).toEqual('italic');
    });

    it('can set btn:state styles', () => {
        var disabled = false;
        var widget = TestUtils.renderIntoDocument(
                <NumericInput disabled={disabled} style={{
                    'btn'         : { color: 'rgb(1, 2, 3)' },
                    'btn:hover'   : { color: 'rgb(2, 3, 4)' },
                    'btn:active'  : { color: 'rgb(3, 4, 5)' },
                    'btn:disabled': { color: 'rgb(4, 5, 6)' }
                }} mobile={false}/>
            ),
            widgetNode  = ReactDOM.findDOMNode(widget),
            btnUpNode   = widgetNode.firstChild.nextElementSibling,
            btnDownNode = widgetNode.lastChild;

        // normal
        expect(btnUpNode.style.color).toEqual('rgb(1, 2, 3)');
        expect(btnDownNode.style.color).toEqual('rgb(1, 2, 3)');

        // :hover
        TestUtils.Simulate.mouseEnter(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(2, 3, 4)');
        TestUtils.Simulate.mouseEnter(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(2, 3, 4)');

        // :active
        TestUtils.Simulate.mouseDown(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(3, 4, 5)');
        TestUtils.Simulate.mouseDown(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(3, 4, 5)');

        // :disabled
        widget = TestUtils.renderIntoDocument(
            <NumericInput disabled style={{
                'btn'         : { color: 'rgb(1, 2, 3)'},
                'btn:hover'   : { color: 'rgb(2, 3, 4)'},
                'btn:active'  : { color: 'rgb(3, 4, 5)'},
                'btn:disabled': { color: 'rgb(4, 5, 6)'}
            }} mobile={false}/>
        );
        widgetNode  = ReactDOM.findDOMNode(widget);
        btnUpNode   = widgetNode.firstChild.nextElementSibling;
        btnDownNode = widgetNode.lastChild;

        expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
        expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
        TestUtils.Simulate.mouseEnter(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
        TestUtils.Simulate.mouseEnter(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
        TestUtils.Simulate.mouseDown(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
        TestUtils.Simulate.mouseDown(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
    });

    it ('can set mobile styles', () => {
        var widget = TestUtils.renderIntoDocument(<NumericInput mobile/>),
            widgetNode  = ReactDOM.findDOMNode(widget),
            btnUpNode   = widgetNode.firstChild.nextElementSibling,
            btnDownNode = widgetNode.lastChild;

        expect(btnUpNode.style.bottom).toEqual('2px');
        expect(btnDownNode.style.left).toEqual('2px');

        widget = TestUtils.renderIntoDocument(<NumericInput mobile={false}/>),
            widgetNode  = ReactDOM.findDOMNode(widget),
            btnUpNode   = widgetNode.firstChild.nextElementSibling,
            btnDownNode = widgetNode.lastChild;

        expect(btnUpNode.style.bottom).toEqual('50%');
        expect(btnDownNode.style.top).toEqual('50%');
    });

    it("calls it's onChange callback properly", () => {
        var value = null, stringValue = "";
        function onChange(valueAsNumber, valueAsString) {
            value = valueAsNumber
            stringValue = valueAsString
        }
        function format(val) {
            return val * 100 + 'x';
        }
        var widget = TestUtils.renderIntoDocument(
                <NumericInput value={0} onChange={onChange} format={format} />
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            btnUpNode  = widgetNode.firstChild.nextElementSibling,
            inputNode  = widget.refsInput;

        expect(inputNode.value).toEqual('0x');
        expect(value).toEqual(null);
        TestUtils.Simulate.mouseDown(btnUpNode);
        expect(inputNode.value).toEqual('100x');
        expect(stringValue).toEqual('100x');
        expect(value).toEqual(1);
    });

    it("calls it's onFocus and onBlur callbacks", () => {
        var hasFocus = null;
        function onFocus() {
            hasFocus = true;
        }
        function onBlur() {
            hasFocus = false;
        }
        var widget = TestUtils.renderIntoDocument(
                <NumericInput onFocus={onFocus} onBlur={onBlur} />
            ),
            inputNode = widget.refsInput;

        expect(hasFocus).toEqual(null);
        TestUtils.Simulate.focus(inputNode);
        expect(hasFocus).toEqual(true);
        TestUtils.Simulate.blur(inputNode);
        expect(hasFocus).toEqual(false);
    });

    it("calls it's onKeyDown callbacks and makest the event cancelable", () => {
        var hits = 0, widget, inputNode;
        function onKeyDown(e) {
            expect(e.target).toEqual(inputNode);
            if (hits > 0) {
                e.preventDefault()
            }
            hits++;
        }
        widget = TestUtils.renderIntoDocument(
            <NumericInput value={0} onKeyDown={onKeyDown} />
        );
        inputNode = widget.refsInput;

        expect(hits).toEqual(0);
        expect(inputNode.value).toEqual('0');

        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });

        expect(hits).toEqual(1);
        expect(inputNode.value).toEqual('1');

        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });

        expect(hits).toEqual(2);
        expect(inputNode.value).toEqual('1');
    });
});
