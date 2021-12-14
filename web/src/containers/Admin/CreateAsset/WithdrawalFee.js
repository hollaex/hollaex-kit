import React from 'react';
import { Button, Select, InputNumber, Form } from 'antd';
import _get from 'lodash/get';

const WithdrawalFee = ({ coinFormData = {}, updateFormData, handleClose, coins = [] }) => {
    
    const [form] = Form.useForm();
    const withdrawal_fees = _get(coinFormData, 'withdrawal_fees', {});

    const handleUpdate = (values) => {
        let formProps = {};
        if (values) {
            Object.keys(values).map(data => {
                if (data !== 'option') {
                    return formProps = {
                        ...formProps,
                        [values.option]: {
                            ...formProps[values.option],
                            [data]: values[data]
                        }
                    }
                } else {
                    return null;
                }
            })
        }
        handleClose();
        updateFormData('withdrawal_fees', formProps);
    };

    const initialValues = {
        'option': Object.keys(withdrawal_fees)[0],
        'value': withdrawal_fees[Object.keys(withdrawal_fees)[0]].value,
        'symbol': withdrawal_fees[Object.keys(withdrawal_fees)[0]].symbol,
    }

    return (
        <div className="coin-limit-wrap">
            <div className="title">Withdrawal Fees</div>
            <Form
                form={form}
                initialValues={initialValues}
                name="withdrawalForm"
                onFinish={handleUpdate}
            >
                <div className="field-wrap">
                    <div className="sub-title">Options</div>
                    <Form.Item
                        name="option"
                        rules={[
                            {
                                required: true,
                                message: 'This field is required!',
                            },
                        ]}
                    >
                        <Select
                            size="small"
                            className="w-100"
                        >
                            {Object.keys(withdrawal_fees).map((option, index) => (
                                <Select.Option key={index} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <div className="field-wrap last">
                    <div className="sub-title">Value</div>
                    <Form.Item
                        name="value"
                        rules={[
                            {
                                required: true,
                                message: 'This field is required!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </div>
                <div className="field-wrap last">
                    <div className="sub-title">Symbol</div>
                    <Form.Item
                        name="symbol"
                        rules={[
                            {
                                required: true,
                                message: 'This field is required!',
                            },
                        ]}
                    >
                        <Select
                            size="small"
                            className="w-100"
                        >
                            {coins.map((option, index) => (
                                <Select.Option key={index} value={option.symbol}>
                                    {option.symbol}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <div className="btn-wrapper">
                    <Button
                        type="primary"
                        className="green-btn"
                        htmlType="submit"
                    >
                        Next
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default WithdrawalFee;
