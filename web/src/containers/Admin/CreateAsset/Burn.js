import React, { useCallback, useEffect, useState } from 'react';
import { Button, InputNumber, Form, Input, Select, message } from 'antd';
import _debounce from 'lodash/debounce';

import { storeBurn, storeMint } from '../AdminFinancials/action';

// import { storeBurn, storeMint, getExchangeUsers } from '../../common/fetch';

const { TextArea } = Input;
const { Option } = Select;

const Burn = ({ type = 'burn', coinFormData = {}, onClose, exchangeUsers, exchange }) => {
    const [dataSource, setDataSource] = useState([]);
    // const dataSource = [];
    const [form] = Form.useForm();
    const getAllUsers = useCallback(async (params = {}) => {
        try {
            // const res = await getExchangeUsers(exchange.id, params);
            const res = {};
            if (res.data && res.data.data) {
                const exchangeUsers = res.data.data || [];
                setDataSource(exchangeUsers)
            }
        } catch (error) {
            console.log('error', error);
        }
    }, []);

    useEffect(() => {
        getAllUsers()
    }, [getAllUsers]);

    const handleSubmit = (values) => {
        if (values) {
            // let body = getFieldsValue();
            const { amount, user_id, description } = values;
            const formProps = {
                currency: coinFormData.symbol,
                amount,
                description,
                user_id: user_id ? parseInt(user_id, 10) : user_id
            }
            if (type === 'mint') {
                handleMint(formProps);
                onClose();
            } else {
                handleBurn(formProps);
                onClose();
            }
        }
    }

    const handleBurn = async (formValues) => {
        try {
            const res = await storeBurn(formValues);
            // const res = {};
            if (res.data) {
                message.success(`${res.data.amount} ${res.data.currency} successfully burnt`)
            }
        } catch (error) {
            if (error.data && error.data.message) {
                message.error(error.data.message);
            }
        }
    };

    const handleMint = async (formValues) => {
        try {
            const res = await storeMint(formValues);
            // const res = {};
            if (res.data) {
                message.success(`${res.data.amount} ${res.data.currency} successfully minted and allocated to user`)
            }
        } catch (error) {
            if (error.data && error.data.message) {
                message.error(error.data.message);
            }
        }
    };

    const searchUser = (searchText) => {
        getAllUsers({ search: searchText });
    };

    const handleSearch = _debounce(searchUser, 1000);

    const checkEmail = (rule, value, callback) => {
        let baseData = dataSource;
        let emailData = baseData.filter(data => data.id === parseInt(value, 10));
        if (!emailData.length) {
            callback("User doesn't exists");
        } else {
            callback();
        }
    };

    return (
        <div className='burn-wrapper'>
            <div className="title">{type === 'burn' ? 'Burn' : 'Mint'}</div>
            <div>
                {type === 'burn'
                    ? 'Burning will reduce the supply of the asset in existence.'
                    : 'Minting will create new supply of the asset into existence.'
                }
            </div>
            <Form form={form} name="EditAssetForm" onFinish={handleSubmit}>
                <Form.Item
                    name="amount"
                    className="type_wrapper"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the amount'
                        }
                    ]}
                >
                    <h3>Amount</h3>
                    <InputNumber placeholder='Amount' />
                </Form.Item>
                <Form.Item
                    name="user_id"
                    className="type_wrapper"
                    rules={[
                        {
                            required: true,
                            message: 'Please input email'
                        },
                        {
                            validator: checkEmail
                        }
                    ]}
                >
                    <h3>Email</h3>
                    <Select
                        showSearch
                        placeholder="Select an user"
                        className="user-search-field"
                        onSearch={(text) => handleSearch(text)}
                        filterOption={() => true}
                    >
                        {dataSource.map((sender) => (
                            <Option key={sender.id}>{sender.email}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item className="type_wrapper">
                    <h3>Description</h3>
                    <TextArea
                        placeholder="description"
                        rows={3}
                    />
                </Form.Item>
                <Button
                    type='primary'
                    className="green-btn"
                    htmlType='submit'
                >
                    Proceed
                </Button>
            </Form>
        </div>
    );
}

export default Burn;
