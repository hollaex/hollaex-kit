/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { PlusSquareOutlined } from '@ant-design/icons';
import { UploadOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Dialog } from 'components';
import axios from 'axios';
import {
	Row,
	Col,
	Form,
	Input,
	Select,
	Button,
	Card,
	List,
	message,
	Typography,
	Divider,
} from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import withConfig from 'components/ConfigProvider/withConfig';
const { Option } = Select;
const { Text } = Typography;

const MarginTrading = ({
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	user,
	token,
	balance,
}) => {
	// State for Create Margin Transfer
	const [balanceSymbol, setBalanceSymbol] = useState();
	const [balanceAmount, setBalanceAmount] = useState('');
	const [marginToSpot, setMarginToSpot] = useState(true);

	// State for Close Margin Position
	const [targetAsset, setTargetAsset] = useState('');
	const [positionId, setPositionId] = useState('');

	// State for Create Margin Order
	const [orderSymbol, setOrderSymbol] = useState();
	const [orderSide, setOrderSide] = useState('buy');
	const [orderSize, setOrderSize] = useState('');
	const [orderType, setOrderType] = useState('market');
	const [orderPrice, setOrderPrice] = useState('');
	const [orderStop, setOrderStop] = useState('');
	const [orderNote, setOrderNote] = useState('');
	const [userBalance, setBalance] = useState(balance);

	// State for Get Margin Positions
	const [marginPositions, setMarginPositions] = useState([]);

	// Fetch Margin Positions on Component Mount
	useEffect(() => {
		fetchMarginPositions();
	}, []);

	// Fetch Margin Positions
	const fetchMarginPositions = async () => {
		try {
			const response = await axios.get('/margin/position');
			setMarginPositions(response.data.data);
			fetchUserBalance();
		} catch (error) {
			message.error(
				`Error fetching margin positions: ${
					error.response?.data?.message || error.message
				}`
			);
		}
	};

	const fetchUserBalance = async () => {
		try {
			const response = await axios.get('/user/balance');
			setBalance(response.data);
		} catch (error) {
			return error;
		}
	};

	// Create Margin Transfer
	const handleCreateMarginTransfer = async () => {
		try {
			const response = await axios.post('/margin', {
				balance_symbol: balanceSymbol,
				balance_amount: parseFloat(balanceAmount),
				margin_to_spot: marginToSpot,
			});

			message.success(`Success: ${response.data.message}`);
			fetchMarginPositions();
		} catch (error) {
			message.error(`Error: ${error.response?.data?.message || error.message}`);
		}
	};

	// Close Margin Position
	const handleCloseMarginPosition = async () => {
		try {
			const response = await axios.post('/margin/position', {
				target_asset: targetAsset,
				position_id: parseFloat(positionId),
			});

			message.success(`Success: ${response.data.message}`);
			fetchMarginPositions();
		} catch (error) {
			message.error(`Error: ${error.response?.data?.message || error.message}`);
		}
	};

	// Create Margin Order
	const handleCreateMarginOrder = async () => {
		try {
			const response = await axios.post('/order', {
				symbol: orderSymbol,
				side: orderSide,
				size: parseFloat(orderSize),
				type: orderType,
				price: orderPrice ? parseFloat(orderPrice) : undefined,
				stop: orderStop ? parseFloat(orderStop) : undefined,
				meta: {
					margin: true,
				},
			});

			message.success(`Success: ${response.data.message}`);
			fetchMarginPositions();
		} catch (error) {
			message.error(`Error: ${error.response?.data?.message || error.message}`);
		}
	};

	const BalanceCard = () => {
		delete userBalance.user_id;
		const coins = Object.keys(userBalance).reduce((acc, key) => {
			const match = key.match(/^([a-zA-Z]+)_/);
			if (match) {
				const coin = match[1];
				if (!acc[coin]) {
					acc[coin] = {};
				}
				acc[coin][key] = userBalance[key];
			}
			return acc;
		}, {});

		return (
			<Card
				title="Balance Overview"
				headStyle={{ color: 'white', backgroundColor: '#1a1a1a' }}
				style={{
					backgroundColor: '#262626',
					color: 'white',
					marginTop: '24px',
					marginBottom: 20,
					border: '1px solid #404040',
				}}
			>
				<Row gutter={[0, 16]} style={{ padding: 16 }}>
					{Object.keys(coins).map((coin) => {
						const {
							[`${coin}_margin_balance`]: marginBalance,
							[`${coin}_margin_available`]: marginAvailable,
							[`${coin}_margin_borrowed`]: marginBorrowed,
						} = coins[coin];

						return (
							<React.Fragment key={coin}>
								<BalanceSection
									title={`${coin.toUpperCase()} Balances`} // Coin name as title
									data={{
										'Margin Total Balance': marginBalance,
										'Margin Available Balance': marginAvailable,
										'Margin Borrowed': marginBorrowed,
									}}
								/>

								{coin !== Object.keys(coins).slice(-1)[0] && (
									<Divider
										style={{ borderColor: '#404040', margin: '16px 0' }}
									/>
								)}
							</React.Fragment>
						);
					})}

					<div style={{ marginTop: 16, textAlign: 'right' }}>
						<Text type="secondary" style={{ color: '#8c8c8c', fontSize: 12 }}>
							Last Updated: {new Date(userBalance.timestamp).toLocaleString()}
						</Text>
					</div>
				</Row>
			</Card>
		);
	};

	const BalanceSection = ({ title, data }) => (
		<div style={{ width: '100%' }}>
			<Text
				strong
				style={{ color: '#bfbfbf', marginBottom: 12, display: 'block' }}
			>
				{title}
			</Text>
			<Row gutter={[24, 8]}>
				{Object.entries(data).map(([label, value]) => (
					<Col span={8} key={label}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Text style={{ color: '#8c8c8c' }}>{label}:</Text>
							<Text style={{ color: '#f5f5f5' }}>{value}</Text>
						</div>
					</Col>
				))}
			</Row>
		</div>
	);

	return (
		<div className="summary-container">
			<div style={{ padding: '24px' }}>
				<h1 style={{ color: 'white' }}>Margin Trading</h1>

				{BalanceCard()}
				<Row gutter={[16, 16]}>
					{/* Create Margin Transfer Section */}
					<Col span={8}>
						<Card
							headStyle={{ color: 'white' }}
							style={{
								backgroundColor: '#333333',
								color: 'white',
								border: '1px solid #404040',
							}}
							title="Create Margin Transfer"
						>
							<Form style={{ color: 'white' }} layout="vertical">
								<Form.Item
									label={
										<label style={{ color: 'white' }}>Balance Symbol</label>
									}
								>
									<Select
										value={balanceSymbol}
										onChange={(value) => setBalanceSymbol(value)} // Update balanceSymbol state
										placeholder="Select a symbol"
										style={{ width: '100%' }}
									>
										{Object.keys(coins).map((key) => (
											<Select.Option value={key}>{key}</Select.Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item
									label={
										<label style={{ color: 'white' }}>Balance Amount</label>
									}
								>
									<Input
										type="number"
										value={balanceAmount}
										onChange={(e) => setBalanceAmount(e.target.value)}
										placeholder="input"
									/>
								</Form.Item>
								<Form.Item
									label={
										<label style={{ color: 'white' }}>Transfer Direction</label>
									}
								>
									<Select
										value={marginToSpot}
										onChange={(value) => setMarginToSpot(value)}
									>
										<Option value={true}>Margin to Spot</Option>
										<Option value={false}>Spot to Margin</Option>
									</Select>
								</Form.Item>
								<Button type="primary" onClick={handleCreateMarginTransfer}>
									Create Transfer
								</Button>
							</Form>
						</Card>
					</Col>

					{/* Create Margin Order Section */}
					<Col span={8}>
						<Card
							headStyle={{ color: 'white' }}
							style={{
								backgroundColor: '#333333',
								color: 'white',
								border: '1px solid #404040',
							}}
							title="Create Margin Order"
						>
							<Form layout="vertical">
								<Form.Item
									label={<label style={{ color: 'white' }}>Symbol</label>}
								>
									<Select
										value={orderSymbol}
										onChange={(value) => setOrderSymbol(value)}
										placeholder="Select a symbol"
										style={{ width: '100%' }}
									>
										{Object.keys(pairs).map((key) => (
											<Select.Option value={key}>{key}</Select.Option>
										))}
									</Select>
								</Form.Item>

								<Form.Item
									label={<label style={{ color: 'white' }}>Side</label>}
								>
									<Select
										value={orderSide}
										onChange={(value) => setOrderSide(value)}
									>
										<Option value="buy">Buy</Option>
										<Option value="sell">Sell</Option>
									</Select>
								</Form.Item>
								<Form.Item
									label={<label style={{ color: 'white' }}>Size</label>}
								>
									<Input
										type="number"
										value={orderSize}
										onChange={(e) => setOrderSize(e.target.value)}
										placeholder="input.1"
									/>
								</Form.Item>
								<Form.Item
									label={<label style={{ color: 'white' }}>Type</label>}
								>
									<Select
										value={orderType}
										onChange={(value) => setOrderType(value)}
									>
										<Option value="market">Market</Option>
										<Option value="limit">Limit</Option>
									</Select>
								</Form.Item>
								{orderType === 'limit' && (
									<Form.Item
										label={<label style={{ color: 'white' }}>Price</label>}
									>
										<Input
											type="number"
											value={orderPrice}
											onChange={(e) => setOrderPrice(e.target.value)}
											placeholder="input"
										/>
									</Form.Item>
								)}
								{/* <Form.Item label="Stop Price (optional)">
                                <Input
                                    type="number"
                                    value={orderStop}
                                    onChange={(e) => setOrderStop(e.target.value)}
                                    placeholder="input"
                                />
                            </Form.Item>
                            <Form.Item label="Note (optional)">
                                <Input
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    placeholder="input margin order"
                                />
                            </Form.Item> */}
								<Button type="primary" onClick={handleCreateMarginOrder}>
									Create Order
								</Button>
							</Form>
						</Card>
					</Col>

					{/* Close Margin Position Section */}
					<Col span={8}>
						<Card
							headStyle={{ color: 'white' }}
							style={{
								backgroundColor: '#333333',
								color: 'white',
								border: '1px solid #404040',
							}}
							title="Close Margin Position"
						>
							<Form layout="vertical">
								<Form.Item
									label={<label style={{ color: 'white' }}>Target Asset</label>}
								>
									<Select
										value={orderSymbol}
										onChange={(value) => setTargetAsset(value)}
										placeholder="Select a coin"
										style={{ width: '100%' }}
									>
										{Object.keys(coins).map((key) => (
											<Select.Option value={key}>{key}</Select.Option>
										))}
									</Select>
								</Form.Item>

								<Form.Item
									label={<label style={{ color: 'white' }}>Position ID</label>}
								>
									<Input
										type="number"
										value={positionId}
										onChange={(e) => setPositionId(e.target.value)}
										placeholder="input"
									/>
								</Form.Item>
								<Button type="primary" onClick={handleCloseMarginPosition}>
									Close Position
								</Button>
							</Form>
						</Card>
					</Col>
				</Row>

				{/* Display Margin Positions */}
				<Card
					headStyle={{ color: 'white' }}
					style={{
						backgroundColor: '#333333',
						color: 'white',
						marginTop: '24px',
						border: '1px solid #404040',
					}}
					title="Margin Positions"
				>
					{marginPositions.length > 0 ? (
						<List
							dataSource={marginPositions}
							renderItem={(position) => (
								<List.Item>
									<Card
										headStyle={{ color: 'white' }}
										title={`Position ID: ${position.id}`}
										style={{
											width: '100%',
											backgroundColor: '#333333',
											border: '1px solid #404040',
										}}
									>
										<Row gutter={[16, 16]}>
											{/* Basic Info */}
											<Col span={8}>
												<p style={{ color: 'white' }}>
													<strong style={{ color: 'white ' }}>Symbol:</strong>{' '}
													{position.symbol}
												</p>
												<p style={{ color: 'white' }}>
													<strong style={{ color: 'white ' }}>Side:</strong>{' '}
													{position.side}
												</p>
												<p style={{ color: 'white' }}>
													<strong style={{ color: 'white ' }}>Size:</strong>{' '}
													{position.size}
												</p>
												<p style={{ color: 'white' }}>
													<strong style={{ color: 'white ' }}>Value:</strong>{' '}
													{position.value}
												</p>
											</Col>

											{/* Price Info */}
											<Col span={8}>
												<p style={{ color: 'white' }}>
													<strong style={{ color: 'white ' }}>
														Open Price:
													</strong>{' '}
													{position.open_price}
												</p>
												<p style={{ color: 'white' }}>
													<strong style={{ color: 'white ' }}>
														Current Price:
													</strong>{' '}
													{position.current_price}
												</p>
												<p style={{ color: 'white' }}>
													<strong style={{ color: 'white ' }}>
														Liquidation Price:
													</strong>{' '}
													{position.liquidation_price}
												</p>
											</Col>

											{/* Collateral and Borrowed Info */}
										</Row>
									</Card>
								</List.Item>
							)}
						/>
					) : (
						<p style={{ color: 'white' }}>No margin positions found.</p>
					)}
				</Card>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	balance: state.user.balance,
	user: state.user,
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withRouter(withConfig(MarginTrading)));
