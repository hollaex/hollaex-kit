import React from 'react';
import { Input, Form, Button } from 'antd';

const { Item } = Form;

const EmailSetup = (props) => {
    const handleSubmit = (values) => {
        props.onFieldChange(values.email, 'email');
        props.onChangeStep('password');
    };
    return (
        <div className="setup-container">
            <div className="content">
                <div className="email-icon"></div>
                <div className="wrapper">
                    <div className="header">
                        Operator administrator email account
                        </div>
                    <div className="description">
                        This email will be used to login to your exchange as an admin. Please use an email you will remember.
                        </div>
                    <Form
                        name='email-form'
                        initialValues={props.initialValues}
                        onFinish={handleSubmit}
                    >
                        <div className="setup-field-wrapper setup-field-content">
                            <div className="setup-field-label">Email</div>
                            <Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!'
                                    },
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!'
                                    }
                                ]}
                            >
                                <Input />
                            </Item>
                        </div>
                        <div className="btn-wrapper">
                            <Button onClick={() => props.onChangeStep('network-config')}>Back</Button>
                            <div className="separator"></div>
                            <Button htmlType='submit'>Proceed</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default EmailSetup;
