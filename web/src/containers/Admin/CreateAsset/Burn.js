import React, { useCallback, useEffect, useState } from 'react';
import { Button, InputNumber, Form, Input, Select, message, Modal } from 'antd';
import _debounce from 'lodash/debounce';

import { storeBurn, storeMint } from '../AdminFinancials/action';
import { requestUsers } from '../ListUsers/actions';
import { CloseOutlined } from '@ant-design/icons';
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
	const [displayAdvanced, setDisplayAdvanced] = useState(false);
	const [advancedValues, setAdvancedValues] = useState({
		transaction_id: null,
		fee: null,
		address: null,
	});
	const getAllUsers = useCallback(async (params = {}) => {
		try {
			const res = await requestUsers(params);
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
			const { amount, user_id, description, status } = values;

			const { transaction_id, fee, address } = advancedValues;
			const formProps = {
				currency: coinFormData.symbol,
				amount,
				user_id: user_id ? parseInt(user_id, 10) : user_id,
				...(fee && { fee }),
				...(description && { description }),
				status: Number(status) ? true : false,
				...(transaction_id && { transaction_id }),
				...(address && { address }),
			};
			setAdvancedValues({
				transaction_id: null,
				fee: null,
				address: null,
			});
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
				message.success(`${res.amount} ${res.currency} successfully burnt`);
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

	useEffect(() => {
		return () => handleSearch && handleSearch.cancel();
		// eslint-disable-next-line
	}, []);

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

				<h3>
					Status <span style={{ fontSize: 14 }}>(Optional)</span>
				</h3>
				<Form.Item initialValue={'1'} name="status">
					<Select
						placeholder="Select an user"
						className="user-search-field"
						autoComplete={false}
					>
						<Option key={'1'}>Completed</Option>
						<Option key={'0'}>Pending</Option>
					</Select>
				</Form.Item>

				<h3>Description</h3>
				<Form.Item name="description">
					<TextArea placeholder="description" rows={3} />
				</Form.Item>

				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayAdvanced}
					footer={null}
					onCancel={() => {
						setDisplayAdvanced(false);
					}}
				>
					<h2 style={{ color: 'white' }}>Advanced fields</h2>
					<h3 style={{ color: 'white', marginTop: 20 }}>
						Transaction ID <span style={{ fontSize: 14 }}>(Optional)</span>
					</h3>
					<Input
						placeholder="Transaction ID"
						value={advancedValues?.transaction_id}
						onChange={(e) => {
							setAdvancedValues({
								...advancedValues,
								transaction_id: e.target.value.trim(),
							});
						}}
					/>
					<h3 style={{ color: 'white', marginTop: 20 }}>
						Fee <span style={{ fontSize: 14 }}>(Optional)</span>
					</h3>
					<InputNumber
						placeholder="Amount"
						value={advancedValues?.fee}
						onChange={(value) => {
							setAdvancedValues({
								...advancedValues,
								fee: value,
							});
						}}
					/>
					<h3 style={{ color: 'white', marginTop: 20 }}>
						Address <span style={{ fontSize: 14 }}>(Optional)</span>
					</h3>
					<Input
						placeholder="Address"
						value={advancedValues?.address}
						onChange={(e) => {
							setAdvancedValues({
								...advancedValues,
								address: e.target.value,
							});
						}}
					/>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={async () => {
								setDisplayAdvanced(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Proceed
						</Button>
					</div>
				</Modal>

				<div
					style={{
						textDecoration: 'underline',
						cursor: 'pointer',
						marginBottom: 30,
						marginTop: -10,
						color: 'white',
					}}
					onClick={() => {
						setDisplayAdvanced(true);
					}}
				>
					Advanced
				</div>

				<Button type="primary" className="green-btn" htmlType="submit">
					Proceed
				</Button>
			</Form>
		</div>
	);
};

export default Burn;
