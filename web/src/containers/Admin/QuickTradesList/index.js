import React, { useEffect, useState } from 'react';
import { Row, Select, Button, Modal, Input, message } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import PairsSection from './PairsSection';
import { submitOrderByAdmin } from './action';
import _debounce from 'lodash/debounce';
import { requestUsers } from '../Stakes/actions';
import './index.scss';

// const TYPE_OPTIONS = [{ value: true, label: 'Active' }];

const QuickTradesList = ({ pairs, coins, userId, getThisExchangeOrder }) => {
	const [options, setOptions] = useState([]);
	const [pair, setPair] = useState(null);
	const [type] = useState(true);
	const [displayCreateOrder, setDisplayCreateOrder] = useState(false);
	const [selectedEmailData, setSelectedEmailData] = useState({});
	const [selectedEmailData2, setSelectedEmailData2] = useState({});
	const [emailOptions, setEmailOptions] = useState([]);
	const [orderPayload, setOrderPayload] = useState({});

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

	const handleEmailChangeTaker = (value) => {
		let emailId = parseInt(value);
		let emailData = {};
		emailOptions &&
			emailOptions.forEach((item) => {
				if (item.value === emailId) {
					emailData = item;
				}
			});
		setSelectedEmailData2(emailData);
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

	const onHandleDisable = () => {
		if (
			(orderPayload && orderPayload.maker_fee) ||
			(orderPayload && orderPayload.taker_fee)
		) {
			return false;
		}
		return true;
	};

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
					<h2 style={{ fontWeight: '600', color: 'white' }}>Create Trade</h2>
					<div style={{ fontWeight: '400', color: 'white' }}>
						You can create trade for the selected users below
					</div>
					<div style={{ marginBottom: 30, marginTop: 10 }}>
						<div style={{ marginBottom: 10 }}>
							<div className="mb-2">Maker</div>
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

						<div style={{ marginBottom: 10 }}>
							<div className="mb-2">Taker</div>
							<div className="d-flex align-items-center">
								<Select
									showSearch
									placeholder="user@exchange.com"
									className="user-search-field"
									onSearch={(text) => handleSearch(text)}
									filterOption={() => true}
									style={{ width: '100%' }}
									value={selectedEmailData2 && selectedEmailData2.label}
									onChange={(text) => handleEmailChangeTaker(text)}
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

						<div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
							<div style={{ marginBottom: 10, flex: 8 }}>
								<div className="mb-1">Base Asset</div>
								<Select
									style={{ width: '100%' }}
									value={orderPayload?.base_coin}
									placeholder="Select Base Asset"
									onChange={(value) =>
										setOrderPayload({
											...orderPayload,
											base_coin: value,
										})
									}
								>
									{Object.values(coins).map((coin) => (
										<Select.Option value={coin.symbol}>
											{coin.fullname}
										</Select.Option>
									))}
								</Select>
							</div>
							<div
								style={{
									fontSize: 16,
									flex: 1,
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'relative',
									top: 5,
								}}
							>
								-
							</div>
							<div style={{ marginBottom: 10, flex: 8 }}>
								<div className="mb-1">Quote Asset</div>
								<Select
									style={{ width: '100%' }}
									value={orderPayload?.quote_coin}
									placeholder="Select Quote Asset"
									onChange={(value) =>
										setOrderPayload({
											...orderPayload,
											quote_coin: value,
										})
									}
								>
									{Object.values(coins).map((coin) => (
										<Select.Option value={coin.symbol}>
											{coin.fullname}
										</Select.Option>
									))}
								</Select>
							</div>
						</div>
						{orderPayload?.base_coin && orderPayload?.quote_coin && (
							<div style={{ marginBottom: 10 }}>
								Pair:{' '}
								<span style={{ fontWeight: 'bold' }}>
									{orderPayload?.base_coin}-{orderPayload?.quote_coin}
								</span>
							</div>
						)}

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

						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">Maker Fee (%)</div>
							<Input
								type="number"
								placeholder="Enter maker fee"
								// style={{ width: 200 }}
								value={orderPayload?.maker_fee}
								onChange={(e) =>
									setOrderPayload({
										...orderPayload,
										maker_fee: e.target.value,
									})
								}
							/>
						</div>
						<div style={{ marginBottom: 10 }}>
							<div className="mb-1">Taker Fee (%)</div>
							<Input
								type="number"
								placeholder="Enter taker fee"
								// style={{ width: 200 }}
								value={orderPayload?.taker_fee}
								onChange={(e) =>
									setOrderPayload({
										...orderPayload,
										taker_fee: e.target.value,
									})
								}
							/>
						</div>
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
								setOrderPayload();
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
									if (
										selectedEmailData2?.value == null ||
										selectedEmailData?.value == null
									) {
										message.error('Please select users');
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

									if (!orderPayload.price) {
										message.error('Please input pirce');
										return;
									}
									if (!orderPayload.base_coin) {
										message.error('Please select base asset');
										return;
									}

									if (!orderPayload.quote_coin) {
										message.error('Please select quote asset');
										return;
									}

									if (!orderPayload.maker_fee) {
										message.error('Please input maker fee');
										return;
									}

									if (!orderPayload.taker_fee) {
										message.error('Please input taker fee');
										return;
									}

									orderPayload.size = Number(orderPayload.size);
									orderPayload.price = Number(orderPayload.price);
									orderPayload.maker_fee = Number(orderPayload.maker_fee);
									orderPayload.taker_fee = Number(orderPayload.taker_fee);
									orderPayload.symbol = `${orderPayload.base_coin}-${orderPayload.quote_coin}`;

									if (orderPayload.type === 'market') {
										delete orderPayload.price;
									}

									await submitOrderByAdmin({
										...orderPayload,
										maker_id: selectedEmailData?.value,
										taker_id: selectedEmailData2?.value,
									});
									message.success('Trade successfully created');
									setDisplayCreateOrder(false);
									setPair('');
									setPair(null);
									setOrderPayload({});
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
							disabled={onHandleDisable()}
						>
							Create Trade
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
					{/* <Select
						style={{
							width: 100,
						}}
						options={TYPE_OPTIONS}
						value={type}
						onChange={setType}
					/> */}
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
						Create Trade
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
	coins: state.app.coins,
});

export default connect(mapStateToProps)(QuickTradesList);
