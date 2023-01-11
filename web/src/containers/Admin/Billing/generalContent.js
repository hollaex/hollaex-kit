import React, { Fragment, useEffect, useState } from 'react';
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
// import { ExclamationCircleFilled, InfoCircleOutlined, CopyOutlined, RightOutlined } from '@ant-design/icons';
import Subscription from './subscription';
import moment from 'moment';
import { STATIC_ICONS } from 'config/icons';
import PlanStructure from './planStructure';
import GeneralChildContent from './generalChildContent';
import {
	ExclamationCircleFilled,
	RightOutlined,
	InfoCircleOutlined,
	CopyOutlined,
} from '@ant-design/icons';
import {
	getExchangeBilling,
	getNewExchangeBilling,
	getPrice,
	setExchangePlan,
} from './action';
import './Billing.scss';
import { DASH_TOKEN_KEY } from 'config/constants';
import { getExchange } from '../AdminFinancials/action';
import { Icon } from '@ant-design/compatible';

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
const GeneralContent = ({ exchange, user }) => {
	const balance = user?.balance;
	const dashToken = localStorage.getItem(DASH_TOKEN_KEY);
	const options = ['item', 'method', 'crypto', 'payment'];
	const paymentMethods = [
		'PayPal',
		'Bank Wire Transfer',
		'Cryptocurrency',
		'Credit Card',
	];
	const [activeRadio, setActiveRadio] = useState(3);
	const [type, setType] = useState('item');
	// const [itemType, setItemType] = useState('crypto');
	const [selectedType, setSelectedType] = useState('crypto');
	const [currency, setCurrency] = useState('usdt');
	const [modalWidth, setModalWidth] = useState('85rem');
	const [OpenPlanModal, setOpenPlanModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [checked, setChecked] = useState(false);
	const [isMonthly, setIsMonthly] = useState(false);
	const [isPaymentMethodDisable, setIsPaymentMethodDisable] = useState([]);
	const [isExchangeDetails, setExchangeDetails] = useState(true);
	const [invoceData, setInvoceData] = useState([]);
	const [priceData, setPriceData] = useState({});
	const [paymentOptions, setOptions] = useState([]);
	const [cryptoPayType, setCryptoPay] = useState('');
	const [isAutomatedKYC, setIsAutomatedKYC] = useState(false);
	const [showPayAddress, setShowPayAddress] = useState(false);

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
		const balanceAvailable =
			balance[`${currency.toLowerCase()}_available`] || 0;
		if (balanceAvailable && balanceAvailable) {
			setOptions(payOptions);
		} else {
			const optionData = payOptions.filter((data) => data.key !== 'pay');
			setOptions(optionData);
		}
	}, [balance, currency]);

	const onChange = (e) => {
		setActiveRadio(e.target.value);
		setChecked(e.target.checked);
	};

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
		setChecked(false);
		setType(name);
		setActiveRadio(1);
		if (name === 'item') {
			setModalWidth('85rem');
		} else if (name === 'method') {
			setModalWidth('65rem');
		} else if (name === 'crypto') {
			setModalWidth('65rem');
		} else if (name === 'payment') {
			setModalWidth('65rem');
		}
	};

	const handleOnCancel = () => {
		setOpenPlanModal(false);
		setChecked(false);
		setActiveRadio(1);
	};

	const isCloud = () => {
		const exchangePlans = ['basic', 'crypto', 'fiat'];
		if (exchangePlans.includes(exchange.plan)) {
			return true;
		} else {
			return false;
		}
	};

	const renderFooterImage = () => {
		// const exchangePlans = ['basic', 'crypto', 'fiat'];
		// if (isAutomatedKYC) {
		//     return STATIC_ICONS['KYC_PLUGIN_ICON'];
		// } else if (exchange.plan === 'boost' && invoiceData.item === 'boost') {
		//     return STATIC_ICONS['DIY_BOOST_ICON'];
		// } else if (!exchangePlans.includes(exchange.plan) && invoiceData.item !== 'boost') {
		//     return STATIC_ICONS['DIY_ICON'];
		// } else {
		//     return STATIC_ICONS['CURRENT_PLAN_CLOUD_ICON'];
		// }
	};

	const renderFooterInfo = () => {
		// const exchangePlans = ['basic', 'crypto', 'fiat'];
		// if (!exchangePlans.includes(exchange.plan)) {
		//     if (type === 'boost' && invoiceData.item === 'boost') {
		//         return (
		//             <div>
		//                 <div className="sub-title billing-package-text">DIY Boost</div>
		//                 <span className="bodyContentSmall">HollaEx Yearly DIY Boost</span>
		//             </div>
		//         )
		//     } else {
		//         return (
		//             <div>
		//                 <div className="sub-title billing-package-text">{invoice.item}</div>
		//                 <span className="bodyContentSmall">{invoice.description}</span>
		//             </div>
		//         )
		//     }
		// } else if (isAutomatedKYC && !is_active) {
		//     return (
		//         <div>
		//             <div className="sub-title billing-package-text">Automated KYC</div>
		//             <span className="bodyContentSmall">First time activation and {_get(invoice, 'meta.addon.count', '')} user verifications</span>
		//         </div>
		//     )
		// } else if (is_active) {
		//     return (
		//         <div>
		//             <div className="sub-title billing-package-text">Automated KYC</div>
		//             <span className="bodyContentSmall">Charge {_get(invoice, 'meta.addon.count', '')} user verifications</span>
		//         </div>
		//     )
		// } else {
		//     return (
		//         <div>
		//             <div className="sub-title billing-package-text">{invoice.item}</div>
		//             <span className="bodyContentSmall">{invoice.description}</span>
		//         </div>
		//     )
		// }
	};

	const renderPrice = () => {
		// let PriceValue = `${_get(invoice, 'currency', '').toUpperCase()} ${_get(invoice, 'amount', '')}`;
		// if (invoice.method !== 'paypal' &&
		//     invoice.method !== 'bank' &&
		//     invoice.method !== 'stripe' &&
		//     invoice.meta &&
		//     invoice.meta.amount
		// ) {
		//     PriceValue = `${invoice.meta.currency.toUpperCase()} ${invoice.meta.amount}`;
		// }
		// if (isEdit || isAutomatedKYC) {
		//     return (
		//         <Fragment>
		//             <div className="sub-title">Payment:</div>{' '}
		//             <div>{PriceValue}</div>
		//         </Fragment>
		//     );
		// } else {
		//     return (
		//         <Fragment>
		//             <div className="sub-title">{isMonthly ? 'Monthly payment:' : 'Yearly payment:'}</div>{' '}
		//             <div>{PriceValue}</div>
		//         </Fragment>
		//     );
		// }
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
							{/* <img
								src={renderFooterImage()}
								alt="cloud-icon"
								className="cloud-icon"
							/> */}
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
							{renderFooterInfo()}
						</div>
						<div className="content-align d-flex seperator">
							<img
								src={`${STATIC_ICONS['EXCHANGE_ICON']}`}
								alt="Exchange-icon"
								className="exchange-icon"
							/>
							{/* <span className="bodyContentSmall">{exchange.display_name}</span> */}
							<span className="bodyContentSmall">texter-1</span>
						</div>
						{/* <div className="content-align d-flex">{renderPrice()}</div> */}
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
				setType('method')
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
			// setType('payment')
		}
	};

	const handleOnSwith = (isCheck) => {
		setIsMonthly(isCheck);
	};

	const handleCryptoPay = (payType) => {
		setCryptoPay(payType);
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
							{name.charAt(0).toUpperCase() + name.slice(1)}
						</Breadcrumb.Item>
					);
				})}
			</Breadcrumb>
		);
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
						onClick={() => setOpenPlanModal(true)}
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
								{TYPES.map((type) => {
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
							{renderBtn('item-button')}
						</div>
					</div>
				);
			case 'method':
				return (
					<div className="radiobtn-container">
						<p>Select Payment Method</p>
						<Radio.Group className={'radio-content'} onChange={onChange}>
							<Space direction="vertical">
								{paymentMethods.map((method, inx) => {
									if (method === 'Cryptocurrency') {
										return (
											<Radio value={inx}>
												<span>{method} </span>
												<span className="danger"> (up to 10% off) </span>
												<span>
													<img
														src={STATIC_ICONS['FIRE_BALL']}
														className="fire-icon"
														alt="fire"
													/>
												</span>
											</Radio>
										);
									} else {
										return (
											<Radio
												value={inx}
												disabled={isPaymentMethodDisable.includes(method)}
											>
												{method}
											</Radio>
										);
									}
								})}
							</Space>
						</Radio.Group>
						<Subscription />
						{renderBtn('method-button')}
					</div>
				);
			case 'crypto':
				return (
					<div className="radiobtn-container">
						<p>Pick Crypto</p>
						<Radio.Group
							className="my-3"
							onChange={onChange}
							value={activeRadio}
						>
							<Space direction="vertical">
								<Radio value={1}>USDT (TRC20)</Radio>
								{activeRadio === 1 && checked && handleGetCoins('USDT', 'btc')}
								<Radio value={2}>Bitcoin</Radio>
								{activeRadio === 2 &&
									checked &&
									handleGetCoins('Bitcoin', 'btc')}
								<Radio value={3}>
									<span>XHT </span>
									<span className="danger"> (10% discount) </span>
									<span>
										<img
											src={STATIC_ICONS['FIRE_BALL']}
											className="fire-icon"
											alt="fire"
										/>
									</span>
								</Radio>
								{activeRadio === 3 && checked && handleGetCoins('XHT', 'xht')}
								<Radio value={4}>Ethereum</Radio>
								{activeRadio === 4 &&
									checked &&
									handleGetCoins('Ethereum', 'eth')}
								<Radio value={5}>TRON</Radio>
								{activeRadio === 5 && checked && handleGetCoins('TRON', 'trx')}
								<Radio value={6}>XRP</Radio>
								{activeRadio === 6 && checked && handleGetCoins('XRP', 'xrp')}
							</Space>
						</Radio.Group>
						<Subscription />
						{renderBtn('crypto-button')}
					</div>
				);
			case 'payment':
			case 'cryptoPayment':
				// const balanceAvailable =
				//  balance[`${currency.toLowerCase()}_available`] || 0;
				// const currencyData = {};
				return (
					<div className="crypto-payment-container">
						<div>
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
							<div className="payment-details">
								<span>
									<h5>Selected Crypto :</h5> <p>EFH</p>
								</span>
								<span>
									<h5> Required payment amount:</h5>
									<p>1.3875 ETH </p>{' '}
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
														defaultValue="git@github.com:ant-design/ant-design.git"
													/>
													<Tooltip title="copy git url">
														<Button icon={<CopyOutlined />} />
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
										<div style={{ width: '20%' }}>
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
			case 'payment1':
				setOpenPlanModal(false);
				break;
			default:
				return <div />;
		}
	};

	const handleNext = () => {
		if (type === 'item') {
			setType('method');
			setModalWidth('65rem');
			storePlanType();
		} else if (type === 'method') {
			setType('crypto');
			setModalWidth('65rem');
		} else if (type === 'crypto') {
			setOpenPlanModal(false);
			setModalWidth('65rem');
		} else if (type === 'payment') {
			setOpenPlanModal(false);
			setModalWidth('65rem');
		}
	};

	const handleBack = () => {
		if (type === 'item') {
			setOpenPlanModal(false);
		} else if (type === 'method') {
			setType('item');
			setModalWidth('85rem');
		} else if (type === 'crypto') {
			setType('method');
			setModalWidth('65rem');
		}
	};

	const renderBtn = (type) => {
		return (
			<div className={`${type}`}>
				<Button type="primary" onClick={() => handleBack()}>
					Back
				</Button>
				<Button type="primary" onClick={() => handleNext()}>
					Next
				</Button>
			</div>
		);
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
				onCancel={handleOnCancel}
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

export default GeneralContent;
