import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { Tag } from 'antd';
import { STATIC_ICONS } from 'config/icons';

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

export const payOptions = [
	{ key: 'pay', value: 'Pay from wallet' },
	{ key: 'transfer', value: 'Transfer crypto payment' },
];

export const cryptoCoins = [
	{ coin: 'USDT', symbol: 'usdt' },
	{ coin: 'Bitcoin', symbol: 'btc' },
	{ coin: 'XHT', symbol: 'xht' },
	{ coin: 'Ethereum', symbol: 'eth' },
	{ coin: 'TRON', symbol: 'trx' },
	{ coin: 'XRP', symbol: 'xrp' },
];

export const paymentMethods = [
	{ label: 'PayPal', method: 'paypal' },
	{ label: 'Bank Wire Transfer', method: 'bank' },
	{ label: 'Cryptocurrency', method: 'cryptoCurrency' },
	{ label: 'Credit Card', method: 'stripe' },
];

export const columns = (onHandlePendingPay) => {
	return [
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
								<Link onClick={() => onHandlePendingPay(item)}>Pay</Link>
							</span>
						</div>
					);
				}
			},
		},
	];
};

export const options = ['item', 'method', 'crypto', 'payment'];
export const fiatOptions = ['item', 'apply'];
export const pendingPayOption = ['method', 'crypto', 'payment'];
