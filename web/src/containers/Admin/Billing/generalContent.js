import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ReactSVG } from 'react-svg';
import QR from 'qrcode.react';
import moment from 'moment';
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
import {
	RightOutlined,
	InfoCircleOutlined,
	CopyOutlined,
} from '@ant-design/icons';
import { STATIC_ICONS } from 'config/icons';
import { DASH_TOKEN_KEY } from 'config/constants';
import Subscription from 'containers/Admin/Billing/subscription';
import PlanStructure from 'containers/Admin/Billing/planStructure';
import GeneralChildContent from 'containers/Admin/Billing/generalChildContent';
import {
	getExchangeBilling,
	getNewExchangeBilling,
	getPrice,
	setExchangePlan,
	requestStoreInvoice,
} from './action';
import './Billing.scss';
import { getExchange } from '../AdminFinancials/action';
import {
	setSelectedPayment,
	setSelectedType,
	setExchangePlanType,
	setSelectedCrypto,
	setCryptoPaymentType,
} from 'actions/adminBillingActions';
import EnterpriseForm from '../EnterPriseForm';
import { planData } from './planStructure';
import './Billing.scss';

const { Option } = Select;
const TabPane = Tabs.TabPane;

const TYPES = [
	{
		name: 'Basic',
		type: 'basic',
		background: STATIC_ICONS['CLOUD_BASIC_BACKGROUND'],
	},
	{
		name: 'Crypto Pro',
		type: 'crypto',
		background: STATIC_ICONS['CLOUD_CRYPTO_BACKGROUND'],
	},
	{
		name: 'Fiat Ramp',
		type: 'fiat',
		background: STATIC_ICONS['CLOUD_FIAT_BACKGROUND'],
	},
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

const paymentMethods = [
	{ label: 'PayPal', method: 'paypal' },
	{ label: 'Bank Wire Transfer', method: 'bank' },
	{ label: 'Cryptocurrency', method: 'cryptoCurrency' },
	{ label: 'Credit Card', method: 'stripe' },
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
	setSelectedPayment,
	setSelectedType,
	exchangePlanType,
	setExchangePlanType,
	isAutomatedKYC,
}) => {
	const balance = user?.balance;
	const dashToken = localStorage.getItem(DASH_TOKEN_KEY);
	const options = ['item', 'method', 'crypto', 'payment'];
	const subscribtionPaymentPrice = priceData?.[selectedType];

	const [modalWidth, setModalWidth] = useState('85rem');
	const [OpenPlanModal, setOpenPlanModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isMonthly, setIsMonthly] = useState(false);
	const [invoceData, setInvoceData] = useState([]);
	const [priceData, setPriceData] = useState({});
	const [paymentOptions, setOptions] = useState([]);
	const [showPayAddress, setShowPayAddress] = useState(false);
	const [activeBreadCrumb, setActiveBreadCrumb] = useState(false);
	const [invoice, setInvoice] = useState({});
	const [loading, setLoading] = useState(false);
	const [isFiatFormCompleted, setFiatCompleted] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		getExchangePrice();
	}, []);

	useEffect(() => {
		if (dashToken) {
			getInvoice({ is_paid: false });
		}
	}, [dashToken]);

	useEffect(() => {
		const balanceAvailable = 0;
		if (balanceAvailable && balanceAvailable) {
			setOptions(payOptions);
		} else {
			const optionData = payOptions.filter((data) => data.key !== 'pay');
			setOptions(optionData);
		}
	}, [balance, selectedCrypto]);

	const submitEnterprise = async (formProps) => {};

	const renderCoins = (coin, symbol) => {
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

	const onHandleBreadcrumb = (name) => {
		if (activeBreadCrumb) {
			if (
				exchangePlanType !== 'item' &&
				((exchangePlanType === 'method' && name === 'item') ||
					(exchangePlanType === 'crypto' && name !== 'payment') ||
					exchangePlanType === 'payment')
			) {
				setExchangePlanType(name);
			}

			if (name === 'item' || exchangePlanType === 'item') {
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
		let invoice = {
			id: 524,
			amount: 30000,
			currency: 'usd',
			item: 'fiat',
			description: 'HollaEx Yearly Cloud Hosting',
			is_paid: false,
			is_overpaid: false,
			is_underpaid: false,
			expiry: '2023-01-26T11:11:34.021Z',
			method: '',
			meta: { exchange_id: 1144 },
			created_at: '2023-01-19T11:11:34.056Z',
			updated_at: '2023-01-19T11:15:42.657Z',
			user_id: 2826,
		};
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
						setOpenPlanModal(false);
					case 'bank':
					case 'stripe':
						setOpenPlanModal(false);
						break;
					case 'cryptoCurrency':
						setOpenPlanModal(false);
						break;
					default:
						break;
				}
			} else if (selectedPayment === 'cryptoCurrency') {
				setExchangePlanType('crypto');
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
			Object.keys(res).forEach((key) => {
				let temp = res[key];
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
		// const parObj = {
		//  id: 1144,
		//  period: 'year',
		//  plan: 'fiat',
		// };
		try {
			const res = await setExchangePlan(params);
			if (exchange && exchange.id && params.plan !== 'fiat') {
				const resInvoice = await getNewExchangeBilling(exchange.id);
				if (resInvoice.data) {
					// setInvoceData({ pendingInvoice: resInvoice.data });
					getInvoice();
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
				() => setExchangePlanType('method')
			);
			// setExchangePlanType('payment');
		} else if (
			selectedType === 'fiat' &&
			exchange?.business_info &&
			Object.keys(exchange.business_info)?.length
		) {
			setFiatCompleted(true);
		} else if (selectedType === 'fiat') {
			updatePlanType(
				{
					id: exchange.id,
					plan: selectedType,
					period: isMonthly ? 'month' : 'year',
				}
				// () => setExchangePlanType('enterPrise')
			);
			setExchangePlanType('fiat');
			setModalWidth('55rem');
		} else {
			updatePlanType(
				{
					id: exchange.id,
					plan: selectedType,
					period: isMonthly ? 'month' : 'year',
				},
				() => setExchangePlanType('method')
			);
			setExchangePlanType('method');
			setModalWidth('65rem');
			setActiveBreadCrumb(true);
			// setExchangePlanType('payment')
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
							onClick={() => onHandleBreadcrumb(name)}
							key={inx}
							className={
								name === exchangePlanType ? 'breadcrumb-item-active' : ''
							}
						>
							{name === 'crypto'
								? selectedPayment === 'cryptoCurrency' && 'Crypto'
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
		setExchangePlanType('item');
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
								<p className="cloud-type">{planData?.[selectedType]?.title}</p>
							</div>
							<p className="pb-5">{planData?.[selectedType]?.description}</p>
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

	const checkDisabled = (method) => {
		if (
			method === 'bank' ||
			(selectedType === 'basic' && method === 'paypal')
		) {
			return true;
		}
		return false;
	};

	const renderContent = () => {
		switch (exchangePlanType) {
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
							<div>
								{' '}
								{isFiatFormCompleted ? (
									<div className="success-msg">
										You've already submitted a Fiat Ramp form.
									</div>
								) : null}
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
							{renderBtn('price')}
						</div>
					</div>
				);
			case 'method':
				return (
					<div className="radiobtn-container">
						<p>Select Payment Method</p>
						<Radio.Group className={'radio-content'} value={selectedPayment}>
							<Space direction="vertical">
								{paymentMethods.map((opt, inx) => {
									return (
										<Radio
											value={opt.method}
											disabled={checkDisabled(opt.method)}
											onChange={() => setSelectedPayment(opt.method)}
										>
											{opt.method === 'cryptoCurrency' ? (
												<>
													<span>{opt.label} </span>
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
												<span>{opt.label} </span>
											)}
										</Radio>
									);
								})}
							</Space>
						</Radio.Group>
						<Subscription
							isMonthly={isMonthly}
							planPriceData={subscribtionPaymentPrice}
						/>
						{renderBtn('payment')}
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
												renderCoins(item.coin, item.symbol)}
										</>
									);
								})}
							</Space>
						</Radio.Group>
						<Subscription
							isMonthly={isMonthly}
							planPriceData={subscribtionPaymentPrice}
						/>
						{renderBtn('cryptoCurrency')}
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
											<div className="bodyContentSmall">
												Scannable QR code of payment address
											</div>
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
			case 'fiat':
				return (
					<div className="enterprise-form-wrapper">
						<EnterpriseForm onSubmitEnterprise={submitEnterprise} />
					</div>
				);
			default:
				return <div />;
		}
	};

	const handleNext = () => {
		if (exchangePlanType === 'item') {
			setExchangePlanType('method');
			storePlanType();
		} else if (exchangePlanType === 'method') {
			if (selectedPayment === 'cryptoCurrency') setExchangePlanType('crypto');
			else setOpenPlanModal(false);
		} else if (exchangePlanType === 'crypto') {
			setExchangePlanType('payment');
		} else if (exchangePlanType === 'payment') {
			setOpenPlanModal(false);
		}
		setModalWidth('65rem');
		setActiveBreadCrumb(true);
	};

	const handleBack = () => {
		if (exchangePlanType === 'item') {
			setOpenPlanModal(false);
		} else if (exchangePlanType === 'method') {
			setExchangePlanType('item');
		} else if (exchangePlanType === 'crypto') {
			setExchangePlanType('method');
		} else if (exchangePlanType === 'payment') {
			setExchangePlanType('crypto');
		}
		setModalWidth('85rem');
	};

	const renderBtn = (type) => {
		<div className="payment-button">
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
		</div>;
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
	exchangePlanType: store.admin.exchangePlanType,
	selectedCrypto: store.admin.selectedCrypto,
	isAutomatedKYC: store.admin.isAutomatedKYC,
});

export default connect(mapStateToProps, {
	setSelectedPayment,
	setSelectedType,
	setExchangePlanType,
	setSelectedCrypto,
})(GeneralContent);
