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

const SIGNUP = {
	TITLE: 'ثبت نام',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `شما باید ایمیل خود را با فشار دادن دکمه زیر تایید نمایید.
		 در صورت داشتن هر گونه سوال و یا ابهامی  کافیست تا آن را در پاسخ به همین ایمیل با ما درمیان بگذارید .`,
		2: 'برای ادامه روند ثبت نام خود ، لطفا دکمه زیر را فشار دهید.',
		3: 'تایید'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'خوش آمدید',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `با تشکر از ثبت نام شما در ${API_NAME()}.`,
		2: (account, deposit) => `
		برای شروع معاملات شما ابتدا باید به حساب کاربری خود رمزارز و یا پول فیات واریز نمایید.
		لطفا ابتدا به حساب کاربری خود رفته وصفحه واریز ها را مشاهده فرمایید.`,
		3: 'حساب کاربری',
		4: 'واریز',
		5: 'در صورت داشتن سوال و یا ابهامی با ما تماس حاصل فرمایید.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'ورود',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'شما با جزییات زیر وارد حساب کاربری خود شده ایید:',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'اگر شما وارد حساب کاربری خود نشده ایید ، اکیدا توصیه میکنیم  بی درنگ پسورد خود را عوض کنید و همچنین رمز یکبار مصرف حساب کاربری خود را فعال نمایید.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'درخواست کلمه عبور جدید',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'شما درخواست کلمه عبور جدید برای حساب کاربری خود را ارسال کرده اید. ',
		2: 'برای بروز رسانی کلمه عبور خود از لینک زیر استفاده نمایید.',
		3: 'کلمه عبور من را مجددا تنظیم کن',
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
			`شما یک واریز جدید به مبلغ ${amount} ${currency.toUpperCase()} دارید که در حال انتظار برای واریز به کیف پول  ${API_NAME()} می باشد. 
لطفا تا تایید تراکنش خود و مشاهده مبلغ در کیف پول خود تامل فرمایید.
تراکنش شما حداقل به  ${confirmation} تایید بر روی شبکه بلاکچین نیاز دارد.`,
		COMPLETED: (amount, confirmation, currency) =>
			`واریز ${
				currency.toUpperCase()
			} شما به میزان ${amount} ${currency.toUpperCase()} تکمیل و تایید شده و هم اکنون در کیف پول ${
				currency.toUpperCase()
			} شما قابل استفاده است.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'حساب کاربری تایید شد',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'تبریک می گوییم. حساب کاربری شما تایید و ارتقا سطح داده شده است و هم اکنون می توانید براحتی فعالیت خود را آغاز نمایید.',
		2: 'هم اکنون معامله کنید'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'حساب کاربری ارتقا یافت',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`تبریک می گوییم ، سطح حساب کاربری شما به سطح ${level}ارتقا یافت.
شما می توانید از مزیت های کارمزد کمتر و سقف برداشت های بیشتر منتفع شوید.`,
		2: 'هم اکنون معامله کنید'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} مردود شد`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`ما قادر به پردازش واریز ${currency.toUpperCase()} شما در تاریخ ${date} و به مبلغ ${amount}نمی باشیم. یه همین دلیل سیستم درخواست شما رد کرده است `,
		WITHDRAWAL: (currency, date, amount) =>
			`ما قادر به پردازش برداشت ${currency.toUpperCase()} شما در تاریخ ${date} و به مبلغ ${amount}.به همین دلیل درخواست برداشت شما توسط سیستم رد شده است و مبلغ برداشت به${API_NAME()} کیف پول شما عودت داده خواهد شد.`,
		1: 'درصورت وجود هر گونه سوال بیشتر ، در پاسخ به این ایمیل آن را مطرح کنید.',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'وضعیت: مردود شده'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency, address = '') =>
			`شما درخواست برداشت به مبلغ ${amount} ${currency.toUpperCase()} و به آدرس ${address}ثبت کرده اید. درخواست برداشت شما درحال انتظار بوده و به زودی مورد پردازش قرار خواهد گرفت.`,
		COMPLETED: (amount, currency, address = '') =>
			`درخواست برداشت شما به مبلغ ${amount} ${currency.toUpperCase()} درحال انجام و ارسال به آدرس ${address}می باشد.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `وضعیت: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} درخواست`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`شما درخواست برداشت ${currency.toUpperCase()} و به مبلغ ${amount} به آدرس ${address}نموده اید.`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `آدرس: ${address}`,
		5: (network) => `Network: ${network}`,
		6: 'برای تایید برداشت خود ،دکمه زیر فشار دهید.',
		7: 'تایید',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'کدملی'
			? 'کد ملی مورد تایید نیست'
			: 'شماره حساب بانکی مورد تایید نیست',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? 'کد ملی و هویتی شما مورد پردازش قرار گرفت و متاسفانه مورد تایید نمی باشد لطفا برای جزییات بیشتر به پیام های ذیل مراجعه فرمایید:'
				: 'درخواست اضافه شدن بانک جدید ، مورد تایید قرار نگرفت لطفا برای جزییات بیشتر به پیام های ذیل مراجعه فرمایید:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
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

const USERVERIFICATION = {
	TITLE: 'تایید کاربر',
	BODY: {
		1: 'تایید کاربر باید صورت پذیرد',
		2: (email) =>
			`کاربر "${email}" مدارکش برای تایید حساب کاربری ارسال نموده ، لطفا آنها را بررسی نمایید.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'واریز مشکوک',
	BODY: {
		1: 'واریز مشکوک',
		2: (email, currency) =>
			`کاربر با ایمیل کاربری ${email} واریز ${currency.toUpperCase()} دریافت نموده که مشکوک به نظر می رسد.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'اطلاعات تراکنش:',
		5: (data) => `${JSON.stringify(data)}`
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
	CONTACTFORM,
	SMS,
	INVITEDOPERATOR,
	DISCOUNTUPDATE
};
