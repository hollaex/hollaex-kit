import React from 'react';
import { Button, Select, InputNumber, Form } from 'antd';
import _get from 'lodash/get';

const WithdrawalFee = ({
    coinFormData = {},
    updateFormData,
    coins = [],
    handleScreenChange,
    isWithdrawalEdit = false,
    handleWithdrawalFeeChange,
    handleSymbolChange
}) => {
    const [form] = Form.useForm();
    const withdrawal_fees = _get(coinFormData, 'withdrawal_fees', {});

    const handleUpdate = (values) => {
        let formProps = {};
        if (values) {
            Object.keys(values).forEach(data => {
                const temp = data.split('_');
                formProps = {
                    ...formProps,
                    [temp[0]]: {
                        ...formProps[temp[0]],
                        [temp[1]]: values[data]
                    }
                }
            })
        }
        updateFormData('withdrawal_fees', formProps);
        if (isWithdrawalEdit) {
            handleScreenChange('update_confirm');
        } else {
            handleScreenChange('final');
        }
    };

    const getInitialValues = () => {
        let initialValues = {};
        if (withdrawal_fees) {
            Object.keys(withdrawal_fees).forEach(data => {
                initialValues = {
                    ...initialValues,
                    [`${data}_value`]: withdrawal_fees[data].value,
                    [`${data}_symbol`]: withdrawal_fees[data].symbol
                }
            });
        } else {
            initialValues = {
                ...initialValues,
                [`${coinFormData && coinFormData.symbol}_value`]: coinFormData.withdrawal_fee || 0,
                [`${coinFormData && coinFormData.symbol}_symbol`]: coinFormData.symbol
            }
        }
        return initialValues;
    };

    return (
        <div className="coin-limit-wrap">
            <div className="title">Withdrawal Fees</div>
            <Form
                form={form}
                initialValues={getInitialValues()}
                name="withdrawalForm"
                onFinish={handleUpdate}
            >
                {withdrawal_fees 
                    ? Object.keys(withdrawal_fees).map((data, key) => {
                    return <div key={key}>
                        <div className="field-wrap">
                            <div className="sub-title">{data.toUpperCase()}</div>
                        </div>
                        <div className="field-wrap last">
                            <div className="sub-title">Value</div>
                            <Form.Item
                                name={`${data}_value`}
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <InputNumber onChange={(val) => handleWithdrawalFeeChange(data, val, 'value', 'withdrawal_fees')}/>
                            </Form.Item>
                        </div>
                        <div className="field-wrap last">
                            <div className="sub-title">Symbol</div>
                            <Form.Item
                                name={`${data}_symbol`}
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
                                    onChange={(val) => handleWithdrawalFeeChange(data, val, 'symbol', 'withdrawal_fees')}
                                >
                                    {coins.map((option, index) => (
                                        <Select.Option key={index} value={option.symbol}>
                                            {option.symbol}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                })
                : 
                    <div>
                        <div className="field-wrap">
                            <div className="sub-title">{coinFormData && coinFormData.symbol && coinFormData.symbol.toUpperCase()}</div>
                        </div>
                        <div className="field-wrap last">
                            <div className="sub-title">Value</div>
                            <Form.Item
                                name={`${coinFormData && coinFormData.symbol}_value`}
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <InputNumber onChange={(val) => handleSymbolChange(coinFormData && coinFormData.symbol, val, 'value', 'withdrawal_fees')} />
                            </Form.Item>
                        </div>
                        <div className="field-wrap last">
                            <div className="sub-title">Symbol</div>
                            <Form.Item
                                name={`${coinFormData && coinFormData.symbol}_symbol`}
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
                                    onChange={(val) => handleSymbolChange(coinFormData && coinFormData.symbol, val, 'symbol', 'withdrawal_fees')}
                                >
                                    {coins.map((option, index) => (
                                        <Select.Option key={index} value={option.symbol}>
                                            {option.symbol}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
            }
                {isWithdrawalEdit
                    ?
                    <div>
                        <Button
                            type="primary"
                            className="green-btn w-100"
                            htmlType="submit"
                        >
                            Next
                        </Button>
                    </div>
                    :
                    <div className="btn-wrapper w-100">
                        <Button
                            type="primary"
                            className="green-btn mr-5"
                            onClick={() => handleScreenChange('step9')}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            className="green-btn"
                            htmlType="submit"
                        >
                            Next
                        </Button>
                    </div>
                }
            </Form>
        </div>
    );
};

export default WithdrawalFee;
