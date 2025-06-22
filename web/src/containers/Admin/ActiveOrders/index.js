import React, { useEffect, useState } from 'react';
import { Row, Select, Button, Modal, Input, message } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import PairsSection from './PairsSection';
import { submitOrderByAdmin } from './action';
import _debounce from 'lodash/debounce';
import { requestUsers } from '../Stakes/actions';
import './index.scss';

const TYPE_OPTIONS = [{ value: true, label: 'Active' }];

const ActiveOrders = ({ pairs, userId, getThisExchangeOrder }) => {
	const [options, setOptions] = useState([]);
	const [pair, setPair] = useState(null);
	const [type, setType] = useState(true);
	const [displayCreateOrder, setDisplayCreateOrder] = useState(false);
	const [selectedEmailData, setSelectedEmailData] = useState({});
	const [emailOptions, setEmailOptions] = useState([]);
	const [orderPayload, setOrderPayload] = useState({
		type: 'limit',
	});

	useEffect(() => {
		setOptions(getOptions(pairs));
	}, [pairs]);

	const getOptions = (pairs) => {
		const options = [{ value: null, label: 'All' }];
		Object.keys(pairs).forEach((pair) => {
			options.push({
				label: pair,
				value: pair,
			});
		});
		return options;
	};
	const handleEmailChange = (value) => {
		let emailId = parseInt(value);
		let emailData = {};
		emailOptions &&
			emailOptions.forEach((item) => {
				if (item.value === emailId) {
					emailData = item;
				}
			});
		setSelectedEmailData(emailData);
		handleSearch(emailData.label);
	};

	const getAllUserData = async (params = {}) => {
		try {
			const res = await requestUsers(params);
			if (res && res.data) {
				const userData = res.data.map((user) => ({
					label: user.email,
					value: user.id,
				}));
				setEmailOptions(userData);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	const searchUser = (searchText, type) => {
		getAllUserData({ search: searchText }, type);
	};

	const handleSearch = _debounce(searchUser, 1000);

	useEffect(() => {
		return () => handleSearch && handleSearch.cancel();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="app_container-content">
			{displayCreateOrder && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayCreateOrder}
					footer={null}
					onCancel={() => {
						setDisplayCreateOrder(false);
					}}
				>
					<h2 style={{ fontWeight: '600', color: 'white' }}>Create Order</h2>
					<div style={{ fontWeight: '400', color: 'white' }}>
						You can create order for the selected user below
					</div>
					<div style={{ marginBottom: 30, marginTop: 10 }}>
						{!userId && (
							<div style={{ marginBottom: 10 }}>
								<div className="mb-2">User</div>
								<div className="d-flex align-items-center">
									<Select
										showSearch
										placeholder="user@exchange.com"
										className="user-search-field"
										onSearch={(text) => handleSearch(text)}
										filterOption={() => true}
										style={{ width: '100%' }}
										value={selectedEmailData && selectedEmailData.label}
										onChange={(text) => handleEmailChange(text)}
										showAction={['focus', 'click']}
									>
										{emailOptions &&
											emailOptions.map((email) => (
												<Select.Option key={email.value}>
													{email.label}
												</Select.Option>
											))}
									</Select>
								</div>
							</div>
						)}

						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">Symbol</div>
							<Select
								style={{ width: '100%' }}
								options={options.filter((option) => option.label !== 'All')}
								value={orderPayload?.symbol}
								placeholder="Select Order Symbol"
								onChange={(value) =>
									setOrderPayload({
										...orderPayload,
										symbol: value,
									})
								}
							/>
						</div>

						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">Type</div>
							<Select
								onChange={(value) =>
									setOrderPayload({
										...orderPayload,
										type: value,
									})
								}
								value={orderPayload?.type}
								style={{ width: '100%' }}
								placeholder="Select Order Type"
							>
								<Select.Option value="limit">Limit</Select.Option>
								<Select.Option value="market">Market</Select.Option>
							</Select>
						</div>

						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">Side</div>
							<Select
								onChange={(value) =>
									setOrderPayload({
										...orderPayload,
										side: value,
									})
								}
								value={orderPayload?.side}
								style={{ width: '100%' }}
								placeholder="Select side"
							>
								<Select.Option value="buy">Buy</Select.Option>
								<Select.Option value="sell">Sell</Select.Option>
							</Select>
						</div>

						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">Size</div>
							<Input
								type="number"
								placeholder="Enter size value"
								// style={{ width: 200 }}
								value={orderPayload?.size}
								onChange={(e) =>
									setOrderPayload({
										...orderPayload,
										size: e.target.value,
									})
								}
							/>
						</div>

						{orderPayload.type === 'limit' && (
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Price</div>
								<Input
									type="number"
									// style={{ width: 200 }}
									placeholder="Enter price value"
									value={orderPayload?.price}
									onChange={(e) =>
										setOrderPayload({
											...orderPayload,
											price: e.target.value,
										})
									}
								/>
							</div>
						)}
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
						}}
					>
						<Button
							onClick={() => {
								setOrderPayload({
									type: 'limit',
								});
								setDisplayCreateOrder(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
						<Button
							onClick={async () => {
								try {
									if (!userId && selectedEmailData?.value == null) {
										message.error('Please select user');
										return;
									}

									if (!orderPayload.size) {
										message.error('Please input size');
										return;
									}
									if (!orderPayload.side) {
										message.error('Please select side');
										return;
									}
									if (!orderPayload.type) {
										message.error('Please select order type');
										return;
									}
									if (orderPayload.type === 'limit' && !orderPayload.price) {
										message.error('Please input pirce');
										return;
									}
									if (!orderPayload.symbol) {
										message.error('Please select symbol');
										return;
									}
									orderPayload.size = Number(orderPayload.size);
									orderPayload.price = Number(orderPayload.price);
									if (orderPayload.type === 'market') {
										delete orderPayload.price;
									}

									await submitOrderByAdmin({
										...orderPayload,
										user_id: userId || selectedEmailData?.value,
									});
									message.success('Order successfully created');
									setDisplayCreateOrder(false);
									setPair('');
									setPair(null);
									setOrderPayload({
										type: 'limit',
									});
								} catch (error) {
									message.error(error.response.data.message);
								}
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Create Order
						</Button>
					</div>
				</Modal>
			)}

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<Select
						style={{
							width: 100,
						}}
						options={options}
						value={pair}
						onChange={setPair}
					/>
					<Select
						style={{
							width: 100,
						}}
						options={TYPE_OPTIONS}
						value={type}
						onChange={setType}
					/>
				</div>

				<div>
					<Button
						className="green-btn"
						type="primary"
						onClick={() => {
							if (!userId) getAllUserData();
							setDisplayCreateOrder(true);
						}}
					>
						Create Order
					</Button>
				</div>
			</div>
			<Row>
				<PairsSection
					key={`${pair}_${type}`}
					userId={userId}
					pair={pair}
					open={type}
					getThisExchangeOrder={getThisExchangeOrder}
				/>
			</Row>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(ActiveOrders);
