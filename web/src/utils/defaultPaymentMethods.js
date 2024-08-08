const DEFAULT_PAYMENT_METHODS = [
	{
		fields: [
			{
				id: 1,
				name: 'Bank Number',
				required: true,
			},
			{
				id: 2,
				name: 'Full Name',
				required: true,
			},
		],
		system_name: 'IBAN',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'Routing Number',
				required: true,
			},
			{
				id: 3,
				name: 'Account Holder Name',
				required: true,
			},
		],
		system_name: 'Wire Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'Routing Number',
				required: true,
			},
			{
				id: 3,
				name: 'Account Holder Name',
				required: true,
			},
		],
		system_name: 'ACH Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'SWIFT Code',
				required: true,
			},
			{
				id: 3,
				name: 'Account Holder Name',
				required: true,
			},
		],
		system_name: 'SWIFT Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'IBAN',
				required: true,
			},
			{
				id: 2,
				name: 'BIC',
				required: true,
			},
			{
				id: 3,
				name: 'Account Holder Name',
				required: true,
			},
		],
		system_name: 'SEPA Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
			{
				id: 2,
				name: 'Currency',
				required: true,
			},
		],
		system_name: 'Wise',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
			{
				id: 2,
				name: 'Currency',
				required: true,
			},
		],
		system_name: 'PayPal',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email or Phone',
				required: true,
			},
		],
		system_name: 'Zelle',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Username',
				required: true,
			},
		],
		system_name: 'Venmo',
	},
	{
		fields: [
			{
				id: 1,
				name: 'MTCN',
				required: true,
			},
		],
		system_name: 'Western Union',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Reference Number',
				required: true,
			},
		],
		system_name: 'MoneyGram',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Revolut',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'Alipay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'WeChat ID',
				required: true,
			},
		],
		system_name: 'WeChat Pay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Square Cash',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Stripe',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Amazon Pay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'Payoneer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Skrill',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account ID',
				required: true,
			},
		],
		system_name: 'Neteller',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Voucher Code',
				required: true,
			},
		],
		system_name: 'Paysafe',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Klarna',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'Afterpay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'Bill.com',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'QuickBooks Payments',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'GoCardless',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Braintree',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'WorldPay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Adyen',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'BlueSnap',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Chase QuickPay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'Routing Number',
				required: true,
			},
		],
		system_name: 'Citibank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Barclaycard',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Paysend',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Monzo',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'Routing Number',
				required: true,
			},
		],
		system_name: 'HSBC Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Cash App',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'N26 Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'TransferGo',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'BitPay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Coinbase',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Wallet Address',
				required: true,
			},
		],
		system_name: 'Blockchain Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'Routing Number',
				required: true,
			},
		],
		system_name: 'Lloyds Bank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Revolut Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'N26 Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Monzo Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'TransferWise Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'N26 Bank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Zen Pay',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Ally Bank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Bank of America Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'Routing Number',
				required: true,
			},
		],
		system_name: 'Santander Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'First Direct Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'PNC Bank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'USAA Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
			{
				id: 2,
				name: 'Routing Number',
				required: true,
			},
		],
		system_name: 'Chime Bank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Capital One Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Fifth Third Bank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Discover Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Netspend',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'N26 Bank Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'M-Pesa',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Payza',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'JCB Card Payment',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'Zenith Bank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'GTBank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Paytm',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Account Number',
				required: true,
			},
		],
		system_name: 'Ecobank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'FirstBank Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Remitly',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Card Number',
				required: true,
			},
			{
				id: 2,
				name: 'Expiry Date',
				required: true,
			},
			{
				id: 3,
				name: 'CVV',
				required: true,
			},
		],
		system_name: 'Hyperwallet',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Payoneer Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Xoom',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Phone Number',
				required: true,
			},
		],
		system_name: 'Bradesco Transfer',
	},
	{
		fields: [
			{
				id: 1,
				name: 'Email',
				required: true,
			},
		],
		system_name: 'Interac e-Transfer',
	},
];

export default DEFAULT_PAYMENT_METHODS;
