import React from 'react';
import { Input, Form, Button, InputNumber } from 'antd';

const { Item } = Form;

const Login = (props) => {
    const handleSubmit = (values) => {
        console.log('values', values);
    };
    return (
        <div className="setup-container">
            <div className="content">
                <div className="email-icon"></div>
                <div className="wrapper">
                    <div className="header">
                        Login
                    </div>
                    <Form name='login-form' onFinish={handleSubmit}>
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
                                        message: 'Invalid email address'
                                    }
                                ]}
                            >
                                <Input />
                            </Item>
                            <div className="setup-field-label">Password</div>
                            <Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!'
                                    }
                                ]}
                            >
                                <Input.Password />
                            </Item>
                            <div className="setup-field-label">2FA
                                <span className="description">(if active)</span>
                            </div>
                            <Item
                                name="otp"
                            >
                                <InputNumber maxLength="6" placeholder="6-digit code" />
                            </Item>
                        </div>
                        <div className="btn-container">
                            <Button htmlType='submit'>Proceed</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Login;
