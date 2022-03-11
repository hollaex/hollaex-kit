'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Dear ${name}`,
	CLOSING: {
		1: 'Regards',
		2: () => `${API_NAME()} team`
	},
	IP_ADDRESS: (ip) => `IP Address: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Request initiated from: ${ip}`,
	TXID: (txid) => `Transaction ID: ${txid}`,
	FEE: (fee) => `Fee: ${fee}`,
	AMOUNT: (amount) => `Amount: ${amount}`,
	ADDRESS: (address) => `Address: ${address}`,
	TIME: (time) => `Time: ${time}`,
	COUNTRY: (country) => `Country: ${country}`,
	DEVICE: (device) => `Device: ${device}`,
	MESSAGE: (message) => `Message: ${message}`,
	ERROR_REQUEST:
		'If this request was made in error, it is safe to ignore it; no changes will be made to your account.',
	EXPLORER:
		'You can find the status of your transaction on blockchain through these Block Explorers:',
	DEPOSIT: 'Deposit',
	WITHDRAWAL: 'Withdrawal'
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: 'Need help? Just reply to this email',
	PRIVACY_POLICY: 'Privacy policy',
	TERMS: 'Terms and conditions',
	INVITE_YOUR_FRIENDS: 'Invite your friends',
	POWERED_BY: 'Powered by'
};

const ALERT = {
	TITLE: (title) => `ALERT: ${title}`,
	BODY: {
		1: (type) => `Alert: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'Contact Form',
	BODY: {
		1: 'Contact Form Data',
		2: (email) =>
			`The client with email ${email} has submitted the contact form.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Your verification code is ${code}`
	,
	deposit: (currency, amount) =>
		`Your ${currency.toUpperCase()} deposit for amount ${amount} is confirmed and deposited to your wallet`
	,
	withdrawal: (currency, amount) =>
		`Your ${currency.toUpperCase()} withdrawal for amount ${amount} is confirmed`
};

const INVITEDOPERATOR = {
	TITLE: 'Operator Invite',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		CREATED: {
			1: (role, invitingEmail) => `You've been invited as an operator to ${API_NAME()} with the role of ${role} by user ${invitingEmail}.`,
			2: 'Your temporary password is provided below. Make sure to change your password after logging in for security purposes.',
			3: (email) => `Email: ${email}`,
			4: (password) => `Password: ${password}`,
			5: 'Login'
		},
		EXISTING: {
			1: (role, invitingEmail) => `Your ${API_NAME()} account has been upgraded to the role of ${role} by user ${invitingEmail}.`,
			2: 'Login'
		}
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	COMMON,
	CONTACTFORM,
	ALERT,
	SMS,
	INVITEDOPERATOR
};
