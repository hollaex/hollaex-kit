import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';
import flatten from 'flat';

// OPEN PR for translations on language branch
const options = { safe: true };
const nestedContent = {
	APP_TITLE: 'هولا إكس',
	APP_SUB_TITLE: 'بورصة العملات الرقمية المفتوحة', // slogan

	LOGOUT_CONFIRM_TEXT: 'هل انت متأكد؟هل تريد تسجيل الخروج؟',
	ADD_TRADING_PAIR: 'حدد السوق',
	ACTIVE_TRADES: 'يجب عليك أن {0} للوصول الي تداولاتك المفتوحة',
	CANCEL_BASE_WITHDRAWAL: 'إلغاء {0}السحب',
	CANCEL_WITHDRAWAL: 'إلغاء السحب',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM:
		'هل تريد إلغاء السحب الذي في قيد الانتظار لـ',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'تسجیل الدخول',
	SIGN_IN: 'تسجیل الدخول',
	SIGNUP_TEXT: 'سجّل',
	REGISTER_TEXT: 'إنشاء حساب',
	ACCOUNT_TEXT: 'الحساب',
	HOME_TEXT: 'الصفحة الرئيسية',
	CLOSE_TEXT: 'إغلاق',
	COPY_TEXT: 'نسخ',
	COPY_SUCCESS_TEXT: 'تم النسخ بنجاح',
	CANCEL_SUCCESS_TEXT: 'تم الإلغاء بنجاح',
	UPLOAD_TEXT: 'تحميل',
	ADD_FILES: 'أضف ملفات', // ToDo
	OR_TEXT: 'أو',
	CONTACT_US_TEXT: 'إتصل معنا',
	HELPFUL_RESOURCES_TEXT: 'مصادر مفيدة',
	HELP_RESOURCE_GUIDE_TEXT:
		'لا تتردد في الاتصال معنا لمزيد من المعلومات و في مواجهة أي مشاكل عن طريق إرسال رسالة الكترونية لنا.',
	HELP_TELEGRAM_TEXT: 'تحقق من وثائق API المفتوحة:',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: 'تحتاج لمساعدة؟', // new
	HELP_TEXT: 'مساعدة',
	SUCCESS_TEXT: 'نجاح',
	ERROR_TEXT: 'خطأ',
	PROCEED: 'تقدم',
	EDIT_TEXT: 'تعديل',
	BACK_TEXT: 'عودة',
	NO_OPTIONS: 'لا يوجد خيارات متاحة',
	SECONDS: 'ثواني',
	VIEW_MARKET: 'مشاهدة السوق', // new
	GO_TRADE: 'قم بالتداول', // new
	VIEW_INFO: 'مشاهدة صفحة المعلومات', // new
	APPLY_HERE: 'قدم هنا', // new
	HOME: {
		SECTION_1_TITLE: 'أهلا بكم في مجموعة أدوات بورصة هولاإكس',
		SECTION_1_TEXT_1:
			'إنشأ بورصة العملات الرقمية قابلة للتطويرالخاصة بك عن طريق مجموعة أدوات هولاإكس و كن جزء في مستقبل التمويل.',
		SECTION_1_TEXT_2:
			'نحن نسعي لجلب التكنولوجيا المالية إلي الأمام عن طريق التمكن السهل والميسور لتكنولوجيا التداول.',
		SECTION_1_BUTTON_1: 'إكتشف أكثر',
		SECTION_3_TITLE: 'الميزات',
		SECTION_3_CARD_1_TITLE: 'محرك متجانس قابل للتطویر',
		SECTION_3_CARD_1_TEXT:
			'محرك متجانس مع أداء عالي و قابل للتطوير عن طريق استخدام الخوارزميات اللتي لديها اكثر كفاءة.',
		SECTION_3_CARD_2_TITLE: 'دمج البنك',
		SECTION_3_CARD_2_TEXT:
			'يوجد وصلات مع وحدات قابلة للتخصيص لدمج البنوك. نحن نعلم أن التمويل التقليدي و نقدر أن نساعدكم في صنع بورصتكم المحلية.',
		SECTION_3_CARD_3_TITLE: 'أمان عالي',
		SECTION_3_CARD_3_TEXT:
			'تستخدم هولاإكس افضل الممارسات الأمنية واكثر الخوارزميات ثقةً و أماناً لإبقاء الأموال في أمان. إنها أولويتنا القصوي و اتخذنا إعتناء خاص به.',
		SECTION_3_CARD_4_TITLE: 'تبلیغ متقدم',
		SECTION_3_CARD_4_TEXT:
			'لوحة تحكم تحتوي على بريد إلكتروني قابلة للتخصيص وتقارير لإعلام الدعم والمسؤول عن حالة النظام والمعاملات ',
		SECTION_3_CARD_5_TITLE: 'الدعم',
		SECTION_3_CARD_5_TEXT:
			'يمكننا أن نعتني باحتياجاتك ولدينا متخصص عبر الإنترنت لمساعدتك في مشاكلك وإستفساراتك',
		SECTION_3_CARD_6_TITLE: 'تکامل  إعرف عميلك',
		SECTION_3_CARD_6_TEXT:
			'وحدات مرنة وقابلة للتكامل لتطبيق طرق إعرف عميلك والتحقق من المستخدم في ولايات قضائية مختلفة.',
		SECTION_3_BUTTON_1: 'مشاهدة ملف Demo',
	},
	FOOTER: {
		FOOTER_LEGAL: ['صنع بفخر في سيول ، كوريا الجنوبية ،شركة بيت هولا'],
		FOOTER_LANGUAGE_TEXT: 'اللغة',
		SECTIONS: {
			SECTION_1_TITLE: 'حول',
			SECTION_1_LINK_1: 'حولنا',
			SECTION_1_LINK_2: 'تعليمات الاستخدام',
			SECTION_1_LINK_3: 'سياسة الخصوصية',
			SECTION_1_LINK_4: 'إتصل بنا',
			SECTION_2_TITLE: 'معلومات',
			SECTION_2_LINK_1: 'مدونة',
			SECTION_2_LINK_2: 'إتصل بنا',
			SECTION_2_LINK_3: 'مهنة',
			SECTION_3_TITLE: 'المطورون',
			SECTION_3_LINK_1: 'توثيق',
			SECTION_3_LINK_2: 'المنتدى',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'مکتبه',
			SECTION_3_LINK_5: 'وثيقة API',
			SECTION_3_LINK_6: 'واجهة برمجة تطبيقات التداول',
			SECTION_3_LINK_7: 'ادوات المطورين',
			SECTION_3_LINK_8: 'توثيق',
			SECTION_4_TITLE: 'بورصة',
			SECTION_4_LINK_1: 'تسجيل الدخول',
			SECTION_4_LINK_2: 'تسجيل',
			SECTION_4_LINK_3: 'اتصل بنا',
			SECTION_4_LINK_4: 'تعليمات الاستخدام',
			SECTION_5_TITLE: 'مصادر',
			SECTION_5_LINK_1: 'وايت بيبر',
			SECTION_5_LINK_2: 'عملة هولاإكس',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'مكتب المساعدة', // new
			SECTION_6_TITLE: 'الشبكة الاجتماعية',
			SECTION_6_LINK_1: 'توییتر',
			SECTION_6_LINK_2: 'تلگرام',
		},
		XHT_DESCRIPTION:
			'مجموعة أدواتHollaEx  عبارة عن منصة تداول مفتوحة المصدر أنشأتها شركة bitHolla Inc. ويمكنك إنشاء وإدراج أي أصول رقمية ومستخدمين على متنها للتداول في البورصة باستخدام مجموعة أدوات التبادل هذه. من أجل تشغيل واحدة بنفسك.',
		CLICK_HERE: 'انقر هنا',
		VISIT_HERE: 'زوروا هنا',
	},
	ACCOUNTS: {
		TITLE: 'الحساب',
		TAB_VERIFICATION: 'التحقق',
		TAB_SECURITY: 'الأمان',
		TAB_NOTIFICATIONS: 'إشعارات',
		TAB_SETTINGS: 'إعدادات',
		TAB_PROFILE: 'الملف الشخصي',
		TAB_WALLET: 'محفظة النقود',
		TAB_SUMMARY: 'ملخص',
		TAB_HISTORY: 'التاریخ',
		TAB_API: 'واجهة برمجة التطبيقات',
		TAB_SIGNOUT: 'خروج',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: 'طلب الدخول',
		REQUEST_INVITE: 'طلب دعوة',
		CATEGORY_PLACEHOLDER: 'حدد الفئة التي تناسب مشكلتك',
		INTRODUCTION_LABEL: 'عرف نفسك',
		INTRODUCTION_PLACEHOLDER: 'أين تقيم ، هل أنت مهتم بإجراء بورصة؟',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'الفئة',
		CATEGORY_PLACEHOLDER: 'حدد الفئة التي تناسب مشكلتك',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'التحقق من المستخدم',
			OPTION_LEVEL: 'زيادة مستوى المستخدم',
			OPTION_DEPOSIT: 'الإيداع والسحب',
			OPTION_BUG: 'تقرير خلل برمجي', // ToDo:
			OPTION_PERSONAL_INFO: 'تغيير المعلومات الشخصية', // ToDo:
			OPTION_BANK_TRANSFER: 'تحويل بنكي', // new
			OPTION_REQUEST: 'طلب دعوة لبورصة HollaEx', // new
		},
		SUBJECT_LABEL: 'موضوع',
		SUBJECT_PLACEHOLDER: 'اكتب موضوع مشكلتك',
		DESCRIPTION_LABEL: 'وصف',
		DESCRIPTION_PLACEHOLDER: 'اكتب بالتفصيل ما هي المشكلة',
		ATTACHMENT_LABEL: 'أضف مرفقات (3 كحد أقصى)', // ToDo:
		ATTACHMENT_PLACEHOLDER:
			'أضف ملفًا للمساعدة في إبلاغ مشكلتك. يتم قبول ملفات PDF و JPG و PNG و GIF',
		SUCCESS_MESSAGE: 'تم إرسال البريد الإلكتروني لموظفينا في قسم الدعم.',
		SUCCESS_TITLE: 'تم ارسال الرسالة',
		SUCCESS_MESSAGE_1: 'تم إرسال مشكلتك إلى قسم دعم العملاء',
		SUCCESS_MESSAGE_2: 'سوف يتم الرد خلال 1-3 أيام.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'عنوان الاستلام {0} الخاص بك', // new
			DESTINATION_TAG: 'ملصق الوجهة {0} الخاصة بك', // new
			MEMO: 'مذكرتك {0}', // new, Perisna should be added in Persian lang
			BTC: 'عنوان استلام Bitcoin الخاص بك',
			ETH: 'عنوان استلام Ethereum الخاص بك',
			BCH: 'عنوان استلام  Bitcoin Cash الخاص بك',
		},
		INCREASE_LIMIT: 'هل تريد زيادة الحد اليومي الخاص بك؟',
		QR_CODE:
			'يمكن فحص رمز الاستجابة السريعة(QR Code)  هذا بواسطة الشخص الذي يريد إرسال الأموال إليك',
		NO_DATA: 'لا توجد معلومات متاحة',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {الحد الأقصى للإيداع اليومي}:  1 -> {1,000} 2 -> {Currency} 3 -> {(تريد زيادة الحد اليومي الخاص بك؟)}
	},
	LOGIN: {
		LOGIN_TO: 'تسجيل الدخول إلى {0}',
		CANT_LOGIN: 'لا تستطيع تسجيل الدخول؟',
		NO_ACCOUNT: 'ليس لديك حساب؟',
		CREATE_ACCOUNT: 'قم بإنشاء واحد هنا',
		HELP: 'مساعدة',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'البريد الإلكتروني',
		EMAIL_PLACEHOLDER: 'اكتب البريد الالكتروني الخاص بك',
		PASSWORD_LABEL: 'كلمه السر',
		PASSWORD_PLACEHOLDER: 'اكتب كلمة المرور الخاصة بك',
		PASSWORD_REPEAT_LABEL: 'أعد كتابة كلمة المرور الخاصة بك',
		PASSWORD_REPEAT_PLACEHOLDER: 'أعد كتابة كلمة المرور الخاصة بك',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'أدخل رمز السري المتغير لتسجيل الدخول',
		CAPTCHA: 'فترة منتهية. يرجى تحديث الصفحة',
		FROZEN_ACCOUNT: 'تم تجميد هذا الحساب',
		INVALID_EMAIL: 'عنوان البريد الإلكتروني غير صالح',
		TYPE_EMAIL: 'اكتب بريدك الإلكتروني',
		REQUIRED: 'یرجي إدخال ألبريد ألإلكتروني الخاص بك',
		INVALID_DATE: 'تاريخ غير صالح',
		INVALID_PASSWORD:
			'رمز مرور خاطئ. يجب أن يحتوي على 8 أحرف على الأقل ، و رقم واحد في كلمة المرور ، و حرف خاص.',
		INVALID_PASSWORD_2:
			'رمز مرور خاطئ. يجب أن يحتوي على 8 أحرف على الأقل ، و علي الأقل رقم واحد في كلمة المرور ، و حرف خاص.',
		INVALID_CURRENCY: 'عنوان {0} غير صالح ({1})',
		INVALID_BALANCE: 'رصيد الموجود غير كافٍ ({0}) لإجراء العملية ({1}).',
		MIN_VALUE: 'يجب أن تكون القيمة {0} أو أعلى.',
		MAX_VALUE: 'يجب أن تكون القيمة {0} أو أقل.',
		MIN_VALUE_NE: 'يجب أن تكون القيمة أكبر من {0}.',
		MAX_VALUE_NE: 'يجب أن تكون القيمة أقل من {0}.',
		INSUFFICIENT_BALANCE: 'رصيد غير كاف',
		PASSWORDS_DONT_MATCH: 'كلمة المرور غير متطابقة',
		USER_EXIST: 'هذا البريد الإلكتروني مسجل من سابق',
		ACCEPT_TERMS: 'لم توافق على شروط الاستخدام وسياسة الخصوصية',
		STEP: 'قيمة غير صحيحة ، الخطوة هي {0}',
		ONLY_NUMBERS: 'قيمة غير صحيحة ، الخطوة هي {0}',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'سياسة الخصوصية',
			SUBTITLE:
				'تم التحديث الأخير في 1 أبريل 2019. يستبدل الإصدار السابق بالكامل.',
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
			OKAY: 'حسنا',
			START_TRADING: 'إبدأ بالتداول',
			SEE_HISTORY: 'مشاهدة السجل',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} تم استلام الإيداع',
			TITLE_INCOMING: 'واردة {0}',
			SUBTITLE_RECEIVED: 'لقد تلقيت إيداعك بقيمة {0}',
			SUBTITLE_INCOMING: 'لديك {0} واردة',
			INFORMATION_PENDING_1:
				'يتطلب {0} تصديقاً واحدًا قبل أن تتمكن من بدء التداول.',
			INFORMATION_PENDING_2:
				'قد يستغرق ذلك 10-30 دقيقة. سنرسل بريداً إلكترونياً بمجرد تصديق {0} على البلوك تشين.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: 'تم ارسال الطلب',
		BUTTON_TEXT: 'حسناً',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: 'أدخل رمز المصادقة الخاص بك للمتابعة',
		OTP_LABEL: 'رمز السري المتغير',
		OTP_PLACEHOLDER: 'أدخل رمز المصادقة',
		OTP_TITLE: 'رمز المصدق',
		OTP_HELP: 'مساعدة',
		OTP_BUTTON: 'إرسال',
		ERROR_INVALID: 'رمز السري المتغير غير صالح',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'التداول السريع',
		TOTAL_COST: 'التكلفة الإجمالية',
		BUTTON: 'إعادة نظر الطلب',
		INPUT: 'من {0} إلى {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: 'الصفحة السابقة',
	NEXT_PAGE: 'الصفحة التالية',
	WALLET: {
		TOTAL_ASSETS: 'جاري تحميل الأصول ...',
		AVAILABLE_WITHDRAWAL: 'إجمالي الأصول',
		AVAILABLE_TRADING: 'متاح للتداول',
		ORDERS_PLURAL: 'الطلبات',
		ORDERS_SINGULAR: 'الطلب',
		HOLD_ORDERS:
			'لديك {0} مفتوحة {1} ، مما أدى إلى إمتلاك {2} {3} في رصيدك بعملة {4}',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'استرجاع الحساب',
		SUBTITLE: `استرجع حسابك أدناه`,
		SUPPORT: 'اتصل بالدعم',
		BUTTON: 'أرسل رابط الاسترداد',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'تم إرسال إعادة تعيين كلمة المرور',
		TEXT:
			'إذا كان هناك حساب لعنوان البريد الإلكتروني ، فقد تم إرسال بريد إلكتروني إليه مع تعليمات إعادة التعيين. يرجى التحقق من بريدك الإلكتروني والنقر فوق الرابط لإكمال إعادة تعيين كلمة المرور الخاصة بك.',
	},
	RESET_PASSWORD: {
		TITLE: 'قم بتعيين كلمة مرور جديدة',
		SUBTITLE: 'قم بتعيين كلمة مرور جديدة',
		BUTTON: 'قم بتعيين كلمة مرور جديدة',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'لقد نجحت في إعداد كلمة مرور جديدة.',
		TEXT_2: 'انقر على تسجيل الدخول أدناه للمتابعة.',
	},
	SIGN_UP: {
		SIGNUP_TO: 'سجل في {0}',
		NO_EMAIL: 'ألم تتلق البريد الإلكتروني؟',
		REQUEST_EMAIL: 'اطلب واحدة أخرى هنا',
		HAVE_ACCOUNT: 'هل لديك حساب؟',
		GOTO_LOGIN: 'اذهب إلى صفحة تسجيل الدخول',
		AFFILIATION_CODE: 'معرف الإحالة (إختياري)', // new
		AFFILIATION_CODE_PLACEHOLDER: 'اكتب معرف الإحالة الخاص بك', //
		TERMS: {
			terms: 'شروط عامة',
			policy: 'سياسة الخصوصية',
			text: 'لقد قرأت وأوافق على {0} و {1}',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'أرسل البريد الإلكتروني',
		TEXT_1:
			'تحقق من بريدك الإلكتروني وانقر على الرابط للتحقق من بريدك الإلكتروني.',
		TEXT_2:
			'إذا ما تلقيت أي تأكيد عبر البريد الإلكتروني وقمت بفحص البريد الغير هام الخاص بك ، فيمكنك محاولة النقر علی إعادة الإرسال أدناه.',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'إعادة إرسال طلب البريد الإلكتروني',
		BUTTON: 'طلب بريد إلكتروني',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'إعادة إرسال البريد الإلكتروني',
		TEXT_1:
			'إذا لم تتلق رسالة التحقق من البريد الإلكتروني بعد بضع دقائق ، فيرجى الاتصال بنا أدناه.',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'الرمز غير صحيح',
		TEXT_1: 'لقد نجحت في التحقق من بريدك الإلكتروني.',
		TEXT_2: 'يمكنك الآن متابعة تسجيل الدخول',
	},
	USER_VERIFICATION: {
		INFO_TXT: 'هنا يمكنك مراقبة سيرك نحو التحقق وترقيات الحساب.',
		INFO_TXT_1:
			'يرجى تقديم المعلومات ذات الصلة المطلوبة لكل قسم أدناه. فقط عند اكتمال عمليات الإرسال لجميع الأقسام ، ستتم مراجعة معلوماتك والموافقة عليها لترقية الحساب.',
		INFO_TXT_2: 'يتطلب التحقق لقسم الهوية منك {0} مستندات معينة.',
		DOCUMENTATIONS: 'تحمیل',
		COMPLETED: 'منجز',
		PENDING_VERIFICATION: 'في انتظار التحقق',
		TITLE_EMAIL: 'االبريد الإلكتروني',
		MY_EMAIL: 'بريدي الالكتروني',
		MAKE_FIRST_DEPOSIT: 'قم بعمل أول إيداع', // new
		OBTAIN_XHT: 'احصل على عملة XHT', // new
		TITLE_USER_DOCUMENTATION: 'تطابق',
		TITLE_ID_DOCUMENTS: 'تحميل',
		TITLE_BANK_ACCOUNT: 'حساب البنك',
		TITLE_MOBILE_PHONE: 'الهاتف المحول',
		TITLE_PERSONAL_INFORMATION: 'الهاتف المحول',
		VERIFY_EMAIL: 'التحقق من البريد الإلكتروني',
		VERIFY_MOBILE_PHONE: 'تحقق من الهاتف المحمول',
		VERIFY_USER_DOCUMENTATION: 'تحقق من وثائق المستخدم',
		VERIFY_ID_DOCUMENTS: 'تحقق من وثائق الهوية',
		VERIFY_BANK_ACCOUNT: 'تحقق من الحساب المصرفي',
		BUTTON: 'إرسال طلب التحقق',
		TITLE_IDENTITY: 'هوية',
		TITLE_MOBILE: 'الهاتف المحمول',
		TITLE_MOBILE_HEADER: ' رقم الهاتف المحمول',
		TITLE_BANK: 'بنك',
		TITLE_BANK_HEADER: 'التفاصيل المصرفية',
		CHANGE_VALUE: 'تغيير القيمة',
		PENDING_VERIFICATION_PERSONAL_INFORMATION: 'تتم معالجة معلوماتك الشخصية',
		PENDING_VERIFICATION_BANK: 'يتم التحقق من التفاصيل المصرفية الخاصة بك',
		PENDING_VERIFICATION_DOCUMENTS: 'يتم التحقق من المستندات الخاصة بك',
		GOTO_VERIFICATION: 'إذهب إلى التحقق',
		GOTO_WALLET: 'اذهب إلى المحفظة', // new
		CONNECT_BANK_ACCOUNT: 'اتصال الحساب المصرفي',
		ACTIVATE_2FA: 'تفعيل توثيق ذو عاملين',
		INCOMPLETED: 'غير مكتمل',
		BANK_VERIFICATION: 'التحقق من البنك',
		IDENTITY_VERIFICATION: 'التحقق من الهوية',
		PHONE_VERIFICATION: 'التحقق من الهاتف',
		DOCUMENT_VERIFICATION: 'التحقق من الوثيقة',
		START_BANK_VERIFICATION: 'بدء التحقق من البنك',
		START_IDENTITY_VERIFICATION: 'ابدأ التحقق من الهوية',
		START_PHONE_VERIFICATION: 'ابدأ التحقق من الهاتف',
		START_DOCUMENTATION_SUBMISSION: 'بدء تقديم الوثائق',
		GO_BACK: 'إرجع',
		BANK_VERIFICATION_TEXT_1:
			'يمكنك إضافة ما يصل إلى 3 حسابات بنكية. لإستخدام الحسابات المصرفية الدولية ، سيُطلب منك الاتصال بدعم العملاء وسيكون لديك حدود سحب محدودة.',
		BANK_VERIFICATION_TEXT_2:
			'من خلال التحقق من حسابك المصرفي ، يمكنك الحصول على ما يلي:',
		BASE_WITHDRAWAL: 'سحب نقدي(فیات)',
		BASE_DEPOSITS: 'الودائع النقدية(فیات)',
		ADD_ANOTHER_BANK_ACCOUNT: 'Add Another Bank Account', // ماذاهذا
		BANK_NAME: 'اسم البنك',
		ACCOUNT_NUMBER: 'رقم الحساب',
		CARD_NUMBER: 'رقم البطاقة',
		BANK_VERIFICATION_HELP_TEXT:
			'من أجل التحقق لهذا القسم، يجب عليك إكمال قسم {0}.',
		DOCUMENT_SUBMISSION: 'تقديم الوثائق',
		REVIEW_IDENTITY_VERIFICATION: 'مراجعة التحقق من الهوية',
		PHONE_DETAILS: 'تفاصيل الهاتف',
		PHONE_COUNTRY_ORIGIN: 'بلد منشأ الهاتف',
		MOBILE_NUMBER: 'رقم الهاتف المحمول',
		DOCUMENT_PROOF_SUBMISSION: 'تقديم إثبات الوثائق',
		START_DOCUMENTATION_RESUBMISSION: 'بدء إعادة تقديم الوثائق',
		SUBMISSION_PENDING_TXT:
			'تم تقديم هذا القسم سابقاً. إجراء التغييرات وإعادة التقديم،سيؤدي إلى تغيير معلوماتك السابقة.',
		CUSTOMER_SUPPORT_MESSAGE: 'رسالة دعم العملاء',
		DOCUMENT_PENDING_NOTE:
			'يتم تقديم المستندات الخاصة بك وهي قيد المراجعة. يرجى التحلي بالصبر.',
		DOCUMENT_VERIFIED_NOTE: 'لقد تم تقديم المستندات الخاصة بك.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: 'ملاحظة من قسم التحقق',
		CODE_EXPIRES_IN: 'تنتهي صلاحية الرمز في',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'الاسم الاول',
				FIRST_NAME_PLACEHOLDER:
					'اكتب اسمك الأول كما يظهر في وثيقة الهوية الخاصة بك',
				LAST_NAME_LABEL: 'اسم العائلة',
				LAST_NAME_PLACEHOLDER:
					'اكتب اسمك عائلتك كما يظهر في وثيقة الهوية الخاصة بك.',
				FULL_NAME_LABEL: 'اسمك الكامل',
				FULL_NAME_PLACEHOLDER:
					'اكتب اسمك بالكامل كما يظهر في وثيقة الهوية الخاصة بك',
				GENDER_LABEL: 'الجنس',
				GENDER_PLACEHOLDER: 'اكتب ما هو جنسك',
				GENDER_OPTIONS: {
					MAN: 'ذكر',
					WOMAN: 'أنثى',
				},
				NATIONALITY_LABEL: 'الجنسية',
				NATIONALITY_PLACEHOLDER: 'اكتب ما هي جنسيتك في وثيقة الهوية الخاصة بك',
				DOB_LABEL: 'تاريخ الولادة',
				COUNTRY_LABEL: 'البلد الذي تقيم فيه',
				COUNTRY_PLACEHOLDER: 'حدد البلد الذي تقيم فيه حاليا',
				CITY_LABEL: 'مدينة',
				CITY_PLACEHOLDER: 'اكتب المدينة التي تعيش فيها',
				ADDRESS_LABEL: 'عنوان',
				ADDRESS_PLACEHOLDER: 'اكتب العنوان الذي تعيش فيه حاليا',
				POSTAL_CODE_LABEL: 'رقم البريد',
				POSTAL_CODE_PLACEHOLDER: 'اكتب رقم البريد الخاص بك',
				PHONE_CODE_LABEL: 'بلد',
				PHONE_CODE_PLACEHOLDER: 'حدد البلد الذي يتصل به هاتفك',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21) 1 -> كوريا الجنوبية
				PHONE_NUMBER_LABEL: 'رقم الهاتف',
				PHONE_NUMBER_PLACEHOLDER: 'اكتب رقم هاتفك',
				CONNECTING_LOADING: 'يتم الاتصال',
				SMS_SEND: 'أرسل رسالة نصية قصيرة',
				SMS_CODE_LABEL: 'رمز الرسالة النصية القصيرة',
				SMS_CODE_PLACEHOLDER: 'أدخل رمز الرسالة القصيرة الخاص بك',
			},
			INFORMATION: {
				TEXT:
					'هام: أدخل اسمك في الفراغ تماماً كما يظهر في وثائق هويتك (الاسم الأول الكامل ، وأي اسم اوسط واسم (أسماء) العائلة بالكامل). هل انتم شرکة ؟ اتصل بدعم العملاء لحساب الشركة.',
				TITLE_PERSONAL_INFORMATION: 'معلومات شخصية',
				TITLE_PHONE: 'هاتف',
				PHONE_VERIFICATION_TXT:
					'سيساعدنا تقديم تفاصيل اتصال صالحة بشكل كبير في حل النزاعات مع منع المعاملات الغير مرغوب فيها على حسابك.',
				PHONE_VERIFICATION_TXT_1:
					'تلقي تحديثات فورية لعمليات الإيداع والسحب من خلال مشاركة رقم هاتفك المحمول.',
				PHONE_VERIFICATION_TXT_2:
					'قم بإثبات هويتك وعنوانك من خلال مشاركة رقم هاتف LAN الخاص بك (اختياري).',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'الرجاء تحديد نوع وثيقة الهوية',
				ID_NUMBER: 'الرجاء كتابة رقم الوثائق الخاصة بك',
				ISSUED_DATE: 'الرجاء تحديد تاريخ إصدار الوثيقة الخاصة بك',
				EXPIRATION_DATE:
					'يرجى تحديد التاريخ الذي تنتهي فيه صلاحية الوثيقة الخاصة بك.',
				FRONT: 'يرجى تحميل نسخة من جواز سفرك',
				PROOF_OF_RESIDENCY:
					'يرجى تحميل نسخة ممسوحة ضوئيًا من الوثيقة الذي تثبت عنوان الذي تقيم فيه حاليًا',
				SELFIE_PHOTO_ID: 'يرجى تحميل صورة شخصية مع جواز السفر والملاحظة',
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'نوع وثيقة الهوية',
				TYPE_PLACEHOLDER: 'حدد نوع وثيقة الهوية',
				TYPE_OPTIONS: {
					ID: 'هویة',
					PASSPORT: 'جواز سفر',
				},
				ID_NUMBER_LABEL: 'رقم جواز السفر',
				ID_NUMBER_PLACEHOLDER: 'اكتب رقم جواز سفرك',
				ID_PASSPORT_NUMBER_LABEL: 'رقم جواز السفر',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'اكتب رقم جواز سفرك',
				ISSUED_DATE_LABEL: 'تاريخ اصدار جواز السفر',
				EXPIRATION_DATE_LABEL: 'تاريخ انتهاء الجواز',
				FRONT_LABEL: 'جواز سفر',
				FRONT_PLACEHOLDER: 'أضف نسخة من جواز سفرك',
				BACK_LABEL: 'الجانب الخلفي من جواز السفر',
				BACK_PLACEHOLDER:
					'أضف نسخة من ظهر الهوية الخاصة بك (إذا كان قابلاً للتطبيق)',
				PASSPORT_LABEL: 'وثيقة جواز السفر',
				PASSPORT_PLACEHOLDER: 'أضف نسخة من جواز سفر الخاص بك',
				POR_LABEL: 'وثيقة تثبت عنوانك',
				POR_PLACEHOLDER: 'أضف نسخة من وثيقة تثبت عنوانك',
				SELFIE_PHOTO_ID_LABEL: 'صورتك الشخصية مع جواز السفر والملاحظة',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'أضف نسخة من صورتك الشخصية مع جواز السفر والملاحظة',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'وثيقة الهوية',
				PROOF_OF_RESIDENCY: 'اثبات الإقامة',
				ID_SECTION: {
					TITLE: 'يرجى التأكد من أن الوثائق التي قدمتها هي:',
					LIST_ITEM_1:
						'جودة عالية (صور ملونة ، دقة 300 نقطة في البوصة أو أعلى).',
					LIST_ITEM_2: 'مرئية بالكامل (العلامات المائية مسموح بها).',
					LIST_ITEM_3: 'صالح ، مع تاريخ انتهاء الصلاحية واضح بالكامل.',
					WARNING_1:
						'يتم قبول جواز سفرصالح فقط ؛ تُقبل الصور عالية الجودة أو الصور الممسوحة ضوئيًا لهذه الوثائق:',
					WARNING_2:
						'تأكد من أنك تقوم بتحميل المستندات الخاصة بك. أي استخدام لوثائق خاطئة أو مزيفة سيكون له عواقب قانونية ويؤدي إلى تجميد حسابك على الفور.',
					WARNING_3: 'يرجى عدم تقديم جواز السفر كإثبات على إقامتك.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'لتجنب التأخير عند التحقق من حسابك ، يرجى التأكد من:',
					SECTION_1_TEXT_2:
						'يمكنك رؤية اسمك وعنوانك وتاريخ الإصدار والمُصدر بوضوح.',
					SECTION_1_TEXT_3:
						'وثيقة إثبات الإقامة المقدمة ليست أقدم من ثلاثة أشهر.',
					SECTION_1_TEXT_4:
						'ارسل صور فوتوغرافية ملونة أو صور ممسوحة ضوئيًا بجودة عالية (300 نقطة في البوصة على الأقل)',
					SECTION_2_TITLE: 'إثبات الإقامة المقبول هو:',
					SECTION_2_LIST_ITEM_1: 'كشف حساب بنكي.',
					SECTION_2_LIST_ITEM_2: 'فاتورة خدمات (كهرباء ، مياه ، انترنت).',
					SECTION_2_LIST_ITEM_3:
						'وثيقة صادرة عن الحكومة (الإقرار الضريبي ، شهادة إقامة).',
					WARNING:
						'لا يمكننا قبول العنوان الموجود في وثيقة الهوية الخاصة بك كإثبات صالح على الإقامة.', //IN PERSIAN ?
				},
				SELFIE: {
					TITLE: 'صورة شخصية مع جواز السفر والملاحظة',
					INFO_TEXT:
						'يرجى تقديم صورة لك وأنت تحمل جواز سفرك. في نفس الصورة مع إشارة إلى عنوان URL البورصة ، تاريخ اليوم وتوقيعك معروض. تأكد من أن وجهك مرئي بوضوح وأن تفاصيل الهوية الخاصة بك قابلة للقرائة.',
					REQUIRED: 'مطلوب:',
					INSTRUCTION_1: 'وجهك مرئي بوضوح',
					INSTRUCTION_2: 'جواز السفر قابل للقرائة بوضوح',
					INSTRUCTION_3: 'اكتب اسم البورصة',
					INSTRUCTION_4: 'اكتب تاريخ اليوم',
					INSTRUCTION_5: 'اكتب توقيعك',
					WARNING:
						'سيتم رفض الصورة الشخصية بجواز سفر مختلف عن المحتوى الذي تم تحميله',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'الرجاء كتابة اسمك الأول والأخير كما هو مترابط بحسابك المصرفي',
				ACCOUNT_NUMBER: 'يجب أن يكون رقم حسابك المصرفي أقل من 50 رقمًا',
				ACCOUNT_NUMBER_MAX_LENGTH: 'حد رقم حسابك المصرفي هو 50 حرفًا',
				CARD_NUMBER: 'شكل رقم حسابك غير صحيح ',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'اسم البنك',
				BANK_NAME_PLACEHOLDER: 'اكتب اسم البنك الذي تتعامل معه',
				ACCOUNT_NUMBER_LABEL: 'رقم الحساب المصرفي',
				ACCOUNT_NUMBER_PLACEHOLDER: 'اكتب رقم حسابك المصرفي',
				ACCOUNT_OWNER_LABEL: 'اسم صاحب الحساب المصرفي',
				ACCOUNT_OWNER_PLACEHOLDER: 'اكتب الاسم كما هو موجود في حسابك المصرفي',
				CARD_NUMBER_LABEL: 'رقم البطاقة المصرفية',
				CARD_NUMBER_PLACEHOLDER:
					'اكتب الرقم المكون من 16 رقمًا الموجود في مقدمة بطاقتك المصرفية',
			},
		},
		WARNING: {
			TEXT_1: 'من خلال التحقق من هويتك يمكنك الحصول على ما يلي:',
			LIST_ITEM_1: 'زيادة حدود السحب',
			LIST_ITEM_2: 'زيادة حدود الودائع',
			LIST_ITEM_3: 'رسوم أقل',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			'قم بتغيير إعدادات حسابك. من واجهة المستخدم والإشعارات واسم المستخدم والتخصيصات الأخرى.',
		TITLE_TEXT_2: 'سيؤدي حفظ الإعدادات إلى تطبيق التغييرات وحفظها.',
		TITLE_NOTIFICATION: 'إشعارات',
		TITLE_INTERFACE: 'إشعارات',
		TITLE_LANGUAGE: 'لغة',
		TITLE_CHAT: 'محادثة',
		TITLE_AUDIO_CUE: 'شغل إشاره الصوت',
		TITLE_MANAGE_RISK: 'إدارة المخاطر',
		ORDERBOOK_LEVEL: 'مستويات دفتر الطلبات (20 بحد أقصى)',
		SET_TXT: 'مجموعة',
		CREATE_ORDER_WARING: 'إنشاء أمر تحذير',
		RISKY_TRADE_DETECTED: 'کشف تداول محفوظ بالخطر',
		RISKY_WARNING_TEXT_1:
			'تتجاوز قيمة هذا الطلب مبلغ الحد المخصص للطلب الذي عينته {0}.',
		RISKY_WARNING_TEXT_2: '({0} من المحفظة)',
		RISKY_WARNING_TEXT_3:
			'يرجى التحقق والتأكد من أنك تريد حقًا إجراء هذا التداول.',
		GO_TO_RISK_MANAGMENT: 'اذهب إلى إدارة المخاطر',
		CREATE_ORDER_WARING_TEXT:
			'أنشئ تحذيراً منبثقًا عندما يستخدم طلب التداول الخاص بك أكثر من {0} من محفظتك.',
		ORDER_PORTFOLIO_LABEL: 'نسبة المحفظة مبلغ:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'النوافذ المنبثقة للتداول',
			POPUP_ORDER_CONFIRMATION: 'اطلب التأكيد قبل تقديم الطلبات',
			POPUP_ORDER_COMPLETED: 'أظهر نافذة منبثقة عند اكتمال الطلب',
			POPUP_ORDER_PARTIALLY_FILLED: 'أظهر نافذة منبثقة عند تنفيذ الطلب جزئيًا',
		},
		AUDIO_CUE_FORM: {
			// new
			ALL_AUDIO: 'جميع إشارات الصوت',
			PUBLIC_TRADE_AUDIO: 'عند إتمام إجراء تداول عام',
			ORDERS_PARTIAL_AUDIO: 'عندما يتم تنفيذ أحد طلباتك جزئيًا',
			ORDERS_PLACED_AUDIO: 'عندما يتم وضع طلب',
			ORDERS_CANCELED_AUDIO: 'عندما يتم إلغاء الطلب',
			ORDERS_COMPLETED_AUDIO: 'عندما يتم تنفيذ أحد طلباتك بالكامل',
			CLICK_AMOUNTS_AUDIO: 'عند النقر على الكميات والأسعار في دفتر الطلبات',
			GET_QUICK_TRADE_AUDIO: 'عند الحصول على عرض أسعار للتداول السريع',
			SUCCESS_QUICK_TRADE_AUDIO: 'عندما يحدث تداول سريع ناجح',
			QUICK_TRADE_TIMEOUT_AUDIO: 'عندما ينفذ وقت التداول السريع',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'قم بإنشاء تحذير منبثق عندما تتجاوز قيمة طلب التداول نسبة مئوية محددة من محفظتك',
			INFO_TEXT_1: 'إجمالي قيمة الأصول بعملة {0}: {1}',
			PORTFOLIO: 'نسبة المحفظة',
			TOMAN_ASSET: 'القيمة التقريبية',
			ADJUST: '(ضبط النسبة المئوية)',
			ACTIVATE_RISK_MANAGMENT: 'تفعيل إدارة المخاطر',
			WARNING_POP_UP: 'النوافذ المنبثقة للتحذير',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'سجل',
		TITLE_TRADES: 'سجل التداولات',
		TITLE_DEPOSITS: 'سجل الودائع',
		TITLE_WITHDRAWALS: 'سجل عمليات السحب',
		TEXT_DOWNLOAD: 'سجل التحميل',
		TRADES: 'التداولات',
		DEPOSITS: 'الودائع',
		WITHDRAWAL: 'عمليات السحب',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'اضبط إعدادات الأمان لحسابك. من المصادقة ذات العاملين ، وكلمة المرور ، ومفاتيح واجهة برمجة التطبيقات (API)، والوظائف الأخرى المتعلقة بالأمان.',
		OTP: {
			TITLE: 'المصادقة ذات العاملين',
			OTP_ENABLED: 'تمكين رقم السري المتغير',
			OTP_DISABLED: 'يرجى تشغيل المصادقة ذات العاملين',
			ENABLED_TEXTS: {
				TEXT_1: 'طلب رقم السري المتغير عند تسجيل الدخول',
				TEXT_2: 'طلب رقم السري المتغير عند سحب الأموال',
			},
			DIALOG: {
				SUCCESS: 'لقد قمت بتنشيط  رقم السري المتغير بنجاح',
				REVOKE: 'لقد قمت بإبطال رقم السري المتغير الخاص بك بنجاح',
			},
			CONTENT: {
				TITLE: 'تنشيط المصادقة ذات العاملين',
				MESSAGE_1: 'مسح ضوئي',
				MESSAGE_2:
					'امسح رمز الاستجابة السريع أدناه باستخدام Google Authenticator أو Authy لإعداد المصادقة ذات العاملين تلقائيًا في جهازك.',
				MESSAGE_3:
					'إذا كنت تواجه مشكلات في مسح هذا ، فيمكنك إدخال الرمز يدويًا أدناه',
				MESSAGE_4:
					'يجب عليك تخزين هذا الرمز بشكل آمن لاستعادة المصادقة ذات العاملين الخاص بك في حالة تغيير هاتفك المحمول أو فقده في المستقبل.',
				MESSAGE_5: 'يدوي',
				WARNING:
					'نوصي بشدة بإعداد المصادقة اذات العاملين(2FA) .سيؤدي القيام بذلك إلى زيادة أمان أموالك بشكل كبير.',

				ENABLE: 'مَكِّن المصادقة الثنائية',
				DISABLE: 'تعطيل المصادقة ذات العاملين',
			},
			FORM: {
				PLACEHOLDER: 'أدخل الرقم السري المتغير المقدم من Google Authenticator.',
				BUTTON: 'تمكين المصادقة ذات العاملين',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'كلمة المرور',
			ACTIVE: 'فعال',
			DIALOG: {
				SUCCESS: 'لقد غيرت كلمة سرك بنجاح',
			},
			FORM: {
				BUTTON: 'تغيير كلمة المرور',
				CURRENT_PASSWORD: {
					label: 'كلمة المرور الحالية',
					placeholder: 'ادخل كلمة مرورك الحالية',
				},
				NEW_PASSWORD: {
					label: 'كلمة المرور الجديدة',
					placeholder: 'اكتب كلمة مرور جديدة',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'تأكيد كلمة المرور الجديدة',
					placeholder: 'أعد كتابة كلمة المرور الجديدة',
				},
			},
		},
		LOGIN: {
			TITLE: 'سجل تسجيل الدخول',
			IP_ADDRESS: 'عنوان IP',
			TIME: 'التاريخ / الوقت',
			CONTENT: {
				TITLE: 'سجل عمليات تسجيل الدخول',
				MESSAGE:
					'يوجد أدناه قائمة محفوظات تسجيل الدخول مع تفاصيل IP والبلد والوقت. إذا رأيت أي عمليات مريبة، يجب عليك تغيير كلمة المرور والاتصال بالدعم',
			},
		},
		FREEZE: {
			TITLE: 'تجميد الحساب',
			CONTENT: {
				MESSAGE_1:
					'سيؤدي تجميد حسابك إلى إيقاف عمليات السحب وإيقاف جميع التداولات.',
				WARNING_1: 'استخدم فقط إذا كنت تخشى أن يتم اختراق حسابك',
				TITLE_1: 'جَمِّد حسابك',
				TITLE_2: 'تجميد الحساب',
				MESSAGE_2:
					'قد يساعد تجميد حسابك في حماية حسابك من الهجمات الإلكترونية.',
				MESSAGE_3: 'سيحدث ما يلي إذا اخترت تجميد حسابك:',
				MESSAGE_4: '1. سيتم إلغاء عمليات السحب التي في قيد الانتظار.',
				MESSAGE_5: '2. سيتم إيقاف جميع التداولات وإلغاء الطلبات الغير منفذة.',
				MESSAGE_6: '3. يلزم الاتصال بالدعم لإعادة تنشيط حسابك.',
				WARNING_2: 'هل تريد حقًا تجميد حسابك؟',
			},
		},
	},
	CURRENCY: 'عملة',
	TYPE: 'نوع',
	TYPES_VALUES: {
		market: 'سوق',
		limit: 'حد',
	},
	TYPES: [
		{ value: 'market', label: 'سوق' },
		{ value: 'limit', label: 'حد' },
	],
	SIDE: 'جانب',
	SIDES_VALUES: {
		buy: 'الشراء',
		sell: 'بيع',
	},
	SIDES_VERBS: {
		buy: 'تم الشراء',
		sell: 'تم البيع',
	},
	SIDES: [
		{ value: 'buy', label: 'الشراء' },
		{ value: 'sell', label: 'بيع' },
	], // DO NOT CHANGE value, ONLY TRANSLATE label
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'تشغيل' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: false, label: ' إيقاف' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIZE: 'حجم',
	PRICE: 'السعر',
	FEE: 'مصاريف',
	FEES: 'مصاريف',
	LIMIT: 'حد',
	TIME: 'وقت',
	TIMESTAMP: 'الطابع الزمني',
	MORE: 'أكثر',
	VIEW: 'رؤية',
	STATUS: 'حالة',
	AMOUNT: 'كمية',
	COMPLETE: 'كامل',
	PENDING: 'قيد الانتظار',
	REJECTED: 'مرفوض',
	ORDERBOOK: 'دفتر الطلبات',
	CANCEL: 'إلغاء',
	CANCEL_ALL: 'إلغاء الكل',
	GO_TRADE_HISTORY: 'إذهب الى سجل التداولات',
	ORDER_ENTRY: 'ادخال الطلبية',
	TRADE_HISTORY: 'history',
	CHART: 'price chart',
	ORDERS: 'my active orders',
	TRADES: 'my transaction history',
	RECENT_TRADES: 'my recent trades', // ToDo
	ORDER_HISTORY: 'Order history',
	PUBLIC_SALES: 'المبيعات العامة',
	REMAINING: 'متبقي',
	FULLFILLED: '{0}٪ مكتمل',
	FILLED: 'مكتمل',
	LOWEST_PRICE: 'أقل سعر ({0})',
	PHASE: 'مرحلة',
	INCOMING: 'واردة',
	PRICE_CURRENCY: 'السعر',
	AMOUNT_SYMBOL: 'المبلغ',
	MARKET_PRICE: 'سعر السوق',
	ORDER_PRICE: 'سعر الطلب',
	TOTAL_ORDER: 'الطلب الكلي',
	NO_DATA: 'لايوجد بيانات',
	LOADING: 'جاري التحميل',
	CHART_TEXTS: {
		d: 'تاريخ',
		o: 'فتح',
		h: 'قمة',
		l: 'القعر',
		c: 'إغلاق',
		v: 'الحجم',
	},
	QUICK_TRADE: 'تداول سريع',
	PRO_TRADE: 'تداول مهني',
	ADMIN_DASH: 'صفحة الإدارة',
	WALLET_TITLE: 'محفظة',
	TRADING_MODE_TITLE: 'حالة التداول',
	TRADING_TITLE: 'تداول',
	LOGOUT: 'تسجيل الخروج',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'المعاملة صغيرة جدًا بحيث غير قابلة للإرسال. جرب كمية أكبر.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'المعاملة كبيرة جدًا بحيث غير قابلة للإرسال. جرب كمية أقل.',
	WITHDRAWALS_LOWER_BALANCE:
		'ليس لديك ما يكفي من {0} في رصيدك لإرسال هذه المعاملة.',
	WITHDRAWALS_FEE_TOO_LARGE: 'الرسوم أكثر من {0}٪ من إجمالي معاملتك.',

	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'عنوان البتكوين غير صالح. يرجى التحقق بعناية وإعادة الإدخال',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'آعنوان الايثيريوم غير صالح. يرجى التحقق بعناية وإعادة الإدخال',
	WITHDRAWALS_BUTTON_TEXT: 'مراجعة عمليات السحب',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'عنوان الوجهة',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'اكتب العنوان',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'ملصق الوجهة (اختياري)', // new
	WITHDRAWALS_FORM_MEMO_LABEL: 'مذكرة (اختياري)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'اكتب ملصق الوجهة', // new
	WITHDRAWALS_FORM_MEMO_PLACEHOLDER: 'اكتب مذكرة المعاملة', // new
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} المبلغ المراد سحبه',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER: 'اكتب مبلغ {0} الذي ترغب في سحبه',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'رسوم عملیات التحويل',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'رسوم السحب من البنك',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'اكتب مبلغ {0} الذي ترغب في استخدامه في رسوم المعاملة',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'الرسوم الأمثل: {0} {1}', // TODO {0} -> amount {1} -> currency name
	DEPOSITS_FORM_AMOUNT_LABEL: '{0} المبلغ المراد إيداعه',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER: 'اكتب مبلغ {0} الذي ترغب في سحبه',
	DEPOSITS_BUTTON_TEXT: 'مراجعة الإيداع',
	DEPOSIT_PROCEED_PAYMENT: 'إدفع',
	DEPOSIT_BANK_REFERENCE:
		'أضف هذا الرمز "{0}" إلى المعاملة المصرفية لتحديد الإيداع',
	DEPOSIT_METHOD: 'طريقة الدفع', //{} IS MISSED
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'بطاقة ائتمان',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1:
		'انتقل إلى طريقة الدفع ببطاقة الائتمان.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2: 'سوف تغادر المنصة لإجراء الدفع.',
	DEPOSIT_VERIFICATION_WAITING_TITLE: 'التحقق من الدفع',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'الرجاء عدم إغلاق التطبيق أثناء التحقق من الدفع',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'إذا حدث خطأ ما في عملية التحقق ، يرجى الاتصال بنا.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'هذا هو معرف العملية: "{0}" ، يرجى تزويدنا بهذا المعرف لمساعدتك.',
	DEPOSIT_VERIFICATION_SUCCESS: 'تم التحقق من الدفع',
	DEPOSIT_VERIFICATION_ERROR: 'كان هناك خطأ في التحقق من الإيداع.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: 'تم التحقق من الإيداع سابقاً',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'حالة غير صالحة',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'البطاقة التي قمت بالإيداع معها ليست مماثلة لبطاقتك المسجلة. لذلك تم رفض إيداعك وسيتم استرداد أموالك في أقل من ساعة.',
	QUOTE_MESSAGE: 'أنت ذاهب إلى {0} {1} {2} مقابل {3} {4}',
	QUOTE_BUTTON: 'قبول',
	QUOTE_REVIEW: 'مراجعة',
	QUOTE_COUNTDOWN_MESSAGE: 'لديك {0} ثواني لإجراء التداول',
	QUOTE_EXPIRED_TOKEN: 'انتهت صلاحية رمز عرض السعر',
	QUOTE_SUCCESS_REVIEW_TITLE: 'التداول السريع',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'لقد نجحت في {0} {1} {2} لـ {3} {4}', // you have successfully buy 1 btc from x toman
	COUNTDOWN_ERROR_MESSAGE: 'انتهى العد التنازلي',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'البنك المراد السحب إليه',
		MESSAGE_ABOUT_SEND: 'أنت على وشك الإرسال',
		MESSAGE_BTC_WARNING:
			'الرجاء التأكد من دقة هذا العنوان نظراً لأن عمليات نقل {0} لا رجعة فيها',
		MESSAGE_ABOUT_WITHDRAW: 'أنت على وشك التحويل إلى حسابك المصرفي',
		MESSAGE_FEE: 'يشمل رسوم المعاملات {0} ({1})',
		MESSAGE_FEE_BASE: 'يشمل رسوم المعاملات {0}',
		BASE_MESSAGE_1:
			'يمكنك فقط السحب إلى حساب مصرفي باسم يطابق الاسم المسجل في حسابك.',
		BASE_MESSAGE_2: 'الحد الأدنى للسحب',
		BASE_MESSAGE_3: 'الحد الأقصى للسحب اليومي',
		BASE_INCREASE_LIMIT: 'زوّد الحد اليومي الخاص بك',
		CONFIRM_VIA_EMAIL: 'أكد عبر البريد الإلكتروني',
		CONFIRM_VIA_EMAIL_1: 'لقد أرسلنا لك رسالة تأكيد بالبريد الإلكتروني للسحب.',
		CONFIRM_VIA_EMAIL_2: 'من أجل استكمال عملية السحب يرجى التأكيد',
		CONFIRM_VIA_EMAIL_3: 'السحب عبر بريدك الإلكتروني في غضون 5 دقائق.',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'تم تأكيد طلب السحب الخاص بك. سيتم معالجتها قريبا.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'لعرض حالة السحب الخاصة بك ، يرجى زيارة صفحة سجل السحب الخاصة بك.',
		GO_WITHDRAWAL_HISTORY: 'اذهب إلى تاريخ الانسحاب',
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'الوديعة',
	WALLET_BUTTON_BASE_WITHDRAW: 'سحب',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'تلقى',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'أرسل',
	AVAILABLE_TEXT: 'متاح',
	AVAILABLE_BALANCE_TEXT: 'الرصيد {0} المتاح: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'رصيد حساب',
	CURRENCY_BALANCE_TEXT: 'رصيد {0} ',
	WALLET_TABLE_AMOUNT_IN: `المبلغ بـ {0}`,
	WALLET_TABLE_TOTAL: 'المجموع الكلي',
	WALLET_ALL_ASSETS: 'جميع الأصول',
	WALLET_DEPOSIT_USD:
		'للإيداع / السحب بالعملة الورقية في بلدان مختلفة واستفسارات أخرى عن المحفظة {0}.', // new
	WALLET_HIDE_ZERO_BALANCE: 'إخفاء الرصيد الصفري',
	WALLET_ESTIMATED_TOTAL_BALANCE: 'إجمالي الرصيد المقدر',
	WALLET_ASSETS_SEARCH_TXT: 'بحث',
	HIDE_TEXT: 'إخفاء',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'البائعين',
	ORDERBOOK_BUYERS: 'المشترين',
	ORDERBOOK_SPREAD: 'الفارغ {0}',
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'أقصى',
	DATEFIELD_TOOGLE_DATE_GR: 'التقويم الميلادي',
	VERIFICATION_WARNING_TITLE: 'التحقق من التفاصيل المصرفية الخاصة بك',
	VERIFICATION_WARNING_MESSAGE:
		'قبل أن تقوم بالسحب ، تحتاج إلى التحقق من التفاصيل المصرفية الخاصة بك.',
	ORDER_SPENT: 'اُنفِقَ',
	ORDER_RECEIVED: 'مستلم',
	ORDER_SOLD: 'تم البيع',
	ORDER_BOUGHT: 'تم الشراء',
	ORDER_AVERAGE_PRICE: 'تم الشراء',
	ORDER_TITLE_CREATED: 'تم بنجاح إنشاء حد {0}',
	ORDER_TITLE_FULLY_FILLED: 'تم تنفيذ طلب {0} بنجاح',
	ORDER_TITLE_PARTIALLY_FILLED: 'اُنفِذَ طلب {0} جزئيًا',
	ORDER_TITLE_TRADE_COMPLETE: 'طلب {0} {1} كان ناجحًا',
	LOGOUT_TITLE: 'لقد تم تسجيل خروجك',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'انتهت صلاحية الرمز',
	LOGOUT_ERROR_LOGIN_AGAIN: 'تسجيل الدخول مرة أخرى',
	LOGOUT_ERROR_INVALID_TOKEN: 'رمز غير صالح',
	LOGOUT_ERROR_INACTIVE: 'لقد تم تسجيل خروجك لأنك كنت غير نشط',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	ORDER_ENTRY_ADVANCED: 'Advanced',
	QUICK_TRADE_OUT_OF_LIMITS: 'حجم الطلب خارج الحدود',
	QUICK_TRADE_TOKEN_USED: 'الرمز مستخدم سابقاً',
	QUICK_TRADE_QUOTE_EXPIRED: 'انتهت صلاحية عرض الاسعار',
	QUICK_TRADE_QUOTE_INVALID: 'العرض سعر غيرصالح',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'خطأ في حساب عرض السعر',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED: 'لا يمكن تنفيذ الطلب بالحجم الحالي',
	QUICK_TRADE_ORDER_NOT_FILLED: 'لم يتم تنفيذ الطلب',
	QUICK_TRADE_NO_BALANCE: 'رصيد غير كافٍ لأداء الطلب',
	QUICK_TRADE_SUCCESS: 'نجاح!',
	QUICK_TRADE_INSUFFICIENT_FUND: 'رصيد غير كاف',
	QUICK_TRADE_INSUFFICIENT_FUND_MESSAGE:
		'ليس لديك أموال كافية في محفظتك لإكمال هذه المعاملة.',
	YES: 'نعم',
	NO: 'لا',
	NEXT: 'التالي',
	SKIP_FOR_NOW: 'تخطي في الوقت الحالي',
	SUBMIT: 'إرسال',
	RESUBMIT: 'إعادة الإرسال',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'مستندات مفقودة!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'للحصول على حق التمكن الكامل إلى وظائف السحب والإيداع ، يجب عليك تقديم مستندات الهوية الخاصة بك على صفحة حسابك.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'نجاح!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'ستتلقى إشعارًا بالبريد الإلكتروني عندما تتم معالجة معلوماتك. يمكن أن تستغرق المعالجة عادةً من يوم إلى ثلاثة أيام.',
	VERIFICATION_NOTIFICATION_BUTTON: 'انتقل الى البورصة',
	ERROR_USER_ALREADY_VERIFIED: 'تم التحقق من المستخدم سابقاً',
	ERROR_INVALID_CARD_USER: 'معلومات البنك أو البطاقة المقدمة غير صحيحة',
	ERROR_INVALID_CARD_NUMBER: 'رقم البطاقة غير صالح',
	ERROR_LOGIN_USER_NOT_VERIFIED: 'لم يتم التحقق من المستخدم',
	ERROR_LOGIN_USER_NOT_ACTIVATED: 'لم يتم تنشيط المستخدم',
	ERROR_LOGIN_INVALID_CREDENTIALS: 'أوراق الاعتماد(الوثائق) غير صحيحة',
	SMS_SENT_TO: 'تم إرسال رسالة قصيرة إلى {0}', // TODO check msg
	SMS_ERROR_SENT_TO:
		'خطأ في إرسال رسالة قصيرة إلى {0}. يرجى تحديث الصفحة وحاول مرة أخرى.', // TODO check msg
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'معرّف المعاملة', // TODO check msg
	CHECK_ORDER: 'تحقق وتأكد من طلبك',
	CHECK_ORDER_TYPE: '{0} {1}', // 0 -> maker/limit  1 -> sell/buy
	CONFIRM_TEXT: 'أيِّد',
	GOTO_XHT_MARKET: 'انتقل إلى سوق عملة XHT', // new
	INVALID_CAPTCHA: 'كلمة التحقق غير صالحة',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL: 'تفضيلات اللغة (تشمل رسائل البريد الإلكتروني)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES, //should not be changed
	SETTINGS_ORDERPOPUP_LABEL: 'عرض نافذة تأكيد الطلب المنبثقة',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'لا' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: true, label: 'نعم' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTINGS_THEME_LABEL: 'شكل واجهة المستخدم', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'أبيض' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'dark', label: 'داكن' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTING_BUTTON: 'حفظ',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'عمليات السحب معطّلة',
	VERIFICATION_NO_WITHDRAW_MESSAGE: 'تم تعطيل حسابك لعمليات السحب',
	UP_TO_MARKET: 'تصل إلى السوق',
	VIEW_MY_FEES: 'عرض الرسوم الخاصة بي', // new
	DEVELOPER_SECTION: {
		TITLE: 'مفتاح واجهة برمجة التطبيقات(API)',
		INFORMATION_TEXT:
			'توفر واجهة برمجة التطبيقات(API) وظائف مثل الحصول على أرصدة المحفظة وإدارة طلبات الشراء / البيع وطلب عمليات السحب بالإضافة إلى بيانات السوق مثل التداولات الأخيرة ودفتر الطلبات والمؤشر.',
		ERROR_INACTIVE_OTP:
			'لإنشاء مفتاح واجهة برمجة التطبيقات (API) ، تحتاج إلى تمكين المصادقة ذات العاملين(2FA).',
		ENABLE_2FA: 'تمكين المصادقة ذات العاملين(2FA)',
		WARNING_TEXT:
			'لا تشارك مفتاح واجهة برمجة التطبيقات (API) الخاص بك مع الآخرين.',
		GENERATE_KEY: 'أنشئ مفتاح (API)',
		ACTIVE: 'نشط',
		INACTIVE: 'غير نشط',
		INVALID_LEVEL:
			'تحتاج إلى ترقية مستوى التحقق لتتمكن من الوصول إلى هذه الميزة', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'أنشئ مفتاح (API)',
		GENERATE_TEXT:
			'يرجى تسمية مفتاح API الخاص بك والحفاظ على خصوصيته بعد إنشائه. لن تتمكن من استعادته مرة أخرى لاحقًا.',
		GENERATE: 'أنشئ',
		DELETE_TITLE: 'حذف مفتاح API',
		DELETE_TEXT:
			'يعد حذف مفتاح API الخاص بك أمراً لا رجوع فيه على الرغم من أنه يمكنك إنشاء مفتاح API جديد في أي وقت. هل تريد حذف مفتاح API الخاص بك؟',
		DELETE: 'حذف',
		FORM_NAME_LABEL: 'اسم',
		FORM_LABLE_PLACEHOLDER: 'اسم مفتاح API',
		API_KEY_LABEL: 'مفتاح API',
		SECRET_KEY_LABEL: 'مفتاح سري',
		CREATED_TITLE: 'انسخ مفتاح API الخاص بك',
		CREATED_TEXT_1:
			'يرجى نسخ مفتاح API الخاص بك لأنه لن يكون من الممكن الوصول إليه في المستقبل.',
		CREATED_TEXT_2: 'حافظ على خصوصية مفتاحك.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'اسم',
		API_KEY: 'مفتاح API',
		SECRET: 'سري',
		CREATED: 'تاريخ الإنشاء',
		REVOKE: 'إبطال',
		REVOKED: 'إنْفَسَخَ',
		REVOKE_TOOLTIP: 'يجب عليك تفعيل المصادقة ذات العاملين(2FA) لإلغاء الرمز', // TODO
	},
	CHAT: {
		CHAT_TEXT: 'محادثة',
		MARKET_CHAT: 'محادثة السوق',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'اقرأ أكثر',
		SHOW_IMAGE: 'إظهار الصورة',
		HIDE_IMAGE: 'إخفاء الصورة',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'رسالة',
		SIGN_UP_CHAT: 'سجّل للدردشة',
		JOIN_CHAT: 'تعيين اسم المستخدم للدردشة',
		TROLLBOX: 'كشك الدردشة ({0})', // new
	},
	INVALID_USERNAME:
		'يجب أن يتراوح اسم المستخدم بين 3 و 15 حرفًا. يحتوي فقط على أحرف صغيرة وأرقام و حرف تسطير سفلي.',
	USERNAME_TAKEN:
		'وقد تم اتخاذ هذا الاسم المستخدم سابقاً. يرجى المحاولة مرة أخرى.',
	USERNAME_LABEL: 'اسم المستخدم (للدردشة)',
	USERNAME_PLACEHOLDER: 'اسم المستخدم',
	TAB_USERNAME: 'اسم المستخدم',
	USERNAME_WARNING:
		'لا يمكن تغيير اسم المستخدم الخاص بك إلا مرة واحدة. يرجى التأكد من أن اسم المستخدم الخاص بك يكون مرغوب فيه.',
	USERNAME_CANNOT_BE_CHANGED: 'لا يمكن تغيير اسم المستخدم',
	UPGRADE_LEVEL: 'ترقية مستوى الحساب',
	LEVELS: {
		LABEL_LEVEL: 'مستوى',
		LABEL_LEVEL_1: 'واحد',
		LABEL_LEVEL_2: 'اثنين',
		LABEL_LEVEL_3: 'ثلاثة',
		LABEL_MAKER_FEE: 'رسوم صانع السوق',
		LABEL_TAKER_FEE: 'رسوم متلقي الطلبات',
		LABEL_BASE_DEPOSIT: 'الإيداع اليومي باليورو',
		LABEL_BASE_WITHDRAWAL: 'سحب يومي من اليورو',
		LABEL_BTC_DEPOSIT: 'إيداع البتكوين اليومي',
		LABEL_BTC_WITHDRAWAL: 'سحب البيتكوين اليومي',
		LABEL_ETH_DEPOSIT: 'إيداع الايثيريوم اليومي',
		LABEL_ETH_WITHDRAWAL: 'سحب الايثيريوم اليومي',
		LABEL_PAIR_MAKER_FEE: 'رسوم صانع السوق {0}',
		LABEL_PAIR_TAKER_FEE: 'رسوم متلقي الطلبات {0}',
		UNLIMITED: 'غير محدود',
		BLOCKED: '0',
	},
	WALLET_ADDRESS_TITLE: 'أنشئ محفظة {0}  ',
	WALLET_ADDRESS_GENERATE: 'أنشئ',
	WALLET_ADDRESS_MESSAGE: 'عندما تنشئ محفظة ، فإنك تنشئ عنوان إيداع وسحب.',
	WALLET_ADDRESS_ERROR:
		'خطأ في إنشاء العنوان ، يرجى التحديث والمحاولة مرة أخرى.',
	DEPOSIT_WITHDRAW: 'إيداع / سحب',
	GENERATE_WALLET: 'أنشئ المحفظة',
	TRADE_TAB_CHART: 'جدول بياني',
	TRADE_TAB_TRADE: 'تداول',
	TRADE_TAB_ORDERS: 'الطلبات',
	TRADE_TAB_POSTS: 'البوستات', // new
	WALLET_TAB_WALLET: 'المحفظة',
	WALLET_TAB_TRANSACTIONS: 'المعاملات',
	RECEIVE_CURRENCY: 'تلقي {0}',
	SEND_CURRENCY: 'إرسال {0}',
	COPY_ADDRESS: 'نسخ العنوان',
	SUCCESFUL_COPY: 'تم النسخ بنجاح!',
	QUICK_TRADE_MODE: 'حالة التداول السريع',
	JUST_NOW: 'الآن',
	PAIR: 'زوج',
	ZERO_ASSET: 'ليس لديك أي أصول',
	DEPOSIT_ASSETS: 'أودع اصولاً',
	SEARCH_TXT: 'بحث',
	SEARCH_ASSETS: 'البحث في الأصول',
	TOTAL_ASSETS_VALUE: 'إجمالي قيمة الأصول بعملة {0}: {1}',
	SUMMARY: {
		TITLE: 'ملخص',
		TINY_PINK_SHRIMP_TRADER: 'متداول الجمبري الوردي الصغير',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'حساب تداول الجمبري الوردي الصغير',
		LITTLE_RED_SNAPPER_TRADER: 'متداول النهّاش الأحمر الصغير',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'حساب تداول النهّاش الأحمر الصغير',
		CUNNING_BLUE_KRAKEN_TRADING: 'متداول كراكن الازرق الماكر',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: 'حساب تداول كراكن الازرق الماكر',
		BLACK_LEVIATHAN_TRADING: 'تداول ليفياثان الأسود',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: 'حساب تداول ليفياثان الأسود',
		URGENT_REQUIREMENTS: 'متطلبات عاجلة',
		TRADING_VOLUME: 'حجم التداول',
		ACCOUNT_ASSETS: 'أصول الحساب',
		ACCOUNT_DETAILS: 'تفاصيل الحساب',
		SHRIMP_ACCOUNT_TXT_1: 'تبدأ رحلتك من هنا!',
		SHRIMP_ACCOUNT_TXT_2:
			'حافظ على صحة السباحة ، ستخرج قريبًا عن بقية المياه الضحلة',
		SNAPPER_ACCOUNT_TXT_1: 'تهانينا على البقاء في مسارك خلال توّرم السوق.',
		SNAPPER_ACCOUNT_TXT_2:
			'تقدم وحارب الموجة للحصول على المزيد من كنوز العملات الرقمية في المستقبل.',
		KRAKEN_ACCOUNT_TXT_1:
			'من المرجح أن تكسر النكات أكثر من الهياكل ، هذه القشريات قد نجت من حصتها من العواصف!',
		LEVIATHAN_ACCOUNT_TXT_1:
			'وحش من الهاوية ، يرى من خلال العملات الرقمية إلى أعماق لا يسبر غورها ، سادة مياه منتصف الليل وموجات المد والجزر.',
		VIEW_FEE_STRUCTURE: 'عرض تركيبة الرسوم وحدودها',
		UPGRADE_ACCOUNT: 'حدّث الحساب',
		ACTIVE_2FA_SECURITY: 'تفعيل أمن ذات العاملين',
		ACCOUNT_ASSETS_TXT_1: 'المعروض هو ملخص لجميع الأصول الخاصة بك.',
		ACCOUNT_ASSETS_TXT_2:
			'امتلاك كميات كبيرة من الأصول سيؤهلك لتحديث الحساب الذي يتضمن شارة فريدة ورسوم تداول أقل.',
		TRADING_VOLUME_TXT_1:
			'يتم عرض سجل حجم التداول الخاص بك بعملة {0} ويتم حسابه اسميًا في نهاية كل شهر من جميع أزواج التداول.',
		TRADING_VOLUME_TXT_2:
			'سيؤهلك نشاط التداول المرتفع لترقية الحساب الذي يمنحك شارة فريدة وامتيازات أخرى.',
		ACCOUNT_DETAILS_TXT_1:
			'يحدد نوع حسابك شارة حسابك ورسوم التداول والودائع وحدود السحب.',
		ACCOUNT_DETAILS_TXT_2:
			'سيحدد عمر حساب التداول الخاص بك ومستوى النشاط ومبلغ أصول الحساب الإجمالي ما إذا كان حسابك مؤهلاً للترقية.',
		ACCOUNT_DETAILS_TXT_3:
			'يتطلب الحفاظ على مستوى حسابك تداولًا مستمرًا والحفاظ على قدر معين من الأصول المودعة.',
		ACCOUNT_DETAILS_TXT_4:
			'سيحدث التخفيض الدوري للحسابات إذا لم يتم الحفاظ على النشاط والأصول.',
		REQUIREMENTS: 'متطلبات',
		ONE_REQUIREMENT: 'متطلب واحد فقط:', // new
		REQUEST_ACCOUNT_UPGRADE: 'طلب ترقية الحساب',
		FEES_AND_LIMIT: 'تركيب الرسوم والحد {0}', // new
		FEES_AND_LIMIT_TXT_1:
			'أن تصبح متداولاً للعملات المشفرة يمثل بداية جديدة. مسلحًا بالذكاء والإرادة والسرعة فقط من خلال المخاطرة والتداول ، سيسمح لك بتحديث حسابك.',
		FEES_AND_LIMIT_TXT_2: 'كل حساب له رسومه الخاصة وحدود الإيداع والسحب.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'مخصص الايداع و السحب',
		TRADING_FEE_STRUCTURE: 'تركيب رسوم التداول',
		WITHDRAWAL: 'سحب',
		DEPOSIT: 'ايداع',
		TAKER: 'متلقي الطلبات',
		MAKER: 'صانع السوق',
		WEBSITE: 'موقع الكتروني',
		VIP_TRADER_ACCOUNT_ELIGIBLITY: 'أهلية ترقية حساب VIP Trader (متداول أعيان)',
		PRO_TRADER_ACCOUNT_ELIGIBLITY: 'أهلية ترقية حساب المتداول المحترف',
		TRADER_ACCOUNT_ELIGIBILITY: 'أهلية ترقية حساب مستوى {0} ',
		NOMINAL_TRADING: 'التداول الاسمي',
		NOMINAL_TRADING_WITH_MONTH: 'يستمر التداول الاسمي لـ {0}',
		ACCOUNT_AGE_OF_MONTHS: 'عمر الحساب {0} شهر',
		TRADING_VOLUME_EQUIVALENT: '{0} {1} ما يعادل حجم التداول',
		LEVEL_OF_ACCOUNT: 'حساب مستوی {0}',
		TITLE_OF_ACCOUNT: '{0} Account', // was not translated
		LEVEL_TXT_DEFAULT: 'أضف وصف مستواك هنا',
		LEVEL_1_TXT:
			'رحلتك تبدأ هنا أيها المتداول عملات المشفرة الشاب! للحصول على المكافآت ، يمكنك التحقق من هويتك وكذلك الحصول على حد إيداع وسحب أكبر مع رسوم تداول مخفضة.',
		LEVEL_2_TXT:
			'ببساطة تداول شهرياً بمبلغ يزيد عن 3000 دولار أمريكي أو مع رصيد يزيد عن 5000 XHT، إستمتع برسوم تداول أقل.',
		LEVEL_3_TXT:
			'من هنا تبدأ المتعة! تمتع برسوم تداول مخفضة وحدود كبيرة للإيداع والسحب. للوصول إلى المستوى 3 ، يجب عليك إكمال التحقق.',
		LEVEL_4_TXT:
			'ببساطة تداول شهرياً بمبلغ يزيد عن 10,000 دولار أمريكي أو مع رصيد يزيد عن  XHT10,000، إستمتع برسوم تداول أقل.',
		LEVEL_5_TXT:
			'لقد نجحت! حساب المستوى 5 هو حساب نادر فقط لمشغلي التبادل أو مستخدمي Vault أو برنامج شركاء هولا إكس (HAP). استمتع بحدود كبيرة واستمتع برسوم خالیة من رسوم صانع السوق.',
		LEVEL_6_TXT:
			'ببساطة تداول شهرياً بمبلغ يزيد عن 300,000 دولار أمريكي أومع رصيد يزيد عن 100,000 XHT ،استمتع برسوم تداول أقل و زيادة مبلغ السحب.',
		LEVEL_7_TXT:
			'ببساطة تداول شهريًا بمبلغ يزيد عن 500,000 دولار أمريكي أو مع رصيد يزيد عن  300,000 XHT  ، استمتع برسوم تداول أقل و زيادة مبلغ السحب.',
		LEVEL_8_TXT:
			'ببساطة تداول شهرياً بمبلغ يزيد عن 600,000 دولار أمريكي أو مع رصيد يزيد عن 400,000 XHT ، استمتع برسوم تداول أقل.',
		LEVEL_9_TXT:
			'ببساطة تداول شهريًا بمبلغ یزيد عن 2,000,000 دولار أمريكي أو مع رصيد يزيد عن 1,000,000 XHT ، استمتع برسوم تداول أقل.',
		LEVEL_10_TXT:
			'يكسبك حساب تداول الحوت المال مقابل صناعة السوق. للحصول على هذا الحساب الخاص ، يرجى التواصل معنا.',
		CURRENT_TXT: 'الحالي',
		TRADER_ACCOUNT_XHT_TEXT:
			'حسابك في فترة البيع المسبق لـعملة XHT ، وهذا يعني أنه يمكنك الحصول على عملة XHT مقابل 0.10 دولار لكل عملة واحدة من XHT. سيتم تحويل جميع الودائع إلى عملة XHT بمجرد تصفية المعاملة.',
		TRADER_ACCOUNT_TITLE: 'الحساب - فترة ما قبل البيع', // new
		HAP_ACCOUNT: 'حساب HAP (برنامج شركاء هولا إكس)', // new
		HAP_ACCOUNT_TXT:
			'حسابك هو حساب برنامج شركاء هولا إكس مثبَت. يمكنك الآن الحصول على مكافأة 10٪ لكل شخص تقوم بدعوته ويشتري عملة XHT.', // new
		EMAIL_VERIFICATION: 'تأكيد بواسطة البريد الالكتروني', // new
		DOCUMENTS: 'الوثائق', // new
		HAP_TEXT: 'برنامج شركاء هولا إكس (HAP) {0}', // new
		LOCK_AN_EXCHANGE: 'أتمم تبادلاً {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'مستخدمو الاشتراك في Vault {0}', // new
		TRADE_OVER_XHT: 'تداول بمبلغ يزيد عن USDT {0}', // new
		TRADE_OVER_BTC: 'تداول بمبلغ يزيد عن  BTC {0}', // new
		XHT_IN_WALLET: '{0} XHT في المحفظة', // new
		REWARDS_BONUS: 'المكافآت والجوائز', // new
		COMPLETE_TASK_DESC: 'أكمل المهام واكسب مكافآت تزيد قيمتها عن 10,000 دولار.', // new
		TASKS: 'مهام', // new
		MAKE_FIRST_DEPOSIT: 'قم بعمل إيداعك الأول واحصل على 1 XHT', // new
		BUY_FIRST_XHT: 'اشترِ XHT الأول واحصل على مكافأة قدرها 5 XHT', // new
		COMPLETE_ACC_VERIFICATION:
			'أكمل عملية التحقق من الحساب واحصل على مكافأة قدرها 20 XHT', // new
		INVITE_USER: 'قم بدعوة المستخدمين واستمتع بعمولات من تداولاتهم', // new
		JOIN_HAP:
			'انضم إلى HAP (برنامج شركاء هولا إكس) واكسب 10٪ على كل مجموعة أدوات هولاإكس تبيعها.', // new
		EARN_RUNNING_EXCHANGE: 'احصل على دخلاً سلبياً مع تشغيل البورصة الخاصة بك', // new
		XHT_WAVE_AUCTION: 'بيانات مزادات موجات  XHT', // new
		XHT_WAVE_DESC_1: 'يتم توزيع عملة هولاإكس (XHT) من خلال موجات من المزادات.', // new
		XHT_WAVE_DESC_2:
			'تبيع مزاد الموجة كمية عشوائية من عملة XHT في أوقات عشوائية لأعلى مزايدين في دفتر الطلبات', // new
		XHT_WAVE_DESC_3: 'يعرض أدناه البيانات التاريخية في سجل مزادات الموجة.', // new
		WAVE_AUCTION_PHASE: 'مرحلة المزاد الموجي {0}', // new
		LEARN_MORE_WAVE_AUCTION: 'تعرف على المزيد حول المزاد الموجي', // new
		WAVE_NUMBER: 'رقم الموجة', // new
		DISCOUNT: '({0}٪ خصم)', // new
		MY_FEES_LIMITS: 'رسوماتي و حدودي', // new
		MARKETS: 'أسواق', // new
		CHANGE_24H: 'التغييرات في 24 ساعة', // new
		VOLUME_24H: 'الحجم في 24 ساعة', // new
		PRICE_GRAPH_24H: 'الرسم البياني للأسعار في 24 ساعة', // new
		VIEW_MORE_MARKETS: 'عرض المزيد من الأسواق', // new
	},
	REFERRAL_LINK: {
		TITLE: 'ادعو صديقك', // new
		INFO_TEXT:
			'قم بإحالة أصدقائك من خلال إعطاء هذا الرابط واحصل على مزايا من خلال تأهيل أشخاص آخرين.',
		COPY_FIELD_LABEL: 'شارك الرابط أدناه مع أصدقائك واكسب عمولات:', // new
		REFERRED_USER_COUT: 'لقد قمت بإحالة {0} من ائمستخدمين', // new
		COPY_LINK_BUTTON: 'انسخ رابط الإحالة', // new
		XHT_TITLE: 'إحالاتي', // new
		XHT_INFO_TEXT: 'اكسب عمولات بدعوة أصدقائك.', // new
		XHT_INFO_TEXT_1: 'يتم دفع العمولات بشكل دوري إلى محفظتك', // new
		APPLICATION_TXT: 'لكي تصبح موزعًا لمجموعة أدوات هولاإكس ، يرجى ملئ الطلب.', // new
		TOTAL_REFERRAL: 'إجمالي المشتريات من الإحالات:', // new
		PENDING_REFERRAL: 'العمولات التي في قيد الانتظار:', // new
		EARN_REFERRAL: 'العمولات المكتسبة:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'قدم طلباً', // new
	},
	STAKE_TOKEN: {
		TITLE: 'حصِّص عملة هولاإكس (XHT) ', // new
		INFO_TXT1:
			'يجب أن تكون عملات هولاإكس (XHT) مضمونة (مدعومة) لتشغيل برنامج مجموعة أدوات بورصة هولاإكس.', // new
		INFO_TXT2:
			'يمكنك ضمانة عملة هولاإكس الخاصة بك بطريقة مماثلة وكسب عملة XHT التي لم يتم بيعها خلال مزادات الموجة.', // new
		INFO_TXT3:
			'ما عليك سوى الانتقال إلى dash.bitholla.com وإضمان البورصة الخاصة بك اليوم واكتسب عملة XHT مجانًا', // new
		BUTTON_TXT: 'اكتشف المزيد', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'اتفاقية شراء عملة هولاإكس',
		SERVICE_AGREEMENT: AGREEMENT, //إتفاقية
		PROCEED: 'تقدم',
		AGREE_TERMS_LABEL: 'لقد قرأت و وافقت على اتفاقية شراء عملة هولاإكس',
		RISK_INVOLVED_LABEL: 'أنا أدرك المخاطر التي تنطوي عليها',
		DOWNLOAD_PDF: 'قم بتنزيل ملف PDF',
		DEPOSIT_FUNDS: 'قم بإيداع الأموال في محفظتك للحصول على عملة هولاإكس (XHT)',
		READ_FAG: 'اقرأ الأسئلة الشائعة لـ هولاإكس هنا: {0}',
		READ_DOCUMENTATION: 'اقرأ المستند التقني لهولاإكس هنا: {0}',
		READ_WAVES: 'قواعد مزاد الموجة العامة لشهر ديسمبر المقبل {0}', // new
		DOWNLOAD_BUY_XHT: 'قم بتنزيل ملف PDF للاطلاع على الدليل البصري على {0}',
		HOW_TO_BUY: 'كيفية شراء عملة هولاإكس (XHT)',
		PUBLIC_SALES: 'مزاد الموجة العام', // new
		CONTACT_US:
			'لا تتردد في الاتصال بنا للحصول على مزيد من المعلومات وأي مشكلات عن طريق إرسال بريد إلكتروني إلينا إلى {0}',
		VISUAL_STEP: 'شاهد الدليل البصري على {0}', // new
		WARNING_TXT:
			'سنراجع طلبك ونرسل مزيدًا من الإرشادات إلى بريدك الإلكتروني حول كيفية الوصول إلى بورصة هولاإكس.', // new
		WARNING_TXT1:
			'في غضون ذلك ، يمكنك التعرف على شبكة هولاإكس باستخدام الموارد أدناه', // new
		XHT_ORDER_TXT_1: 'لبدء التداول يجب عليك تسجيل الدخول', // new
		XHT_ORDER_TXT_2: '', // new
		XHT_ORDER_TXT_3: '{0} أو {1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: 'قم بتسجيل الدخول لترى تداولاتك الأخيرة', //new
		XHT_TRADE_TXT_2: 'يمكنك {0} الاطلاع على تاريخ تداولات الحديثة الخاصة بك', //new
		LOGIN_HERE: 'تسجيل الدخول هنا',
	},
	WAVES: {
		// new
		TITLE: 'معلومات الموجة',
		NEXT_WAVE: 'الموجة المقبلة',
		WAVE_AMOUNT: 'الحجم في الموجة',
		FLOOR: 'الأرض',
		LAST_WAVE: 'الموجة الأخيرة',
	},
	TYPES_OF_POSTS: {
		// new
		TITLE: 'البوستات',
		ANNOUNCEMEN: 'إعلان',
		SYSTEM_UPDATE: 'تحديث النظام',
		LAST_WAVE: 'الموجة الأخيرة',
		ANNOUNCEMENT_TXT:
			'سيتم توزيع عملة  XHTالمجاني على جميع المحافظ التي تنطبق عليها',
		SYSTEM_UPDATE_TIME: 'الوقت: 12:31 ظهرًا ، 19 ديسمبر 2019	',
		SYSTEM_UPDATE_DURATION: '1 ساعة',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: '12:31 مساءً ، 19 ديسمبر 2019',
	},
	USER_LEVEL: 'مستوى المستخدم', // new
	LIMIT_AMOUNT: 'مبلغ الحد', // new
	FEE_AMOUNT: 'مبلغ الرسوم', // new
	COINS: 'عملات', // new
	PAIRS: 'أزواج', // new
	NOTE_FOR_EDIT_COIN: 'ملاحظة: لإضافة وإزالة {0} يرجى الرجوع إلى {1}.', // new
	REFER_DOCS_LINK: 'الوثائق', // new
	RESTART_TO_APPLY:
		'تحتاج إلى إعادة تشغيل البورصة الخاص بك لتطبيق هذه التغييرات.', // new
	TRIAL_EXCHANGE_MSG:
		'أنت تستخدم إصدار إختباري من {0} وستنتهي صلاحيته في غضون {1} يوم.', // new
	EXPIRY_EXCHANGE_MSG:
		'انتهت صلاحية بورصتك. انتقل إلى dash.bitholla.com لتنشيطها مرة أخرى.', // new
	EXPIRED_INFO_1: 'انتهت الفترة الإختبارية الخاصة بك.', // new
	EXPIRED_INFO_2: 'إضمن البورصة لتنشيطها مرة أخرى.', // new
	EXPIRED_BUTTON_TXT: 'تنشيط البورصة', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: 'إعلان',
		ANNOUNCEMNT_TXT_3:
			'تمت إعادة جدولة الإطلاق العام ومزاد الموجة إلى 1 يناير 2020. ودائع وسحب المحفظة مفتوحة الآن.',
		ANNOUNCEMNT_TXT_4:
			'كل عام وأنتم بخيريا عميلين هولاإكس. نحن نحقق إنجازاً جديداً بدءًا من عام 2020 مع إطلاق منصة التداول الأكثر شفافيةً بمساعدتكم جميعًا.',
		ANNOUNCEMNT_TXT_1:
			'اكسب عملة XHT مع برنامج HAP (برنامج شركاء هولاإكس) من خلال تقديم البورصة لأصدقائك. {0}.',
		DEFAULT_ANNOUNCEMENT: 'يعرض هذا القسم الإعلانات العامة لالبورصة الخاصة بك!',
		ANNOUNCEMENT_TXT_2:
			'سيتم توزيع عملة XHT المجانية على جميع محفظات التي {0}.',
		LEARN_MORE: 'إعلم المزيد',
		APPLY_TODAY: 'قدّم اليوم', // new
	},
	OPEN_WALLET: 'محفظة مفتوحة', // new
	AGO: 'منذ', // new
	CUMULATIVE_AMOUNT_SYMBOL: 'تراكمي',
	POST_ONLY: 'نشر فقط',
	CLEAR: 'مسح',
	ORDER_TYPE: 'اكتب',
	TRIGGER_CONDITIONS: 'شروط التنشيط',
	TRANSACTION_STATUS: {
		PENDING: 'قيد الانتظار',
		REJECTED: 'مرفوض',
		COMPLETED: 'مكتمل',
	},
	DEPOSIT_STATUS: {
		// new
		NEW: 'جديد',
		SEARCH_FIELD_LABEL: 'الصق معرّف معاملتك',
		SEARCH: 'بحث',
		SEARCHING: 'جاري البحث',
		CHECK_DEPOSIT_STATUS: 'تحقق من حالة الايداع',
		STATUS_DESCRIPTION:
			'يمكنك التحقق من حالة الإيداع الخاص بك عن طريق إضافة معرف المعاملة أدناه.',
		TRANSACTION_ID: 'معرف المعاملة ',
		SEARCH_SUCCESS: 'تم العثور على المعاملة!',
		ADDRESS_FIELD_LABEL:
			'المعاملة غير موجودة. يرجى التحقق من الهوية والمحاولة مرة أخرى. إذا كنت تعتقد أن هناك مشكلة يرجى الاتصال بالدعم.', // new
		CURRENCY_FIELD_LABEL: 'Select the currency', // new
	},
	CANCEL_ORDERS: {
		HEADING: 'Cancel orders',
		SUB_HEADING: 'Cancel all orders',
		INFO_1: 'This will cancel your open orders for all markets.',
		INFO_2: 'Are you sure you want to cancel all your open orders?',
	},
	AMOUNT_IN: 'Amount in',
	LIMITS_BLOCK: {
		HEADER_ROW_DESCRIPTION:
			'Deposit and withdrawal allowance for all assets ({0})',
		HEADER_ROW_TYPE: 'Type (All assets)',
		HEADER_ROW_AMOUNT: 'Amount ({0})',
	},
	MARKETS_TABLE: {
		TITLE: 'Live markets',
		MARKETS: 'Markets',
		LAST_PRICE: 'Last price',
		CHANGE_24H: 'Change (24 hours)',
		VOLUME_24h: 'Volume (24 hours)',
		CHART_24H: 'Chart (24 hours)',
		VIEW_MARKETS: 'View Markets',
	},
};

const content = flatten(nestedContent, options);

export default content;
