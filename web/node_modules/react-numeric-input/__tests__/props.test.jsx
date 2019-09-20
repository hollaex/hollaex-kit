/* global React, describe, it */
import expect       from 'expect'
import NumericInput from '../src/NumericInput.jsx'
import React        from 'react'
import TestUtils    from 'react-dom/test-utils'

function testProp(cfg) {
    return Promise.all(cfg.map.map(entry => {
        return new Promise(resolve => {
            let props = { [cfg.propName] : entry.in }
            if (entry.otherProps) {
                props = { ...props, ...entry.otherProps}
            }
            let app = TestUtils.renderIntoDocument(<NumericInput {...props} />)
            let result = cfg.getValue(app)
            expect(result).toEqual(
                entry.out,
                `If the "${cfg.propName}" is set to "${String(entry.in)}" the result
                should be "${entry.out}" but got "${result}"`
            )
            resolve()
        })
    }))
}

function testInputProp(cfg) {
    cfg.getValue = cfg.getValue || (widget => widget.refsInput[cfg.propName])
    return testProp(cfg).then(() => {
        let app = TestUtils.renderIntoDocument(<NumericInput />)
        let attrName = cfg.attrName || cfg.propName.toLowerCase()
        if (attrName == "pattern") {
            return new Promise(resolve => {
                expect(app.refsInput.outerHTML.search(
                    new RegExp('\\bpattern="\\.\\*"')
                )).toNotEqual(
                    -1,
                    `If the "pattern" is not set the corresponding
                    attribute should be set to ".*". The outerHTML was
                    ${app.refsInput.outerHTML}.`
                )
                resolve()
            })
        }
        if (attrName == "value") {
            return new Promise(resolve => {
                expect(app.refsInput.outerHTML.search(
                    new RegExp("\\bvalue=\"\"", "i")
                )).toNotEqual(
                    -1,
                    `If the "value" is not set the corresponding
                    attribute should be set as "". The outerHTML was
                    ${app.refsInput.outerHTML}.`
                )
                resolve()
            })
        }
        return new Promise(resolve => {
            expect(app.refsInput.outerHTML.search(
                new RegExp("\\b" + attrName + "=", "i")
            )).toEqual(
                -1,
                `If the "${cfg.propName}" is not set the corresponding
                attribute should not be set. The outerHTML was
                ${app.refsInput.outerHTML}.`
            )
            resolve()
        })
    })
}

function testAllInputProps(cfgArr) {
    return Promise.all(cfgArr.map(testInputProp))
}

describe('NumericInput', () => {
    it('handles properly all the props', done => {

        // These are all attached on the input
        testAllInputProps([
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
                map: [
                    { in: null     , out: false },
                    { in: undefined, out: false },
                    { in: true     , out: true  },
                    { in: false    , out: false }
                ]
            },
            {
                propName: "required",
                map: [
                    { in: null     , out: false },
                    { in: undefined, out: false },
                    { in: true     , out: true  },
                    { in: false    , out: false }
                ]
            },
            {
                propName: "maxLength",
                map: [
                    // { in: null     , out: 524288 },
                    // { in: undefined, out: 524288 },
                    // { in: 0        , out: 524288 },
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
                map: [
                    { in: null     , out: false },
                    { in: undefined, out: false },
                    { in: true     , out: true  },
                    { in: false    , out: false }
                ]
            },
            {
                propName: "noValidate",
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
                    // { in: null     , out: null },
                    // { in: undefined, out: null },
                    // { in: 0        , out: 0    },
                    { in: 1        , out: 1    },
                    { in: 2        , out: 2    }
                ]
            },
            {
                propName: "value",
                map: [
                    { in: ""       , out: ""    , otherProps: { strict: true  }},
                    { in: ""       , out: ""    , otherProps: { strict: false }},
                    { in: "a"      , out: ""    , otherProps: { strict: true  }},
                    { in: "a"      , out: "a"   , otherProps: { strict: false }},
                    { in: "b"      , out: ""    , otherProps: { strict: true  }},
                    { in: "b"      , out: "b"   , otherProps: { strict: false }},
                    { in: null     , out: ""    , otherProps: { strict: true  }},
                    { in: null     , out: ""    , otherProps: { strict: false }},
                    { in: undefined, out: ""    , otherProps: { strict: true  }},
                    { in: undefined, out: ""    , otherProps: { strict: false }},
                    { in: 123      , out: "123" , otherProps: { strict: true  }},
                    { in: 123      , out: "123" , otherProps: { strict: false }}
                ]
            },
            {
                propName: "defaultValue",
                // attrName: "value",
                getValue : (widget) => widget.refsInput.value,
                map: [
                    { in: ""       , out: ""    , otherProps: { strict: true  }},
                    { in: ""       , out: ""    , otherProps: { strict: false }},
                    { in: "a"      , out: ""    , otherProps: { strict: true  }},
                    { in: "a"      , out: "a"   , otherProps: { strict: false }},
                    { in: "b"      , out: ""    , otherProps: { strict: true  }},
                    { in: "b"      , out: "b"   , otherProps: { strict: false }},
                    { in: null     , out: ""    , otherProps: { strict: true  }},
                    { in: null     , out: ""    , otherProps: { strict: false }},
                    { in: undefined, out: ""    , otherProps: { strict: true  }},
                    { in: undefined, out: ""    , otherProps: { strict: false }},
                    { in: 123      , out: "123" , otherProps: { strict: true  }},
                    { in: 123      , out: "123" , otherProps: { strict: false }}
                ]
            }//,
            // {
            //     propName: "step",
            //     map: [
            //         { in: null     , out: null },
            //         { in: undefined, out: null },
            //         { in: 0        , out: 0    },
            //         { in: 1        , out: 1    },
            //         { in: 2        , out: 2    }
            //     ]
            // },
            // {
            //     propName: "min",
            //     map: [
            //         { in: null     , out: 524288 },
            //         { in: undefined, out: 524288 },
            //         { in: 0        , out: 524288 },
            //         { in: 1        , out: 1      },
            //         { in: 2        , out: 2      }
            //     ]
            // },
            // {
            //     propName: "max",
            //     map: [
            //         { in: null     , out: 524288 },
            //         { in: undefined, out: 524288 },
            //         { in: 0        , out: 524288 },
            //         { in: 1        , out: 1      },
            //         { in: 2        , out: 2      }
            //     ]
            // },
            // {
            //     propName: "precision",
            //     map: [
            //         { in: null     , out: 524288 },
            //         { in: undefined, out: 524288 },
            //         { in: 0        , out: 524288 },
            //         { in: 1        , out: 1      },
            //         { in: 2        , out: 2      }
            //     ]
            // }
        ])


        // TODO: Test props which are not passed to the input
        .then(() => {})

        .then(() => done())

        .catch(done)
    });

    it('can disable inline styles', done => {
        let app = TestUtils.renderIntoDocument(<NumericInput style={false} />);

        function walk(el, visitor) {
            visitor(el);
            if (el.childNodes) {
                for (let i = 0, l = el.childNodes.length; i < l; i++) {
                    let child = el.childNodes[i]
                    if (child.nodeType === 1) {
                        walk(child, visitor)
                    }
                }
            }
        }

        walk(app.refsWrapper, el => {
            expect(!el.getAttribute('style')).toEqual(true);
        });

        app = TestUtils.renderIntoDocument(<NumericInput style={false} mobile />);

        walk(app.refsWrapper, el => {
            expect(!el.getAttribute('style')).toEqual(true);
        });

        done();
    });
})
