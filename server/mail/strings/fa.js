'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `کاربر عزیز ${name}`,
	CLOSING: {
		1: 'با تشکر',
		2: () => `${API_NAME()} تیم`
	},
	IP_ADDRESS: (ip) => `آی پی آدرس: ${ip}`,
	IP_REQUEST_FROM: (ip) => `درخواست ارسالی از : ${ip}`,
	TXID: (txid) => `شماره پیگیری تراکنش :${txid}`,
	FEE: (fee) => `کارمزد: ${fee}`,
	AMOUNT: (amount) => ` مبلغ:${amount}`,
	ADDRESS: (address) => ` آدرس:${address}`,
	TIME: (time) => ` زمان:${time}`,
	COUNTRY: (country) => `کشور:${country}`,
	DEVICE: (device) => `دستگاه:${device}`,
	MESSAGE: (message) => ` پیام:${message}`,
	ERROR_REQUEST:
		'اگر این درخواست را باشتباه صادر کرده اید می توانید براحتی آن را ملغی کنید بدون آنکه نگران تغییر در حساب کاربری خود باشید.',
	EXPLORER:
		'شما از آخرین وضعیت تراکنش خود بر روی شبکه بلاکچین با استفاده از لینک های زیر می توانید آگاه شوید :',
	DEPOSIT: 'واریز',
	WITHDRAWAL: 'برداشت'
};

const FOOTER = {
	FOLLOW_US: 'ما را دنبال کنید',
	NEED_HELP: 'سوالی دارید؟ کافی است در پاسخ به همین ایمیل آن را بپرسید',
	PRIVACY_POLICY: 'حریم خصوصی',
	TERMS: 'شرایط استفاده',
	INVITE_YOUR_FRIENDS: 'دوستان خود را دعوت کنید',
	POWERED_BY: 'قدرت گرفته توسط'
};

const CONTACTFORM = {
	TITLE: 'فرم تماس',
	BODY: {
		1: 'اطلاعات فرم تماس',
		2: (email) =>
			`کاربر با ایمیل کاربری ${email} پیامی از طریق فرم تماس ارسال نموده است.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`کد تایید شما ${code}`
	,
	deposit: (currency, amount) =>
		`واریز ${currency.toUpperCase()} شما به مبلغ ${amount} مورد تایید قرار گرفته و در کیف پول شما قابلیت استفاده دارد.`
	,
	withdrawal: (currency, amount) =>
		`برداشت ${currency.toUpperCase()} شما با مبلغ ${amount} مورد تایید قرار گرفت.`
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
	SMS,
	INVITEDOPERATOR,
	CONTACTFORM
};
