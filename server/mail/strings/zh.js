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

const SIGNUP = {
	TITLE: '注册会员',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `需要通过点击下面的按钮确认你的邮箱地址。 
		如果你有任何问题，请随时联系我们，只需回复此邮件即可。`,
		2: '请点击下方按钮，进行注册',
		3: '确认'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: '注册会员',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `感谢你在${API_NAME()}进行注册`,
		2: (account, deposit) => `
			若要进行交易，必须先将加密货币或资金存入你的账户。
			前往${account}并访问${deposit}页面。
			`,
		3: '账号',
		4: '充值',
		5: '如果您有任何问题，请回复此邮件与我们进行联系。'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: '登录',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '我们已经记录了你的账号的登录信息，具体如下',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: `非本人的情况下，请更改你的密码，设置双重身份验证并立即联系我们。`
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: '申请重置密码',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '你已申请重置密码',
		2: '请点击下方链接，进行密码更新',
		3: '重置我的密码',
		4: COMMON.ERROR_REQUEST,
		5: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation = 0, currency) =>
			`你的${API_NAME()}钱包中有一笔${amount} ${currency.toUpperCase()}的新存款正在等待处理，待交易被确认后，资金才会进入到你的钱包中，该交易需要在区块链上进行${confirmation}确认。`,
		COMPLETED: (amount, confirmation, currency) =>
			`你的${amount} ${currency.toUpperCase()}存款已完成。你的${
				currency.toUpperCase()
			}可在钱包中进行确认。`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `状态: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: (network) => `Network: ${network}`,
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: '账号认证完成',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '恭喜你，你的账号验证成功。',
		2: '进行交易'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: '账号升级完成',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`恭喜你，你的账号级别已升级至${level}，你将可以享受更低的费用、更高的提款限额和其他高级功能。`,
		2: '进行交易'
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
			`我们无法找到或处理你在${date}存入的${currency.toUpperCase()}存款${amount}，因此这笔交易已被系统拒绝。`,
		WITHDRAWAL: (currency, date, amount) =>
			`我们无法找到或处理你的${currency.toUpperCase()}在${date}提取的${amount}，因此系统拒绝了这一交易，你的待处理提款金额将被退回至${API_NAME()}钱包中。`,
		1: '如果你有任何疑问，请回复此邮件。',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: '状态:拒绝'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency, address = '') =>
			`你向该地址${address}申请了${amount} ${currency.toUpperCase()}的提款请求，该提款地址正在等待处理并会很快得到处理。`,
		COMPLETED: (amount, currency, address = '') =>
			`你的${amount} ${currency.toUpperCase()}已向该地址${address}提款完毕。`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `充值状态: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: (network) => `Network: ${network}`,
		7: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}申请`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`你已提出${currency.toUpperCase()}提款申请，金额为${amount}至${address}。`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `地址: ${address}`,
		5: (network) => `Network: ${network}`,
		6: '为完成此次提款申请，请点击下方按钮。',
		7: '确认',
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
		type === 'id' ? 'ID 认证拒绝' : '新的银行信息申请被拒绝',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? '你的ID 认证已处理完毕，但是很遗憾被拒绝。关于进一步的操作，请阅读下方信息:'
				: '你的新的银行信息申请已被处理，但是很遗憾被拒绝。关于进一步的操作，请阅读下方信息:',
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
	TITLE: '咨询格式',
	BODY: {
		1: 'Contact Form Data',
		2: (email) =>
			`The client with email ${email} has submitted the contact form.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: '用户验证',
	BODY: {
		1: 'User Verification Required',
		2: (email) =>
			`User "${email}" uploaded his documents for verification. Please verify his documents.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: '可疑存款',
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

const DISCOUNTUPDATE = {
	TITLE: 'Discount Rate Change',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (rate) => `Your discount rate has been changed to ${rate}%. This rate will be applied to your order fees.`
	},
	CLOSING: COMMON.CLOSING
};

const BANKVERIFIED = {
	TITLE: 'Bank Verified',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'A pending bank account has been verified. Your valid account can now be used for exchange operations requiring a bank account.',
		2: 'To view your current bank accounts, please visit the exchange\'s Verification Tab'
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
	DISCOUNTUPDATE,
	BANKVERIFIED
};
