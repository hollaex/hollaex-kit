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
	Form,
} from 'antd';
import {
	RightOutlined,
	InfoCircleOutlined,
	CopyOutlined,
} from '@ant-design/icons';
import { STATIC_ICONS } from 'config/icons';
import { DASH_TOKEN_KEY } from 'config/constants';
import PlanStructure from 'containers/Admin/Billing/planStructure';
import DIYPlanStructure from 'containers/Admin/Billing/diyPlanStructure';
import GeneralChildContent from 'containers/Admin/Billing/generalChildContent';
import {
	getExchangeBilling,
	getNewExchangeBilling,
	// getNewExchangeBilling,
	getPrice,
	requestStoreInvoice,
	setExchangePlan,
	// setExchangePlan,
} from './action';
import './Billing.scss';
// import { getExchange } from '../AdminFinancials/action';
import {
	setSelectedPayment,
	setSelectedType,
	setExchangePlanType,
	setSelectedCrypto,
	setCryptoPaymentType,
	setTransferCryptoPayment,
	setFiatSubmission,
	setPaymentAddressDetails,
	setExchangeCardKey,
} from 'actions/adminBillingActions';
import EnterpriseForm from '../EnterPriseForm';
import './Billing.scss';
import { getExchange } from '../AdminFinancials/action';
import _get from 'lodash/get';

const { Option } = Select;
const TabPane = Tabs.TabPane;

export const planData = {
	basic: {
		title: 'Basic',
		description: 'Get started fast with a basic test exchange',
		background: STATIC_ICONS['CLOUD_BASIC_BACKGROUND'],
		icon: 'BASIC_PLAN_BACKGROUND',
		isPopular: false,
		section: [
			{
				title: 'Cloud',
				points: ['Cloud exchange server hosting'],
			},
		],
		services: {
			title: 'Limited features',
			points: [
				'Theme customization',
				'Localization',
				'Custom domain',
				'Add HollaEx plugins',
				'Add custom plugins',
				'Download exchange logs',
				'Full exchange backup',
			],
			hideOnMonthly: false,
			hideActive: false,
		},
		amount: {
			yearly: 75,
			discount: '25%',
			monthly: 100,
			share: '50%',
		},
	},
	crypto: {
		title: 'Crypto Pro',
		description:
			'For those looking to start a crypto-to-crypto exchange business',
		background: STATIC_ICONS['CLOUD_CRYPTO_BACKGROUND'],
		icon: 'CRYPTO_PRO_PLAN_BACKGROUND',
		isPopular: true,
		section: [
			{
				title: 'Cloud',
				points: ['Cloud exchange server hosting'],
			},
		],
		services: {
			title: 'Full features',
			points: [
				'Theme customization',
				'Localization',
				'Custom domain',
				'Add HollaEx plugins',
				'Add custom plugins',
				'Add custom GitHub repo',
				'Team management & roles',
				'Download exchange logs',
				'Full exchange backup',
				'Landing page (homepage)',
				'Remove HollaEx badge',
				'Referral affiliate link',
				'Crypto chat box',
			],
			hideOnMonthly: false,
			hideActive: false,
		},
		asset_pairs: {
			title: 'Asset and pairs',
			points: ['One free custom crypto coin & pair'],
		},
		amount: {
			yearly: 210,
			discount: '30%',
			monthly: 300,
			share: '25%',
		},
	},
	fiat: {
		title: 'Fiat Ramp',
		description:
			'For those that want to start a fiat to crypto exchange that have a bank or fiat payment processor',
		background: STATIC_ICONS['CLOUD_FIAT_BACKGROUND'],
		icon: 'FIAT_MASTER_PLAN_BACKGROUND',
		isPopular: false,
		section: [
			{
				title: 'Cloud',
				points: ['Cloud exchange server hosting'],
			},
		],
		services: {
			title: 'Full features',
			points: [
				'Theme customization',
				'Localization',
				'Custom domain',
				'Add HollaEx plugins',
				'Add custom plugins',
				'Add custom GitHub repo',
				'Full management & system',
				'Download exchange logs',
				'Full exchange backup',
				'Landing page (homepage)',
				'Remove HollaEx badge',
				'Referral affiliate link',
				'Crypto chat box',
			],
			hideOnMonthly: false,
			hideActive: false,
		},
		asset_pairs: {
			title: 'Asset and pairs',
			points: [
				'One free custom crypto coin & pair',
				'One free fiat coin & pair',
			],
		},
		integration: {
			title: 'Fiat integration & KYC system',
			points: [
				'Add fiat bank or payment ramp',
				'Know your customer (KYC) system',
			],
		},
		amount: {
			yearly: 850,
			discount: '35%',
			monthly: 1000,
			share: '15%',
		},
	},
};

