import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ReactSVG } from 'react-svg';
import {
	Button,
	Tabs,
	Modal,
	Breadcrumb,
	Radio,
	Space,
	Switch,
	Tag,
	message,
	Select,
	Input,
	Tooltip,
} from 'antd';
import QR from 'qrcode.react';
import Subscription from './subscription';
import moment from 'moment';
import { STATIC_ICONS } from 'config/icons';
import PlanStructure from './planStructure';
import GeneralChildContent from './generalChildContent';
import {
	RightOutlined,
	InfoCircleOutlined,
	CopyOutlined,
} from '@ant-design/icons';
import {
	getExchangeBilling,
	getNewExchangeBilling,
	getPrice,
	setExchangePlan,
	requestStoreInvoice,
} from './action';
import './Billing.scss';
import { DASH_TOKEN_KEY } from 'config/constants';
import { getExchange } from '../AdminFinancials/action';
import {
	setSelectedPayment,
	setSelectedType,
	setType,
	setSelectedCrypto,
	setCryptoPaymentType,
} from '../../../actions/adminBillingActions';

const { Option } = Select;
const TabPane = Tabs.TabPane;

const TYPES = [
	{ type: 'basic', background: STATIC_ICONS['CLOUD_BASIC_BACKGROUND'] },
	{ type: 'crypto', background: STATIC_ICONS['CLOUD_CRYPTO_BACKGROUND'] },
	{ type: 'fiat', background: STATIC_ICONS['CLOUD_FIAT_BACKGROUND'] },
];

const payOptions = [
	{ key: 'pay', value: 'Pay from wallet' },
	{ key: 'transfer', value: 'Transfer crypto payment' },
];

const cryptoCoins = [
	{ coin: 'USDT', symbol: 'btc' },
	{ coin: 'Bitcoin', symbol: 'btc' },
	{ coin: 'XHT', symbol: 'xht' },
	{ coin: 'Ethereum', symbol: 'eth' },
	{ coin: 'TRON', symbol: 'trx' },
	{ coin: 'XRP', symbol: 'xrp' },
];

