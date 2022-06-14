'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `${name}님`,
	CLOSING: {
		1: '이용해 주셔서 감사합니다.',
		2: () => `${API_NAME()} 팀`
	},
	IP_ADDRESS: (ip) => `IP 주소: ${ip}`,
	IP_REQUEST_FROM: (ip) => `요청하신곳: ${ip}`,
	TXID: (txid) => `거래 ID 확인: ${txid}`,
	FEE: (fee) => `수수료: ${fee}`,
	AMOUNT: (amount) => `금액: ${amount}`,
	ADDRESS: (address) => `주소: ${address}`,
	TIME: (time) => `시간: ${time}`,
	COUNTRY: (country) => `국가: ${country}`,
	DEVICE: (device) => `브라우저: ${device}`,
	MESSAGE: (message) => `메세지: ${message}`,
	ERROR_REQUEST:
		'만약 이 요청을 원하지 않는다면, 회원님의 계정에는 변경사항이 없으니 본 메일을 무시해 주시기 바랍니다.',
	EXPLORER: '회원님이 요청하신 거래 상황을 이곳에서 확인하실 수 있습니다.',
	DEPOSIT: '입금',
	WITHDRAWAL: '출금'
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: '도움이 필요하시다면, 이 이메일에 회신해 주시기 바랍니다.',
	PRIVACY_POLICY: '개인정보 처리방침',
	TERMS: '이용약관',
	INVITE_YOUR_FRIENDS: '친구 초대:',
	POWERED_BY: 'Powered by'
};

const ALERT = {
	TITLE: (title) => `ALERT: ${title}`,
	BODY: {
		1: (type) => `Alert: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: '문의 양식',
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
	ALERT,
	SMS,
	INVITEDOPERATOR,
	CONTACTFORM
};
