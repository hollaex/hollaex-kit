/* global $, hljs, NumericInput, React */
export default class Demo extends React.Component
{
    constructor(...args) {
        super(...args)
        // var that = this;
        this.state = {
            inputProps : {
                name      : { value: "whatever"    ,     on: false },
                className : { value: "form-control",     on: true  },
                value     : { value: 50,                 on: true  },
                min       : { value: 0,                  on: true  },
                max       : { value: 100,                on: true  },
                step      : { value: 1,                  on: true  },
                precision : { value: 0,                  on: true  },
                size      : { value: 5,                  on: true  },
                maxLength : { value: 2,                  on: false },
                disabled  : { value: true,               on: false },
                readOnly  : { value: true,               on: false },
                mobile    : { value: true,               on: false },
                required  : { value: true,               on: false },
                noValidate: { value: true,               on: false },
                pattern   : { value: "[0-9].[0-9][0-9]", on: false },
                title     : { value: "The title attr",   on: false },
                snap      : { value: true,               on: false },
                inputmode : { value: "numeric",          on: false },
                strict    : { value: true,               on: false },
                noStyle   : { value: true,               on: false }
                // library
            }
        }
    }

    componentDidUpdate() {
        hljs.highlightBlock(this.refs.code)
    }

    toggleProp(propName) {
        this.state.inputProps[propName].on = !this.state.inputProps[propName].on
        this.setState(this.state)
    }

    setProp(propName, event) {
        let val = event.target ? event.target.value : event
        this.state.inputProps[propName].value = val
        this.setState(this.state)
    }

    onChange(x) {
        this.state.inputProps.value.value = x === null ? "" : x
        if (this.state.inputProps.value.on) {
            this.setState(this.state);
        }
    }

    onInvalid(message) {
        // console.log("Invalid", message)
        $(this.refs.errorMessage).text(message || "Unknown error")
    }

    onValid() {
        // console.log("Valid")
        $(this.refs.errorMessage).empty()
    }

    renderCode() {
        let out = '<NumericInput '
        let hasProps = false

        for (let propName in this.state.inputProps) {
            if (this.state.inputProps[propName].on && !this.state.inputProps[propName].hidden) {
                let val = this.state.inputProps[propName].value
                out += `\n\t${propName}`
                if (val !== true) {
                    out += '=' + (
                        typeof val == 'string' ? `"${val}" ` : `{ ${val} } `
                    )
                }
                hasProps = true
            }
        }

        if (hasProps) {
            out += '\n'
        }

        out += '/>'

        return <div className="code js" ref="code" style={{ minHeight: 379 }}>{ out }</div>
    }

    renderPropEditors(config) {
        return config.map((props, propName) => {
            let editor = null
            let { type, name, ...rest } = props

            if (type == 'text') {
                editor = (
                    <input
                        type="text"
                        className="form-control input-sm"
                        value={ this.state.inputProps[name].value }
                        onChange={ this.setProp.bind(this, name) }
                    />
                )
            }
            else if (type == "number") {
                editor = (
                    <NumericInput
                        className="form-control input-sm"
                        value={ this.state.inputProps[name].value }
                        onChange={ this.setProp.bind(this, name) }
                        { ...rest }
                    />
                )
            }

            return (
                <tr key={ propName }>
                    <td className="unselectable">
                        <label style={{ display: "block" }}>
                            <input
                                type="checkbox"
                                checked={ this.state.inputProps[name].on }
                                onChange={ this.toggleProp.bind(this, name) }
                            />
                        &nbsp;{ name }
                        </label>
                    </td>
                    <td>
                        { editor }
                    </td>
                </tr>
            )
        })
    }

    render() {
        let inputProps = {}
        for (let propName in this.state.inputProps) {
            if (this.state.inputProps[propName].on) {
                inputProps[propName] = this.state.inputProps[propName].value
            }
            // else {
            //     inputProps[propName] = null
            // }
        }

        return (
            <div className="row">
                <div className="col-xs-6">
                    <div className="panel panel-default">
                        <div className="panel-heading">Props</div>
                        <table className="table table-striped table-condensed">
                            <colgroup>
                                <col width={169}/>
                                <col/>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>name</th>
                                    <th>value</th>
                                </tr>
                            </thead>
                        </table>
                        <div style={{
                            overflow : 'auto',
                            maxHeight: 452
                        }}>
                            <table className="table table-striped table-condensed">
                                <colgroup>
                                    <col width={169}/>
                                    <col/>
                                </colgroup>
                                <tbody>
                                    {this.renderPropEditors([
                                        { name: "name"      , type: "text"   },
                                        { name: "className" , type: "text"   },
                                        { name: "value"     , type: "text"   },
                                        { name: "min"       , type: "number" },
                                        { name: "max"       , type: "number" },
                                        { name: "step"      , type: "number", min: 0.001, step: 0.1, precision: 3 },
                                        { name: "precision" , type: "number", min: 0, max: 20 },
                                        { name: "size"      , type: "number", min: 0, max: 60 },
                                        { name: "maxLength" , type: "number", min: 0, max: 20 },
                                        { name: "disabled"  , type: "bool"   },
                                        { name: "readOnly"  , type: "bool"   },
                                        { name: "mobile"    , type: "bool"   },
                                        { name: "pattern"   , type: "text"   },
                                        { name: "title"     , type: "text"   },
                                        { name: "required"  , type: "bool"   },
                                        { name: "noValidate", type: "bool"   },
                                        { name: "inputmode" , type: "text"   },
                                        { name: "snap"      , type: "bool"   },
                                        { name: "strict"    , type: "bool"   },
                                        { name: "noStyle"   , type: "bool"   }
                                    ])}
                                    {/*
                                    parse	function	parseFloat
                                    format	function	none
                                    style	object	none
                                    */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Preview</div>
                        <div className="panel-body">
                            <div ref="example">
                                <NumericInput { ...inputProps }
                                    onChange={ this.onChange.bind(this) }
                                    onInvalid={ this.onInvalid.bind(this) }
                                    onValid={ this.onValid.bind(this) }
                                    value={ inputProps.value === null ? undefined : inputProps.value || ""}
                                />
                                <div className="help-block">
                                    <span ref="errorMessage" className="text-danger"/>
                                </div>
                            </div>
                            <hr/>
                            { this.renderCode() }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
