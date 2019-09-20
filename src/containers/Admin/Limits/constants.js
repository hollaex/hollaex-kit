// export const COLUMNS_CURRENCY = [
// 	{
// 		title: 'Verification Level',
// 		dataIndex: 'verification_level',
// 		key: 'verification_level'
// 	},
// 	{
// 		title: 'BTC Withdrawal Max Daily',
// 		dataIndex: 'btc_withdraw_daily',
// 		key: 'btc_withdraw_daily'
// 	},
// 	{
// 		title: 'BTC Deposit Max Daily',
// 		dataIndex: 'btc_deposit_daily',
// 		key: 'btc_deposit_daily'
// 	},
// 	{
// 		title: 'FIAT Withdrawal Max Daily',
// 		dataIndex: 'fiat_withdraw_daily',
// 		key: 'fiat_withdraw_daily'
// 	},
// 	{
// 		title: 'FIAT Deposit Max Daily',
// 		dataIndex: 'fiat_deposit_daily',
// 		key: 'fiat_deposit_daily'
// 	}
// ];

export const COLUMNS_FEES = [
	{
		title: 'Verification Level',
		dataIndex: 'verification_level',
		key: 'verification_level'
	},
	{ title: 'Taker Fee', dataIndex: 'taker_fee', key: 'taker_fee' },
	{ title: 'Maker Fee', dataIndex: 'maker_fee', key: 'maker_fee' }
];

export const UPDATE_KEYS = [{ value: 1, label: 1 }, { value: 2, label: 2 }];

export const CURRENCY_KEYS = [
	{ value: 'fullname', label: 'fullname' },
	{ value: 'symbol', label: 'symbol' },
	{ value: 'active', label: 'active' },
	{ value: 'allow_deposit', label: 'allow_deposit' },
	{ value: 'allow_withdrawal', label: 'allow_withdrawal' },
	{ value: 'withdrawal_fee', label: 'withdrawal_fee' },
	{ value: 'min', label: 'min' },
	{ value: 'max', label: 'max' }
];

const returnArray = (obj) => {
	const keys = Object.keys(obj);
	return keys.map((index) => ` ${obj[index]} `);
};

export const COLUMNS_CURRENCY = [
	{
		title: 'fullname',
		dataIndex: 'fullname',
		key: 'fullname'
	},
	{
		title: 'symbol',
		dataIndex: 'symbol',
		key: 'symbol'
	},
	{
		title: 'active',
		dataIndex: 'active',
		key: 'active',
		render: (v) => (v ? 'active' : 'inactive')
	},
	{
		title: 'allow_deposit',
		dataIndex: 'allow_deposit',
		key: 'allow_deposit',
		render: (v) => (v ? 'allow' : 'inallow')
	},
	{
		title: 'allow_withdrawal',
		dataIndex: 'allow_withdrawal',
		key: 'allow_withdrawal',
		render: (v) => (v ? 'allow' : 'inallow')
	},
	{
		title: 'withdrawal_fee',
		dataIndex: 'withdrawal_fee',
		key: 'withdrawal_fee'
	},
	{
		title: 'min',
		dataIndex: 'min',
		key: 'min'
	},
	{
		title: 'max',
		dataIndex: 'max',
		key: 'max'
	},
	{
		title: 'increment_unit',
		dataIndex: 'increment_unit',
		key: 'increment_unit'
	},
	{
		title: 'deposit_limits',
		dataIndex: 'deposit_limits',
		key: 'deposit_limits',
		render: (d) => returnArray(d)
	},
	{
		title: 'withdrawal_limits',
		dataIndex: 'withdrawal_limits',
		key: 'withdrawal_limits',
		render: (d) => returnArray(d)
	}
];
