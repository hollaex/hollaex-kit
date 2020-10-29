import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { Button } from 'antd';

import renderFields from '../../../components/AdminForm/utils';

class FormWrapper extends Component {
    componentDidMount() {
        if (this.props.forceValidate) {
            this.props.form.validateFields();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields();
        const formProps = this.props.form.getFieldsValue();
        this.props.handleSubmit(formProps);
    };

    renderCustomFields = (fields = {}) => {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="custom-form-wrapper">
                {Object.keys(fields).map((key, index) => {
                    let section = fields[key];
                    return (
                        <Fragment key={index}>
                            <div className={section.className}>
                                {section.header
                                    ? <Fragment>
                                        <div className={section.header.className}>
                                            {renderFields(
                                                section.header.fields,
                                                getFieldDecorator,
                                                this.props.initialValues
                                            )}
                                        </div>
                                        <span className="divider-horizontal"></span>
                                    </Fragment>
                                    : null
                                }
                                {section.content
                                    ? <div className={section.content.className}>
                                        {renderFields(
                                            section.content.fields,
                                            getFieldDecorator,
                                            this.props.initialValues
                                        )}
                                    </div>
                                    : null
                                }
                                {section.bottomLink
                                    ? <div>{section.bottomLink}</div>
                                    : null
                                }
                            </div>
                            {index < (Object.keys(fields).length - 1)
                                ? <span className="divider-vertical"></span>
                                : null
                            }
                        </Fragment>
                    )
                })}
            </div>
        );

    }

    render() {
        const { fields, initialValues = {}, customFields = false, buttonTxt = "Save" } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {customFields
                        ? this.renderCustomFields(fields)
                        : renderFields(fields, getFieldDecorator, initialValues)
                    }
                    <Button block type="primary" htmlType="submit" className="green-btn minimal-btn">
                        {buttonTxt}
                    </Button>
                </form>
            </div>
        );
    }
}

export default reduxForm({
	form: 'FooterLinkForm'
})(FormWrapper);
