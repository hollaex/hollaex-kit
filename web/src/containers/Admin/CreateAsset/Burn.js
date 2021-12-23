import React, { useCallback, useEffect, useState } from 'react';
import { Button, InputNumber, Form, Input, Select, message } from 'antd';
import _debounce from 'lodash/debounce';

import { storeBurn, storeMint } from '../AdminFinancials/action';
import { requestUsers } from '../ListUsers/actions';

const { TextArea } = Input;
const { Option } = Select;

const Burn = ({
	type = 'burn',
	coinFormData = {},
	onClose,
	exchangeUsers,
	exchange,
}) => {
	const [dataSource, setDataSource] = useState([]);
	const [form] = Form.useForm();
	const getAllUsers = useCallback(async (params = {}) => {
		try {
			const res = await requestUsers (params);
			if (res && res.data) {
				const exchangeUsers = res.data || [];
				setDataSource(exchangeUsers);
			}
		} catch (error) {
			console.log('error', error);
		}
	}, []);

	useEffect(() => {
		getAllUsers();
	}, [getAllUsers]);

	const handleSubmit = (values) => {
		if (values) {
			const { amount, user_id, description } = values;
			const formProps = {
				currency: coinFormData.symbol,
				amount,
				description,
				user_id: user_id ? parseInt(user_id, 10) : user_id,
			};
			if (type === 'mint') {
				handleMint(formProps);
				onClose();
			} else {
				handleBurn(formProps);
				onClose();
			}
		}
	};

	const handleBurn = async (formValues) => {
		try {
			const res = await storeBurn(formValues);
			if (res) {
				message.success(
					`${res.amount} ${res.currency} successfully burnt`
				);
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
			if (res) {
				message.success(
					`${res.amount} ${res.currency} successfully minted and allocated to user`
				);
			}
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			}
		}
	};

	const searchUser = (searchText) => {
		if (searchText) {
			getAllUsers({ search: searchText });
		} else {
			getAllUsers();
		}
	};

	const handleSearch = _debounce(searchUser, 1000);

	const checkEmail = (rule, value, callback) => {
		let baseData = dataSource;
		let emailData = baseData.filter((data) => data.id === parseInt(value, 10));
		if (!emailData.length) {
			callback("User doesn't exists");
		} else {
			callback();
		}
	};

	return (
		<div className="burn-wrapper">
			<div className="title">{type === 'burn' ? 'Burn' : 'Mint'}</div>
			<div>
				{type === 'burn'
					? 'Burning will reduce the supply of the asset in existence.'
					: 'Minting will create new supply of the asset into existence.'}
			</div>
			<Form form={form} name="EditAssetForm" onFinish={handleSubmit}>
				<h3>Amount</h3>
				<Form.Item
					name="amount"
					rules={[
						{
							required: true,
							message: 'Please enter the amount',
						},
					]}
				>
					<InputNumber placeholder="Amount" />
				</Form.Item>
				<h3>Email</h3>
				<Form.Item
					name="user_id"
					rules={[
						{
							required: true,
							message: 'Please input email',
						},
						{
							validator: checkEmail,
						},
					]}
				>
					<Select
						showSearch
						placeholder="Select an user"
						className="user-search-field"
						onSearch={(text) => handleSearch(text)}
						filterOption={() => true}
						autoComplete={false}
					>
						{dataSource.map((sender) => (
							<Option key={sender.id}>{sender.email}</Option>
						))}
					</Select>
				</Form.Item>
				<h3>Description</h3>
				<Form.Item name="description">
					<TextArea placeholder="description" rows={3} />
				</Form.Item>
				<Button type="primary" className="green-btn" htmlType="submit">
					Proceed
				</Button>
			</Form>
		</div>
	);
};

export default Burn;