const columns = [
	{
		title: 'Item',
		dataIndex: 'item',
		key: 'item',
		render: (item, index) => (
			<div className="billing-package-text" key={index?.id}>
				{item}
			</div>
		),
	},
	{
		title: 'Description',
		dataIndex: 'description',
		key: 'description',
		render: (description, index) => <div key={index?.id}>{description}</div>,
	},
	{
		title: 'Amount',
		dataIndex: 'amount',
		key: 'amount',
		render: (amount, item) => `${amount} ${item.currency.toUpperCase()}`,
	},
	{
		title: 'Date',
		dataIndex: 'created_at',
		key: 'created_at',
		render: (date, item) => moment(date).format('MMM DD, YYYY'),
	},
	{
		title: 'Time left',
		dataIndex: 'expiry',
		key: 'expiry',
		render: (date, item) =>
			item.is_paid
				? '---'
				: moment(date).diff(moment(), 'days') >= 1
				? `${moment(date).diff(moment(), 'days')} days`
				: '0 days',
	},
	{
		title: 'Status',
		dataIndex: 'is_paid',
		key: 'is_paid',
		render: (isPaid, item) => {
			if (isPaid) {
				return (
					<div className="download-text-wrapper">
						<Tag color="green">Paid</Tag>
						<div>
							{/* <Icon type="download" onClick={() => handleDownload(item.id)} style={{ fontSize: '18px', color: '#808080' }} /> */}
						</div>
					</div>
				);
			} else if (moment().isAfter(moment(item.expiry))) {
				return <Tag color="red">Expired</Tag>;
			} else {
				return (
					<div>
						<Tag
							color="orange"
							style={{
								color: '#E87511',
								background: '#E8751133',
								borderColor: ' #E87511',
							}}
						>
							Unpaid{' '}
						</Tag>
						<span>
							<Link
							// onClick={() => {handleEdit(item.id, item.item === "plugin", true); }}
							// to={`/billing?id=${exchange.id}`}
							>
								Pay
							</Link>
						</span>
					</div>
				);
			}
		},
	},
];
const GeneralContent = ({
	selectedCrypto,
	exchange,
	user,
	setSelectedCrypto,
	selectedPayment,
	selectedType,
	type,
	setSelectedPayment,
	setSelectedType,
	setType,
	isAutomatedKYC,
}) => {
	const balance = user?.balance;
	const dashToken = localStorage.getItem(DASH_TOKEN_KEY);
	const options = ['item', 'method', 'crypto', 'payment'];
	const paymentMethods = [
		'PayPal',
		'Bank Wire Transfer',
		'Cryptocurrency',
		'Credit Card',
	];

	const [modalWidth, setModalWidth] = useState('85rem');
	const [OpenPlanModal, setOpenPlanModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isMonthly, setIsMonthly] = useState(false);
	const [isPaymentMethodDisable, setIsPaymentMethodDisable] = useState([]);
	const [invoceData, setInvoceData] = useState([]);
	const [priceData, setPriceData] = useState({});
	const [paymentOptions, setOptions] = useState([]);
	const [showPayAddress, setShowPayAddress] = useState(false);
	const [activeBreadCrumb, setActiveBreadCrumb] = useState(false);
	const [invoice, setInvoice] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getData();
		setIsLoading(true);
		getExchangePrice();
	}, []);

	useEffect(() => {
		if (dashToken) {
			getInvoice({ is_paid: false });
		}
	}, [dashToken]);

	useEffect(() => {
		if (selectedType === 'basic') {
			setIsPaymentMethodDisable(['PayPal', 'Bank Wire Transfer']);
		} else if (selectedType === 'crypto') {
			setIsPaymentMethodDisable(['Bank Wire Transfer']);
		}
	}, [selectedType]);

	useEffect(() => {
		const balanceAvailable = 0;
		if (balanceAvailable && balanceAvailable) {
			setOptions(payOptions);
		} else {
			const optionData = payOptions.filter((data) => data.key !== 'pay');
			setOptions(optionData);
		}
	}, [balance, selectedCrypto]);

	const handleGetCoins = (coin, symbol) => {
		return (
			<div className="get-coins">
				<div className="d-flex coin-wrapper">
					Get {coin}
					<div className="get-coin-here">
						<Link to={`/trade/${symbol}-usdt`}>here</Link>
					</div>
				</div>
			</div>
		);
	};

	const getData = async () => {};

	const handleBreadcrumb = (name) => {
		if (activeBreadCrumb) {
			if (type !== 'item') {
				if (type === 'method' && name === 'item') {
					setType('item');
				} else if (type === 'crypto' && name !== 'payment') {
					setType(name);
				} else if (type === 'payment') {
					setType(name);
				}
			}

			if (name === 'item' || type === 'item') {
				setModalWidth('85rem');
			} else {
				setModalWidth('65rem');
			}
		}
	};

	const isCloud = () => {
		const exchangePlans = ['basic', 'crypto', 'fiat'];
		if (exchangePlans.includes(exchange.plan)) {
			return true;
		} else {
			return false;
		}
	};

	const storePaymentMethod = async () => {
		try {
			if (
				invoice &&
				invoice.id &&
				(selectedPayment === 'paypal' ||
					selectedPayment === 'bank' ||
					selectedPayment === 'stripe')
			) {
				setLoading(true);
				let method = '';
				switch (selectedPayment) {
					case 'paypal':
					case 'bank':
					case 'stripe':
						method = selectedPayment;
						break;
					case 'cryptoCurrency':
						method = selectedCrypto;
						break;
					default:
						break;
				}
				console.log('method123', method);
				const res = requestStoreInvoice(invoice?.data?.id, { method });
				if (res.data) {
					switch (selectedPayment) {
						case 'paypal':
							window.location.replace(res.data.meta.redirect_url);
							message.success('Redirecting to the paypal');
							setInvoice(res.data);
							setLoading(false);
							// onCancel();
							break;
						case 'stripe':
							window.location.replace(res.data.meta.redirect_url);
							message.success('Redirecting to the payment');
							setInvoice(res.data);
							setLoading(false);
							// onCancel();
							break;
						case 'bank':
							setInvoice(res.data);
							// setNextType(selectedPayment);
							break;

						case 'cryptoCurrency':
							if (res.data.method === 'xht' && res.data.is_paid) {
								// setNextType('xhtPayment');
							} else if (res.data.method === 'xht' && !res.data.is_paid) {
								// setNextType('xhtInSufficient');
							} else {
								// setNextType('cryptoPayment');
							}
							setInvoice({
								...invoice,
								method,
								meta: { ...invoice.meta, ...res.data },
							});
							// setCurrencyAddress(res.data);
							break;
						default:
							break;
					}
					getInvoice();
					setTimeout(() => {
						setLoading(false);
					}, 1000);
				}
			} else if (selectedPayment === 'cryptoCurrency') {
				// setNextType(selectedPayment);
			}
		} catch (error) {
			console.error(error);
			setLoading(false);
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
		}
	};

	const renderFooter = () => {
		return (
			<div className="cloud-plan-wrapper">
				<div className="cloud-content">
					<h3 className="payment-header">
						{isAutomatedKYC
							? 'Selected item'
							: isCloud()
							? 'Selected cloud plan'
							: 'Selected DIY plan'}
					</h3>
					<div className="cloud-box-container d-flex">
						<div className="content-align d-flex">
							<div className="card-icon">
								<ReactSVG
									src={STATIC_ICONS['CLOUD_BASIC']}
									className="cloud-background"
								/>
								<ReactSVG
									src={STATIC_ICONS['CLOUD_CRYPTO']}
									className="cloud-icon"
								/>
							</div>
						</div>
						<div className="content-align d-flex seperator">
							<img
								src={`${STATIC_ICONS['EXCHANGE_ICON']}`}
								alt="Exchange-icon"
								className="exchange-icon"
							/>
							<span className="bodyContentSmall">texter-1</span>
						</div>
						<div className="month-content d-flex">Monthly payment:</div>
					</div>
				</div>
				<div>{renderBtn('payment-button')}</div>
			</div>
		);
	};

	const getExchangePrice = async () => {
		try {
			const res = await getPrice();
			let priceData = {};
			Object.keys(res.data).forEach((key) => {
				let temp = res.data[key];
				if (!temp.month) {
					temp.month = {};
				}
				if (!temp.year) {
					temp.year = {};
				}
				priceData[key] = { ...temp };
			});
			setPriceData(priceData);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			}
		}
	};

	const updatePlanType = async (params, callback = () => {}) => {
		try {
			const res = await setExchangePlan(params);
			if (exchange && exchange[0] && exchange[0].id && params.plan !== 'fiat') {
				const resInvoice = await getNewExchangeBilling(exchange[0].id);
				if (resInvoice.data) {
					// setState({ pendingInvoice: resInvoice.data });
					// getInvoice();
				}
			}
			if (res.data) {
				getExchange();
				callback();
			}
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
		}
	};

	const storePlanType = () => {
		if (exchange.type === 'DIY') {
			updatePlanType(
				{ id: exchange.id, plan: selectedType, period: 'year' },
				() => setType('method')
			);
			// setType('payment');
		} else if (
			selectedType === 'fiat' &&
			Object.keys(exchange.business_info)?.length
		) {
			// setFiatCompleted(true);
		} else if (selectedType === 'fiat') {
			updatePlanType(
				{
					id: exchange.id,
					plan: selectedType,
					period: isMonthly ? 'month' : 'year',
				},
				() => setType('enterPrise')
			);
			// setType("enterPrise")
		} else {
			updatePlanType(
				{
					id: exchange.id,
					plan: selectedType,
					period: isMonthly ? 'month' : 'year',
				},
				() => setType('method')
			);
			setType('method');
			setModalWidth('65rem');
			// setType('payment')
		}
	};

	const handleOnSwith = (isCheck) => {
		setIsMonthly(isCheck);
	};

	const renderModelContent = () => {
		return (
			<Breadcrumb separator={<RightOutlined />}>
				{options.map((name, inx) => {
					return (
						<Breadcrumb.Item
							onClick={() => handleBreadcrumb(name)}
							key={inx}
							className={name === type ? 'breadcrumb-item-active' : ''}
						>
							{name === 'crypto'
								? selectedPayment === 'Cryptocurrency' && 'Crypto'
								: name.charAt(0).toUpperCase() + name.slice(1)}
						</Breadcrumb.Item>
					);
				})}
			</Breadcrumb>
		);
	};

	const handleOpenModal = () => {
		setOpenPlanModal(true);
		setModalWidth('85rem');
		setType('item');
		setSelectedPayment('');
		setSelectedType('crypto');
	};

	const renderCard = () => {
		return (
			<div className="mt-5 card-boder">
				<div className={`card-design-${selectedType}`} />
				<div
					className="card-wrapper"
					style={{
						backgroundImage: `url(${STATIC_ICONS['CLOUD_BASIC_BACKGROUND']})`,
					}}
				>
					<div className="d-flex contentWrapper">
						<div className="card-icon">
							<ReactSVG
								src={STATIC_ICONS['CLOUD_BASIC']}
								className="cloud-background"
							/>
							<ReactSVG
								src={STATIC_ICONS['CLOUD_CRYPTO']}
								className="cloud-icon"
							/>
						</div>
						<div className="payment-text">
							<div className="d-flex">
								<p className="white-text">Cloud: </p>
								<p className="cloud-type">{selectedType}</p>
							</div>
							<p className="pb-5">
								Get started fast with a basic test exchange
							</p>
						</div>
					</div>
				</div>
				<div className="pay-button">
					<Button
						type="primary"
						onClick={() => handleOpenModal()}
						className="m-2 px-4 py-1"
						shape="round"
					>
						Pay
					</Button>
				</div>
				{}
			</div>
		);
	};

	const copyQr = async () => {
		var qrcode = document.getElementById('copyqrcode').value;
		return await navigator.clipboard.writeText(qrcode);
	};

	const handlePayMethod = (method) => {
		setSelectedPayment(method);
	};

	const renderContent = () => {
		switch (type) {
			case 'item':
				return (
					<div>
						<div className="switch-wrapper">
							<div className="d-flex">
								<div className="switch-content">
									<span className={'switch-label'}>Pay yearly</span>
									<div className="green-label save-label">(Save up to 35%)</div>
								</div>
								<Switch onClick={handleOnSwith} />
								<span className={'switch-label label-inactive ml-1'}>
									Pay monthly
								</span>
							</div>
						</div>
						<div className="bg-model">
							<div
								className={
									'box-container content-wrapper plan-structure-wrapper'
								}
							>
								{TYPES.map((type, inx) => {
									return (
										<PlanStructure
											className={
												selectedType === type.type
													? ''
													: 'opacity-plan-container'
											}
											selectedType={selectedType}
											setSelectedType={setSelectedType}
											typeData={type}
											dataType={type}
											priceData={priceData}
											isMonthly={isMonthly}
											key={inx}
										/>
									);
								})}
							</div>
							<div className="footer">
								<p>
									* A donation towards the HollaEx network is required for new
									custom coin and trading pair activation
								</p>
								<p>
									* Custom exchange code and technical support are not included
									in cloud plans and are paid separately
								</p>
							</div>
							{renderBtn('price', 'price-button')}
						</div>
					</div>
				);
			case 'method':
				return (
					<div className="radiobtn-container">
						<p>Select Payment Method</p>
						<Radio.Group className={'radio-content'} value={selectedPayment}>
							<Space direction="vertical">
								{paymentMethods.map((method, inx) => {
									return (
										<Radio
											value={method}
											disabled={isPaymentMethodDisable.includes(method)}
											onChange={() => handlePayMethod(method)}
										>
											{method === 'Cryptocurrency' ? (
												<>
													<span>{method} </span>
													<span className="danger"> (up to 10% off) </span>
													<span>
														<img
															src={STATIC_ICONS['FIRE_BALL']}
															className="fire-icon"
															alt="fire"
														/>
													</span>
												</>
											) : (
												method
											)}
										</Radio>
									);
								})}
							</Space>
						</Radio.Group>
						<Subscription />
						{renderBtn('payment', 'method-button')}
					</div>
				);
			case 'crypto':
				return (
					<div className="radiobtn-container">
						<p>Pick Crypto</p>
						<Radio.Group className="my-3" value={selectedCrypto}>
							<Space direction="vertical">
								{cryptoCoins.map((item, inx) => {
									return (
										<>
											<Radio
												onChange={() => setSelectedCrypto(item.coin)}
												name={item.coin}
												value={item.coin}
											>
												{item.coin === 'XHT' ? (
													<>
														<span>{item.coin} </span>
														<span className="danger"> (10% discount) </span>
														<span>
															<img
																src={STATIC_ICONS['FIRE_BALL']}
																className="fire-icon"
																alt="fire"
															/>
														</span>
													</>
												) : (
													item.coin
												)}
											</Radio>
											{selectedCrypto &&
												selectedCrypto === item.coin &&
												handleGetCoins(item.coin, item.symbol)}
										</>
									);
								})}
							</Space>
						</Radio.Group>
						<Subscription />
						{renderBtn('cryptoCurrency', 'crypto-button')}
					</div>
				);
			case 'payment':
				return (
					<div className="crypto-payment-container">
						<div>
							<div className="payment-type-dropdown">
								<h5>Select how to pay:</h5>
								<Select placeholder="Select payment method">
									{paymentOptions.map((item) => (
										<Option
											onChange={() => setCryptoPaymentType(item.value)}
											value={item.key}
											key={item.key}
										>
											{item.value}
										</Option>
									))}
								</Select>
							</div>
							<div className="payment-details">
								<span>
									<h5>Selected Crypto :</h5> <p>{selectedCrypto}</p>
								</span>
								<span>
									<h5> Required payment amount:</h5>
									<p>{`1.3875 ${selectedCrypto}`} </p>
								</span>
								{showPayAddress ? null : (
									<Button
										type="primary"
										onClick={() => setShowPayAddress(true)}
									>
										Show payment address:
									</Button>
								)}
							</div>
							{showPayAddress ? (
								<div className="qr-container">
									<div className="qr-text-container">
										<div style={{ width: '80%' }}>
											<div>
												<h5>Payment Address</h5>
												<Input.Group compact>
													<Input
														style={{ width: '70%' }}
														id={'copyqrcode'}
														defaultValue="git@github.com:ant-design/ant-design.git"
													/>
													<Tooltip title="copy QR code">
														<Button
															onClick={() => copyQr()}
															icon={<CopyOutlined />}
														/>
													</Tooltip>
												</Input.Group>
											</div>
											<div className="info-container">
												<div>
													<InfoCircleOutlined />
												</div>
												<p>
													Before sending your payment check and consider the
													transaction fee and that the required amount is
													sufficient.
												</p>
											</div>
										</div>
										<div className="scanner-container">
											<QR value={''} size={100} />
											<div className="bodyContentSmall">Scan this QR code</div>
										</div>
									</div>
									<p>
										After your payment has been received you will be sent an
										email with your payment details
									</p>
								</div>
							) : null}
						</div>
						{renderFooter()}
					</div>
				);
			default:
				return <div />;
		}
	};

	const handleNext = () => {
		if (type === 'item') {
			setType('method');
			storePlanType();
		} else if (type === 'method') {
			if (selectedPayment === 'Cryptocurrency') setType('crypto');
			else setOpenPlanModal(false);
		} else if (type === 'crypto') {
			setType('payment');
		} else if (type === 'payment') {
			setOpenPlanModal(false);
		}
		setModalWidth('65rem');
		setActiveBreadCrumb(true);
	};

	const handleBack = () => {
		if (type === 'item') {
			setOpenPlanModal(false);
		} else if (type === 'method') {
			setType('item');
		} else if (type === 'crypto') {
			setType('method');
		} else if (type === 'payment') {
			setType('crypto');
		}
		setModalWidth('85rem');
	};

	const renderBtn = (type, buttontype) => {
		switch (type) {
			case 'price':
				return (
					<div className={`${buttontype}`}>
						<Button block type="primary" onClick={handleBack}>
							Back
						</Button>
						<div className="btn-divider" />
						<Button
							block
							type="primary"
							onClick={storePlanType}
							disabled={type === 'diy'}
						>
							Next
						</Button>
					</div>
				);
			case 'payment':
				return (
					<div className={`${buttontype}`}>
						<Button block type="primary" onClick={handleBack}>
							Back
						</Button>
						<div className="btn-divider" />
						<Button block type="primary" onClick={storePaymentMethod()}>
							Next
						</Button>
					</div>
				);
			// case 'paypal':
			//     return null;
			// case 'stripe':
			//     return null;
			// case 'bank':
			//     return (
			//         <div className={`${buttontype}`}>
			//             <Button block type="primary" onClick={handleBack}>Back</Button>
			//             <div className='btn-divider' />
			//             <Button block type="primary" onClick={handleNext}>
			//                 Proceed
			//             </Button>
			//         </div>
			//     );
			case 'cryptoCurrency':
				return (
					<div className="d-flex">
						<Button block type="primary" onClick={handleBack}>
							Back
						</Button>
						<div className="btn-divider" />
						<Button block type="primary" onClick={handleNext}>
							Next
						</Button>
					</div>
				);
			// case 'cryptoPayment':
			//     const balanceAvailable = balance[`${currency.toLowerCase()}_available`] || 0;
			//     const paymentAmount = currencyData.amount || 0;
			//     return (
			//         <div className='d-flex'>
			//             <Button block type="primary" onClick={handleBack}>
			//                 Back
			//             </Button>
			//             <div className='btn-divider' />
			//             {cryptoPayType === "pay" ?
			//                 <Button
			//                     block type="primary"
			//                     disabled={cryptoPayType === 'pay' && (!balanceAvailable || balanceAvailable < paymentAmount || loading)}
			//                     onClick={handleNext}>
			//                     {cryptoPayType === 'pay' ? 'Proceed' : 'Yes, I have sent the crypto. Continue'}
			//                 </Button>
			//                 : <Button block type="primary" onClick={onClose}>
			//                     Done
			//                 </Button>
			//             }
			//         </div>
			//     );
			// case 'xhtPayment':
			//     return (
			//         <Button block type="primary" onClick={handleNext}>Confirm payment</Button>
			//     );
			// case 'xhtInSufficient':
			//     return (
			//         <Button block type="primary" onClick={() => history.push('/credit')}>Go to XHT Balance</Button>
			//     );
			// case 'confirmation':
			//     return (
			//         <div className={`${type}`}>
			//             <Button block type="primary" onClick={handleBack}>Back</Button>
			//             <div className="btn-divider" />
			//             <Button block type="primary" onClick={onCancel}>Okay</Button>
			//         </div>
			//     );
			// case 'payment-confirm':
			// case 'kyc-payment-confirm':
			//     return (
			//         <Button block type="primary" onClick={onCancel}>Okay</Button>
			//     );
			default:
				return null;
		}
	};

	const getInvoice = async (params) => {
		const res = await getExchangeBilling(params);
		if (res && res?.data && res?.data?.data) {
			setInvoceData(res?.data?.data);
		}
		setIsLoading(false);
	};

	const getTableData = (key) => {
		setIsLoading(true);
		if (key === '1') {
			getInvoice({ is_paid: false });
		} else {
			getInvoice({ is_paid: true });
		}
	};

	return (
		<div className="general-content-wrapper">
			<div className="d-flex mt-1 ml-3">
				<ReactSVG
					src={STATIC_ICONS['CLOUD_FIAT']}
					className="cloud-background"
				/>

				<div className="ml-4  header-content">
					<p className="description-header">Payment for Plans</p>
					<div className="d-flex description-content">
						<div>Below is current your plan. Get more view details on</div>
						<div className="cloud-plans mx-1">cloud plans here.</div>
					</div>
					<p className="description-content">Current Plan : {selectedType}</p>
				</div>
			</div>
			{renderCard()}

			<Modal
				visible={OpenPlanModal}
				className="bg-model"
				width={modalWidth}
				zIndex={1000}
				onCancel={() => setOpenPlanModal(false)}
				footer={null}
			>
				{renderModelContent()}
				{renderContent()}
			</Modal>

			<Tabs
				defaultActiveKey={0}
				className="mt-5 tab-border"
				onChange={getTableData}
			>
				<TabPane tab="Pending" key="1">
					<GeneralChildContent
						columns={columns}
						dataSource={invoceData}
						isLoading={isLoading}
					/>
				</TabPane>
				<TabPane tab="Paid" key="2">
					<GeneralChildContent
						columns={columns}
						dataSource={invoceData}
						isLoading={isLoading}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (store) => ({
	selectedPayment: store.admin.selectedPayment,
	selectedType: store.admin.selectedType,
	type: store.admin.type,
	selectedCrypto: store.admin.selectedCrypto,
	isAutomatedKYC: store.admin.isAutomatedKYC,
});

export default connect(mapStateToProps, {
	setSelectedPayment,
	setSelectedType,
	setType,
	setSelectedCrypto,
})(GeneralContent);
