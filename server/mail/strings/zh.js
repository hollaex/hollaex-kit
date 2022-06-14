'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `${name}`,
	CLOSING: {
		1: '感谢你的使用',
		2: () => `${API_NAME()}团队`
	},
	IP_ADDRESS: (ip) => `IP 地址: ${ip}`,
	IP_REQUEST_FROM: (ip) => `提出申请的出处: ${ip}`,
	TXID: (txid) => `交易 ID: ${txid}`,
	FEE: (fee) => `手续费: ${fee}`,
	AMOUNT: (amount) => `金额: ${amount}`,
	ADDRESS: (address) => `地址: ${address}`,
	TIME: (time) => `时间: ${time}`,

	COUNTRY: (country) => `国家: ${country}`,
	DEVICE: (device) => `设备: ${device}`,
	MESSAGE: (message) => `消息: ${message}`,
	ERROR_REQUEST:
		'如果该请求是错误的，请忽略，并且你的账号不会有任何改变',
	EXPLORER: '可通过区块链浏览器查找区块链上的交易状态',
	DEPOSIT: '充值',
	WITHDRAWAL: '提款'
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: '如果需要帮助，请回复此邮件',
	PRIVACY_POLICY: '隐私政策',
	TERMS: '使用条款',
	INVITE_YOUR_FRIENDS: '邀请好友:',
	POWERED_BY: 'Powered by'
};

const ALERT = {
	TITLE: (title) => `ALERT: ${title}`,
	BODY: {
		1: (type) => `Alert: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: '咨询格式',
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

module.exports = {
	FOOTER,
	COMMON,
	CONTACTFORM,
	ALERT,
	SMS
};
