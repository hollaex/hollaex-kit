import React, { Fragment, useEffect, useRef, useState } from 'react';
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
	message,
	Select,
	Input,
	Tooltip,
	Spin,
	Empty,
} from 'antd';
import {
	RightOutlined,
	InfoCircleOutlined,
	CopyOutlined,
	CheckCircleFilled,
	ExclamationCircleFilled,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import isEmpty from 'lodash.isempty';

import { STATIC_ICONS } from 'config/icons';
import { DASH_TOKEN_KEY } from 'config/constants';
import PlanStructure from 'containers/Admin/Billing/planStructure';
import DIYPlanStructure from 'containers/Admin/Billing/diyPlanStructure';
import GeneralChildContent from 'containers/Admin/Billing/generalChildContent';
import EnterpriseForm from 'containers/Admin/EnterPriseForm';
import Subscription from 'containers/Admin/Billing/subscription';
import FiatConfirmation from 'containers/Admin/Billing/FiatConformatiom';
import PluginSubscription from 'containers/Admin/Billing/pluginSubscription';
import {
	getExchangeBilling,
	getNewExchangeBilling,
	getPluginActivateDetails,
	getPrice,
	postContact,
	requestStoreInvoice,
	setExchangePlan,
} from 'containers/Admin/Billing/action';
import {
	setSelectedPayment,
	setSelectedType,
	setExchangePlanType,
	setSelectedCrypto,
	setTransferCryptoPayment,
	setFiatSubmission,
	setPaymentAddressDetails,
	setExchangeCardKey,
} from 'actions/adminBillingActions';
import { requestPlugins } from 'containers/Admin/Plugins/action';
import { setExplorePlugins, setSelectedPlugin } from 'actions/appActions';
import {
	planData,
	diyPlanData,
	payOptions,
	cryptoCoins,
	paymentMethods,
	columns,
	options,
	fiatOptions,
	pendingPayOption,
} from './utils';
import './Billing.scss';
import { getFormattedDate } from 'utils/string';
import {
	removeAutoPayment,
	setAutoPaymentDetail,
} from '../AdminFinancials/action';
import { requestUsers } from '../Trades/actions';

const { Option } = Select;
const TabPane = Tabs.TabPane;

const GeneralContent = ({
	dashExchange,
	user,
	selectedCrypto,
	setSelectedCrypto,
	selectedPayment,
	setSelectedPayment,
	selectedType,
	setSelectedType,
	exchangePlanType,
	setExchangePlanType,
	setTransferCryptoPayment,
	transferCryptoPayment,
	setFiatSubmission,
	fiatSubmission,
	setPaymentAddressDetails,
	paymentAddressDetails,
	// putExchange,
	getExchange,
	fiatPutExchange,
	exchangeCardKey,
	setExchangeCardKey,
	userEmail,
	pluginData = {},
	setSelectedPlugin,
	explorePlugins,
	setExplorePlugins,
}) => {
	const balance = user?.balance;
	const dashToken = localStorage.getItem(DASH_TOKEN_KEY);
	const isPluginDataAvail = !isEmpty(pluginData);
	const month = dashExchange.period !== 'year';

	const [modalWidth, setModalWidth] = useState('85rem');
	const [OpenPlanModal, setOpenPlanModal] = useState(isPluginDataAvail);
	const [isLoading, setIsLoading] = useState(false);
	const [isMonthly, setIsMonthly] = useState(month);
	const [invoiceData, setinvoiceData] = useState([]);
	const [currentInvoice, setCurrentInvoice] = useState({});
	const [activateInvoiceData, setActivateInvoiceData] = useState({});
	const [priceData, setPriceData] = useState({});
	const [paymentOptions, setOptions] = useState([]);
	const [showPayAddress, setShowPayAddress] = useState(false);
	const [isFiatFormCompleted, setFiatCompleted] = useState(false);
	const [currencyData, setCurrencyAddress] = useState({});
	const [selectedPlanData, setSelectedPlanData] = useState({});
	const [showCloudPlanDetails, setShowCloudPlanDetails] = useState(false);
	const [pendingPay, setPendingPay] = useState(false);
	const [hideBreadcrumb, setHideBreadcrumb] = useState(false);
	const [selectedPendingItem, setSelectedPendingItem] = useState({});
	const [cryptoPayType, setCryptoPay] = useState('');
	const [activeKey, setActiveKey] = useState('1');
	const [isAutoPayment, setIsAutoPayment] = useState(false);
	const [isConfirmAutoPayment, setIsConfirmAutoPayment] = useState(false);
	const [isEditAutoPayment, setIsEditAutoPayment] = useState(false);
	const [isEditDetail, setIsEditDetail] = useState(true);
	const [isRemovePayment, setIsRemovePayment] = useState(false);
	const [isConfirmRemovePayment, setIsConfirmRemovePayment] = useState(false);
	const [userData, setUserData] = useState([]);
	const [selectedEmailData, setSelectedEmailData] = useState(
		userData[0]?.email || ''
	);

	const selectRef = useRef(null);

	const planPriceData = priceData[selectedType];

	useEffect(() => {
		setIsLoading(true);
		getExchangePrice();
		getExplorePlugin();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const typeInfo = Object.keys(planData).includes(dashExchange.plan);
		if (!isEmpty(dashExchange)) {
			if (dashExchange.type === 'Cloud') {
				setExchangeCardKey('cloudExchange');
				setSelectedPlanData(planData);
				if (typeInfo) {
					setSelectedType(dashExchange.plan);
				} else {
					setSelectedType('basic');
				}
			} else {
				if (typeInfo) {
					setExchangeCardKey('diy');
					setSelectedType('diy');
				} else {
					setExchangeCardKey('boost');
					setSelectedType('boost');
				}
				setSelectedPlanData(diyPlanData);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dashExchange]);

	useEffect(() => {
		if (dashToken) {
			getInvoice({ is_paid: false });
		}
	}, [dashToken]);

	useEffect(() => {
		if (showCloudPlanDetails) {
			setModalWidth('75rem');
		} else {
			if (exchangePlanType === 'item') {
				setModalWidth('85rem');
			} else if (exchangePlanType === 'fiat') {
				setModalWidth('55rem');
			} else if (exchangePlanType === 'method') {
				setSelectedPayment('cryptoCurrency');
				setModalWidth('65rem');
			} else {
				setModalWidth('65rem');
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exchangePlanType, showCloudPlanDetails]);

	useEffect(() => {
		const balanceAvailable =
			balance[`${selectedCrypto.coin.toLowerCase()}_available`] || 0;
		if (balanceAvailable && balanceAvailable >= currencyData?.amount) {
			setOptions(payOptions);
		} else {
			const optionData = payOptions.filter((data) => data.key !== 'pay');
			setOptions(optionData);
		}
	}, [balance, selectedCrypto.coin, currencyData]);

	useEffect(() => {
		if (selectedType === 'boost' || selectedType === 'diy') {
			setExchangeCardKey('diy');
		} else {
			setExchangeCardKey('cloudExchange');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedType]);

	const getAllUserData = async (params = {}, emailChange = false) => {
		try {
			const res = await requestUsers(params);
			if (res && res.data) {
				const userData = res.data.map((user) => ({
					label: user.email,
					value: user.id,
				}));
				setSelectedEmailData(userData);
				setUserData(res.data);
			}
		} catch (error) {
			console.error('error', error);
		}
	};

	const searchUser = (searchText) => {
		getAllUserData({ search: searchText });
	};

	const searchUserById = (userId) => {
		getAllUserData({ id: userId });
	};

	const getExplorePlugin = async () => {
		try {
			const res = await requestPlugins();
			if (res && res.data) {
				setExplorePlugins(res.data);
			}
		} catch (error) {
			throw error;
		}
	};

	const submitEnterprise = async (formProps) => {
		const data = {
			email: userEmail,
			category: 'enterprise',
			subject: 'enterprise exchange',
			description: JSON.stringify(formProps),
		};
		const body = {
			id: dashExchange.id,
			business_info: formProps,
		};
		try {
			const res = await postContact(data);
			await fiatPutExchange(body);
			await getExchange();
			message.success(res.message);
			setExchangePlanType('fiat-application');
			setHideBreadcrumb(true);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error('Fail to message');
			}
		}
	};

	const renderCoins = (coin, symbol) => {
		return (
			<div className="get-coins">
				<div className="d-flex coin-wrapper">
					Get {coin}
					<div className="get-coin-here">
						<Link to={`/trade/${symbol}-usdt`} target="_blank">
							here
						</Link>
					</div>
				</div>
			</div>
		);
	};

	const onHandleBreadcrumb = (name) => {
		setIsMonthly(false);

		if (
			exchangePlanType !== 'item' &&
			((exchangePlanType === 'method' && name === 'item') ||
				(exchangePlanType === 'crypto' && name !== 'payment') ||
				exchangePlanType === 'payment')
		) {
			setExchangePlanType(name);
		}

		if (name === 'item' || exchangePlanType === 'item') {
			setExchangePlanType('item');
			setSelectedPayment('');
		}
	};

	const onHandlePendingPay = (pendingItem) => {
		setOpenPlanModal(true);
		setPendingPay(true);
		setHideBreadcrumb(false);
		setExchangePlanType('method');
		setShowCloudPlanDetails(false);
		setSelectedPendingItem(pendingItem);
		setSelectedPayment('cryptoCurrency');
	};

	const onHandleCloudPlans = () => {
		setOpenPlanModal(true);
		setExchangePlanType('item');
		setShowCloudPlanDetails(true);
		setIsMonthly(false);
		setHideBreadcrumb(false);
	};

	const onHandleCancel = () => {
		setOpenPlanModal(false);
		setTransferCryptoPayment(false);
		setShowPayAddress(false);
		setFiatSubmission(false);
		setSelectedPayment('');
		setPaymentAddressDetails({});
		setPendingPay(false);
		setHideBreadcrumb(false);
		setActivateInvoiceData({});
	};

	const handleViewPlan = () => {
		setExchangePlanType('item');
		setHideBreadcrumb(false);
	};

	const storePaymentMethod = async (selectedPendingId) => {
		setIsLoading(true);
		try {
			if (
				invoiceData[0] &&
				invoiceData[0].id &&
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
						break;
					case 'bank':
						break;
					case 'stripe':
						break;
					default:
						break;
				}
				const invoiceId = activateInvoiceData.id
					? activateInvoiceData.id
					: selectedPendingId
					? selectedPendingId
					: invoiceData[0].id;
				const res = await requestStoreInvoice(invoiceId, { method });
				if (res) {
					switch (selectedPayment) {
						case 'paypal':
							window.location.replace(res.meta.redirect_url);
							message.success('Redirecting to the paypal');
							setOpenPlanModal(false);
							setCurrentInvoice(res.data);
							break;
						case 'stripe':
							window.location.replace(res.meta.redirect_url);
							message.success('Redirecting to the payment');
							setOpenPlanModal(false);
							setCurrentInvoice(res.data);
							break;
						case 'bank':
							setCurrentInvoice(res.data);
							break;
						case 'cryptoCurrency':
							if (res.method === 'xht' && res.is_paid) {
								setExchangePlanType('xhtPayment');
								setPaymentAddressDetails(res);
							} else if (res.method === 'xht' && !res.is_paid) {
								setExchangePlanType('xhtInSufficient');
							} else {
								setExchangePlanType('payment');
							}
							setCurrentInvoice({
								...currentInvoice,
								method,
								meta: { ...currentInvoice.meta, ...res },
							});
							setCurrencyAddress(res);
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
			setIsLoading(false);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
			setIsLoading(false);
		}
	};

	const renderFooter = () => {
		let pendingPlugin = [];
		if (selectedPendingItem) {
			pendingPlugin = explorePlugins.filter(
				(plugin) => plugin.name === selectedPendingItem?.meta?.activation?.name
			);
		}
		return (
			<div className="horizantal-line">
				{isPluginDataAvail || selectedPendingItem?.item === 'plugin' ? (
					<PluginSubscription
						pluginData={pendingPay ? pendingPlugin[0] : pluginData}
						selectedCrypto={selectedCrypto}
						isMonthly={isMonthly}
						paymentAddressDetails={
							paymentAddressDetails?.amount
								? paymentAddressDetails
								: selectedPendingItem?.meta
						}
						exchangePlanType={exchangePlanType}
						exchangeCardKey={exchangeCardKey}
						planPriceData={planPriceData}
						setExchangePlanType={setExchangePlanType}
					/>
				) : (
					<Subscription
						selectedCrypto={selectedCrypto}
						selectedType={selectedType}
						planPriceData={planPriceData}
						isMonthly={isMonthly}
						dashExchange={dashExchange}
						selectedPlanData={selectedPlanData}
						exchangeCardKey={exchangeCardKey}
						paymentAddressDetails={paymentAddressDetails}
						exchangePlanType={exchangePlanType}
						selectedPendingItem={selectedPendingItem}
						pendingPay={pendingPay}
					/>
				)}
				<div>{renderBtn()}</div>
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
			setIsLoading(false);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			}
			setIsLoading(false);
		}
	};

	const updatePlanType = async (params, callback = () => {}) => {
		try {
			const res = await setExchangePlan(params);
			if (dashExchange && dashExchange.id && params.plan !== 'fiat') {
				const resInvoice = await getNewExchangeBilling(dashExchange.id);
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
					setExchangePlanType('method');
				}
			}
			setIsLoading(false);
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
			setIsLoading(false);
		}
	};

	const storePlanType = () => {
		setIsLoading(true);
		if (selectedType === 'DIY' || 'boost') {
			updatePlanType({
				id: dashExchange.id,
				plan: selectedType,
				period: 'year',
			});
		} else if (
			selectedType === 'fiat' &&
			dashExchange?.business_info &&
			Object.keys(dashExchange.business_info)?.length
		) {
			setFiatCompleted(true);
		} else if (selectedType === 'fiat') {
			updatePlanType(
				{
					id: dashExchange.id,
					plan: selectedType,
					period: isMonthly ? 'month' : 'year',
				}
				// () => setExchangePlanType('enterPrise')
			);
			setExchangePlanType('fiat');
		} else {
			updatePlanType(
				{
					id: dashExchange.id,
					plan: selectedType,
					period: isMonthly ? 'month' : 'year',
				},
				() => setExchangePlanType('method')
			);
		}
	};

	const getPluginActivate = async () => {
		try {
			const res = await getPluginActivateDetails(pluginData.name);
			if (res && res.data) {
				setinvoiceData([res.data]);
				setActivateInvoiceData(res.data);
				setExchangePlanType('method');
			}
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
		}
	};

	const handleOnSwith = (isCheck) => {
		setIsMonthly(isCheck);
	};

	const renderModelContent = () => {
		const breadCrumbOptions =
			selectedType === 'fiat' && pendingPay === false && !isPluginDataAvail
				? fiatOptions
				: pendingPay
				? pendingPayOption
				: options;
		return showCloudPlanDetails ? (
			<div className="breadcrumb-cloud-plan-details">Cloud plan details</div>
		) : (
			<Breadcrumb separator={<RightOutlined />}>
				{breadCrumbOptions.map((name, inx) => {
					return (
						<Breadcrumb.Item
							onClick={() => onHandleBreadcrumb(name)}
							key={inx}
							className={
								name === exchangePlanType ||
								(exchangePlanType === 'fiat' && name === 'apply')
									? 'breadcrumb-item-active'
									: ''
							}
						>
							{name === 'crypto'
								? selectedPayment === 'cryptoCurrency' &&
								  (exchangePlanType === 'crypto' ||
										exchangePlanType === 'payment') &&
								  'Crypto'
								: name.charAt(0).toUpperCase() + name.slice(1)}
						</Breadcrumb.Item>
					);
				})}
			</Breadcrumb>
		);
	};

	const handleOpenModal = () => {
		setShowCloudPlanDetails(false);
		setExchangePlanType('item');
		setOpenPlanModal(true);
		setHideBreadcrumb(false);
	};

	const renderCardDetails = () => {
		return (
			<div
				className="card-wrapper"
				style={{
					backgroundImage: `url(${
						selectedType === 'basic'
							? STATIC_ICONS['CLOUD_BASIC_BACKGROUND']
							: selectedType === 'crypto'
							? STATIC_ICONS['CLOUD_CRYPTO_BACKGROUND']
							: selectedType === 'fiat'
							? STATIC_ICONS['CLOUD_FIAT_BACKGROUND']
							: ''
					})`,
				}}
			>
				<div
					className={`d-flex ${selectedType}-content-wrapper cloud-card-details w-100`}
				>
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
									{selectedType === 'diy'
										? 'Do-It-Yourself'
										: selectedType === 'fiat'
										? 'Enterprise'
										: selectedType}
								</p>
							</div>
						</div>
						<p className={selectedType ? 'basic-plan' : 'crypto-fiat-plan'}>
							{selectedPlanData[selectedType]?.description}
						</p>
					</div>
				</div>
			</div>
		);
	};

	const onHandleAutoPayment = () => {
		if (dashExchange?.auto_payment_id) {
			setIsEditAutoPayment(true);
		} else {
			setIsAutoPayment(true);
		}
		searchUserById(1);
	};

	const renderCard = () => {
		const isPaid =
			dashExchange.is_paid && moment().isBefore(moment(dashExchange.expiry));
		return (
			<div className="mt-5 card-boder">
				{isEmpty(dashExchange) ? (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						imageStyle={{ height: 60 }}
					/>
				) : (
					<>
						<div className={`card-design-${selectedType}`} />
						{renderCardDetails()}
						<div
							className={`button-container billing-button-container ${
								!isPaid ? 'pay-button' : ''
							}`}
						>
							<Fragment>
								<div className="button-wrapper">
									{isPaid && (
										<div className="anchor" onClick={handleClickScroll}>
											View last bill
										</div>
									)}
									<div className="custom-line"></div>
									{dashExchange?.auto_payment_id ? (
										<div onClick={() => onHandleAutoPayment()}>
											<CheckCircleFilled className="check-icon" />{' '}
											<span className="anchor">Auto Payment Set</span>
										</div>
									) : (
										<div
											className="anchor"
											onClick={() => onHandleAutoPayment()}
										>
											Auto Payment Bill
										</div>
									)}
								</div>
								<Button
									type="primary"
									onClick={() => handleOpenModal()}
									className={`m-2 ${isPaid ? 'paid-btn pointer-none' : ''}`}
									shape="round"
								>
									{isPaid && <CheckCircleFilled />}
									{isPaid
										? 'paid'
										: exchangeCardKey === 'diy'
										? 'Boost'
										: 'Pay'}
								</Button>
							</Fragment>
						</div>
					</>
				)}
			</div>
		);
	};

	const copyQr = async () => {
		var qrcode = document.getElementById('copyqrcode').value;
		return await navigator.clipboard.writeText(qrcode);
	};

	const checkDisabled = (method) => {
		if (method === 'bank' || method === 'paypal') {
			return true;
		}
		return false;
	};

	const onHandleSelectedType = (type) => {
		setSelectedType(type);
		setFiatSubmission(false);
	};

	const handleCryptoPay = (payType) => {
		setCryptoPay(payType);
	};

	const renderContent = () => {
		switch (exchangePlanType) {
			case 'item':
				return (
					<>
						{isPluginDataAvail ? (
							renderFooter()
						) : (
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
												defaultChecked={isMonthly}
												checked={isMonthly}
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
														dashExchange={dashExchange}
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
														cloudPlanDetails={showCloudPlanDetails}
														key={inx}
													/>
												);
											}
										})}
									</div>
									<div className="footer">
										{exchangeCardKey === 'diy' ? (
											<div>
												<div className="mb-1">
													*DIY exchanges aren't assisted. This means email
													communications and direct customer support aren't
													provided. All exchange data management, hosting,
													exchange upgrading and backups are the responsibility
													of the operator. However, support services can be
													purchased separately upon request.
												</div>
												<div>
													*A donation towards the HollaEx network is required
													for new custom coin and trading pair activation (DIY
													boost includes 1 free token & market).
												</div>
											</div>
										) : (
											<div>
												*A donation towards the HollaEx network is required for
												new custom coin and trading pair activation
											</div>
										)}
										<div>
											*Custom exchange code and technical support are not
											included in cloud plans and are paid separately
										</div>
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
						)}
					</>
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
												key={inx}
											>
												{opt.method === 'cryptoCurrency' ? (
													<>
														<span>{opt.label} </span>
														<span className="danger"> (up to 5% off) </span>
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
													key={inx}
												>
													{item.coin === 'XHT' ? (
														<>
															<span>{item.coin} </span>
															<span className="danger">
																(discounts may apply)
															</span>
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
				const balanceAvailable =
					balance[`${selectedCrypto.coin.toLowerCase()}_available`] || 0;
				return (
					<div>
						<div className="crypto-payment-container">
							<div className="payment-type-dropdown">
								<h5>Select how to pay:</h5>
								<Select
									onChange={handleCryptoPay}
									placeholder="Select payment method"
								>
									{paymentOptions.map((item) => (
										<Option value={item.key} key={item.key}>
											{item.value}
										</Option>
									))}
								</Select>
							</div>
							{cryptoPayType === 'pay' ? (
								<Fragment>
									<div>
										<span className="bold">Selected crypto: </span>
										<span>
											{selectedCrypto.coin
												? selectedCrypto.coin.toUpperCase()
												: ''}
										</span>
									</div>
									<div>
										<span className="bold">{`Your ${selectedCrypto.coin.toUpperCase()} balance: `}</span>
										<span>
											{balanceAvailable} {selectedCrypto.coin.toUpperCase()}
										</span>
									</div>
									{!balanceAvailable ||
									balanceAvailable < paymentAddressDetails.amount ? (
										<div className="crypto-error">
											<ExclamationCircleFilled /> Insufficient balance
										</div>
									) : null}
									<div className="crypto-payment-divider"></div>
									<div>
										<div className="crypto-required-amount">
											Required amount: {paymentAddressDetails.amount}{' '}
											{paymentAddressDetails.currency
												? paymentAddressDetails.currency.toUpperCase()
												: ''}
										</div>
										<div className="small-text">
											The required amount will be directly deducted from your
											account wallet balance. Please check the details before
											proceeding.
										</div>
									</div>
								</Fragment>
							) : cryptoPayType === 'transfer' ? (
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
							) : null}
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
											<QR
												value={
													paymentAddressDetails && paymentAddressDetails.address
												}
												size={100}
											/>
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
			case 'xhtPayment':
				return (
					<div className="steps-content-wrapper text-center">
						<div className="bg-white xht-header">
							Please review your crypto payment below:
						</div>
						<div className="bodyContentSmall">
							Please review your crypto payment below:
						</div>
						{/* <div><img src={''} className="bank-icon" alt="bank" /></div> */}
						<div className="amount">
							Cost: {paymentAddressDetails?.amount} XHT*
						</div>
						<div className="bold billing-package-text">{invoiceData.item}</div>
						<div className="bodyContentSmall">{invoiceData.description}</div>
						{renderFooter()}
					</div>
				);
			case 'xhtInSufficient':
				return (
					<div className="steps-content-wrapper text-center">
						<div className="bg-white xht-header">
							You have insufficient XHT balance
						</div>
						<div className="bodyContentSmall">
							You can go to your XHT wallet to charge your XHT balance
							<span className="link">
								<Link to="/credit"> here</Link>{' '}
							</span>
							or you can
							<span
								className="link"
								onClick={() => setExchangePlanType('cryptoCurrency')}
							>
								{' '}
								go back{' '}
							</span>
							and pick another payment option
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
			case 'fiat-application':
				return (
					<FiatConfirmation
						exchange={dashExchange}
						onCancel={() => setOpenPlanModal(false)}
						handleViewPlan={handleViewPlan}
					/>
				);
			default:
				return <div />;
		}
	};

	const handleNext = () => {
		if (exchangePlanType === 'item') {
			if (isPluginDataAvail) {
				getPluginActivate();
			} else if (selectedType === 'fiat' && isFiatFormCompleted) {
				setModalWidth('85rem');
				setFiatSubmission(true);
			} else {
				storePlanType();
			}
		} else if (exchangePlanType === 'method') {
			if (selectedPayment !== 'cryptoCurrency') {
				storePaymentMethod();
			} else {
				setExchangePlanType('crypto');
			}
		} else if (exchangePlanType === 'crypto') {
			storePaymentMethod(selectedPendingItem?.id);
		} else if (exchangePlanType === 'payment') {
			setOpenPlanModal(false);
			setActivateInvoiceData({});
		}
	};

	const handleBack = () => {
		setFiatSubmission(false);
		if (exchangePlanType === 'item') {
			setOpenPlanModal(false);
			setHideBreadcrumb(false);
			// setSelectedPlugin({});
		} else if (exchangePlanType === 'method') {
			if (pendingPay) {
				setOpenPlanModal(false);
				setPendingPay(false);
				setHideBreadcrumb(true);
			} else {
				setExchangePlanType('item');
				setIsMonthly(!isMonthly);
				setPaymentAddressDetails({});
			}
		} else if (exchangePlanType === 'crypto') {
			setExchangePlanType('method');
			setSelectedCrypto({ coin: 'XHT', symbol: 'xht' });
		} else if (exchangePlanType === 'payment') {
			setExchangePlanType('crypto');
			setTransferCryptoPayment(false);
			setShowPayAddress(false);
		}
	};

	const renderBtn = () => {
		return (
			<div
				className={
					isPluginDataAvail
						? 'plugin-btn-wrapper'
						: showCloudPlanDetails
						? 'cloud-plan-button'
						: 'payment-button'
				}
			>
				<Button block type="primary" onClick={handleBack}>
					Back
				</Button>
				{!showCloudPlanDetails && (
					<Button
						block
						type="primary"
						onClick={handleNext}
						disabled={selectedType === 'diy'}
						className={isPluginDataAvail ? 'plugin-btn' : ''}
					>
						{exchangePlanType === 'payment' ? 'Done' : 'Next'}
					</Button>
				)}
			</div>
		);
	};

	const getInvoice = async (params) => {
		const res = await getExchangeBilling(params);
		if (res && res?.data) {
			setinvoiceData(res?.data);
		}
		setIsLoading(false);
	};

	const getTableData = (key) => {
		setIsLoading(true);
		setActiveKey(key);
		if (key === '1') {
			getInvoice({ is_paid: false });
		} else {
			getInvoice({ is_paid: true });
		}
	};

	const handleClickScroll = () => {
		setActiveKey('2');
		getInvoice({ is_paid: true });
		const element = document.getElementById('table-section');
		if (element) {
			// 👇 Will scroll smoothly to the top of the next section
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const handleAfterclose = () => {
		setExchangePlanType('item');
		setSelectedPlugin({});
	};

	const onAutoPaymentClose = () => {
		setIsAutoPayment(false);
		setUserData([]);
	};

	const onHandleBack = (title) => {
		if (title === 'auto payment') {
			setIsAutoPayment(false);
		} else if (title === 'confirm') {
			setIsConfirmAutoPayment(false);
			setIsAutoPayment(true);
		} else if (title === 'confirm remove') {
			setIsConfirmRemovePayment(false);
			setIsEditAutoPayment(true);
		} else if (title === 'edit') {
			setIsEditAutoPayment(false);
		}
	};

	const onHandleNext = (title) => {
		if (title === 'auto payment') {
			setIsConfirmAutoPayment(true);
			setIsAutoPayment(false);
		} else if (title === 'edit') {
			setIsEditAutoPayment(false);
			if (isEditDetail) {
				setIsAutoPayment(true);
			} else {
				setIsConfirmRemovePayment(true);
			}
		} else if (title === 'confirm remove') {
			setIsConfirmRemovePayment(false);
			onHandleRemoveAutoPayment();
		}
	};

	const onHandleConfirmClose = () => {
		setIsConfirmAutoPayment(false);
	};

	const onHandleEditClose = () => {
		setIsEditAutoPayment(false);
		setIsEditDetail(true);
		setIsRemovePayment(false);
	};

	const onHandleConfirmPayment = async () => {
		try {
			const userValue = userData?.length > 0 ? userData[0] : user;
			await setAutoPaymentDetail({
				auto_payment_id: userValue?.network_id,
				exchange_id: dashExchange?.id,
			});
			getExchange();
			message.success(
				`you've successfully activated the auto payment for your exchange billing`
			);
		} catch (error) {
			console.error('error', error);
		}
		setIsConfirmAutoPayment(false);
		setUserData([]);
	};

	const onHandleRemoveAutoPayment = async () => {
		try {
			await removeAutoPayment({ exchange_id: dashExchange?.id });
			getExchange();
			message.success(`You've successfylly removed the automatic bill payment`);
		} catch (error) {
			console.error(error);
		}
		setIsEditDetail(true);
		setIsRemovePayment(false);
	};

	const handleChange = (value) => {
		if (selectedEmailData) {
			const filteredEmail = userData?.filter((email) => email?.email === value);
			searchUserById(filteredEmail[0]?.id);
		}
	};

	const usdtPrice =
		userData?.length > 0
			? userData[0]?.balance?.usdt_available
			: user?.balance?.usdt_available;

	const handleEditClick = () => {
		if (selectRef && selectRef.current && selectRef.current.focus) {
			selectRef.current.focus();
		}
	};

	const onHandleCloseRemovePayment = () => {
		setIsConfirmRemovePayment(false);
		setIsEditDetail(true);
		setIsRemovePayment(false);
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
						{isEmpty(dashExchange) ? (
							<div>Currently no plans available </div>
						) : (
							<>
								<div>
									Below is your current plan. Learn more about
									{dashExchange.type.toUpperCase() !== 'CLOUD'
										? `cloud plans.`
										: null}
								</div>
								{dashExchange.type.toUpperCase() === 'CLOUD' ? (
									<div
										className={`cloud-plans mx-1 }`}
										onClick={() => onHandleCloudPlans()}
									>
										plans here.
									</div>
								) : null}
							</>
						)}
					</div>
				</div>
			</div>
			{renderCard()}
			<Modal
				visible={OpenPlanModal}
				className="bg-model blue-admin-billing-model"
				width={modalWidth}
				zIndex={1000}
				onCancel={onHandleCancel}
				footer={null}
				afterClose={handleAfterclose}
			>
				{hideBreadcrumb === false && renderModelContent()}
				<Spin spinning={isLoading}>{renderContent()}</Spin>
			</Modal>
			<Modal
				visible={isAutoPayment}
				className="auto-payment-billing-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => onAutoPaymentClose()}
				footer={null}
			>
				<div className="auto-payment-billing-popup-container">
					<div className="title">Automatic Bill Payment</div>
					<div className="payment-description">
						Select an account with avaliable USDT balance from which funds will
						be automatically deducted to cover an exchange-related bills,
					</div>
					<div className="account-details">
						<div>Account to source bill payments from</div>
						<div className="payment-email-input-wrapper mt-1">
							<Select
								ref={(inp) => {
									selectRef.current = inp;
								}}
								className="payment-email-address"
								value={
									(userData?.length > 0 && userData[0]?.email) ||
									(user && user.email)
								}
								showSearch
								placeholder="admin@exchange.com"
								onSearch={(text) => searchUser(text)}
								onChange={handleChange}
								filterOption={(input, option) =>
									option?.value.toLowerCase().includes(input.toLowerCase())
								}
								showAction={['focus', 'click']}
								getPopupContainer={(trigger) => trigger.parentNode}
							>
								{userData?.map((data) => (
									<Option key={data.id || data.email} value={data.email}>
										{data?.email}
									</Option>
								))}
							</Select>
							<span
								className="ml-2 text-decoration-underline edit-btn"
								onClick={() => handleEditClick()}
							>
								Edit
							</span>
						</div>
					</div>
					<div className="my-3">
						Avaliable balance on {userData[0]?.email || userEmail}:
					</div>
					<div className="asset-wrapper">
						<div className="asset-icon">USDT</div>
						<div className="avaliable-amount">
							Tether USD: <span className="asset-amount">{usdtPrice}</span>
						</div>
					</div>
					{!usdtPrice > 0 && (
						<div className="error-field">
							<ExclamationCircleFilled />
							<span>
								There doesn't seem to be any avaliable balance for this coins.
							</span>
						</div>
					)}
					<div className="warning-description">
						<ExclamationCircleOutlined className="warning-icon" />
						<span className="message">
							Please check if the amount are sufficiently sustainable before
							proceeding.
						</span>
					</div>
					<div className="auto-payment-popup-button-wrapper">
						<Button
							onClick={() => onHandleBack('auto payment')}
							className="green-btn"
						>
							Back
						</Button>
						<Button
							onClick={() => onHandleNext('auto payment')}
							className={!usdtPrice ? 'green-btn inactive-btn' : 'green-btn'}
							disabled={!usdtPrice}
						>
							Next
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isConfirmAutoPayment}
				className="auto-payment-billing-popup-wrapper confirm-payment-billing-popup-wrapper"
				width={400}
				zIndex={1000}
				onCancel={() => onHandleConfirmClose()}
				footer={null}
			>
				<div className="auto-payment-billing-popup-container confirm-payment-billing-popup-container">
					<div className="title">Review & confirm auto payment</div>
					<div className="details-description">
						Please check the automatic billing payment details below:
					</div>
					<div className="cloud-card">
						<div>Item</div>
						{renderCardDetails()}
					</div>
					<div className="fund-source-details">
						<div className="payment-title">Fund Source</div>
						<div className="description-text">Account</div>
						<div className="description-text">
							{userData[0]?.email || userEmail}
						</div>
						<div className="custom-line"></div>
						<div className="description-text">usdt: {usdtPrice}</div>
					</div>
					<div className="payment-interval">
						<div className="payment-title">Interval</div>
						<div className="description-text">
							{month ? 'Monthly' : 'Yearly'}
						</div>
					</div>
					<div className="next-payment-date">
						<div className="payment-title">Date of next payment</div>
						<div className="description-text">
							{getFormattedDate(dashExchange.expiry)}
						</div>
					</div>
					<div className="payment-amount">
						<div className="payment-title">Amount to pay</div>
						<div className="description-text">
							{planPriceData && planPriceData[month ? 'month' : 'year']?.price}{' '}
							USDT
						</div>
					</div>
					<div className="auto-payment-popup-button-wrapper">
						<Button
							onClick={() => onHandleBack('confirm')}
							className="green-btn"
						>
							Back
						</Button>
						<Button
							onClick={() => onHandleConfirmPayment()}
							className="green-btn"
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isEditAutoPayment}
				className="auto-payment-billing-popup-wrapper edit-payment-billing-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => onHandleEditClose()}
				footer={null}
			>
				<div className="auto-payment-billing-popup-container edit-payment-popup-container">
					<div className="title">Edit Automatic bill payment</div>
					<div className="mt-3">
						<div className="input-field">
							<Input
								type="radio"
								id="change source"
								name="automatic billing"
								checked={isEditDetail}
								onChange={() => {
									setIsEditDetail(!isEditDetail);
									setIsRemovePayment(false);
								}}
							/>
							<label htmlFor="change source">Change source of funds</label>
						</div>
						<div className="input-field">
							<Input
								type="radio"
								id="remove billing"
								name="automatic billing"
								checked={isRemovePayment}
								onChange={() => {
									setIsRemovePayment(!isRemovePayment);
									setIsEditDetail(false);
								}}
							/>
							<label htmlFor="remove billing">
								Stop and remove automated billing
							</label>
						</div>
					</div>
					<div className="auto-payment-popup-button-wrapper">
						<Button
							onClick={() => onHandleBack('edit')}
							className="green-btn"
							disabled={!isEditDetail}
						>
							Back
						</Button>
						<Button onClick={() => onHandleNext('edit')} className="green-btn">
							Next
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isConfirmRemovePayment}
				className="auto-payment-billing-popup-wrapper confirm-remove-payment-popup-wrapper"
				width={450}
				zIndex={1000}
				onCancel={() => onHandleCloseRemovePayment()}
				footer={null}
			>
				<div className="auto-payment-billing-popup-container">
					<div className="title">Stop and remove Auto pay</div>
					<div className="description-text mt-3">
						You can resume auto payment later at anytime.
					</div>
					<div className="description-text mt-2">
						Are you sure you want to stop and remove automatic payments now for
						billing?
					</div>
					<div className="auto-payment-popup-button-wrapper">
						<Button
							onClick={() => onHandleBack('confirm remove')}
							className="green-btn"
						>
							Back
						</Button>
						<Button
							onClick={() => onHandleNext('confirm remove')}
							className="green-btn"
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>

			<Tabs
				defaultActiveKey={activeKey}
				className="mt-5 tab-border"
				onChange={getTableData}
				activeKey={activeKey}
				id="table-section"
			>
				<TabPane tab="Pending" key="1">
					<GeneralChildContent
						columns={columns(onHandlePendingPay)}
						dataSource={invoiceData}
						isLoading={isLoading}
					/>
				</TabPane>
				<TabPane tab="Paid" key="2">
					<GeneralChildContent
						columns={columns()}
						dataSource={invoiceData}
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
	transferCryptoPayment: store.admin.transferCryptoPayment,
	fiatSubmission: store.admin.fiatSubmission,
	paymentAddressDetails: store.admin.paymentAddressDetails,
	exchangeCardKey: store.admin.exchangeCardKey,
	userEmail: store.user.email,
	pluginData: store.app.selectedPlugin,
	explorePlugins: store.app.explorePlugins,
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
	setExplorePlugins,
	setSelectedPlugin,
})(GeneralContent);
