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

const SIGNUP = {
	TITLE: 'سجّل',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `تحتاج إلى تأكيد حساب البريد الإلكتروني الخاص بك عن طريق النقر على الزر أدناه.
		إذا كانت لديك أي أسئلة ، فلا تتردد في الاتصال بنا ببساطة عن طريق الرد على هذا البريد الإلكتروني.`,
		2: 'الرجاء الضغط على الزر أدناه لمتابعة التسجيل الخاص بك.',
		3: 'أيِّد'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'أهلا بك',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `شكرًا لك على الاشتراك في  ${API_NAME()} .`,
		2: (account, deposit) => `
		لكي تقوم بالتداول ، يجب عليك أولاً إيداع عملة مشفرة أو تمويل الأموال في حسابك. 
		من فضلك ، انتقل إلى ${account}  وقم بزيارة صفحة ${Deposit}.`,
		3: 'الحساب',
		4: 'ايداع',
		5: 'إذا كانت لديك أي أسئلة أو استفسارات ، فيرجى الاتصال بنا ببساطة عن طريق الرد على هذا البريد الإلكتروني.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'تسجيل الدخول',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'لقد سجلنا تسجيل دخولٍ إلى حسابك مع التفاصيل التالية',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'إذا لم يكن هذا أنت ، فيرجى تغيير كلمة المرور الخاصة بك وإعداد المصادقة ذات العاملين والاتصال بنا على الفور.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'طلب إعادة تعيين كلمة المرور',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'لقد قدمت طلباً لإعادة تعيين كلمة المرور لحسابك.',
		2: 'لتحديث كلمة المرور الخاصة بك ، انقر على الرابط أدناه.',
		3: 'إعادة تعيين كلمة المرور الخاصة بي',
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
		5: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'تم التحقق من الحساب',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'تهانينا. تم التحقق من حسابك بنجاح.',
		2: 'تداول الآن'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'تم ترقية الحساب',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`تهانينا. تمت ترقية مستوى حسابك إلى مستوى  ${level}. ستستفيد من رسوم أقل وحدود سحب أعلى وميزات مميزة أخرى.`,
		2: 'تداول الآن'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} مرفوض`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`We were not able to find or process your ${currency.toUpperCase()} deposit made on ${date} for ${amount}. Thus, the transaction is rejected by our system.`,
		WITHDRAWAL: (currency, date, amount) =>
			`لم نتمكن من العثور على الايداعك أو معالجة إيداعك ${currency.toUpperCase()} الذي تم إجراؤه في  ${date} بمبلغ  ${amount}. وبالتالي ، يتم رفض المعاملة من قبل نظامنا.`,
		1: 'لم نتمكن من العثور على السحب الذي طلبته ${currency.toUpperCase()} أو معالجته في  ${date} بمبلغ  ${amount}.  وبالتالي تم رفض المعاملة من قبل نظامنا وإعادة مبلغ السحب المعلق إلى محفظتك ${API_NAME()}.',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'الحالة: مرفوضة'
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
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} طلب`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`لقد قدّمت طلب سحب ${currency.toUpperCase()} بمبلغ ${amount} الى ${address} `,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Address: ${address}`,
		5: 'لتأكيد هذا السحب ، انقر على الزر أدناه.',
		6: 'أيٍّد',
		7: COMMON.ERROR_REQUEST,
		8: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'عنوان السحب غير صالح',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `كان قد يُرسل مبلغ السحب {currency}  $الذي سحبته بمبلغ ${amount} إلى عنوان غير صالح وتم رفضه.`,
		2: (address) => `العنوان: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `تنبيه: ${title}`,
	BODY: {
		1: (type) => `تنبيه: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'هوية'
			? 'تم رفض التحقق من الهوية'
			: 'تم رفض طلب البنك الجديد',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'هوية'
				? 'تم معالجة عملية التحقق من هويتك الحديثة و تم رفضها للأسف. لمزيد من الإجراءات ، اقرأ الرسالة من خبيرنا أدناه:'
				: 'تم معالجة تسجيلك المصرفي الجديد و تم رفضه للأسف. لمزيد من الإجراءات ، اقرأ الرسالة من خبيرنا أدناه:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `الحساب $ {type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `تم تنشيط حسابك ${email}  . أنت الآن قادر على استخدام حسابك.`,
		DEACTIVATED: (email) => `تم تعطيل حسابك ${email} . لن تتمكن من استخدام حسابك حتى يتم تنشيطه بواسطة مسؤول البورصة.`
	},
	CLOSING: COMMON.CLOSING
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

const USERVERIFICATION = {
	TITLE: 'التحقق من المستخدم',
	BODY: {
		1: 'مطلوب التحقق من المستخدم',
		2: (email) =>
			`قام المستخدم "${email}" بتحميل وثائقه للتحقق منها. الرجاء التحقق من وثائقه.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'الوديعة مشكوك فيها',
	BODY: {
		1: 'الوديعة مشكوك فيها',
		2: (email, currency) =>
			`تلقى العميل بالبريد الإلكتروني ${email}  إيداع  ${currency.toUpperCase()}   مشكوكاً.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'بيانات المعاملات:',
		5: (data) => `${JSON.stringify(data)}`
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

const DISCOUNTUPDATE = {
	TITLE: 'Discount Rate Change',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (rate) => `Your discount rate has been changed to ${rate}%. This rate will be applied to your order fees.`
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
	INVITEDOPERATOR,
	DISCOUNTUPDATE
};