export const diyPlanData = {
	diy: {
		title: 'Do-it-yourself',
		description:
			'For tech savvy people that know their way around a server and can self-host their exchange.',
		isPopular: false,
		// icon: DIY_ICON,
		section: [
			{
				title: 'Limited features',
				points: [
					'Theme customization',
					'Localization',
					'Add HollaEx plugins',
					'Add custom plugins',
					'Custom code',
				],
			},
		],
	},
	boost: {
		title: 'DIY Boost',
		description:
			'For expert DIY exchange operators seeking more. Comes fully featured out with reduced revenue sharing, one free custom token and market.',
		isPopular: true,
		// icon: DIY_BOOST_ICON,
		services: {
			title: 'Full features',
			points: [
				'Theme customization',
				'Localization',
				'Add HollaEx plugins',
				'Add custom plugins',
				'Custom code',
				'Multiple role management system',
				'Landing page (homepage)',
				'Remove HollaEx badge',
				'Crypto chat box',
				'Minimum revenue sharing',
				'Fiat integration',
			],
			hideOnMonthly: false,
			hideActive: false,
		},
		asset_pairs: {
			title: 'Asset and pairs',
			points: ['One free custom crypto coin & pair'],
		},
	},
};

const payOptions = [
	{ key: 'pay', value: 'Pay from wallet' },
	{ key: 'transfer', value: 'Transfer crypto payment' },
];

