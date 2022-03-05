'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `${name} العزيز`,
	CLOSING: {
		1: 'تحية',
		2: () => `فريق ${API_NAME()}`
	},
	IP_ADDRESS: (ip) => `عنوان IP: ${ip}`,
	IP_REQUEST_FROM: (ip) => `تم بدء الطلب من: ${ip}`,
	TXID: (txid) => `معرّف المعاملة:${txid} `,
	FEE: (fee) => `الرسوم:  ${fee}`,
	AMOUNT: (amount) => `المبلغ:  ${amount} `,
	ADDRESS: (address) => `العنوان: ${address}`,
	TIME: (time) => `الوقت:  ${time} `,
	COUNTRY: (country) => `البلد:  ${country}`,
	DEVICE: (device) => `الجهاز:  ${device} `,
	MESSAGE: (message) => `الرسالة:  ${message}`,
	ERROR_REQUEST:
		'إذا تم تقديم هذا الطلب عن طريق الخطأ ، فمن الآمن تجاهله ؛ لن يتم إجراء أي تغييرات في حسابك.',
	EXPLORER:
		'يمكنك العثور على حالة معاملتك على البلوك تشين من خلال مستكشفات البلوكات هذه:',
	DEPOSIT: 'ايداع',
	WITHDRAWAL: 'سحب'
};

const FOOTER = {
	FOLLOW_US: 'تابعنا على',
	NEED_HELP: 'تحتاج مساعدة؟ فقط قم بالرد على هذا البريد الإلكتروني',
	PRIVACY_POLICY: 'سياسة الخصوصية',
	TERMS: 'الشروط و الأحكام',
	INVITE_YOUR_FRIENDS: 'أدعو أصدقائك',
	POWERED_BY: 'مشغل بواسطة'
};

const ALERT = {
	TITLE: (title) => `تنبيه: ${title}`,
	BODY: {
		1: (type) => `تنبيه: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'نموذج الاتصال',
	BODY: {
		1: 'بيانات نموذج الاتصال',
		2: (email) =>
			`أرسل العميل بالبريد الإلكتروني   ${email} نموذج الاتصال.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`رمز التحقق الخاص بك هو ${code} `
	,
	deposit: (currency, amount) =>
		`تم التحقق من إيداعك ${currency.toUpperCase()} بمبلغ  ${amount} وإيداعه في محفظتك`
	,
	withdrawal: (currency, amount) =>
		`تم التحقق من سحب ${currency.toUpperCase()}  الخاص بك بمبلغ ${amount}`
};

const INVITEDOPERATOR = {
	TITLE: 'دعوة العامل',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		CREATED: {
			1: (role, invitingEmail) => `لقد تمت دعوتك كعامل (operator) إلى ${API_NAME()} مع دور ${role}  بواسطة المستخدم ${invitingEmail}.`,
			2: 'يتم توفير كلمة المرور المؤقتة الخاصة بك أدناه. تأكد من تغيير كلمة المرور الخاصة بك بعد تسجيل الدخول لأسباب أمنية.',
			3: (email) => `${email} :البريد الإلكتروني `,
			4: (password) => `${password}: كلمة المرور`,
			5: 'Login'
		},
		EXISTING: {
			1: (role, invitingEmail) => `تمت ترقية حسابك على  ${API_NAME()} إلى دور ${role} بواسطة المستخدم ${invitingEmail}.`,
			2: 'تسجيل الدخول'
		}
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation = 0, currency) =>
			`لديك إيداع جديد بمبلغ  {amount}$ ${currency.toUpperCase()}  في قيد الانتظار في محفظتك ${API_NAME()} .يرجى الانتظار حتى يتم تأكيد المعاملة وستتوفر أموالك في محفظتك. تتطلب معاملتك  ${confirmation} تأكيداً (تأكيداتٍ) على البلوك تشين.`,
		COMPLETED: (amount, confirmation, currency) =>
			`Yايداعك لـ
       ${currency.toUpperCase()} ${amount} ${currency.toUpperCase()} قد تم تأكيده و تكميله و موجود في ${
				currency.toUpperCase()
					. محفظتك }`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `الحالة:  ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: (network) => `Network: ${network}`,
		6: (fee) => COMMON.FEE(fee),
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency, address = '') =>
			`لقد قدمت طلب سحب بمبلغ ${amount} ${currency.toUpperCase()}  إلى عنوان ${address}. حالة السحب الخاصة بك في قيد الإنتظار وستتم معالجتها قريبًا.`,
		COMPLETED: (amount, currency, address = '') =>
			`تمت معالجة طلب سحبك بمبلغ ${amount} ${currency.toUpperCase()}  و نقله إلى عنوان ${address}.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `${status}:الحالة`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: (network) => `Network: ${network}`,
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	INVITEDOPERATOR,
	CONTACTFORM,
	DEPOSIT,
	WITHDRAWAL
};
