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

const SIGNUP = {
	TITLE: 'Sign Up',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `You need to confirm your email account by clicking the button below.
		If you have any questions feel free to contact us simply by replying to this email.`,
		2: 'Please click on the button below to proceed with your registration.',
		3: 'Confirm'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'Welcome',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Thank you for signing up to ${API_NAME()}.`,
		2: (account, deposit) => `
		To begin trading, you must first deposit cryptocurrency or fund money to your account.
		Please go to your ${account} and visit the ${deposit} page.`,
		3: 'account',
		4: 'deposit',
		5: 'If you have any questions or concerns, please contact us simply by replying to this email.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Login',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'We have recorded a login to your account with the following details',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'If this was not you, please change your password, set up two-factor authentication, and contact us immediately.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Reset Password Request',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'You have made a request to reset the password for your account.',
		2: 'To update your password, click on the link below.',
		3: 'Reset My Password',
		4: COMMON.ERROR_REQUEST,
		5: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation = 1, currency) =>
			`You have a new deposit for ${amount} ${currency.toUpperCase()} pending in your ${API_NAME()} wallet. Please wait until the transaction is confirmed and your funds will be available in your wallet. Your transaction require ${confirmation} confirmation(s) on blockchain.`,
		COMPLETED: (amount, confirmation, currency) =>
			`Your ${
				currency.toUpperCase()
			} deposit for ${amount} ${currency.toUpperCase()} is confirmed and completed and it is available in your ${
				currency.toUpperCase()
			} wallet.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Account Verified',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Congratulations. Your account is verified successfully.',
		2: 'Trade Now'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'Account Upgraded',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (tier) =>
			`Congratulations. Your account access level is upgraded to ${tier} tier. You will benefit from lower fees, higher withdrawal limits and other premium features.`,
		2: 'Trade Now'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} rejected`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`We were not able to find or process your ${currency.toUpperCase()} deposit made on ${date} for ${amount}. Thus, the transaction is rejected by our system.`,
		WITHDRAWAL: (currency, date, amount) =>
			`We were not able to find or process your ${currency.toUpperCase()} withdrawal made on ${date} for ${amount}. Thus the transaction is rejected by our system and your pending withdrawal amount is credited back to your ${API_NAME()} wallet.`,
		1: 'If you have any further inquiries, you can reply to this email',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'Status: Rejected'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency) =>
			`You made a withdrawal request for ${amount} ${currency.toUpperCase()}. Your withdrawal status is pending and will be processed shortly.`,
		COMPLETED: (amount, currency) =>
			`Your withdrawal request for ${amount} ${currency.toUpperCase()} is processed.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Status: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} Request`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`You have made a ${currency.toUpperCase()} withdrawal request of ${amount} to ${address}`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Address: ${address}`,
		5: (network) => `Network: ${network}`,
		6: 'In order to confirm this withdrawal, please click the button below.',
		7: 'Confirm',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'Invalid Withdrawal Address',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `Your ${currency} withdrawal for ${amount} was being sent to an invalid address and is rejected.`,
		2: (address) => `Address: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `ALERT: ${title}`,
	BODY: {
		1: (type) => `Alert: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id'
			? 'ID Verification Rejected'
			: 'New Bank Application Rejected',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? 'Your recent ID verification is processed and is unfortunately rejected. For further actions read the message from our expert below:'
				: 'Your new bank registration is processed and is unfortunately rejected. For further actions read the message from our expert below:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `Account ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `Your account ${email} has been activated. You are now able to use your account.`,
		DEACTIVATED: (email) => `Your account ${email} has been deactivated. You will not be able to use your account until it is activated by the exchange admin.`
	},
	CLOSING: COMMON.CLOSING
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

const USERVERIFICATION = {
	TITLE: 'User Verification',
	BODY: {
		1: 'User Verification Required',
		2: (email) =>
			`User "${email}" uploaded his documents for verification. Please verify his documents.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'Suspicious Deposit',
	BODY: {
		1: 'Suspicious Deposit',
		2: (email, currency) =>
			`The client with email ${email} has received a ${currency.toUpperCase()} deposit that is suspicious.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Transaction data:',
		5: (data) => `${JSON.stringify(data)}`
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
	SIGNUP,
	WELCOME,
	LOGIN,
	RESETPASSWORD,
	DEPOSIT,
	ACCOUNTVERIFY,
	ACCOUNTUPGRADE,
	USERVERIFICATIONREJECT,
	DEPOSITCANCEL,
	WITHDRAWAL,
	WITHDRAWALREQUEST,
	USERVERIFICATION,
	SUSPICIOUSDEPOSIT,
	INVALIDADDRESS,
	CONTACTFORM,
	USERDEACTIVATED,
	ALERT,
	SMS,
	INVITEDOPERATOR
};