const cryptoCoins = [
	{ coin: 'USDT', symbol: 'usdt' },
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

const configureTypes = [
	{ name: 'Cloud Exchange', value: 'cloudExchange' },
	{ name: 'DIY', value: 'diy' },
];

const options = ['item', 'method', 'crypto', 'payment'];
const fiatOptions = ['item', 'apply'];

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
	setTransferCryptoPayment,
	transferCryptoPayment,
	setFiatSubmission,
	fiatSubmission,
	setPaymentAddressDetails,
	paymentAddressDetails,
	putExchange,
	exchangeCardKey,
	setExchangeCardKey,
}) => {
	const balance = user?.balance;
	const SwitchState = exchange.period === 'year' ? true : false;
	const dashToken = localStorage.getItem(DASH_TOKEN_KEY);

	const [modalWidth, setModalWidth] = useState('85rem');
	const [OpenPlanModal, setOpenPlanModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isMonthly, setIsMonthly] = useState(SwitchState);
	const [invoceData, setInvoceData] = useState([]);
	const [priceData, setPriceData] = useState({});
	const [paymentOptions, setOptions] = useState([]);
	const [showPayAddress, setShowPayAddress] = useState(false);
	const [activeBreadCrumb, setActiveBreadCrumb] = useState(false);
	const [isFiatFormCompleted, setFiatCompleted] = useState(false);
	const [configure, setConfigure] = useState(false);
	const [selectedPlanData, setSelectedPlanData] = useState({});
	const [fiatBreadCrumb, setFiatBreadCrumb] = useState(false);
	const [proceedState, setProceedState] = useState(false);
	const [showCloudPlanDetails, setShowCloudPlanDetails] = useState(false);

	const planPriceData = priceData[selectedType];

	useEffect(() => {
		setIsLoading(true);
		getExchangePrice();
	}, []);

	useEffect(() => {
		if (exchange.plan === 'diy' && exchangeCardKey === 'diy') {
			setSelectedPlanData(diyPlanData);
		} else {
			setSelectedPlanData(planData);
			setExchangeCardKey('cloudExchange');
		}
	}, [exchangeCardKey, exchange.plan === 'diy']);

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
	}, [balance, selectedCrypto.coin]);

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
		setIsMonthly(false);
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
				setExchangePlanType('item');
			}
			if (name === 'apply' && exchangePlanType === 'fiat') {
				setExchangePlanType('method');
				setFiatBreadCrumb(false);
			}
			setFiatBreadCrumb(false);
		}
	};

	const OnHandleCancel = () => {
		setOpenPlanModal(false);
		setTransferCryptoPayment(false);
		setShowCloudPlanDetails(false);
		setShowPayAddress(false);
		setFiatSubmission(false);
		setSelectedPayment('cryptoCurrency');
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
				invoceData[0] &&
				invoceData[0].id &&
				(selectedPayment === 'paypal' ||
					selectedPayment === 'bank' ||
					selectedPayment === 'stripe' ||
					exchangePlanType === 'method' ||
					'crypto')
			) {
				let method =
					selectedPayment !== 'cryptoCurrency'
						? selectedPayment
						: selectedCrypto.symbol;
				switch (selectedPayment) {
					case 'paypal':
						setOpenPlanModal(false);
						break;
					case 'bank':
						break;
					case 'stripe':
						setOpenPlanModal(false);
						break;
					default:
						break;
				}
				const res = await requestStoreInvoice(invoceData[0].id, { method });
				if (res) {
					switch (selectedPayment) {
						case 'paypal':
							window.location.replace(res.meta.redirect_url);
							message.success('Redirecting to the paypal');
							setOpenPlanModal(false);
							break;
						case 'stripe':
							window.location.replace(res.meta.redirect_url);
							message.success('Redirecting to the payment');
							setOpenPlanModal(false);
							break;
						case 'bank':
							break;
						case 'crypto':
							// if (res.method === 'xht' && res.is_paid) {
							// setNextType('xhtPayment');
							// } else if (res.method === 'xht' && !res.is_paid) {
							// setNextType('xhtInSufficient');
							// } else {
							// setNextType('cryptoPayment');
							// }
							// setInvoice({ ...invoceData[0], method, meta: { ...invoceData[0].meta, ...res } });
							// setCurrencyAddress(res);
							break;
						default:
							break;
					}
					if (exchangePlanType === 'crypto') {
						setPaymentAddressDetails(res);
					}
					getInvoice();
					setExchangePlanType('payment');
				}
			} else if (selectedPayment === 'cryptoCurrency') {
				setExchangePlanType('crypto');
			}
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
		}
	};

	const renderFooter = () => {
		return (
			<div>
				<div className="horizantal-line">
					<div className="plan-header">
						{isAutomatedKYC
							? 'Selected item'
							: isCloud()
							? 'Selected cloud plan'
							: 'Selected DIY plan'}
					</div>
					<div className="subscription-container">
						<div className="plan-card">
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
							<div>
								<h6>PLAN SUBSCRIBTION</h6>
								<p className="f-16">{planData?.[selectedType]?.title}</p>
								<h6>
									{isMonthly
										? 'HollaEx Monthly Cloud Hosting:'
										: 'HollaEx Yearly Cloud Hosting:'}
								</h6>
							</div>
						</div>
						<div className="exchange-text">
							<span>
								<ReactSVG
									src={STATIC_ICONS['EXCHANGE_LOGO_LIGHT_THEME']}
									className="cloud-icon"
								/>
							</span>
							<h6>{exchange?.name}</h6>
						</div>
						<div className="payment-container">
							<p className="f-20">
								{isMonthly ? 'Monthly payment:' : 'Yearly payment:'}
							</p>
							<p className="f-20">
								{exchangePlanType === 'payment'
									? `${selectedCrypto.symbol.toUpperCase()} ${
											paymentAddressDetails?.amount
									  }`
									: isMonthly
									? `USD${_get(planPriceData, 'month.price')}`
									: `USD ${_get(planPriceData, 'year.price')}`}
							</p>
						</div>
					</div>
					<div>{renderBtn()}</div>
				</div>
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
		try {
			const res = await setExchangePlan(params);
			if (exchange && exchange.id && params.plan !== 'fiat') {
				const resInvoice = await getNewExchangeBilling(exchange.id);
				if (resInvoice) {
					getInvoice();
				}
			}
			if (res) {
				getExchange();
				callback();
				if (selectedType === 'fiat') {
					setExchangePlanType('fiat');
				} else {
					setModalWidth('65rem');
					setExchangePlanType('method');
				}
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
		if (
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
			setActiveBreadCrumb(true);
		}
	};

	const handleOnSwith = (isCheck) => {
		setIsMonthly(isCheck);
	};

	const renderModelContent = () => {
		const breadCrumbOptions = selectedType === 'fiat' ? fiatOptions : options;
		return showCloudPlanDetails ? (
			<div>Cloud plan details</div>
		) : (
			<Breadcrumb separator={<RightOutlined />}>
				{breadCrumbOptions.map((name, inx) => {
					return (
						<Breadcrumb.Item
							onClick={() => onHandleBreadcrumb(name)}
							key={inx}
							className={
								name === exchangePlanType ? 'breadcrumb-item-active' : ''
							}
						>
							{fiatBreadCrumb
								? name.charAt(0).toUpperCase() + name.slice(1)
								: name === 'crypto'
								? selectedPayment === 'cryptoCurrency' && 'Crypto'
								: name.charAt(0).toUpperCase() + name.slice(1)}
						</Breadcrumb.Item>
					);
				})}
			</Breadcrumb>
		);
	};
	const handleOpenModal = () => {
		if (exchangeCardKey === 'diy') {
			setSelectedType('diy');
		} else {
			setSelectedType('crypto');
		}
		setOpenPlanModal(true);
		setModalWidth('85rem');
		setExchangePlanType('item');
	};

	const onHandleConfig = (values) => {
		setExchangeCardKey(values.configure);
		setProceedState(true);
		if (values.configure !== 'diy') {
			setOpenPlanModal(true);
			setSelectedType('crypto');
		} else {
			setSelectedType('diy');
		}
		setConfigure(false);
		putExchange(values.configure === 'diy' ? 'DIY' : 'Cloud');
	};

	const renderCard = () => {
		return (
			<div className="mt-5 card-boder">
				<div className={`card-design-${selectedType}`} />
				<div
					className="card-wrapper"
					style={{
						backgroundImage: `url(${
							selectedType === 'basic'
								? STATIC_ICONS['CLOUD_BASIC_BACKGROUND']
								: selectedType === 'crypto'
								? STATIC_ICONS['CLOUD_CRYPTO_BACKGROUND']
								: STATIC_ICONS['CLOUD_FIAT_BACKGROUND']
						})`,
					}}
				>
					<div className={`d-flex ${selectedType}-content-wrapper w-100`}>
						<ReactSVG
							src={`${
								selectedType === 'basic'
									? STATIC_ICONS['CLOUD_PLAN_BASIC']
									: selectedType === 'crypto'
									? STATIC_ICONS['CLOUD_PLAN_CRYPTO_PRO']
									: selectedType === 'fiat'
									? STATIC_ICONS['CLOUD_PLAN_FIAT_RAMP']
									: selectedType === 'diy'
									? STATIC_ICONS['DIY_ICON']
									: STATIC_ICONS['DIY_FIRE_MAN_ICON']
							}`}
							className={
								selectedType === 'diy' || selectedType === 'boost'
									? 'diy-background'
									: 'cloud-background'
							}
						/>

						<div className="payment-text">
							<div className="justify-between">
								<div className="d-flex">
									{exchangeCardKey !== 'diy' && (
										<p className="white-text">Cloud: </p>
									)}
									<p
										className={
											exchangeCardKey === 'diy' ? 'diy-type' : 'cloud-type'
										}
									>
										{selectedType === 'diy' ? 'Do-It-Yourself' : selectedType}
									</p>
								</div>
								{exchange.plan === 'diy' ? (
									<div
										className="configure-wrapper"
										onClick={() => setConfigure(true)}
									>
										<ReactSVG
											src={STATIC_ICONS['SETTINGS']}
											className="setting-icon"
										/>
										<p>Configure Plan</p>
									</div>
								) : null}
							</div>
							<p className={selectedType ? 'basic-plan' : 'crypto-fiat-plan'}>
								{planData?.[selectedType]?.description}
								{exchangeCardKey === 'diy' &&
									proceedState &&
									diyPlanData?.[selectedType]?.description}
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
						{exchangeCardKey === 'diy' ? 'Boost' : 'Pay'}
					</Button>
				</div>
				<Modal
					visible={configure}
					onCancel={() => setConfigure(false)}
					zIndex={1000}
					width="420px"
					footer={null}
					className={'configure-modal'}
				>
					<div className="configure-modal-container">
						<h4>Configure Plan</h4>
						<div>
							<Form onFinish={onHandleConfig}>
								<Form.Item name="configure">
									<Radio.Group className="my-3" value={exchangeCardKey}>
										{configureTypes.map((config) => {
											return (
												<Radio key={config.value} value={config.value}>
													{config.name}
												</Radio>
											);
										})}
									</Radio.Group>
								</Form.Item>

								<Button type="primary" htmlType="submit">
									Proceed
								</Button>
							</Form>
						</div>
					</div>
				</Modal>
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

	const onHandleChange = (item) => {
		setCryptoPaymentType(item.value);
		setTransferCryptoPayment(true);
	};

	const onHandleSelectedType = (type) => {
		setSelectedType(type);
		setFiatSubmission(false);
	};

	const renderContent = () => {
		switch (exchangePlanType) {
			case 'item':
				return (
					<div>
						{exchangeCardKey !== 'diy' && (
							<div className="switch-wrapper">
								<div className="d-flex">
									<div className="switch-content">
										<span className={'switch-label'}>Pay yearly</span>
										<div className="green-label save-label">
											(Save up to 35%)
										</div>
									</div>
									<Switch
										onClick={handleOnSwith}
										defaultChecked={!SwitchState}
									/>
									<span className={'switch-label label-inactive ml-1'}>
										Pay monthly
									</span>
								</div>
							</div>
						)}
						<div className="bg-model">
							<div
								className={
									'box-container content-wrapper plan-structure-wrapper w-100'
								}
							>
								{Object.keys(selectedPlanData).map((type, inx) => {
									if (exchangeCardKey === 'diy') {
										return (
											<DIYPlanStructure
												className={
													selectedType === type
														? ''
														: 'opacity-diy-plan-container'
												}
												selectedType={selectedType}
												setSelectedType={setSelectedType}
												type={type}
												planData={selectedPlanData}
												onHandleSelectedType={onHandleSelectedType}
												priceData={priceData}
												isMonthly={isMonthly}
												key={inx}
											/>
										);
									} else {
										return (
											<PlanStructure
												className={
													selectedType === type
														? ''
														: 'opacity-cloud-plan-container'
												}
												selectedType={selectedType}
												setSelectedType={setSelectedType}
												type={type}
												planData={selectedPlanData}
												onHandleSelectedType={onHandleSelectedType}
												priceData={priceData}
												isMonthly={isMonthly}
												key={inx}
											/>
										);
									}
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
							<div>
								{fiatSubmission && selectedType === 'fiat' && (
									<div className="success-msg">
										You've already submitted a Fiat Ramp form.
									</div>
								)}
							</div>
							{renderBtn()}
						</div>
					</div>
				);
			case 'method':
				return (
					<div>
						<div className="radiobtn-container">
							<p>Select Payment Method</p>
							<Radio.Group
								defaultValue={'cryptoCurrency'}
								className={'radio-content'}
								value={selectedPayment}
							>
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
						</div>
						{renderFooter()}
					</div>
				);
			case 'crypto':
				return (
					<div>
						<div className="radiobtn-container">
							<p>Pick Crypto</p>
							<Radio.Group className="my-3" value={selectedCrypto.coin}>
								<Space direction="vertical">
									{cryptoCoins.map((item, inx) => {
										return (
											<>
												<Radio
													onChange={() => setSelectedCrypto(item)}
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
													selectedCrypto.coin === item.coin &&
													renderCoins(item.coin, item.symbol)}
											</>
										);
									})}
								</Space>
							</Radio.Group>
						</div>
						{renderFooter()}
					</div>
				);
			case 'payment':
				return (
					<div>
						<div className="crypto-payment-container">
							<div className="payment-type-dropdown">
								<h5>Select how to pay:</h5>
								{paymentOptions.map((item) => (
									<Select
										onChange={() => onHandleChange(item)}
										placeholder="Select payment method"
									>
										<Option value={item.key} key={item.key}>
											{item.value}
										</Option>
									</Select>
								))}
							</div>
							{transferCryptoPayment && (
								<div className="payment-details">
									<span>
										<h5>Selected Crypto :</h5> <p>{selectedCrypto.coin}</p>
									</span>
									<span>
										<h5> Required payment amount:</h5>
										<p>
											{paymentAddressDetails.amount} {selectedCrypto.coin}{' '}
										</p>
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
							)}
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
														value={
															paymentAddressDetails &&
															paymentAddressDetails.address
														}
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
			if (selectedType === 'fiat') {
				setFiatBreadCrumb(true);
			}
			if (selectedType === 'fiat' && isFiatFormCompleted) {
				setModalWidth('85rem');
				setFiatSubmission(true);
			} else {
				storePlanType();
				setFiatBreadCrumb(false);
				if (selectedType === 'fiat') {
					setFiatBreadCrumb(true);
				}
			}
		} else if (exchangePlanType === 'method') {
			if (selectedPayment !== 'cryptoCurrency') {
				storePaymentMethod();
			} else {
				setExchangePlanType('crypto');
				setFiatBreadCrumb(false);
			}
		} else if (exchangePlanType === 'crypto') {
			storePaymentMethod();
			setFiatBreadCrumb(false);
		} else if (exchangePlanType === 'payment') {
			setOpenPlanModal(false);
			setFiatBreadCrumb(false);
		}
		setActiveBreadCrumb(true);
	};

	const handleBack = () => {
		setFiatSubmission(false);
		setFiatBreadCrumb(false);
		setShowCloudPlanDetails(false);
		if (exchangePlanType === 'item') {
			setOpenPlanModal(false);
		} else if (exchangePlanType === 'method') {
			setModalWidth('85rem');
			setExchangePlanType('item');
			setSelectedPayment('cryptoCurrency');
			setIsMonthly(!SwitchState);
		} else if (exchangePlanType === 'crypto') {
			setExchangePlanType('method');
		} else if (exchangePlanType === 'payment') {
			setExchangePlanType('crypto');
		}
	};

	const renderBtn = () => {
		return (
			<div className="payment-button">
				<Button block type="primary" onClick={handleBack}>
					Back
				</Button>
				<Button
					block
					type="primary"
					onClick={handleNext}
					disabled={selectedType === 'diy'}
				>
					{exchangePlanType === 'payment' ? 'Done' : 'Next'}
				</Button>
			</div>
		);
	};

	const getInvoice = async (params) => {
		const res = await getExchangeBilling(params);
		if (res && res?.data) {
			setInvoceData(res?.data);
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

				<div className="ml-4 header-content">
					<p className="description-header">Payment for Plans</p>
					<div className="d-flex description-content">
						<div>
							Below is current your plan. Get more view details on the available
						</div>
						<div
							className="cloud-plans mx-1"
							onClick={() => setShowCloudPlanDetails(true)}
						>
							cloud plans.
						</div>
					</div>
				</div>
			</div>
			{renderCard()}
			<Modal
				visible={OpenPlanModal || showCloudPlanDetails}
				className="bg-model blue-admin-billing-model"
				width={modalWidth}
				zIndex={1000}
				onCancel={OnHandleCancel}
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
	transferCryptoPayment: store.admin.transferCryptoPayment,
	fiatSubmission: store.admin.fiatSubmission,
	paymentAddressDetails: store.admin.paymentAddressDetails,
	exchangeCardKey: store.admin.exchangeCardKey,
});

export default connect(mapStateToProps, {
	setSelectedPayment,
	setSelectedType,
	setExchangePlanType,
	setSelectedCrypto,
	setTransferCryptoPayment,
	setFiatSubmission,
	setPaymentAddressDetails,
	setExchangeCardKey,
})(GeneralContent);
