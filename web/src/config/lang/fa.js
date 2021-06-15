import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';
import flatten from 'flat';

const options = { safe: true };
const nestedContent = {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'اکسچنج دارایی های دیجیتال متن باز', // slogan

	LOGOUT_CONFIRM_TEXT: 'آیا برای خارج شدن مطمئن هستید؟',
	ADD_TRADING_PAIR: 'اضافه کردن دارایی جدید',
	ACTIVE_TRADES: 'شما باید {0} برای دسترسی به سفارش های فعال خود داشته باشید',
	CANCEL_BASE_WITHDRAWAL: 'برداشت {0}لغو کنید',
	CANCEL_WITHDRAWAL: 'لغو برداشت',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM:
		'آیا از لغو برداشت در حال انتظار خود مطمئن هستید؟',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'ورود',
	SIGN_IN: 'ورود',
	SIGNUP_TEXT: 'ثبت نام',
	REGISTER_TEXT: 'ثبت نام',
	ACCOUNT_TEXT: 'حساب کاربری',
	HOME_TEXT: 'صفحه اصلی',
	CLOSE_TEXT: 'بستن',
	COPY_TEXT: 'کپی',
	COPY_SUCCESS_TEXT: 'با موفقیت کپی شد',
	CANCEL_SUCCESS_TEXT: 'با موفقیت لغو شد',
	UPLOAD_TEXT: 'بارگذاری',
	ADD_FILES: 'اضافه کردن فایل', // ToDo
	OR_TEXT: 'یا',
	CONTACT_US_TEXT: 'تماس با ما',
	HELPFUL_RESOURCES_TEXT: 'منابع مفید',
	HELP_RESOURCE_GUIDE_TEXT:
		'درصورت وجود هر گونه سوال و ابهامی آن را با ارسال ایمیل به support@hollaex.com با ما درمیان بگذارید.',
	HELP_TELEGRAM_TEXT: 'مستندات API های HollaEx را مطالعه نمایید.',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: 'سوالی دارید؟', // new
	HELP_TEXT: 'راهنما',
	SUCCESS_TEXT: 'موفق',
	ERROR_TEXT: 'خطا',
	PROCEED: 'انجام شد',
	EDIT_TEXT: 'ویرایش',
	BACK_TEXT: 'بازگشت',
	NO_OPTIONS: 'گزینه ای وجود ندارد',
	SECONDS: 'ثانیه',
	VIEW_MARKET: 'مشاهده بازار', // new
	GO_TRADE: 'معامله رو شروع کن', // new
	VIEW_INFO: 'مشاهده صفحه اطلاعات', // new
	APPLY_HERE: 'اعمال تغییرات', // new
	HOME: {
		SECTION_1_TITLE: 'به HollaEx kit خوش آمدید',
		SECTION_1_TEXT_1:
			'با خیالی آسوده اکسچنج تبادل دارایی های دیجیتال خود را بسازید و جزو آینده بازارهای مالی جهان شوید.',
		SECTION_1_TEXT_2:
			'هدف ما تسهیل دسترسی افراد به بازارهای مالی از طریق به خدمت گرفتن فن آوری های نوین می باشد.',
		SECTION_1_BUTTON_1: 'بیشتر بدانید',
		SECTION_3_TITLE: 'امکانات',
		SECTION_3_CARD_1_TITLE: 'موتور تطبیق مقایس پذیر',
		SECTION_3_CARD_1_TEXT:
			'موتور تطبیق سفارش های قوی و هوشمند با بهره گیری از بهینه ترین الگوریتم های روز دنیا',
		SECTION_3_CARD_2_TITLE: 'اتصال به بانک',
		SECTION_3_CARD_2_TEXT:
			'برای اتصال به بانک ، پلاگین های ویژه با قابلیت سفارشی سازی بالا به شما کمک مینماید تا اکسچنج بومی خود را بسازید',
		SECTION_3_CARD_3_TITLE: 'امنیت بالا',
		SECTION_3_CARD_3_TEXT:
			'HollaEx kit همواره از بهترین روشهای تست امنیت به منظور تامین امنیت دارایی کاربران استفاده می نماید',
		SECTION_3_CARD_4_TITLE: 'گزارشات پیشرفته',
		SECTION_3_CARD_4_TEXT:
			'پنل مدیریتی قوی به منظور ارسال ایمیل ها و گزارشات دقیق از وضعیت سیستم به مدیریت و تیم پشتیبانی ',
		SECTION_3_CARD_5_TITLE: 'پشتیبانی',
		SECTION_3_CARD_5_TEXT:
			'ما بطور ویژه توسط تیم پشتیبانی متخصص به درخواست های شما پاسخ می دهیم',
		SECTION_3_CARD_6_TITLE: 'اتصال به سیستم احراز هویت',
		SECTION_3_CARD_6_TEXT:
			'سرویس احراز هویت براحتی و سهولت هر چه تمام و متناسب با کشورهای مختلف پیاده سازی می گردد',
		SECTION_3_BUTTON_1: 'مشاهده دمو',
	},
	FOOTER: {
		FOOTER_LEGAL: ['با افتخار توسعه داده شده در سئول ، کره جنوبی'],
		FOOTER_LANGUAGE_TEXT: 'زبان',
		SECTIONS: {
			SECTION_1_TITLE: 'درباره',
			SECTION_1_LINK_1: 'درباره ما',
			SECTION_1_LINK_2: 'شرایط استفاده',
			SECTION_1_LINK_3: 'حریم خصوصی',
			SECTION_1_LINK_4: 'تماس با ما',
			SECTION_2_TITLE: 'اطلاعات',
			SECTION_2_LINK_1: 'بلاگ',
			SECTION_2_LINK_2: 'تماس با ما',
			SECTION_2_LINK_3: 'شغل',
			SECTION_3_TITLE: 'توسعه دهندگان',
			SECTION_3_LINK_1: 'مستندات',
			SECTION_3_LINK_2: 'انجمن',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'کتابخانه',
			SECTION_3_LINK_5: 'مستندات API',
			SECTION_3_LINK_6: 'API معاملات',
			SECTION_3_LINK_7: 'ابزارهای برنامه نویسی',
			SECTION_3_LINK_8: 'مستندات',
			SECTION_4_TITLE: 'اکسچنج',
			SECTION_4_LINK_1: 'ورود',
			SECTION_4_LINK_2: 'ثبت نام',
			SECTION_4_LINK_3: 'تماس با ما',
			SECTION_4_LINK_4: 'شرایط استفاده',
			SECTION_5_TITLE: 'منابع',
			SECTION_5_LINK_1: 'سپید نامه',
			SECTION_5_LINK_2: 'HollaEx Token (XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'سوالات متداول', // new
			SECTION_6_TITLE: 'شبکه های اجتماعی',
			SECTION_6_LINK_1: 'توییتر',
			SECTION_6_LINK_2: 'تلگرام',
			SECTION_6_LINK_3: 'فیسبوک', // new
			SECTION_6_LINK_4: 'اینستاگرام', // new
			SECTION_6_LINK_5: 'لینکدین', // new
			SECTION_6_LINK_6: 'سایت', // new
			SECTION_6_LINK_7: 'پشتیبانی', // new
			SECTION_6_LINK_8: 'اطلاعات', // new
			SECTION_6_LINK_9: 'یوتیوب',
		},
		XHT_DESCRIPTION:
			'HollaEx kit یک پلتفورم متن باز به منظور مبادله دارایی های دیجیتال بین کاربران می باشد که توسط شرکت bitHolla توسعه و ارایه می شود.',
		CLICK_HERE: 'اینجا را کلیک کنید',
		VISIT_HERE: 'اینجا را مشاهده کنید',
	},
	ACCOUNTS: {
		TITLE: 'حساب کاربری',
		TAB_VERIFICATION: 'تایید حساب کاربری',
		TAB_SECURITY: 'امنیت',
		TAB_NOTIFICATIONS: 'اعلانات',
		TAB_SETTINGS: 'تنظیمات',
		TAB_PROFILE: 'پروفایل',
		TAB_WALLET: 'کیف پول',
		TAB_SUMMARY: 'خلاصه',
		TAB_API: 'API',
		TAB_SIGNOUT: 'خروج',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: 'درخواست دسترسی',
		REQUEST_INVITE: 'درخواست دعوت',
		CATEGORY_PLACEHOLDER: 'به هریک از بخش های زیر پاسخ های متناسب بدهید',
		INTRODUCTION_LABEL: 'خودتان رو معرفی کنید',
		INTRODUCTION_PLACEHOLDER:
			'ساکن کدام کشور هستید ؟ و آیا علاقه به راه اندازی اکسچنج دارید؟',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'بخش',
		CATEGORY_PLACEHOLDER:
			'هریک از بخش های زیر که با درخواست شما متناسب است را انتخاب کنید',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'تایید کاربر',
			OPTION_LEVEL: 'ارتقای سطح کاربری',
			OPTION_DEPOSIT: 'واریز و برداشت',
			OPTION_BUG: 'گزارش خطا', // ToDo:
			OPTION_PERSONAL_INFO: 'تغییر اطلاعات شخصی', // ToDo:
			OPTION_BANK_TRANSFER: 'تراکنش بانکی', // new
			OPTION_REQUEST: 'درخواست دعوت به اکسچنج HollaEx', // new
		},
		SUBJECT_LABEL: 'موضوع',
		SUBJECT_PLACEHOLDER: 'موضوع مشکل خود را تایپ کنید',
		DESCRIPTION_LABEL: 'توضیحات',
		DESCRIPTION_PLACEHOLDER: 'مشکل خود را با شرح جزییات بیان نمایید',
		ATTACHMENT_LABEL: 'حداکثر تا 3 قایل می تواند پیوست کنید', // ToDo:
		ATTACHMENT_PLACEHOLDER:
			'برای شرح بهتر مشکل خود می توانید فایل هایی با فرمت PDF,JPG,PNG,GIF پیوست نمایید',
		SUCCESS_MESSAGE: 'ایمیل به تیم پشتیبانی ارسال شد',
		SUCCESS_TITLE: 'پیام ارسال شد',
		SUCCESS_MESSAGE_1: 'مشکل شما به تیم پشتیبانی کاربران ارسال گردید',
		SUCCESS_MESSAGE_2: 'حداکثر تا 3 روز آینده منتظر پاسخ ما باشید',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: '{0}آدرس دریافت شما', // new
			DESTINATION_TAG: 'برچسب مقصد {0 شما}', // new
			BTC: 'آدرس شما برای دریافت بیتکوین',
			ETH: 'آدرس شما برای دریافت اتریوم',
			BCH: 'آدرس شما برای دریافت بیتکوین کش',
		},
		INCREASE_LIMIT: 'میخواهید سقف برداشت روزانه خود را افزایش دهید',
		QR_CODE:
			'کافیست برای ارسال پول توسط دیگران،این کد توسط شخص پرداخت کننده اسکن شود',
		NO_DATA: 'اطلاعاتی موجود نمی باشد',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {1,000} 2 -> {Currency} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: 'ورود به {0}',
		CANT_LOGIN: 'نمی توانید وارد شوید؟',
		NO_ACCOUNT: 'حساب کاربری ندارید؟',
		CREATE_ACCOUNT: 'ایجاد حساب کاربری جدید',
		HELP: 'راهنما',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'ایمیل',
		EMAIL_PLACEHOLDER: 'ایمیل خود را وارد کنید',
		PASSWORD_LABEL: 'کلمه عبور',
		PASSWORD_PLACEHOLDER: 'کلمه عبور خود را وارد کنید',
		PASSWORD_REPEAT_LABEL: 'مجددا کلمه عبور خود را وارد کنید',
		PASSWORD_REPEAT_PLACEHOLDER: 'مجددا کلمه عبور خود را وارد کنید',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'رمزیکبارمصرف خود را وارد نمایید',
		CAPTCHA: 'خطا. صفحه را رفرش کنید',
		FROZEN_ACCOUNT: 'این حساب بسته شده است',
		INVALID_EMAIL: 'آدرس ایمیل نامعتبر است',
		TYPE_EMAIL: 'ایمیل خود را وارد کنید',
		REQUIRED: 'فیلد ضروری',
		INVALID_DATE: 'تاریخ اشتباه',
		INVALID_PASSWORD:
			'کلمه عبور معتبر نمی باشد.کلمه عبور باید حداقل 8 کاراکتر و شامل اعداد و کاراکترهای خاص باشد',
		INVALID_PASSWORD_2:
			'کلمه عبور معتبر نمی باشد.کلمه عبور باید حداقل 8 کاراکتر و شامل اعداد و کاراکترهای خاص باشد',
		INVALID_CURRENCY: 'آدرس{1} نامعتبر{0}',
		INVALID_BALANCE:
			'موجودی کافی({0})برای انجام عملیات مورد نظر را ندارید({1})',
		MIN_VALUE: 'مقدار باید{0 و یا بزرگتر باشد}',
		MAX_VALUE: 'مقدار باید {0 و یا کوچکتر باشد}',
		INSUFFICIENT_BALANCE: 'موجودی حساب ناکافی',
		PASSWORDS_DONT_MATCH: 'کلمه عبور مطابقت ندارد',
		USER_EXIST: 'این ایمیل قبلا ثبت شده است ',
		ACCEPT_TERMS: 'شما شرایط استفاده و حریم خصوصی را تایید ننموده اید',
		STEP: 'مقدار نامعتبر ،مقدار مجاز اضافه کردن {0}',
		ONLY_NUMBERS: 'مقدار فقط می تواند شامل اعداد باشد',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'حریم خصوصی',
			SUBTITLE:
				'بروزرسانی شده در اول آپریل 2019 .نسخه قبلی حریم خصوصی با این نسخه جایگزین شده است.',
			TEXTS: [
				'پلتفورم تحت وب HollaEx یک پلتفورم مبادله دارایی های دیجیتال می باشد که مالکیت آن تماماً دراختیار شرکت bitHolla در کشور کره جنوبی می باشد .از این پس به شرکت bitHoll اختصاراً bitHolla گفته میشود.',
				'استفاده از وب سایت HollaEx (که از این پس به آن "وبسایت" گفته می شود )  و خدمات ارائه شده در آن  (که از این پس به آن "خدمات" گفته می شود )  با شرایط مندرج در صفحه شرایط و مقررات (که از این پس به آن " مقررات"  گفته می شود ) تنظیم و تعیین می شود. این توافق نامه کاملاً توافق طرفین را تشکیل می دهد. کلیه اطلاعات ارائه شده در وب سایت یا اظهارات شفاهی یا کتبی دیگر از این توافق نامه مستثنی هستند. سیاست های اکسچنج فقط جنبه  راهنمایی داشته  و توافق حقوقی بین طرفین نمی باشد.',
				'با دسترسی ، مشاهده یا دانلود اطلاعات از وبسایت و استفاده از خدمات ارائه شده توسط bitHolla ، تصدیق می کنید که آن را خوانده اید ، درک کرده اید ، و بدون قید و شرط موافقت می کنید که مطابق با این شرایط باشید.bitHolla  هر زمان ممکن است بدون اطلاع قبلی شرایط را اصلاح کند. شما موافقت می کنید که همچنان به هرگونه شرایط و ضوابط اصلاح شده پایبند باشید و  bitHolla  هیچ گونه مسئولیتی در قبال اطلاع  رسانی به  شما از چنین اصلاحاتی را  ندارد. شما تأیید می کنید که مسئولیت دارید  که این شرایط را بطور دوره ای بررسی کنید و ادامه استفاده شما از وب سایت و خدمات ارائه شده توسط bitHolla  بعد از هرگونه تغییری در شرایط ، بیانگر پذیرش شرایط توسط شما می باشد.',
				'وب سایت و کپی رایت در کلیه متن ها ، گرافیک ها ، تصاویر ، نرم افزارها و سایر مطالب موجود در وب سایت متعلق به bitHolla شامل کلیه علائم تجاری و سایر حقوق مالکیت معنوی در رابطه با مواد و خدمات در وب سایت است. مواد موجود در این وب سایت فقط برای مصارف شخصی و مقاصد غیر تجاری قابل استفاده است.تمامی محتویات وبسایت شامل، متن ها ، تصاویر، آیتم های گرافیکی ، نرم افزار ها و سایر محتویات دیگر موجود در وبسایت تماماً متعلق به bitHolla می باشد. همچنین تمامی علایم تجاری و سایر حقوق مالکیت معنوی نیز متعلق به bitHolla می باشد.استفاده از این محتویات فقط بمنظور استفاده شخصی و غیر تجاری مجاز می باشد.',

				'شما می توانید هریک از محتویات اشاره شده در بالا را بصورت چاپ و یا نمایش بر روی کامپیوتر با رعایت قوانین کپی رایت نمایش دهید بدون آنکه بدون مجوز bitHolla بخشی و یا تمام مطالب را تغییر ، اصلاح و یا حذف کنید.شما تایید میکنید که نام  bitHolla و لوگوی آن ، علائم تجاری bitHolla بوده و شما فقط می توانید آنها را در چهارچوب موارد و شرایط ذکر شده در بالا ، استفاده نمایید و در غیر اینصورت حق کپی و یا پاک کردن آنها را ندارید.استفاده از وبسایت  به خودی خود هیچ گونه حقی برای شما بوجود نمی آورد  و حقوق شما فقط و فقط همان مواردی است که صراحتا در بخش حریم خصوصی و استفاده عمومی به آن اشاره شده است.',
			],
		},
		GENERAL_TERMS: {
			TITLE: 'شرایط عمومی استفاده',
			SUBTITLE:
				'بروزرسانی شده در اول آپریل 2019 .نسخه شرایط عمومی استفاده با این نسخه جایگزین شده است.',
			TEXTS: [
				'پلتفورم تحت وب HollaEx یک پلتفورم مبادله دارایی های دیجیتال می باشد که مالکیت آن تماماً دراختیار شرکت bitHolla در کشور کره جنوبی می باشد .از این پس به شرکت bitHoll اختصاراً bitHolla گفته میشود.',
				'استفاده از وب سایت HollaEx (که از این پس به آن "وبسایت" گفته می شود )  و خدمات ارائه شده در آن  (که از این پس به آن "خدمات" گفته می شود )  با شرایط مندرج در صفحه شرایط و مقررات (که از این پس به آن " مقررات"  گفته می شود ) تنظیم و تعیین می شود. این توافق نامه کاملاً توافق طرفین را تشکیل می دهد. کلیه اطلاعات ارائه شده در وب سایت یا اظهارات شفاهی یا کتبی دیگر از این توافق نامه مستثنی هستند. سیاست های اکسچنج فقط جنبه  راهنمایی داشته  و توافق حقوقی بین طرفین نمی باشد.',
				'با دسترسی ، مشاهده یا دانلود اطلاعات از وبسایت و استفاده از خدمات ارائه شده توسط bitHolla ، تصدیق می کنید که آن را خوانده اید ، درک کرده اید ، و بدون قید و شرط موافقت می کنید که مطابق با این شرایط باشید.bitHolla  هر زمان ممکن است بدون اطلاع قبلی شرایط را اصلاح کند. شما موافقت می کنید که همچنان به هرگونه شرایط و ضوابط اصلاح شده پایبند باشید و  bitHolla  هیچ گونه مسئولیتی در قبال اطلاع  رسانی به  شما از چنین اصلاحاتی را  ندارد. شما تأیید می کنید که مسئولیت دارید  که این شرایط را بطور دوره ای بررسی کنید و ادامه استفاده شما از وب سایت و خدمات ارائه شده توسط bitHolla  بعد از هرگونه تغییری در شرایط ، بیانگر پذیرش شرایط توسط شما می باشد.',
				'وب سایت و کپی رایت در کلیه متن ها ، گرافیک ها ، تصاویر ، نرم افزارها و سایر مطالب موجود در وب سایت متعلق به bitHolla شامل کلیه علائم تجاری و سایر حقوق مالکیت معنوی در رابطه با مواد و خدمات در وب سایت است. مواد موجود در این وب سایت فقط برای مصارف شخصی و مقاصد غیر تجاری قابل استفاده است.تمامی محتویات وبسایت شامل، متن ها ، تصاویر، آیتم های گرافیکی ، نرم افزار ها و سایر محتویات دیگر موجود در وبسایت تماماً متعلق به bitHolla می باشد. همچنین تمامی علایم تجاری و سایر حقوق مالکیت معنوی نیز متعلق به bitHolla می باشد.استفاده از این محتویات فقط بمنظور استفاده شخصی و غیر تجاری مجاز می باشد.',

				'شما می توانید هریک از محتویات اشاره شده در بالا را بصورت چاپ و یا نمایش بر روی کامپیوتر با رعایت قوانین کپی رایت نمایش دهید بدون آنکه بدون مجوز bitHolla بخشی و یا تمام مطالب را تغییر ، اصلاح و یا حذف کنید.شما تایید میکنید که نام  bitHolla و لوگوی آن ، علائم تجاری bitHolla بوده و شما فقط می توانید آنها را در چهارچوب موارد و شرایط ذکر شده در بالا ، استفاده نمایید و در غیر اینصورت حق کپی و یا پاک کردن آنها را ندارید.استفاده از وبسایت  به خودی خود هیچ گونه حقی برای شما بوجود نمی آورد  و حقوق شما فقط و فقط همان مواردی است که صراحتا در بخش حریم خصوصی و استفاده عمومی به آن اشاره شده است.',
			],
		},
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'تایید',
			START_TRADING: 'شروع معاملات',
			SEE_HISTORY: 'تاریخچه',
		},
		DEPOSITS: {
			TITLE_RECEIVED: 'واریزی دریافت شد{0}',
			TITLE_INCOMING: 'واریزی {0}',
			SUBTITLE_RECEIVED: 'شما مقدار {0} دریافت نمودید',
			SUBTITLE_INCOMING: 'شما یک واریزی دارید {0}',
			INFORMATION_PENDING_1:
				'تراکنش شما به تایید نیاز دارد تا بتوانید معامله را شروع کنید',
			INFORMATION_PENDING_2:
				'مابه محض تایید  واریزی شما بر روی شبکه بلاکچین یک ایمیل برای شما ارسال خواهیم کرد. این زمان ممکن است بین 10 تا 30 دقیقه بطول بیانجامد',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: 'درخواست ارسال شد',
		BUTTON_TEXT: 'تایید',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: 'برای ادامه ، کد تایید خود را وارد نمایید',
		OTP_LABEL: 'رمز یکبار مصرف',
		OTP_PLACEHOLDER: 'کد تایید را وارد نمایید',
		OTP_TITLE: 'کد تایید',
		OTP_HELP: 'راهنما',
		OTP_BUTTON: 'ارسال',
		ERROR_INVALID: 'رمز یکبار مصرف اشتباه است',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'آسان',
		TOTAL_COST: 'مجموع هزینه',
		BUTTON: 'بازنگری {0} سفارش',
		INPUT: '{0}به {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: 'صفحه قبل',
	NEXT_PAGE: 'صفحه بعد',
	WALLET: {
		TOTAL_ASSETS: 'مجموع دارایی ها',
		AVAILABLE_WITHDRAWAL: 'دارایی موثر قابل معامله',
		AVAILABLE_TRADING: 'دارایی موثر قابل برداشت',
		ORDERS_PLURAL: 'سفارش ها',
		ORDERS_SINGULAR: 'سفارش',
		HOLD_ORDERS:
			'شما {0} سفارش تکمیل نشده دارید, که منجر به کسر {2} {3} از دارایی {4} شما شده است',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'بازیابی حساب کاربری',
		SUBTITLE: `حساب کاربری خود را بازیابی کنید`,
		SUPPORT: 'تماس با پشتیبانی',
		BUTTON: 'ارسال لینک بازیابی',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'درخواست کلمه عبور جدید ارسال گردید',
		TEXT:
			'اگر با این ایمیل قبلا حساب کاربری ایجاد کرده باشید ، ایمیل بازیابی کلمه عبور به آن ارسال شده است . لطفا مراحل را طبق آن دنبال نمایید',
	},
	RESET_PASSWORD: {
		TITLE: 'کلمه عبور جدید تعریف کنید',
		SUBTITLE: 'کلمه عبور جدید تعریف کنید',
		BUTTON: 'کلمه عبور جدید تعریف کنید',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'شما با موفقیت کلمه عبور جدید خود را تعریف کردید',
		TEXT_2: 'دکمه ورود در پایین را فشار دهید',
	},
	SIGN_UP: {
		SIGNUP_TO: 'ثبت نام در {0}',
		NO_EMAIL: 'هنوز ایمیلی دریافت نکرده ایید؟',
		REQUEST_EMAIL: 'درخواست مجدد',
		HAVE_ACCOUNT: 'در حال حاضر حساب کاربری دارید؟',
		GOTO_LOGIN: 'به صفحه ورود بروید',
		AFFILIATION_CODE: 'کد رفرال (اختیاری)',
		AFFILIATION_CODE_PLACEHOLDER: 'کد رفرال را وارد کنید',
		TERMS: {
			terms: 'شرایط عمومی',
			policy: 'حریم خصوصی',
			text: 'من با مطالعه و آگاهی با {0} و {1} موافقت می نمایم.',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'ایمیل ارسال شد',
		TEXT_1: 'ایمیل خود را چک کنید و لینک تایید را فشار دهید',
		TEXT_2:
			'اگر ایمیل تایید را تاکنون دریافت نکرده ایید به بخش هرزنامه مراجعه نمایید',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'ارسال مجدد درخواست ایمیل',
		BUTTON: 'درخواست ایمیل',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'ارسال مجدد ایمیل',
		TEXT_1:
			'اگر بعد از چند دقیقه همچنان ایمیلی را دریافت ننموده اید با تیم پشتیبانی ما تماس حاصل فرمایید',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'کد نامعتبر است',
		TEXT_1: 'شما با موفقیت ایمیل خود را تایید نمودید',
		TEXT_2: 'اکنون می توانید وارد شوید',
	},
	USER_VERIFICATION: {
		INFO_TXT:
			'اینجا شما می توانید وضعیت فعلی و روند ارتقای حساب کاربری خود را مشاهده نمایید',
		INFO_TXT_1:
			'لطفا اطلاعات خواسته شده در هر بخش را با دقت وارد نمایید .مستحضر باشید پس از تکمیل همه اطلاعات خواسته شده ، درخواست ارتقای حساب کاربری شما مورد ارزیابی قرار خواهد گرفت',
		INFO_TXT_2: '* روند احراز هویت شما نیازمند بررسی مدارک هویتی شما می باشد',
		DOCUMENTATIONS: 'بارگذاری',
		COMPLETED: 'تکمیل شد',
		PENDING_VERIFICATION: 'تایید حساب کاربری در حال انتظار است ',
		TITLE_EMAIL: 'ایمیل',
		MY_EMAIL: 'ایمیل من',
		MAKE_FIRST_DEPOSIT: 'اولین واریز خود را انجام دهید', // new
		OBTAIN_XHT: 'کسب XHT', // new
		TITLE_USER_DOCUMENTATION: 'مدرک شناسایی',
		TITLE_ID_DOCUMENTS: 'بارگذاری',
		TITLE_BANK_ACCOUNT: 'حساب بانکی',
		TITLE_MOBILE_PHONE: 'شماره تلفن همراه',
		TITLE_PERSONAL_INFORMATION: 'اطلاعات شخصی',
		VERIFY_EMAIL: 'ایمیل خود را تایید کنید',
		VERIFY_MOBILE_PHONE: 'شماره موبایل خود را تایید کنید',
		VERIFY_USER_DOCUMENTATION: 'تایید مدارک کاربر',
		VERIFY_ID_DOCUMENTS: 'تایید مدارک شناسایی',
		VERIFY_BANK_ACCOUNT: 'تایید حساب بانکی',
		BUTTON: 'درخواست تایید مدارک را ارسال کنید',
		TITLE_IDENTITY: 'مدارک شناسایی',
		TITLE_MOBILE: 'تلفن همراه',
		TITLE_MOBILE_HEADER: 'شماره تلفن همراه',
		TITLE_BANK: 'بانک',
		TITLE_BANK_HEADER: 'اطلاعات بانک',
		CHANGE_VALUE: 'تغییر مقادیر',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'اطلاعات شخصی شما در حال بررسی می باشد',
		PENDING_VERIFICATION_BANK: 'مشخصات حساب بانکی شمادر حال بررسی می باشد',
		PENDING_VERIFICATION_DOCUMENTS: 'مدارک شما در حال بررسی می باشد',
		GOTO_VERIFICATION: 'رفتن به بخش تایید حساب کاربری',
		GOTO_WALLET: 'به بخش کیف پول برو', // new
		CONNECT_BANK_ACCOUNT: 'اتصال حساب بانکی',
		ACTIVATE_2FA: 'فعال سازی رمز یکبار مصرف',
		INCOMPLETED: 'تکمیل نشده است',
		BANK_VERIFICATION: 'تایید بانک',
		IDENTITY_VERIFICATION: 'تایید مدارک شناسایی',
		PHONE_VERIFICATION: 'تایید شماره تلفن',
		DOCUMENT_VERIFICATION: 'تایید مدارک',
		START_BANK_VERIFICATION: 'شروع روند تایید حساب بانکی',
		START_IDENTITY_VERIFICATION: 'شروع روند تایید اطلاعات هویتی',
		START_PHONE_VERIFICATION: 'شروع روند تایید شماره تلفن',
		START_DOCUMENTATION_SUBMISSION: 'شروع ارسال مدارک',
		GO_BACK: 'برگرد به عقب',
		BANK_VERIFICATION_TEXT_1:
			'شما 3 حساب بانکی می توانید به حساب کاربری خود متصل نمایید',
		BANK_VERIFICATION_TEXT_2:
			'با تایید حساب بانکی خود موارد زیر برای ممکن می گردد',
		BASE_WITHDRAWAL: 'برداشت تومان',
		BASE_DEPOSITS: 'واریز تومان',
		ADD_ANOTHER_BANK_ACCOUNT: 'یک بانک دیگر اضافه کنید',
		BANK_NAME: 'نام بانک',
		ACCOUNT_NUMBER: 'شماره حساب',
		CARD_NUMBER: 'شماره کارت',
		BANK_VERIFICATION_HELP_TEXT:
			'برای تایید این بخش شما نیاز به تکمیل قسمت{0 دارید}',
		DOCUMENT_SUBMISSION: 'ارسال مدارک',
		REVIEW_IDENTITY_VERIFICATION: 'بررسی تایید مدارک',
		PHONE_DETAILS: 'مشخصات شماره تلفن',
		PHONE_COUNTRY_ORIGIN: 'کد کشور محل سکونت',
		MOBILE_NUMBER: 'شماره تلفن همراه',
		DOCUMENT_PROOF_SUBMISSION: 'کارت ملی',
		START_DOCUMENTATION_RESUBMISSION: 'ارسال مجدد مدارک',
		SUBMISSION_PENDING_TXT:
			'*اطلاعات مربوط به این بخش قبلا ارسال گردیده است. ارسال مجدد مدارک،جایگزین مدارک قبلی خواهد شد.',
		CUSTOMER_SUPPORT_MESSAGE: 'پیام تیم پشتیبانی',
		DOCUMENT_PENDING_NOTE:
			'مدارک شما ارسال گردیده و درحال بررسی می باشند. لطفا شکیبا باشید.',
		DOCUMENT_VERIFIED_NOTE: 'مدارک شما کامل شده اند.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: ' پیام از طرف واحد احراز هویت',
		CODE_EXPIRES_IN: 'اعتبار کد تا',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'نام',
				FIRST_NAME_PLACEHOLDER: 'نام خود را دقیقا مطابق کارت ملی تایپ کنید',
				LAST_NAME_LABEL: 'نام خانوادگی',
				LAST_NAME_PLACEHOLDER:
					'نام خانوادگی خود را دقیقا مطابق کارت ملی تایپ کنید',
				FULL_NAME_LABEL: 'نام و نام خانوادگی',
				FULL_NAME_PLACEHOLDER: 'نام کامل خود را به دقت وارد کنید',
				GENDER_LABEL: 'جنسيت',
				GENDER_PLACEHOLDER: 'جنسیت خود را انتخاب کنید',
				GENDER_OPTIONS: {
					MAN: 'مرد',
					WOMAN: 'زن',
				},
				NATIONALITY_LABEL: 'ملیت',
				NATIONALITY_PLACEHOLDER: 'ملیت خود را تایپ کنید',
				DOB_LABEL: 'تاریخ تولد',
				COUNTRY_LABEL: 'کشوری که در آن اقامت دارید',
				COUNTRY_PLACEHOLDER:
					'کشوری که در حال حاضر در آن اقامت دارید را انتخاب کنید',
				CITY_LABEL: 'شهر',
				CITY_PLACEHOLDER: 'شهر محل سکونت',
				ADDRESS_LABEL: 'نشانی',
				ADDRESS_PLACEHOLDER: 'آدرس کامل محل سکونت',
				POSTAL_CODE_LABEL: 'کد پستی',
				POSTAL_CODE_PLACEHOLDER: 'کد پستی 10 رقمی',
				PHONE_CODE_LABEL: 'کشور',
				PHONE_CODE_PLACEHOLDER:
					'کشوری که شماره تلفن شما در آن ثبت شده را تایپ کنید',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: 'شماره تلفن',
				PHONE_NUMBER_PLACEHOLDER: 'شماره موبایل خود را وارد نمایید',
				CONNECTING_LOADING: 'بارگذاری',
				SMS_SEND: 'ارسال پیامک',
				SMS_CODE_LABEL: 'کد دریافتی',
				SMS_CODE_PLACEHOLDER: 'کد دریافتی را وارد نمایید',
			},
			INFORMATION: {
				TEXT:
					'نکته: نام و نام خانوادگی خود را مطابق با شناسنامه و به فارسی وارد نمایید.',
				TITLE_PERSONAL_INFORMATION: 'اطلاعات شخصی',
				TITLE_PHONE: 'موبایل',
				PHONE_VERIFICATION_TXT:
					'گزارش تمام واریز ها و برداشت ها از حساب کاربری، از طریق پیامک به شماره موبایل شما ارسال خواهد شد.',
				PHONE_VERIFICATION_TXT_1:
					'گزارش تمام واریز ها و برداشت ها از حساب کاربری، از طریق پیامک به شماره موبایل شما ارسال خواهد شد.',
				PHONE_VERIFICATION_TXT_2:
					'برای ارایه خدمات بهتر لطفا شمارهتلفن ثابت خود را نیز ثبت نمایید',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'لطفا یکی از مدارک هویتی را انتخاب کنید',
				ID_NUMBER: 'لطفا شماره سند هویتی را درست وارد کنید',
				ISSUED_DATE: 'لطفا تاریخ صدور مدرک خود را انتخاب کنید',
				EXPIRATION_DATE: 'لطفا تاریخ انقضای مدرک خود را انتخاب کنید',
				FRONT: 'لطفا تصویر مدرک هویتی خود را آپلود کنید',
				PROOF_OF_RESIDENCY: 'لطفا تصویر مدرک اثبات آدرس خود را آپلود کنید',
				SELFIE_PHOTO_ID:
					'لطفا سلفی خود را در حال در دست داشتن متن و کارت بارگذاری کنید',
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'نوع مدرک',
				TYPE_PLACEHOLDER: 'کارت ملی یا شناسنامه جدید',
				TYPE_OPTIONS: {
					ID: 'سند هویت',
					PASSPORT: 'کارت ملی',
				},
				ID_NUMBER_LABEL: 'کد ملی',
				ID_NUMBER_PLACEHOLDER: 'کد ملی 10 رقمی خود را وارد کنید',
				ID_PASSPORT_NUMBER_LABEL: 'کارت ملی',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'شماره کارت ملی خود را وارد نمایید',
				ISSUED_DATE_LABEL: 'تاریخ صدور',
				EXPIRATION_DATE_LABEL: 'تاریخ پایان اعتبار',
				FRONT_LABEL: 'تصویر کارت ملی',
				FRONT_PLACEHOLDER:
					'تصویر کارت ملی یا شناسنامه جدید خود را بارگذاری نمایید',
				BACK_LABEL: 'عکس سلفی',
				BACK_PLACEHOLDER:
					'عکس سلفی خود همراه کارت ملی و دستخطی با نام سایت را بارگذاری کنید',
				PASSPORT_LABEL: 'گذرنامه',
				PASSPORT_PLACEHOLDER: 'اسکن صفحه اول گذرنامه خود را بارگذاری کنید',
				POR_LABEL: 'سند اثبات آدرس',
				POR_PLACEHOLDER: 'تصویر سند اثبات آدرس خود را براگذاری نمایید',
				SELFIE_PHOTO_ID_LABEL: 'تصویر سلفی',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'تصویر سلفی، همراه با مدرک شناسایی و متن دستنویس را بارگذاری کنید',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'مدرک احراز هویت',
				PROOF_OF_RESIDENCY: 'مدرک احراز محل اقامت',
				ID_SECTION: {
					TITLE:
						'لطفا هنگام بارگذاری تصویر کارت ملی خود به نکات زیر دقت نمایید:',
					LIST_ITEM_1:
						'مدارک باید بصورت رنگی و با کیفیت بالا و حجم حداکثر 300 کیلو بایت بارگذاری شوند.',
					LIST_ITEM_2: 'اطلاعات درج شده باید کاملا خوانا باشد.',
					LIST_ITEM_3:
						'تنها کارت ملی که تاریخ اعتبار آن منقضی نشده است ، معتبر می باشد.',
					WARNING_1:
						'تنها کارت ملی  معتبر پذیرفته می شود. عکس با کیفیت بالا یا تصاویر اسکن شده از آن قابل قبول است:',
					WARNING_2:
						'مطمئن شوید که اسناد شخصی خود را بارگذاری می کنید. هرگونه استفاده از اسناد شخص دیگر یا جعلی عواقب قانونی به همراه خواهد داشت و باعث می شود  حساب شما فوراً مسدود شود.',
					WARNING_3:
						'برای احراز محل اقامت خود از بارگذاری کارت ملی ، شناسنامه و پاسپورت خودداری نمایید',
				},
				POR: {
					SECTION_1_TEXT_1:
						'برای احراز هویت هر چه سریعتر حساب کاربری خود ،لطفا به موارد ذیل توجه فرمایید',
					SECTION_1_TEXT_2:
						'نام، آدرس، تاریخ صدور و مرجع صادر کننده به وضوح قابل مشاهده باشد.',
					SECTION_1_TEXT_3:
						'اثبات ارائه سند اقامت نباید قدیمی تر از سه ماه گذشته باشد.',
					SECTION_1_TEXT_4:
						'تصاویر رنگی یا اسکن شده را با کیفیت بالا (حداقل 300 DPI) ارسال نمایید',
					SECTION_2_TITLE: 'موارد قابل قبول احراز محل اقامت:',
					SECTION_2_LIST_ITEM_1: 'سند اجاره و یا مالکیت محل اقامت',
					SECTION_2_LIST_ITEM_2: 'کلیه قبوض حاوی آدرس و کد پستی',
					SECTION_2_LIST_ITEM_3: 'گواهی کد پستی محل سکونت',
					WARNING: '',
				},
				SELFIE: {
					TITLE: 'تصویر سلفی',
					INFO_TEXT:
						'لطفاً تصویر خود را با در دست داشتن سند هویتی خود بگیرید.در تصویر ارسالی تاریخ امروز و امضای شما مشخص باشد. هم چنین مطمئن شوید که صورت شما به وضوح قابل مشاهده است و جزئیات سند هویتی شما نیز به وضوح قابل خواندن باشد.',
					REQUIRED: 'لطفا تصویر سلفی خود را مطابق با شرایط زیر ارسال نمایید::',
					INSTRUCTION_1: 'صورت و شانه ها به وضوح مشخص باشند.',
					INSTRUCTION_2: 'مدرک هویتی و دستنوشته شما واضح و خوانا باشد.',
					INSTRUCTION_3: 'درج نوشته exir.io',
					INSTRUCTION_4: 'درج تاریخ امروز',
					INSTRUCTION_5: 'امضای شما',
					WARNING:
						'در صورت مشاهده خطای network error حجم تصاویر را به زیر 300 کیلو بایت کاهش دهید.',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'لطفا نام و نام خانوادگی خود را با حساب بانکی خود وارد کنید',
				ACCOUNT_NUMBER: 'شماره حساب بانکی شما باید حداکثر 24 رقمی باشد',
				ACCOUNT_NUMBER_MAX_LENGTH: 'شماره حساب حداکثر 50 عدد می باشد',
				CARD_NUMBER: 'شماره کارت باید حتما 16 رقمی باشد',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'نام بانک',
				BANK_NAME_PLACEHOLDER: 'نام بانک خود را وارد کنید',
				ACCOUNT_NUMBER_LABEL: 'شماره حساب بانکی',
				ACCOUNT_NUMBER_PLACEHOLDER: 'شماره حساب بانکی خود را وارد کنید',
				ACCOUNT_OWNER_LABEL: 'نام صاحب حساب بانکی',
				ACCOUNT_OWNER_PLACEHOLDER:
					'نام و نام خانوادگی صاحب حساب بانکی را  وارد کنید',
				CARD_NUMBER_LABEL: 'شماره کارت',
				CARD_NUMBER_PLACEHOLDER: 'شماره 16 رقمی بر روی کارت خود را وارد کنید',
			},
		},
		WARNING: {
			TEXT_1: 'با تکمیل احراز هویت، موارد زیر برای شما میسر می شود:',
			LIST_ITEM_1: 'افزایش محدودیت های برداشت',
			LIST_ITEM_2: 'افزایش محدودیت های سپرده',
			LIST_ITEM_3: 'کارمزد پایین',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			'تنظیمات حساب خود را تغییر دهید. از رابط کاربری، اعلان ها، نام کاربری و موارد شخصی سازی دیگر.',
		TITLE_TEXT_2: 'با ذخیره تنظیمات ، تغییرات شما اعمال و ذخیره می شود.',
		TITLE_NOTIFICATION: 'اعلان ها',
		TITLE_INTERFACE: 'رابط کاربری',
		TITLE_LANGUAGE: 'زبان',
		TITLE_CHAT: 'چت',
		TITLE_AUDIO_CUE: 'اعلان صوتی',
		TITLE_MANAGE_RISK: 'مدیریت ریسک',
		ORDERBOOK_LEVEL: 'تعداد سفارشهای قابل نمایش در بازار (حداکثر 20)',
		SET_TXT: 'تنظیم',
		CREATE_ORDER_WARING: 'ایجاد اخطار سفارش ',
		RISKY_TRADE_DETECTED: 'شناسایی معاملات پرخطر',
		RISKY_WARNING_TEXT_1:
			'این مقدار سفارش ها بیشتر از مبلغ تعیین شده شمامی باشد {0} .',
		RISKY_WARNING_TEXT_2: '({0} سبد معامله)',
		RISKY_WARNING_TEXT_3:
			' لطفاً بررسی و سپس تأیید کنید که می خواهید این معامله را انجام دهید.',
		GO_TO_RISK_MANAGMENT: 'به بخش مدیریت ریسک برو',
		CREATE_ORDER_WARING_TEXT:
			'ایجاد هشدار درهنگامی که سفارش های شما از سقف تعیین شده توسط شما فراتر میرود.',
		ORDER_PORTFOLIO_LABEL: 'درصد سبد معامله:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'اعلان های مربوط به معاملات',
			POPUP_ORDER_CONFIRMATION: 'تاییدیه ثبت سفارش ',
			POPUP_ORDER_COMPLETED: 'اعلان تکمیل سفارش',
			POPUP_ORDER_PARTIALLY_FILLED: 'اعلان تکمیل بخشی از سفارش',
		},
		AUDIO_CUE_FORM: {
			ORDERS_COMPLETED_AUDIO: 'وقتی سفارش تکمیل شد یک اعلان صوتی پخش شود',
			ORDERS_PARTIAL_AUDIO:
				'وقتی بخشی از سفارش تکمیل شد ، یک اعلان صوتی  پخش شود',
			PUBLIC_TRADE_AUDIO: 'در هر خرید و فروش عمومی، یک اعلان صوتی پخش شود',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'وقتی مقدار سفارش خرید و فروش بیش از درصد مشخصی از سبد معاملات شما می شود ، هشدار داده شود',
			INFO_TEXT_1: 'ارزش کل دارایی در {0}:{1}',
			PORTFOLIO: 'درصد سبد معاملات',
			TOMAN_ASSET: 'ارزش تقریبی',
			ADJUST: '(تنظیم درصد)',
			ACTIVATE_RISK_MANAGMENT: 'مدیریت ریسک را فعال کنید',
			WARNING_POP_UP: 'هشدارها',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'تاریحچه',
		TITLE_TRADES: 'تاریخچه خرید و فروش',
		TITLE_DEPOSITS: 'تاریخچه واریزی ها',
		TITLE_WITHDRAWALS: 'تاریخچه برداشت ها',
		TEXT_DOWNLOAD: 'دانلود تاریخچه',
		TRADES: 'خریدو فروش',
		DEPOSITS: 'واریزی ها',
		WITHDRAWALS: 'برداشت ها',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'Adjust the security settings for your account. From Two-factor authentication, password, API keys and other security related functions.',
		OTP: {
			TITLE: 'رمز یکبار مصرف',
			OTP_ENABLED: 'رمز یکبار مصرف را فعال کنید',
			OTP_DISABLED: 'لطفا رمز یکبار مصرف را  فعال کنید',
			ENABLED_TEXTS: {
				TEXT_1: 'هنگام ورود به سیستم ، به OTP نیاز دارید',
				TEXT_2: 'هنگام برداشت وجوه به OTP نیاز دارید',
			},
			DIALOG: {
				SUCCESS: 'شما OTP را با موفقیت فعال کرده اید',
				REVOKE: 'شما OTP خود را با موفقیت غیرفعال کردید',
			},
			CONTENT: {
				TITLE: 'رمز  یکبار مصرف را فعال کنید',
				MESSAGE_1: 'اسکن Qrcode',
				MESSAGE_2:
					'لطفا کیوآر کد زیر را توسط برنامه Google Authenticator یا Authy اسکن کنید.',
				MESSAGE_3:
					'اگر در اسکن مشکلی دارید ، می توانید کد زیر را به صورت دستی وارد کنید',
				MESSAGE_4:
					' شما می توانید این کد را در جایی امن ذخیره نموده و در صورت گم کردن گوشی همراه خود در گوشی جدید وارد کنید',
				MESSAGE_5: 'دستی',
				INPUT: 'رمز یک بار ورود را وارد کنید',
				WARNING:
					'اکیدا توصیه می کنیم رمز یکبار مصرف حساب خود را فعال کنید. این کار امنیت حساب شما را به طور قابل توجهی افزایش می دهد.',
				ENABLE: 'رمز یکبار مصرف را فعال کنید',
				DISABLE: 'غیر فعال کردن رمز یکبار مصرف',
				SECRET_1: 'Enter yor secret key',
				SECRET_2: 'Please enter your secret key to confirm you wrote it down.',
				SECRET_3:
					'This secret key will help you recover your account if you lost access to your phone.',
				INPUT_1: 'Secret Key',

				TITLE_2: 'Enter One-Time Password (OTP)',
				MESSAGE_6: 'Please enter your 6-digit one-time password below.',
				INPUT_2: 'One-Time Password (OTP)',
			},
			FORM: {
				PLACEHOLDER: ' ارائه شده توسط Google Authenticator را وارد کنید',
				BUTTON: 'فعال کردن رمز یکبار مصرف',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'نغییر رمز عبور',
			ACTIVE: 'فعال',
			DIALOG: {
				SUCCESS: 'شما با موفقیت رمز عبورتان را تغییر دادید',
			},
			FORM: {
				BUTTON: 'تغییر رمز عبور',
				CURRENT_PASSWORD: {
					label: ' رمز عبور فعلی',
					placeholder: 'رمز عبور فعلی',
				},
				NEW_PASSWORD: {
					label: 'رمز عبور جدید',
					placeholder: 'یک رمز عبور جدید تایپ کنید',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'تایید رمز جدید',
					placeholder: 'رمز عبور جدید خود را دوباره وارد کنید',
				},
			},
		},
		LOGIN: {
			TITLE: 'Login History',
			CONTENT: {
				TITLE: 'Logins History',
				MESSAGE:
					'Below is login history list with details IP, country and time details. If you see any suspicious activity you should change your password and contact support',
			},
		},
		FREEZE: {
			TITLE: 'Freeze Account',
			CONTENT: {
				MESSAGE_1:
					'Freezing your account will stop whitdrawals and halts all tradings.',
				WARNING_1:
					'Use only if you fear that your account has been compromised',
				TITLE_1: 'Freeze your Account',
				TITLE_2: 'Account freezing',
				MESSAGE_2:
					'Freezing your account may help guard your account from cyber attacks.',
				MESSAGE_3:
					'The following will occur if you choose to freeze your account:',
				MESSAGE_4: '1. Pending withdrawals will be canceled.',
				MESSAGE_5:
					'2. All tradings will be halted and unfilled orders will be canceled.',
				MESSAGE_6:
					'3. Containing support will be required to reactivate your account.',
				WARNING_2: 'Do you really want to freeze your account?',
			},
		},
	},
	CURRENCY: 'نوع دارایی',
	TYPE: 'نوع',
	TYPES_VALUES: {
		market: 'بازار',
		limit: 'محدود',
	},
	TYPES: [
		{ value: 'market', label: 'بازار' },
		{ value: 'limit', label: 'محدود' },
	],
	SIDE: 'معامله',
	SIDES_VALUES: {
		buy: 'خرید',
		sell: 'فروش',
	},
	SIDES: [
		{ value: 'buy', label: 'خرید' },
		{ value: 'sell', label: 'فروش' },
	],
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'روشن' },
		{ value: false, label: 'خاموش' },
	],
	SIZE: 'مقدار',
	PRICE: 'قیمت',
	FEE: 'کارمزد',
	FEES: 'کارمزد',
	LIMIT: 'محدود',
	TIME: 'زمان',
	TIMESTAMP: 'Timestamp',
	MORE: 'بسشتر',
	VIEW: 'مشاهده',
	STATUS: 'وضعیت',
	AMOUNT: 'مقدار',
	COMPLETE: 'تکمیل',
	PENDING: 'درحال انتظار',
	REJECTED: 'مردود',
	ORDERBOOK: 'بازار',
	CANCEL: 'لغو',
	CANCEL_ALL: 'لغو همه',
	GO_TRADE_HISTORY: 'به تاریخچه معاملات بروید',
	ORDER_ENTRY: 'ثبت سفارش',
	TRADE_HISTORY: 'همه مبادلات',
	CHART: 'نمودار قیمت',
	ORDERS: 'سفارش های فعال من',
	TRADES: 'مبادلات گذشته من',
	RECENT_TRADES: 'سفارش های اخیر من', // ToDo
	PUBLIC_SALES: 'تاریخچه معاملات', // ToDo
	REMAINING: 'باقی مانده',
	FULLFILLED: '{0} % تکمیل شده',
	FILLED: 'تکمیل', // new
	LOWEST_PRICE: 'کمترین قیمت ({0})', // new
	PHASE: 'پایه', // new
	INCOMING: 'ورودی', // new
	PRICE_CURRENCY: 'قیمت',
	AMOUNT_SYMBOL: 'مقدار',
	MARKET_PRICE: 'قیمت بازار',
	ORDER_PRICE: 'قیمت سفارش',
	TOTAL_ORDER: 'کل سفارش',
	NO_DATA: 'اطلاعاتی وجود ندارد',
	LOADING: 'بارگذاری',
	CHART_TEXTS: {
		d: 'تاریخ',
		o: 'شروع',
		h: 'بالا',
		l: 'پایین',
		c: 'پایان',
		v: 'حجم',
	},
	QUICK_TRADE: ' خرید و فروش آسان',
	PRO_TRADE: 'خرید و فروش حرفه ای',
	ADMIN_DASH: 'صفحه مدیر',
	WALLET_TITLE: 'کیف پول',
	TRADING_MODE_TITLE: 'خرید و فروش',
	TRADING_TITLE: 'خرید و فروش',
	LOGOUT: 'خروج',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'تراکنش برای ارسال بسیار کوچک است. مقدار بیشتری را امتحان کنید.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'تراکنش برای ارسال بسیار بزرگ است. مقدار کمتری  را امتحان کنید.',
	WITHDRAWALS_LOWER_BALANCE: 'شما برای انجام این معامله مبلغ {0} کافی ندارید',
	WITHDRAWALS_FEE_TOO_LARGE: 'کارمزد بزرگتر از {0}% از این تراکنش است.',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'آدرس بیتکوین نامعتبر است لطفا با دقت آدرس را وارد کنید',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'آدرس اتریوم اشتباه است. آدرس صحیح را وارد کنید.',
	WITHDRAWALS_BUTTON_TEXT: 'مرور برداشت',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'آدرس گیرنده',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'آدرس را وارد کنید',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'جزئیات انتقال (اختیاری)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'آدرس مقصد را تایپ کنید', // new
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} مقدار',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'مقدار {0} را که می خواهید برداشت کنید تایپ کنید',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: ' کارمزد معاملات',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'کارمزد برداشت بانک',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'مقدار {0} که میخواهید در این تراکنش استفاده کنید را وارد کنید',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'کارمزد مطلوب: {0} {1}', // TODO {0} -> amount {1} -> currency name
	DEPOSITS_FORM_AMOUNT_LABEL: 'مبلغ',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER:
		'مقدار {0} را که می خواهید واریز کنید تایپ کنید',
	DEPOSITS_BUTTON_TEXT: 'تایید',
	DEPOSIT_PROCEED_PAYMENT: 'پرداخت',
	DEPOSIT_BANK_REFERENCE:
		'برای شناسایی سپرده، این کد "{0}" را به تراکنش بانکی اضافه کنید',
	DEPOSIT_METHOD: 'روش پرداخت',
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'کارت بانکی',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1: 'به درگاه پرداخت کارت بانکی بروید.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'برای پرداخت شما سایت  را ترک میکنید و پس از انجام تراکنش مجددا به سایت باز خواهی گشت',
	DEPOSIT_VERIFICATION_WAITING_TITLE: 'تأیید پرداخت',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'لطفا این صفحه را تا زمانی که پرداخت شما در حال تایید می باشد، نبندید ',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'واریز شما در حال بررسی میباشد. به محض تایید، ایمیل تایید واریز برای شما ارسال می گردد و موجودی حساب شما در سیستم افزایش می یابد',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'این شناسه عملیات است: "{0}" ، لطفا این شناسه را در اختیار ما قرار دهید تا به شما کمک کنیم.',
	DEPOSIT_VERIFICATION_SUCCESS: 'پرداخت تأیید شد',
	DEPOSIT_VERIFICATION_ERROR: 'خطا در پرداخت.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: 'این شناسه واریزی قبلاً تأیید شده است',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'وضعیت نامعتبر',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		' از کارتی که در پروفایل خود ثبت کرده اید ، اقدام به واریز وجه نقد نموده اید ، مبلغ مورد نظر  تایید نگردیده و  به کیف پول تومانی شما اضافه نشده است. چنانچه مبلغ از حساب بانکی شما کسر  گردیده است ، ظرف مدت حداکثر 72 ساعت به حساب شما عودت داده خواهد شد.',
	QUOTE_MESSAGE: 'شما به {0} {1} {2} برای {3} {4}',
	QUOTE_BUTTON: 'قبول',
	QUOTE_REVIEW: 'بازبینی',
	QUOTE_COUNTDOWN_MESSAGE: 'شما {0} ثانیه برای این تراکنش وقت دارید',
	QUOTE_EXPIRED_TOKEN: 'اعتبار قیمت داده شده منقضی شده',
	QUOTE_SUCCESS_REVIEW_TITLE: 'خرید و فروش آسان',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'شما با موفقیت {0} {1} {2} برای {3} {4}', // you have successfully buy 1 btc from x toman
	COUNTDOWN_ERROR_MESSAGE: 'شمارش معکوس به اتمام رسید.',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'نام بانک دریافت کننده',
		MESSAGE_ABOUT_SEND: 'شما در آستانه ارسال',
		MESSAGE_BTC_WARNING:
			'لطفا از درست بودن آدرس خود اطمینان حاصل کنید {0} تراکنش ها غیر قابل بازگشت هستند.',
		MESSAGE_ABOUT_WITHDRAW: 'شما در حال انجام انتقال به حساب بانکی خود هستید.',
		MESSAGE_FEE: 'شامل کارمزد {0} ({1})',
		MESSAGE_FEE_BASE: 'شامل کارمزد {0}',
		BASE_MESSAGE_1:
			'شما فقط می توانید به مقصد حساب (های) بانکی خود که قبلا در حساب کاربری خود ثبت و تایید کرده اید پول برداشت نمایید',
		BASE_MESSAGE_2: 'حداقل مقدار برداشت',
		BASE_MESSAGE_3: 'محدودیت برداشت روزانه',
		BASE_INCREASE_LIMIT: 'افزایش برداشت محدودیت روزانه',
		CONFIRM_VIA_EMAIL: 'تایید از طریق ایمیل',
		CONFIRM_VIA_EMAIL_1: 'ایمیل تایید برداشت برای شما ارسال شد',
		CONFIRM_VIA_EMAIL_2: 'لطفا برای تایید برداشت و تکمیل فرایند ',
		CONFIRM_VIA_EMAIL_3:
			'حداکثر تا 5 دقیقه برداشت را از طریق ایمیل خود تایید کنید',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'درخواست برداشت شما تایید شد . ما آن را در مدت زمان کوتاهی کارسازی خواهیم نمود.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'برای مشاهده آخرین وضعیت برداشت خود ، لطفاً به صفحه "تاریخچه برداشت ها" مراجعه نمایید.',
		GO_WITHDRAWAL_HISTORY: 'برو به تاریخچه ی مبادلات',
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'واریز',
	WALLET_BUTTON_BASE_WITHDRAW: 'برداشت',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'دریافت',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'ارسال',
	AVAILABLE_TEXT: 'موجودی',
	AVAILABLE_BALANCE_TEXT: 'موجودی قابل دسترس از {0} به مقدار: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'مقدار',
	CURRENCY_BALANCE_TEXT: '{0} مقدار',
	WALLET_TABLE_AMOUNT_IN: `مقدار در {0}`,
	WALLET_TABLE_TOTAL: 'جمع کل',
	WALLET_ALL_ASSETS: 'مجموع دارایی ها',
	HIDE_TEXT: 'مخفی',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'فروشندگان',
	ORDERBOOK_BUYERS: 'خریداران',
	ORDERBOOK_SPREAD: '{0} شکاف قیمت', // 0 -> 660,000 T
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'بیشترین',
	DATEFIELD_TOOGLE_DATE_GR: 'تقویم جهانی',
	VERIFICATION_WARNING_TITLE: 'اطلاعات بانکی خود را تأیید کنید',
	VERIFICATION_WARNING_MESSAGE:
		'قبل از انصراف ، باید اطلاعات بانکی خود را تأیید کنید.',
	ORDER_SPENT: 'خرج شده',
	ORDER_RECEIVED: 'دریافت شده',
	ORDER_SOLD: 'فروخته شده',
	ORDER_BOUGHT: 'خریداری شده',
	ORDER_AVERAGE_PRICE: ' قیمت میانگین',
	ORDER_TITLE_CREATED: 'سفارش {0} با موفقیت انجام شد', // 0 -> buy / sell
	ORDER_TITLE_FULLY_FILLED: 'سفارش {0} تکمیل شد', // 0 -> buy / sell
	ORDER_TITLE_PARTIALLY_FILLED: 'قسمتی از سفارش {0} تکمیل شد', // 0 -> buy / sell
	ORDER_TITLE_TRADE_COMPLETE: 'سفارش {0} {1} با موفقیت انجام شد', // 0 -> buy / sell
	LOGOUT_TITLE: 'شما از حساب خارج شده اید',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'توکن قیمت دیگر اعتبار ندارد',
	LOGOUT_ERROR_LOGIN_AGAIN: 'لطفا مجدد وارد شوید', // ip doesnt match
	LOGOUT_ERROR_INVALID_TOKEN: 'لطفا دوباره وارد شوید',
	LOGOUT_ERROR_INACTIVE: 'لطفا مجدد وارد شوید',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	QUICK_TRADE_OUT_OF_LIMITS: 'سفارش شما خارج از محدوده است.',
	QUICK_TRADE_TOKEN_USED: 'توکن معتبر نیست',
	QUICK_TRADE_QUOTE_EXPIRED:
		'اعتبار قیمت اعلام شده تمام شده. دوباره امتحان کنید.',
	QUICK_TRADE_QUOTE_INVALID: 'قیمت اعلام شده اعتبار ندارد',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'اشتباه در محاسبه قیمت',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED: 'سفارش با این مقدار تکمیل نخواهد شد',
	QUICK_TRADE_ORDER_NOT_FILLED: 'موجودی سایت کافی نیست',
	QUICK_TRADE_NO_BALANCE: 'موجودی شما برای انجام این سفارش کافی نیست',
	YES: 'بله',
	NO: 'خیر',
	NEXT: 'بعدی',
	SKIP_FOR_NOW: 'بعدا وارد می کنم',
	SUBMIT: 'ارائه',
	RESUBMIT: 'ارائه مجدد',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: ' محدودیت دسترسی',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'لطفا در نظر داشته باشید که حساب کاربری شما تا زمانی که بارگذاری مدارک انجام و تایید نشده باشد با محدودیت همراه خواهد بود. شما می توانید به حساب کاربری خود رفته و اطلاعات مربوط به احراز هویت خود را در آنجا بارگذاری کنید.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'موفق!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'هنگامی که اطلاعات شما بررسی گردید، از طریق ایمیل به شما اطلاع می دهیم.',
	VERIFICATION_NOTIFICATION_BUTTON: 'ورود به HollaEx',
	ERROR_USER_ALREADY_VERIFIED: 'کاربر قبلا احراز هویت شده است',
	ERROR_INVALID_CARD_USER: 'مقادیر وارد شده نادرست است',
	ERROR_INVALID_CARD_NUMBER: 'شماره کارت نادرست است',
	ERROR_LOGIN_USER_NOT_VERIFIED: 'کاربر احراز هویت نشده است',
	ERROR_LOGIN_USER_NOT_ACTIVATED: 'حساب کاربری فعال نشده است',
	ERROR_LOGIN_INVALID_CREDENTIALS: 'ایمیل یا رمز عبور اشتباه است',
	SMS_SENT_TO: 'به {0} ارسال شد', // TODO check msg
	SMS_ERROR_SENT_TO:
		'خطا در ارسال به {0}. لطفا صفحه را دوباره بارگذاری کنید و مجددا امتحان کنید.', // TODO check msg
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'شناسه تراکنش:', // TODO check msg
	CHECK_ORDER: 'سفارش خود را تایید کنید',
	CHECK_ORDER_TYPE: '{0} {1}', // 0 -> maker/limit  1 -> sell/buy
	CONFIRM_TEXT: 'تایید',
	GOTO_XHT_MARKET: 'به بازار معاملات XHT بروید', // new
	INVALID_CAPTCHA: 'کپچا نادرست است',
	NO_FEE: 'کاربردی ندارد',
	SETTINGS_LANGUAGE_LABEL:
		'انتخاب زبان (این گزینه شامل ایمیل های ارسالی از طرف HollaEx نیز می شود)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'مشاهده منوی تایید سفارش',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'خیر' },
		{ value: true, label: 'بله' },
	],
	SETTINGS_THEME_LABEL: 'حالت پوسته سایت :', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'روشن' },
		{ value: 'dark', label: 'تیره' },
	],
	SETTING_BUTTON: 'ذخیره',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'برداشت فعال نیست',
	VERIFICATION_NO_WITHDRAW_MESSAGE: 'برداشت از حساب شما امکان پذیر نیست.',
	UP_TO_MARKET: 'مطابق بازار',
	VIEW_MY_FEES: 'مشاهده کارمزد', // new
	DEVELOPER_SECTION: {
		TITLE: 'برنامه نویسان',
		INFORMATION_TEXT:
			'API امکاناتی از قبیل دسترسی به کیف پول و موجودی، مدیریت سفارش ها و خرید و فروش ها، درخواست برداشت و همچنین اطلاعات بازار از جمله آخرین مبدلات، بازار و قیمت لحظه ای را فراهم می کند',
		ERROR_INACTIVE_OTP:
			'برای ساختن کلید API شما باید رمز یکبار مصرف را فعال کنید.',
		ENABLE_2FA: 'فعال سازی رمز یکبار مصرف',
		WARNING_TEXT: 'کلید خود را با دیگران به اشتراک نگذارید',
		GENERATE_KEY: 'کلید API خود را بسازید',
		ACTIVE: 'فعال',
		INACTIVE: 'غیرفعال',
		INVALID_LEVEL: 'برای دسترسی به این سرویس نیاز به سطح کاربری بالاتر دارید.', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'ساخت کلید',
		GENERATE_TEXT:
			'لطفا نام کلید API خود را تعیین کنید و پس از ایجاد آن ، در حفظ و نگهداری آن کوشا باشید و آن را در اختیار کسی قرار ندهید. در نظر داشته باشید شما نمی توانید کلید API خود را بازیابی نمایید.',
		GENERATE: 'ساخت',
		DELETE_TITLE: 'حذف کلید',
		DELETE_TEXT:
			'آیا مطمئن هستید که میخواهید کلید API خود را پاک کنید؟ (توجه داشته باشید اگر کلید API خود را پاک نمایید ، غیر قابل بازیابی خواهد بود . گرچه هر زمان که بخواهید می توانید یک کلید جدیدایجاد کنید.)',
		DELETE: 'حذف',
		FORM_NAME_LABEL: 'نام',
		FORM_LABLE_PLACEHOLDER: 'نام کلید',
		API_KEY_LABEL: 'کلید API',
		SECRET_KEY_LABEL: 'کلید خصوصی',
		CREATED_TITLE: 'کپی کلید API',
		CREATED_TEXT_1:
			'لطفا کلید خود را در جایی امن نگه داری کنید زیرا کلید در آینده قابل دسترس نخواهد بود.',
		CREATED_TEXT_2: 'کلید خود را در جایی امن نگه داری کنید.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'نام',
		API_KEY: 'کلید API',
		SECRET: 'رمز',
		CREATED: 'تاریخ ساخت',
		REVOKE: 'لغو کردن',
		REVOKED: 'لغو شده',
		REVOKE_TOOLTIP: 'شما باید رمز یکبار مصرف خود را برای لغو کلید فعال کنید.', // TODO
	},
	CHAT: {
		CHAT_TEXT: 'چت',
		MARKET_CHAT: 'چت',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'بیشتر بخوانید',
		SHOW_IMAGE: 'Show Image',
		HIDE_IMAGE: 'Hide Image',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'پیام خود را وارد کنید',
		SIGN_UP_CHAT: 'ثبت نام چت',
		JOIN_CHAT: 'نام کاربری چت',
		TROLLBOX: 'چت عمومی ({0})', // new
	},
	INVALID_USERNAME:
		'طول نام کاربری باید بین 3 تا 15 حرف باید باشد. فقط از حروف انگلیسی کوچک، اعداد و کاراکتر underscore استفاده نمایید.',
	USERNAME_TAKEN:
		'نام کاربری انتخاب شده توسط شما، قبلا توسط دیگر کاربران انتخاب شده است، لطفا نام دیگری انتخاب نمایید. ',
	USERNAME_LABEL: 'نام کاربری (جهت استفاده در چت)',
	USERNAME_PLACEHOLDER: 'نام کاربری',
	TAB_USERNAME: 'نام کاربری',
	USERNAME_WARNING:
		'نام کاربری شما فقط یکبار می تواند تغییر یابد. لطفا در انتخاب نام کاربری خود دقت فرمایید.',
	USERNAME_CANNOT_BE_CHANGED: 'نام کاربری نمی تواند تغییر یابد.',
	UPGRADE_LEVEL:
		'درخواست افزایش سطح دسترسی کاربری. (تنها برای افراد با حجم خرید و فروش بالا)',
	LEVELS: {
		LABEL_LEVEL: 'سطح',
		LABEL_LEVEL_1: 'میگوی کوچک (مبتدی) ',
		LABEL_LEVEL_2: 'ماهی قرمز(عادی)',
		LABEL_LEVEL_3: 'هشت پا (ویژه)',
		LABEL_MAKER_FEE: 'کارمزد سفارش گذار',
		LABEL_TAKER_FEE: 'کارمزد پذیرنده سفارش',
		LABEL_BASE_DEPOSIT: 'محدودیت واریز روزانه تومانی',
		LABEL_BASE_WITHDRAWAL: 'محدودیت برداشت روزانه تومانی',
		LABEL_BTC_DEPOSIT: 'محدودیت واریز روزانه بیتکوین',
		LABEL_BTC_WITHDRAWAL: 'محدودیت برداشت روزانه بیتکوین',
		LABEL_ETH_DEPOSIT: 'محدودیت واریز روزانه اتریوم',
		LABEL_ETH_WITHDRAWAL: 'محدودیت برداشت روزانه اتریوم',
		LABEL_PAIR_MAKER_FEE: '{0} کارمزد سفارش گذار',
		LABEL_PAIR_TAKER_FEE: '{0} کارمزد پذیرنده سفارش',
		UNLIMITED: 'نامحدود',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: 'ساخت کیف پول {0} ',
	WALLET_ADDRESS_GENERATE: 'ساخت',
	WALLET_ADDRESS_MESSAGE:
		'با ساخت کیف پول، یک آدرس واریز و برداشت که تنها مخصوص شما است، ساخته می شود',
	WALLET_ADDRESS_ERROR:
		'خطا در محاسبه آدرس، لطفا صفحه را رفرش کرده و دوباره تلاش کنید',
	DEPOSIT_WITHDRAW: 'واریز/برداشت',
	GENERATE_WALLET: ' ساخت کیف پول',
	TRADE_TAB_CHART: 'نمودار',
	TRADE_TAB_TRADE: 'خرید و فروش',
	TRADE_TAB_ORDERS: 'سفارش ها',
	TRADE_TAB_POSTS: 'اطلاعیه ها', // new
	WALLET_TAB_WALLET: 'کیف پول',
	WALLET_TAB_TRANSACTIONS: 'تراکنش ها',
	RECEIVE_CURRENCY: 'دریافت {0}',
	SEND_CURRENCY: 'برداشت {0}',
	COPY_ADDRESS: ' کپی کردن آدرس',
	SUCCESFUL_COPY: 'آدرس با موفقیت کپی شد!',
	QUICK_TRADE_MODE: 'خرید و فروش آسان',
	JUST_NOW: 'الآن',
	PAIR: 'زوج',
	ZERO_ASSET: 'دارایی شما صفر می باشد',
	DEPOSIT_ASSETS: 'واریز دارایی',
	SEARCH_TXT: 'جستجو',
	SEARCH_ASSETS: 'جستجوی دارایی',
	TOTAL_ASSETS_VALUE: 'ارزش کل دارایی ها در {0}: {1}',
	SUMMARY: {
		TITLE: 'خلاصه وضعیت',
		TINY_PINK_SHRIMP_TRADER: 'کاربر مبتدی (میگوی کوچک)',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'حساب کاربر مبتدی (میگوی کوچک)',
		LITTLE_RED_SNAPPER_TRADER: 'کاربر عادی (ماهی قرمز)',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'حساب کاربر عادی (ماهی قرمز)',
		CUNNING_BLUE_KRAKEN_TRADING: 'کاربر ویژه (هشت پا)',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: 'حساب کاربری ویژه (هشت پا)',
		BLACK_LEVIATHAN_TRADING: 'کاربر حرفه ایی (نهنگ سیاه)',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: 'حساب کاربری حرفه ایی (نهنگ سیاه)',
		URGENT_REQUIREMENTS: ' موارد ضروری',
		TRADING_VOLUME: 'حجم معامله',
		ACCOUNT_ASSETS: 'دارایی های حساب کاربری',
		ACCOUNT_DETAILS: ' جزئیات حساب کاربری',
		SHRIMP_ACCOUNT_TXT_1: 'آغاز ماجراجویی شما اینجاست!',
		SHRIMP_ACCOUNT_TXT_2: 'برای متمایز شدن از سایرین به تلاش خود ادامه دهید.',
		SNAPPER_ACCOUNT_TXT_1: ' مسیر زندگی خود را با تورم بازار بگذرانید',
		SNAPPER_ACCOUNT_TXT_2:
			'با ادامه تلاش و مبارزه، به گنجینه دارایی های خود بیافزایید.',
		KRAKEN_ACCOUNT_TXT_1:
			'کسی که در میان طوفان ایستادگی کند، از سایرین متمایز خواهد شد.',
		LEVIATHAN_ACCOUNT_TXT_1:
			'اساتید واقعی ترید، فرصت های بازار را غنیمت شمرده و از آنها استفاده می نمایند.',
		VIEW_FEE_STRUCTURE: 'جدول کارمزدها و سقف برداشت',
		UPGRADE_ACCOUNT: ' ارتقا حساب کاربری',
		ACTIVE_2FA_SECURITY: 'فعال سازی رمز یکبار مصرف',
		ACCOUNT_ASSETS_TXT_1: 'خلاصه وضعیت دارایی های شما',
		ACCOUNT_ASSETS_TXT_2:
			'نگهداری دارایی ها و مبادله بیشتر، به شما در ارتقا سطح کاربری و بهره مندی از مزایای آن کمک می نماید.',
		TRADING_VOLUME_TXT_1:
			'تاریخچه معاملات شما به {0} ، در پایان هر ماه برای هر یک از کوین های که معامله شده، محاسبه و نمایش داده می شود.',
		TRADING_VOLUME_TXT_2:
			'فعالیت تجاری بالا به شما امکان ارتقاء حساب را می دهد و سبب ارائه ویژگی های منحصر به فرد HollaEx برای  حساب کاربری شما می شود.',
		ACCOUNT_DETAILS_TXT_1:
			'سطح کاربری شما بیانگر میزان کارمزد و سقف برداشت شما می باشد.',
		ACCOUNT_DETAILS_TXT_2:
			' تاریخ عضویت، میزان فعالیت و همچنین میزان دارایی های شما بر روی پلتفورم می باشد.',
		ACCOUNT_DETAILS_TXT_3:
			'حفظ سطح حساب کاربری شما نیازمند به فعالیت مداوم شما در بازار HollaEx است',
		ACCOUNT_DETAILS_TXT_4:
			'شرایط فوق بصورت دوره ای مورد ارزیابی قرار گرفته و در صورت عدم احراز این شرایط، سطح کاربری تنزل می یابد.',
		REQUIREMENTS: 'ملزومات',
		ONE_REQUIREMENT: 'فقط یک مورد:', // new
		REQUEST_ACCOUNT_UPGRADE: 'درخواست افزایش سطح کاربری',
		FEES_AND_LIMIT: '{0} جدول کارمزد های و محدودیت های هر سطح کاربری', // new
		FEES_AND_LIMIT_TXT_1:
			'با تدبیر،اراده و سرعت وارد دنیای رمزارزها شده و به یاد داشته باشید که تنها با فرو رفتن در عمق دریا به گوهرهای آن دسترسی پیدا خواهید نمود.',
		FEES_AND_LIMIT_TXT_2:
			'هر حساب کاربری کارمزد و سقف واریز و برداشت منحصر به خود را دارد.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'مقدار مجاز واریز و برداشت',
		TRADING_FEE_STRUCTURE: 'ساختار کارمزد معاملات',
		WITHDRAWAL: 'برداشت',
		DEPOSIT: 'واریز',
		TAKER: 'پذیرنده سفارش ',
		MAKER: 'سفارش گذار',
		WEBSITE: 'وبسایت',
		VIP_TRADER_ACCOUNT_ELIGIBLITY: 'شایستگی ارتقا به حساب کاربری ویژه',
		PRO_TRADER_ACCOUNT_ELIGIBLITY: 'شایستگی ارتقا به حساب کاربری حرفه ایی',
		TRADER_ACCOUNT_ELIGIBILITY: ' داشتن شرایط سطح کاربری {0}',
		NOMINAL_TRADING: 'مقدار نامی معامل',
		NOMINAL_TRADING_WITH_MONTH: 'حجم معاملات ماه گذشته{0}',
		ACCOUNT_AGE_OF_MONTHS: 'قدمت حساب کاربری{0}ماه',
		TRADING_VOLUME_EQUIVALENT: '{0} {1} معادل حجم معاملات',
		LEVEL_OF_ACCOUNT: ' {0} سطح حساب کاربری',
		LEVEL_TXT_DEFAULT: 'توضیحات سطح خود را اینجا اضافه کنید',
		LEVEL_1_TXT:
			'سفر شما از اینجا آغاز می شود! برای به دست آوردن سود بیشتر می توانید به بررسی بازار بپردازید و همچنین با فعالیت بیشتر به کاهش کارمزد معاملات و استفاده از ویژگی های منحصر به فرد هر سطح کاربری بپردازید.', // new
		LEVEL_2_TXT:
			'شما می توانید با ثبت حجم معاملات ماهانه 3000 دلار و یا داشتن متوسط بالانس 5000 توکن XHT به سطح 2 رسیده و از کارمزد های کمتر و سقف برداشت های بیشتر بهره مند گردید.', // new
		LEVEL_3_TXT:
			'اینجاست که همه چیز رنگ و بوی واقعی به خود می گیرد ! برای بهره مندی از کارمزد های کمتر و سقف برداشت های بیشتر ، حساب کاربری خود را احراز هویت کنید.', // new
		LEVEL_4_TXT:
			'شما می توانید با ثبت حجم معاملات ماهانه 10،000 دلار و یا داشتن متوسط بالانس 10،000 توکن XHT به سطح 4 رسیده و از کارمزد های کمتر و سقف برداشت های بیشتر بهره مند گردید.', // new
		LEVEL_5_TXT:
			'شما موفق شدید ! سطح کاربری 5 یک حساب کاربری ویژه است که ویژه اشخاصی که میخواهد اکسچنج راه انداری نمایند و یا کاربران سرویس Vault و HAP می باشد. از کارمزد صفر معاملات لذت ببرید.', // new
		LEVEL_6_TXT:
			'شما می توانید با ثبت حجم معاملات ماهانه 300،000 دلار و یا داشتن متوسط بالانس 100،000 توکن XHT به سطح 6 رسیده و از کارمزد های کمتر و سقف برداشت های بیشتر بهره مند گردید.', // new
		LEVEL_7_TXT:
			'شما می توانید با ثبت حجم معاملات ماهانه 500،000 دلار و یا داشتن متوسط بالانس 300،000 توکن XHT به سطح 7 رسیده و از کارمزد های کمتر و سقف برداشت های بیشتر بهره مند گردید.', // new
		LEVEL_8_TXT:
			'شما می توانید با ثبت حجم معاملات ماهانه 600،000 دلار و یا داشتن متوسط بالانس 400،000 توکن XHT به سطح 8 رسیده و از کارمزد های کمتر و سقف برداشت های بیشتر بهره مند گردید.', // new
		LEVEL_9_TXT:
			'شما می توانید با ثبت حجم معاملات ماهانه 2,000,000 دلار و یا داشتن متوسط بالانس 1,000،000 توکن XHT به سطح 9 رسیده و از کارمزد های کمتر و سقف برداشت های بیشتر بهره مند گردید.', // new
		LEVEL_10_TXT:
			'حساب کاربری سطح 10 ویژه کاربرانی که بازار گردانی میکنند ، می باشد و نه تنها کارمزد نمی دهند بلکه می تواننداز محل معاملات انجام شده، درآمد نیز کسب نمایند.', // new
		CURRENT_TXT: 'فعلی',
		TRADER_ACCOUNT_XHT_TEXT:
			'حساب کاربری شما در دوره پیش فروش XHT ایجاد شده است و این به این معنی است که شما می توانید هر XHT را با قیمت 0.1 دلار خریداری نمایید.',
		TRADER_ACCOUNT_TITLE: 'حساب - دوره پیش فروش', // new
		HAP_ACCOUNT: 'حساب کاربری HAP', // new
		HAP_ACCOUNT_TXT:
			' شما دارای یک حساب کاربری تایید شده در برنامه HAP می باشید. اکنون می توانید برای هر شخصی که توسط شما به HollaEx پیوسته و در آن فعالیت می کند ، 10٪ سود کسب کنید.', // new
		EMAIL_VERIFICATION: 'تأیید ایمیل', // new
		DOCUMENTS: 'اسناد', // new
		HAP_TEXT: 'برنامه HAP{0}', // new
		LOCK_AN_EXCHANGE: 'مبادله را مسدود کنید {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'کاربران استفاده کننده از سرویس Vault {0}', // new
		TRADE_OVER_XHT: 'خرید و فروش بیشتر از  {0} تومان', // new
		TRADE_OVER_BTC: 'خرید و فروش بیشتر از  {0} بیتکوین', // new
		XHT_IN_WALLET: '{0} XHT موجود در کیف پول', // new
		REWARDS_BONUS: 'جوایز و پاداش ها', // new
		COMPLETE_TASK_DESC:
			'فعالیت های موجود را انجام دهید و جوایزی به ارزش بیش از 10،000 دلار کسب کنید.', // new
		TASKS: 'وظایف', // new
		MAKE_FIRST_DEPOSIT: 'بااولین واریز خود XHT دریافت کنید 1 ', // new
		BUY_FIRST_XHT: 'بااولین خرید خود XHT دریافت کنید 5 ', // new
		COMPLETE_ACC_VERIFICATION:
			'مشخصات حساب کاربری خود را کامل کنید و 20 XHT دریافت کنید', // new
		INVITE_USER: 'دوستان خود را دعوت کرده و از کمیسیون خود لذت ببرید', // new
		JOIN_HAP:
			'به برنامه واسط(HAP) بپیوندید و برای هر نسخه HollaEx kit که می فروشید ، 10٪ درآمد کسب کنید', // new
		EARN_RUNNING_EXCHANGE: 'برای اجرای مبادله شخصی خود درآمد جداگانه کسب کنید', // new
		XHT_WAVE_AUCTION: ' موج حراجی XHT ', // new
		XHT_WAVE_DESC_1: 'توزیع توکن HollaEx (XHT) از طریق موج حراجی انجام می شود.', // new
		XHT_WAVE_DESC_2:
			'موج حراجی یک مقدار تصادفی XHT را در مواقع تصادفی به بالاترین پیشنهاد دهنده در سفارسات موجود می فروشد', // new
		XHT_WAVE_DESC_3:
			'در زیر اطلاعات مربوط به تاریخچه موج حراجی نمایش داده می شود', // new
		WAVE_AUCTION_PHASE: 'مراحل موج حراجی {0}', // new
		LEARN_MORE_WAVE_AUCTION: 'درباره موج حراجی بیشتر بدانید', // new
		WAVE_NUMBER: 'شماره موج', // new
		DISCOUNT: '( {0}% تخفیف )', // new
		MY_FEES_LIMITS: ' کارمزدها و محدودیت ها', // new
	},
	REFERRAL_LINK: {
		TITLE: ' دوست خود را دعوت کنید', // new
		INFO_TEXT:
			'با ارائه این لینک به دوستان خود و  ثبت نام آنها از طریق لینک ارائه شده، دوستان شما {0} % تخفیف دریافت می کنند.', // new
		INFO_TEXT_1:
			'{0}%  از معاملات صورت گرفته توسط افرادی که از طریق لینک ارسالی شما به اقدام به ثبت نام نموده اند ، ماهانه به حساب شما واریز می شود.', // new
		COPY_FIELD_LABEL:
			'لینک زیر را با دوستان خود به اشتراک بگذارید و کمیسیون کسب کنید:', // new
		REFERRED_USER_COUT: 'شما کاربران {0} را دعوت کرده اید', // new
		COPY_LINK_BUTTON: 'کپی لینک دعوت نامه', // new
		XHT_TITLE: 'دعوت نامه من', // new
		XHT_INFO_TEXT: 'با دعوت از دوستان خود کمیسیون کسب کنید.', // new
		XHT_INFO_TEXT_1: 'کمیسیون به طور دوره ای به کیف پول شما پرداخت می شود', // new
		APPLICATION_TXT:
			'برای تبدیل شدن به یک انتشار دهنده کیت HollaEx لطفاً درخواست خود را پر کنید.', // new
		TOTAL_REFERRAL: 'مجموع خرید های انجام شده از معارفه های شما:', // new
		PENDING_REFERRAL: 'حق کمیسیون های در انتظار:', // new
		EARN_REFERRAL: 'کمیسیون های کسب شده:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'درخواست دادن', // new
	},
	STAKE_TOKEN: {
		TITLE: 'سهام توکن HollaEx', // new
		INFO_TXT1:
			'توکن HollaEx (XHT).برای اجرای نرم افزار تبادل HollaEx نیازمند وثیقه(staked) است.', // new
		INFO_TXT2:
			'می توانید توکن HollaEx خود را با روشی یکسان تضمین کنید و XHT را که در موج حراجی فروخته نشده است را کسب کنید.', // new
		INFO_TXT3:
			'به dash.bitholla.com بروید ، مبادله شخصی خود را اتضمین کنید و XHT رایگان کسب کنید', // new
		BUTTON_TXT: 'اطلاعات بیشتر', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'توافق نامه خرید توکن HollaEx',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: 'اقدامات',
		AGREE_TERMS_LABEL: 'من توافقنامه خرید توکن HollaEx را خوانده ام و موافقم',
		RISK_INVOLVED_LABEL: 'من خطرات ناشی از آن را درک می کنم',
		DOWNLOAD_PDF: 'PDF دریافت فایل',
		DEPOSIT_FUNDS:
			'برای به دست آوردن توکن HollaEx (XHT) وجوه خود را به کیف پول خود واریز کنید.',
		READ_FAG: ' سؤالات متداول HollaEx {0}',
		READ_DOCUMENTATION: 'گزارشات HollaEx را اینجا بخوانید: {0}',
		READ_WAVES: 'قوانین مربوط به موج حراج عمومی دسامبر پیش رو{0}', // new
		DOWNLOAD_BUY_XHT:
			'PDF را دریافت کنید تا یک نمای مرحله به مرحله از فرایند را ببینید{0}',
		HOW_TO_BUY: 'نحوه خرید توکن HollaEx (XHT)',
		PUBLIC_SALES: ' موج حراجی عمومی', // new
		CONTACT_US:
			'برای اطلاعات بیشتر و در صورت داشتن هرگونه مشکل از طریق ارسال ایمیل به ما در تماس باشید. {0}',
		VISUAL_STEP: 'یک نمای مرحله به مرحله از فرایند را مشاهده کنید {0}', // new
		WARNING_TXT:
			'ما درخواست شما را بررسی خواهیم کرد و دستورالعمل های بیشتر در مورد نحوه دسترسی به صرافی HollaEx را به ایمیل شما ارسال خواهیم کرد.', // new
		WARNING_TXT1:
			'در این مدت می توانید خود را با شبکه HollaEx از طریق منابع زیر آشنا کنید', // new
		XHT_ORDER_TXT_1: 'برای شروع خرید و فروش توکن HollaEx (XHT) باید وارد شوید', // new
		XHT_ORDER_TXT_2:
			'توکن HollaEx از طریق موج حراجی توزیع می شود که در یک زمان تصادفی، روزانه  مقداری  توکن HollaEx را به بالاترین پیشنهاد دهنده سفارش ها فروخته می شود .', // new
		XHT_ORDER_TXT_3: '{0}برای پیوستن به موج ها یا{1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: 'برای دیدن معاملات اخیر خود وارد شوید', //new
		XHT_TRADE_TXT_2:
			'{0}می توانید برای دیدن تاریخچه معاملات اخیر خود داشته باشید', //new
		LOGIN_HERE: 'اینجا وارد شوید',
	},
	WAVES: {
		// new
		TITLE: 'اطلاعات موج',
		NEXT_WAVE: 'موج بعدی',
		WAVE_AMOUNT: 'مقدار موجود موج',
		FLOOR: 'کف',
		LAST_WAVE: 'آخرین موج',
	},
	TYPES_OF_POSTS: {
		// new
		TITLE: 'اطلاعیه ها',
		ANNOUNCEMEN: 'اعلان ها',
		SYSTEM_UPDATE: 'بروز رسانی سیستم',
		LAST_WAVE: 'آخرین موج',
		ANNOUNCEMENT_TXT:
			'XHT رایگان به کلیه کیف پولهایی که توزیع می شود اعمال می شوند',
		SYSTEM_UPDATE_TIME: 'Time: 12:31 PM, December 19th, 2019	',
		SYSTEM_UPDATE_DURATION: '1 hour',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: ' 12: 31 PM, December 19th, 2019',
	},
	USER_LEVEL: 'سطح کاربری', // new
	LIMIT_AMOUNT: 'مقدار محدود', // new
	FEE_AMOUNT: 'مقدار کارمزد', // new
	COINS: 'Coins', // new
	PAIRS: 'Pairs', // new
	NOTE_FOR_EDIT_COIN:
		'توجه: برای حذف و اضافه کردن {0} لطفاً مراجعه کنید به {1}', // new
	REFER_DOCS_LINK: 'اسناد', // new
	RESTART_TO_APPLY:
		'برای اعمال این تغییرات ، باید مبادله خود را مجدداً راه اندازی کنید.', // new
	TRIAL_EXCHANGE_MSG:
		'شما از نسخه آزمایشی {0}  استفاده می کنید که طی روز {1} منقضی می شود.', // new
	EXPIRY_EXCHANGE_MSG:
		'مبادله شما منقضی شده است برای فعال کردن دوباره آن به dash.bitholla.com بروید.', // new
	EXPIRED_INFO_1: 'نسخه آزمایشی HollaEx شما به پایان رسید.', // new
	EXPIRED_INFO_2: 'مبادله خود را مجدد فعال کنید.', // new
	EXPIRED_BUTTON_TXT: 'مبادله فعال', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: 'اطلاعیه ها',
		ANNOUNCEMNT_TXT_3:
			'راه اندازی عمومی و موج حراجی در اول ژانویه سال 2020 تنظیم شده است. سپرده کیف پول و برداشت ها اکنون باز است.',
		ANNOUNCEMNT_TXT_4:
			'سال نو مبارک؛ ما از سال 2020 با همراهی شما در تلاشیم با ارائه یک بازار باز، مارکت جدیدی را تولید می کنیم.',
		ANNOUNCEMNT_TXT_1:
			'با معرفی دوستان خود به hollaex.com ، با برنامه واسط hollaEX (HAP) درآمدزایی کنید. {0}',
		DEFAULT_ANNOUNCEMENT:
			'در این صفحه اطلاعیه های عمومی در مورد اکسچنج شما نمایش داده می شود!',
		ANNOUNCEMENT_TXT_2:
			'XHT رایگان در کلیه کیف پولهایی که {0} دارند توزیع می شود.',
		LEARN_MORE: 'بیشتر بدانید',
		APPLY_TODAY: 'امروز اقدام کنید', // new
	},
	OPEN_WALLET: 'کیف پول', // new
	AGO: 'پیش', // new
};

const content = flatten(nestedContent, options);

export default content;
