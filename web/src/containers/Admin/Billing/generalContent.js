import React, { useEffect, useState } from 'react';
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
} from 'antd';
import Subscription from './subscription';
import moment from 'moment';
import { STATIC_ICONS } from 'config/icons';
import PlanStructure from './planStructure';
import GeneralChildContent from './generalChildContent';
import { RightOutlined } from '@ant-design/icons';
import { getExchangeBilling } from './action';
import './Billing.scss';

const TabPane = Tabs.TabPane;

const TYPES = [
	{ type: 'basic', background: STATIC_ICONS['CLOUD_BASIC_BACKGROUND'] },
	{ type: 'crypto', background: STATIC_ICONS['CLOUD_CRYPTO_BACKGROUND'] },
	{ type: 'fiat', background: STATIC_ICONS['CLOUD_FIAT_BACKGROUND'] },
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
const GeneralContent = ({ updatePlanType }) => {
	const dashToken = localStorage.getItem('DASHTOKEN');
	const [OpenPlanModal, setOpenPlanModal] = useState(false);
	const [type, setType] = useState('item');
	const [invoceData, setInvoceData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [renderCardContent, setRenderCardcontent] = useState('crypto');
	const [modalWidth, setModalWidth] = useState('85rem');
	const [value, setValue] = useState(1);

	const options = ['item', 'method', 'crypto', 'payment'];

	useEffect(() => {
		getData();
		setIsLoading(true);
		setRenderCardcontent('crypto');
	}, []);

	useEffect(() => {
		if (dashToken) {
			getInvoice({ is_paid: false });
		}
	}, [dashToken]);

	const onChange = (e) => {
		setValue(e.target.value);
	};

	const getData = async () => {};

	const handleBreadcrumb = (name) => {
		setType(name);
		if (name === 'item') {
			setModalWidth('85rem');
		} else if (name === 'method') {
			setModalWidth('65rem');
		} else if (name === 'crypto') {
			setModalWidth('65rem');
		}
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
		switch (renderCardContent) {
			case 'basic':
				return (
					<div className="mt-5 card-boder">
						<div className="card-design-basic" />
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
										<p className="cloud-type">basic</p>
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
			case 'crypto':
				return (
					<div className="mt-5 card-boder">
						<div className="card-design-crypto" />
						<div
							className="card-wrapper"
							style={{
								backgroundImage: `url(${STATIC_ICONS['CLOUD_CRYPTO_BACKGROUND']})`,
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
									<p className="white-text">Cloud: crypto </p>
									<p className="pb-5">
										For those looking to start a crypto-to-crypto exchange
										buisness
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
			case 'fiat':
				return (
					<div className="mt-5 card-boder">
						<div className="card-design-fiat" />
						<div
							className="card-wrapper"
							style={{
								backgroundImage: `url(${STATIC_ICONS['CLOUD_FIAT_BACKGROUND']})`,
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
									<p className="white-text">Cloud: fiat-ramp </p>
									<p className="pb-5">
										For those that want to start a fiat to crypto exchange that
										have a bank or fiat payment processor
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
			default:
				return null;
		}
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
								<Switch />
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
									return <PlanStructure typeData={type} />;
								})}
							</div>
							<div className="footer">
								<p>
									*A donation towards the HollaEx network is required for new
									custom coin and trading pair activation
								</p>
								<p>
									*Custom exchange code and technical support are not included
									in cloud plans and are paid separately
								</p>
							</div>
							{renderBtn()}
						</div>
					</div>
				);
			case 'method':
				return (
					<div className="radiobtn-container">
						<p>Select Payment Method</p>
						<Radio.Group
							className={'radio-content'}
							onChange={onChange}
							value={value}
						>
							<Space direction="vertical">
								<Radio value={1}>PayPal</Radio>
								<Radio value={2}>Bank Wire Transfer</Radio>
								<Radio value={3}>
									<span>Cryptocurrency </span>
									<span className="danger"> (up to 10% off) </span>
									<span>
										<img
											src={STATIC_ICONS['FIRE_BALL']}
											className="fire-icon"
											alt="fire"
										/>
									</span>
								</Radio>
								<Radio value={4}>Credit Card (coming soon!)</Radio>
							</Space>
						</Radio.Group>
						<Subscription />
						{renderBtn()}
					</div>
				);
			case 'crypto':
				return (
					<div className="radiobtn-container">
						<p>Pick Crypto</p>
						<Radio.Group className="my-3" onChange={onChange} value={value}>
							<Space direction="vertical">
								<Radio value={1}>USDT (TRC20)</Radio>
								<Radio value={2}>Bitcoin</Radio>
								<Radio>
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
								<Radio value={4}>Ethereum</Radio>
							</Space>
						</Radio.Group>
						<Subscription />
						{renderBtn()}
					</div>
				);
			case 'payment':
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
		} else if (type === 'method') {
			setType('crypto');
			setModalWidth('65rem');
		} else if (type === 'crypto') {
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

	const renderBtn = () => {
		return (
			<div className="button-container">
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
		if (res && res?.data) {
			setInvoceData(res.data);
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
					<p className="description-content">Current Plan : Crypto Pro</p>
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

export default GeneralContent;
