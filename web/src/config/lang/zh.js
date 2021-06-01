import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';

export default {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Open Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: '您想要注销吗?',
	ADD_TRADING_PAIR: '增加货币交易对',
	ACTIVE_TRADES: '为了实际交易时能够进行使用，请{0}',
	CANCEL_FIAT_WITHDRAWAL: '{0}取消提现',
	CANCEL_WITHDRAWAL: '取消提现',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM: '想要取消正在进行的交易吗?:',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: '登录',
	SIGN_IN: '登录',
	SIGNUP_TEXT: '注册会员',
	REGISTER_TEXT: '注册',
	ACCOUNT_TEXT: '账号',
	HOME_TEXT: 'Home',
	CLOSE_TEXT: '关闭',
	COPY_TEXT: '复制',
	COPY_SUCCESS_TEXT: '已成功复制',
	CANCEL_SUCCESS_TEXT: '已成功取消!',
	UPLOAD_TEXT: '上传',
	ADD_FILES: '添加文件', // ToDo
	OR_TEXT: '或者',
	CONTACT_US_TEXT: '咨询',
	HELPFUL_RESOURCES_TEXT: 'Helpful resources',
	HELP_RESOURCE_GUIDE_TEXT: '请通过联系support@hollaex.com进行咨询',
	HELP_TELEGRAM_TEXT: '确认HollaEx的开放API:',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: '需要帮助吗?', // new
	HELP_TEXT: '帮助',
	SUCCESS_TEXT: '成功',
	ERROR_TEXT: '错误',
	PROCEED: '实行',
	EDIT_TEXT: '编辑',
	BACK_TEXT: '返回',
	NO_OPTIONS: '没有能够使用的选项',
	SECONDS: 'seconds',
	VIEW_MARKET: '查看行情', // new
	GO_TRADE: '进行交易', // new
	VIEW_INFO: '查看信息页面', // new
	HOME: {
		SECTION_1_TITLE: '欢迎来到HollaEx交易所 Kit',
		SECTION_1_TEXT_1:
			'通过使用HollaEx Kit来构建您自己的可伸缩数字资产的交易所，并成为未来金融的一部分',
		SECTION_1_TEXT_2:
			'我们努力通过合适的价格以及简单的交易技术来推动金融技术的发展',
		SECTION_1_BUTTON_1: '了解更多',
		SECTION_3_TITLE: '特性',
		SECTION_3_CARD_1_TITLE: '可伸缩的匹配引擎',
		SECTION_3_CARD_1_TEXT: '使用最有效算法的高性能和可扩展的订单匹配引擎',
		SECTION_3_CARD_2_TITLE: '银行一体化',
		SECTION_3_CARD_2_TEXT:
			'我们深知传统金融，插件与可定制的模块，能够实现银行一体化，可以帮助您将交易所变成本地交易所',
		SECTION_3_CARD_3_TITLE: '强大的安全性',
		SECTION_3_CARD_3_TEXT:
			'HollaEx使用最好的安全实践和最安全可靠的算法来保护资金安全，这是我们的首要任务，并且我们采取非常特别的安全惯例。',
		SECTION_3_CARD_4_TITLE: '高级报告制度',
		SECTION_3_CARD_4_TEXT:
			'管理控制面板具有可定制的电子邮件和报告的功能，用于通知支持人员以及管理人员有关系统和交易的状态',
		SECTION_3_CARD_5_TITLE: '客户支持',
		SECTION_3_CARD_5_TEXT:
			'我们可以为您的需求多一份关怀，有在线专业人员为您解答问题与咨询',
		SECTION_3_CARD_6_TITLE: 'KYC集成',
		SECTION_3_CARD_6_TEXT:
			'通过灵活且可集成的模块，可在不同的司法管辖区应用KYC及用户验证方法。',
		SECTION_3_BUTTON_1: '查看演示',
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
		SECTIONS: {
			SECTION_1_TITLE: 'ABOUT',
			SECTION_1_LINK_1: 'About Us',
			SECTION_1_LINK_2: '使用条款',
			SECTION_1_LINK_3: '隐私政策',
			SECTION_1_LINK_4: 'Contact Us',
			SECTION_2_TITLE: 'INFORMATION',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Contact Us',
			SECTION_2_LINK_3: 'Career',
			SECTION_3_TITLE: 'DEVELOPERS',
			SECTION_3_LINK_1: 'Documentation',
			SECTION_3_LINK_2: 'Forum',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'Library',
			SECTION_3_LINK_5: 'API文档',
			SECTION_3_LINK_6: 'API',
			SECTION_3_LINK_7: 'Developer tools',
			SECTION_3_LINK_8: 'Docs',
			SECTION_4_TITLE: 'EXCHANGE',
			SECTION_4_LINK_1: '登录',
			SECTION_4_LINK_2: '注册会员',
			SECTION_4_LINK_3: 'Contact Us',
			SECTION_4_LINK_4: 'Terms of Use',
			SECTION_5_TITLE: 'RESOURCES',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'HollaEx Token(XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_6_TITLE: 'SOCIAL',
			SECTION_6_LINK_1: '推特',
			SECTION_6_LINK_2: 'Telegram',
		},
		XHT_DESCRIPTION:
			'HollaEx Kit是由bitHolla公司打造的一个开源交易平台，你可以创建和列出任何数字资产，并利用这个交易所Kit入驻用户在你的交易所进行交易，为了简单的自己运行一个{1}。',
		CLICK_HERE: '请点击此处',
		VISIT_HERE: '访问此处',
	},
	ACCOUNTS: {
		TITLE: '账号',
		TAB_VERIFICATION: '审核',
		TAB_SECURITY: '安全性',
		TAB_NOTIFICATIONS: '通知',
		TAB_SETTINGS: '设置',
		TAB_PROFILE: '简介',
		TAB_WALLET: '钱包',
		TAB_SUMMARY: '概要',
		TAB_API: 'API',
		TAB_SIGNOUT: '退出',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: '申请访问',
		REQUEST_INVITE: '申请邀请',
		CATEGORY_PLACEHOLDER: '选择适合你的问题的类别',
		INTRODUCTION_LABEL: '自我介绍',
		INTRODUCTION_PLACEHOLDER: '你从属于哪里，对于运营交易所是否有兴趣？',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: '咨询类型',
		CATEGORY_PLACEHOLDER: '选择适合你的问题的类别',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: '用户验证',
			OPTION_LEVEL: '提升用户等级',
			OPTION_DEPOSIT: '充值 & 提款',
			OPTION_BUG: '错误报告',
			OPTION_PERSONAL_INFO: '更改个人信息', // ToDo:
			OPTION_BANK_TRANSFER: '银行汇款', // new
			OPTION_REQUEST: '申请邀请参加HollaEx Exchange交流会', // new
		},
		SUBJECT_LABEL: '咨询题目',
		SUBJECT_PLACEHOLDER: '输入问题的主题',
		DESCRIPTION_LABEL: '咨询内容',
		DESCRIPTION_PLACEHOLDER: '详细输入咨询内容',
		ATTACHMENT_LABEL: '添加附件（最多3个）',
		ATTACHMENT_PLACEHOLDER:
			'添加一个文件来帮助解决你的问题。（可添加PDF, JPG, PNG, GIF文件）',
		SUCCESS_MESSAGE: '该邮件已发送到客服中心',
		SUCCESS_TITLE: '发送信息',
		SUCCESS_MESSAGE_1: '你的问题已发送到客服中心',
		SUCCESS_MESSAGE_2: '将在1~3个工作日内得到回复。',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: '{0} 接收地址', // new
			DESTINATION_TAG: '{0} 目标标签（Destination Tag）', // new
			BTC: '比特币接收地址',
			ETH: 'Ethereum接收地址',
			BCH: 'Bitcoin Cash接收地址',
		},
		INCREASE_LIMIT: '需要增加每日限额吗？',
		QR_CODE: '其他人可以使用该QR码像你转账。',
		NO_DATA: '没有信息',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: '{0} 登录',
		CANT_LOGIN: '无法登录？',
		NO_ACCOUNT: '没有账号？',
		CREATE_ACCOUNT: '创建账号',
		HELP: 'Help',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: '电子邮件',
		EMAIL_PLACEHOLDER: '输入你的电子邮件地址',
		PASSWORD_LABEL: '密码',
		PASSWORD_PLACEHOLDER: '输入密码',
		PASSWORD_REPEAT_LABEL: '确认密码',
		PASSWORD_REPEAT_PLACEHOLDER: '重新输入密码',
	},
	VALIDATIONS: {
		OTP_LOGIN: '输入OTP码用于登录',
		CAPTCHA: 'Expired Session. Please refresh the page', // new
		FROZEN_ACCOUNT: 'This account is frozen.',
		INVALID_EMAIL: '无效的电子邮件地址',
		TYPE_EMAIL: '输入你的电子邮件',
		REQUIRED: '必填项',
		INVALID_DATE: '无效日期',
		INVALID_PASSWORD: '无效的密码（必须包含至少8个字符，使用数字及特殊字符）',
		INVALID_PASSWORD_2:
			'无效的密码（必须包含至少8个字符，使用至少1个数字及特殊字符）',
		INVALID_CURRENCY: '无效的{0}地址({1})',
		INVALID_BALANCE: '可用余额不足({1})，无法执行操作({0})。',
		MIN_VALUE: '值必须为{0}或更高',
		MAX_VALUE: '值必须为{0}或更低',
		INSUFFICIENT_BALANCE: '余额不足',
		PASSWORDS_DONT_MATCH: '密码不一致',
		USER_EXIST: '电子邮件已被注册',
		ACCEPT_TERMS: '你还没有同意使用条款和隐私政策',
		STEP: '无效的值，为{0}',
		ONLY_NUMBERS: '值只能包含数字',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'Privacy Policy',
			SUBTITLE:
				'Last updated April 1, 2019. Replaces the prior version in its entirety.',
			TEXTS: [
				'HollaEx Web is a virtual trading platform that is wholly owned by bitHolla Inc. bitHolla Inc (hereinafter referred to as bitHolla) was incorporated in Seoul South Korea.',
				'Use of this HollaEx website (“Website”) and the service offered on the Website (“Service”) are governed by the terms contained on this Terms and Conditions page (“Terms”). This agreement entirely constitutes the agreement between the parties. All other information provided on the Website or oral/written statements made are excluded from this agreement; the exchange policy is provided for guidance only and does not constitute a legal agreement between the parties.',
				'By accessing, viewing or downloading information from the Website and using the Service provided by bitHolla you acknowledge that you have read, understand, and unconditionally agree to be bound by these Terms. bitHolla may at any time, without notice, amend the Terms. You agree to continue to be bound by any amended terms and conditions and that bitHolla has no obligation to notify you of such amendments. You acknowledge that it is your responsibility to check these Terms periodically for changes and that your continued use of the Website and Services offered by bitHolla following the posting of any changes to the Terms indicates your acceptance of any such changes.',
				'The Website and the copyright in all text, graphics, images, software and any other materials on the Website is owned by bitHolla including all trademarks and other intellectual property rights in respect of materials and Service on the Website. Materials on this Website may only be used for personal use and non-commercial purposes.',
				'You may display on a computer screen or print extracts from the Website for the above-stated purpose only provided that you retain any copyright and other proprietary notices or any bitHolla trademarks or logos, as shown on the initial printout or download without alteration, addition or deletion. Except as expressly stated herein, you may not without bitHolla’s prior written permission alter, modify, reproduce, distribute or use in any other commercial context any materials from the Website.',
				'You acknowledge that ‘bitHolla’ and the bitHolla logo are trademarks of bitHolla Inc. You may reproduce such trademarks without alteration on material downloaded from this Website to the extent authorised above, but you may not otherwise use, copy, adapt or erase them.',
				'You shall not in any circumstances obtain any rights over or in respect of the Website (other than rights to use the Website pursuant to these Terms and any other terms and conditions governing a particular service or section of the Website) or hold yourself out as having any such rights over or in respect of the Website.',
			],
		},
		GENERAL_TERMS: {
			TITLE: 'General Terms of Service',
			SUBTITLE:
				'Last updated April 1, 2019. Replaces the prior version in its entirety.',
			TEXTS: [
				'HollaEx Web is a virtual trading platform that is wholly owned by bitHolla Inc. bitHolla Inc (hereinafter referred to as bitHolla) was incorporated in Seoul South Korea.',
				'Use of this HollaEx website (“Website”) and the service offered on the Website (“Service”) are governed by the terms contained on this Terms and Conditions page (“Terms”). This agreement entirely constitutes the agreement between the parties. All other information provided on the Website or oral/written statements made are excluded from this agreement; the exchange policy is provided for guidance only and does not constitute a legal agreement between the parties.',
				'By accessing, viewing or downloading information from the Website and using the Service provided by bitHolla you acknowledge that you have read, understand, and unconditionally agree to be bound by these Terms. bitHolla may at any time, without notice, amend the Terms. You agree to continue to be bound by any amended terms and conditions and that bitHolla has no obligation to notify you of such amendments. You acknowledge that it is your responsibility to check these Terms periodically for changes and that your continued use of the Website and Services offered by bitHolla following the posting of any changes to the Terms indicates your acceptance of any such changes.',
				'The Website and the copyright in all text, graphics, images, software and any other materials on the Website is owned by bitHolla including all trademarks and other intellectual property rights in respect of materials and Service on the Website. Materials on this Website may only be used for personal use and non-commercial purposes.',
				'You may display on a computer screen or print extracts from the Website for the above-stated purpose only provided that you retain any copyright and other proprietary notices or any bitHolla trademarks or logos, as shown on the initial printout or download without alteration, addition or deletion. Except as expressly stated herein, you may not without bitHolla’s prior written permission alter, modify, reproduce, distribute or use in any other commercial context any materials from the Website.',
				'You acknowledge that ‘bitHolla’ and the bitHolla logo are trademarks of bitHolla Inc. You may reproduce such trademarks without alteration on material downloaded from this Website to the extent authorised above, but you may not otherwise use, copy, adapt or erase them.',
				'You shall not in any circumstances obtain any rights over or in respect of the Website (other than rights to use the Website pursuant to these Terms and any other terms and conditions governing a particular service or section of the Website) or hold yourself out as having any such rights over or in respect of the Website.',
			],
		},
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'Okay',
			START_TRADING: '开始交易',
			SEE_HISTORY: '查看历史',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0}已收存款',
			TITLE_INCOMING: '{0}存款进行中',
			SUBTITLE_RECEIVED: '{0}收到存款',
			SUBTITLE_INCOMING: '{0}存款进行中',
			INFORMATION_PENDING_1: '你的{0}需要1次确认才可以开始交易',
			INFORMATION_PENDING_2:
				'可能需要10-30分钟，一旦{0}在区块链上得到确认，我们将向你发送电子邮件',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: '发送请求',
		BUTTON_TEXT: 'Okay',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: '输入验证码继续进行',
		OTP_LABEL: 'OTP码',
		OTP_PLACEHOLDER: '输入验证码',
		OTP_TITLE: '验证码',
		OTP_HELP: '帮助',
		OTP_BUTTON: '提交',
		ERROR_INVALID: '无效的OTP码',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: '快速',
		TOTAL_COST: '总费用',
		BUTTON: '审阅{0}订单',
		INPUT: '{0}{1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: '上一页',
	NEXT_PAGE: '下一页',
	WALLET: {
		TOTAL_ASSETS: '总资产',
		AVAILABLE_WITHDRAWAL: '可供交易',
		AVAILABLE_TRADING: '可供取款',
		ORDERS_PLURAL: '订单',
		ORDERS_SINGULAR: '订单',
		HOLD_ORDERS:
			'You have {0} open {1}, resulting in a hold of {2} {3} placed on your {4} balance',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: '找回账号',
		SUBTITLE: `在下方找回账号`,
		SUPPORT: '联系客服',
		BUTTON: '发送找回链接',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: '密码重置已发送',
		TEXT:
			'如果该电子邮件是绑定于账号的电子邮件，则已向该账号发送了带有重置说明的邮件，请检查邮件并点击链接完成密码重置。',
	},
	RESET_PASSWORD: {
		TITLE: '设置新的密码',
		SUBTITLE: '设置新的密码',
		BUTTON: '设置新的密码',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: '你已成功设置了新的密码',
		TEXT_2: '点击下面的登录以继续',
	},
	SIGN_UP: {
		SIGNUP_TO: '注册到{0}',
		NO_EMAIL: '没有收到邮件？',
		REQUEST_EMAIL: '再次请求',
		HAVE_ACCOUNT: '已存在账号？',
		GOTO_LOGIN: '进入登录页面',
		AFFILIATION_CODE: '推荐代码（可选）',
		AFFILIATION_CODE_PLACEHOLDER: '输入推荐码',
		TERMS: {
			terms: '一般条款',
			policy: '隐私政策',
			text: '我已阅读并同意{0}以及{1}',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: '电子邮件已发送',
		TEXT_1: '确认你的电子邮件，并点击链接进行认证。',
		TEXT_2:
			'如果没有收到任何验证电子邮件，并已检查了垃圾信箱，请尝试点击下方以重新进行发送。',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: '重新发送电子邮件',
		BUTTON: '申请邮件',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: '重新发送了电子邮件',
		TEXT_1: '如果几分钟后仍然没有收到验证邮件，请通过下方联系我们。',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: '无效的码',
		TEXT_1: '你已成功验证了电子邮件',
		TEXT_2: '请继续登录',
	},
	USER_VERIFICATION: {
		INFO_TXT: '在此页面可查看验证及账户升级进度 ',
		INFO_TXT_1:
			'请提交以下各部分所需的相关信息，只有在所有部分提交完成后，你的信息才会被审查和批准账户升级。',
		INFO_TXT_2: '*身份认证部分需要{0}某些文件',
		DOCUMENTATIONS: '上传文件',
		COMPLETED: '完成',
		PENDING_VERIFICATION: '待核查',
		TITLE_EMAIL: '电子邮件',
		MY_EMAIL: '我的电子邮件',
		MAKE_FIRST_DEPOSIT: '进行第一笔充值', // new
		OBTAIN_XHT: '获取XHT', // new
		TITLE_USER_DOCUMENTATION: 'Identification', // not used
		TITLE_ID_DOCUMENTS: '上传文件',
		TITLE_BANK_ACCOUNT: '银行账户',
		TITLE_MOBILE_PHONE: '手机',
		TITLE_PERSONAL_INFORMATION: '个人信息',
		VERIFY_EMAIL: '验证电子邮件',
		VERIFY_MOBILE_PHONE: '手机验证',
		VERIFY_USER_DOCUMENTATION: '核实用户文件',
		VERIFY_ID_DOCUMENTS: '验证身份证件',
		VERIFY_BANK_ACCOUNT: '验证银行账户',
		BUTTON: '提交验证申请',
		TITLE_IDENTITY: '身份',
		TITLE_MOBILE: '手机',
		TITLE_MOBILE_HEADER: '手机号码',
		TITLE_BANK: '银行',
		TITLE_BANK_HEADER: '银行详情',
		CHANGE_VALUE: '更改值',
		PENDING_VERIFICATION_PERSONAL_INFORMATION: '个人信息正在处理中',
		PENDING_VERIFICATION_BANK: '银行信息正在审核中',
		PENDING_VERIFICATION_DOCUMENTS: '文件正在审核中',
		GOTO_VERIFICATION: '前往验证',
		GOTO_WALLET: '前往钱包', // new
		CONNECT_BANK_ACCOUNT: '连接银行账户',
		ACTIVATE_2FA: '激活双重身份验证（2FA）',
		INCOMPLETED: '未完成',
		BANK_VERIFICATION: '银行验证',
		IDENTITY_VERIFICATION: '身份验证',
		PHONE_VERIFICATION: '手机验证',
		DOCUMENT_VERIFICATION: '文件审核',
		START_BANK_VERIFICATION: '开始银行验证',
		START_IDENTITY_VERIFICATION: '开始身份验证',
		START_PHONE_VERIFICATION: '开始手机验证 ',
		START_DOCUMENTATION_SUBMISSION: '开始提交文件',
		GO_BACK: '返回',
		BANK_VERIFICATION_TEXT_1:
			'最多可以添加3个银行账户，国际银行账户需要联系客服，并且会有提款限额。',
		BANK_VERIFICATION_TEXT_2: '通过验证你的银行账户，可以获得以下信息:',
		FIAT_WITHDRAWAL: '法币提款',
		FIAT_DEPOSITS: '法币充值',
		ADD_ANOTHER_BANK_ACCOUNT: '添加另一个银行账户',
		BANK_NAME: '银行名称',
		ACCOUNT_NUMBER: '账号',
		CARD_NUMBER: '卡号',
		BANK_VERIFICATION_HELP_TEXT: '为了使该部分得到验证，必须完成{0}部分。',
		DOCUMENT_SUBMISSION: '提交文件',
		REVIEW_IDENTITY_VERIFICATION: '审查身份验证',
		PHONE_DETAILS: '手机详情',
		PHONE_COUNTRY_ORIGIN: '手机原产国',
		MOBILE_NUMBER: '手机号码',
		DOCUMENT_PROOF_SUBMISSION: '提交文件证明',
		START_DOCUMENTATION_RESUBMISSION: '重新提交文件',
		SUBMISSION_PENDING_TXT: '*此部分已提交，修改并重新提交将覆盖之前的信息。',
		CUSTOMER_SUPPORT_MESSAGE: '客服信息',
		DOCUMENT_PENDING_NOTE: '文件已提交，正在等待审核，请耐心等待。',
		DOCUMENT_VERIFIED_NOTE: '文件审核完成',
		NOTE_FROM_VERIFICATION_DEPARTMENT: '核查部门的说明',
		CODE_EXPIRES_IN: '验证码有效时间 ',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: '名字',
				FIRST_NAME_PLACEHOLDER: '请输入身份证上的名字',
				LAST_NAME_LABEL: '姓',
				LAST_NAME_PLACEHOLDER: '输入身份证上的姓氏',
				FULL_NAME_LABEL: '姓名',
				FULL_NAME_PLACEHOLDER: '输入身份证上的名字',
				GENDER_LABEL: '性别',
				GENDER_PLACEHOLDER: '输入性别',
				GENDER_OPTIONS: {
					MAN: '男',
					WOMAN: '女',
				},
				NATIONALITY_LABEL: '国籍',
				NATIONALITY_PLACEHOLDER: '输入身份证上的国籍',
				DOB_LABEL: '出生年月日',
				COUNTRY_LABEL: '现居住国家',
				COUNTRY_PLACEHOLDER: '请选择目前居住的国家',
				CITY_LABEL: '城市',
				CITY_PLACEHOLDER: '请选择目前居住的城市',
				ADDRESS_LABEL: '地址',
				ADDRESS_PLACEHOLDER: '请输入目前居住的地址',
				POSTAL_CODE_LABEL: '邮政编码',
				POSTAL_CODE_PLACEHOLDER: '请输入邮政编码',
				PHONE_CODE_LABEL: '国家',
				PHONE_CODE_PLACEHOLDER: '使用中的手机于哪个国家开通',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: '手机号码',
				PHONE_NUMBER_PLACEHOLDER: '请输入手机号码',
				SMS_SEND: '发送SMS',
				SMS_CODE_LABEL: 'SMS码',
				SMS_CODE_PLACEHOLDER: '输入SMS码',
			},
			INFORMATION: {
				TEXT:
					'*重要: 请按照身份证上的姓名准确填写，如果您是企业账号，请联系客服以获得企业账号。',
				TITLE_PERSONAL_INFORMATION: '个人资料',
				TITLE_PHONE: '手机绑定',
				PHONE_VERIFICATION_TXT:
					'提供有效的手机绑定将极大地帮助我们解决问题，同时防止用户账户发生不必要的交易。',
				PHONE_VERIFICATION_TXT_1:
					'通过认证手机号码，可以实时接收充值和取款信息。',
				PHONE_VERIFICATION_TXT_2:
					'通过共享你的LAN电话号码（可选）进一步证明你的身份和地址。',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: '请选择身份证类型',
				ID_NUMBER: ' 请输入身份证号码',
				ISSUED_DATE: '请选择身份证签发日期',
				EXPIRATION_DATE: '请选择身份证到期日期',
				FRONT: '请上传身份证复印件',
				PROOF_OF_RESIDENCY: '请上传可以证明目前居住地的文件资料',
				SELFIE_PHOTO_ID: '请上传本人举着带有备注的身份证件自拍照',
			},
			FORM_FIELDS: {
				TYPE_LABEL: '身份证件类型',
				TYPE_PLACEHOLDER: '选择身份证件类型',
				TYPE_OPTIONS: {
					ID: '身份证',
					PASSPORT: '护照',
				},
				ID_NUMBER_LABEL: '护照号码',
				ID_NUMBER_PLACEHOLDER: '请输入护照号码',
				ID_PASSPORT_NUMBER_LABEL: '护照号码',
				ID_PASSPORT_NUMBER_PLACEHOLDER: '请输入护照号码',
				ISSUED_DATE_LABEL: '护照签发日期',
				EXPIRATION_DATE_LABEL: '护照到期日',
				FRONT_LABEL: '护照复印件',
				FRONT_PLACEHOLDER: '添加护照复印件',
				BACK_LABEL: '护照（背面）',
				BACK_PLACEHOLDER: '添加护照（背面）复印件',
				PASSPORT_LABEL: '护照文件',
				PASSPORT_PLACEHOLDER: '添加护照文件复印件',
				POR_LABEL: '居住地证明资料',
				POR_PLACEHOLDER: '添加居住地证明资料',
				SELFIE_PHOTO_ID_LABEL: '举着护照的自拍照',
				SELFIE_PHOTO_ID_PLACEHOLDER: '添加举着带有备注的护照自拍照',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: '身份证明文件',
				PROOF_OF_RESIDENCY: '居住证明材料',
				ID_SECTION: {
					TITLE: '请确认以下内容',
					LIST_ITEM_1: '高像素（彩色图像，300dpi以上分辨率）',
					LIST_ITEM_2: '全文可见（允许有水印）',
					LIST_ITEM_3: '清晰显示有效的到期日期',
					WARNING_1: '只允许有效的护照，并且提交高像素的照片或扫描图像:',
					WARNING_2:
						'确保上传的文件，任何使用错误的或伪造文件的行为都将产生法律后果，并导致账户被立即冻结。',
					WARNING_3: '请不要提交护照作为居住证明',
				},
				POR: {
					SECTION_1_TEXT_1: '为避免在验证账户时出现延误，请确认以下内容:',
					SECTION_1_TEXT_2: '姓名、地址、发行日期和发行者须清晰可见',
					SECTION_1_TEXT_3: '提交的居住证明不能超过三个月',
					SECTION_1_TEXT_4: '需要提交高像素（至少300dpi）的彩色照片或扫描图像',
					SECTION_2_TITLE: '可提交的居住证明:',
					SECTION_2_LIST_ITEM_1: '银行账户账单',
					SECTION_2_LIST_ITEM_2: '公用事业账单（电费、水费、网费等）',
					SECTION_2_LIST_ITEM_3: '政府颁发的文件（税单、居住证等）',
					WARNING: '无法接受提交的身份证上的地址作为有效的居住证明',
				},
				SELFIE: {
					TITLE: '举着带有备注的护照自拍',
					INFO_TEXT:
						'请确认下列示例，并提交举着包含下方内容的备注和护照照片，确保脸部清晰可见，以及身份信息清晰可读。',
					REQUIRED: '必要条件:',
					INSTRUCTION_1: '脸部清晰可见',
					INSTRUCTION_2: '护照清晰可读',
					INSTRUCTION_3: '备注内容：交易所名称‘hollaex.com',
					INSTRUCTION_4: '备注内容：今天的日期',
					INSTRUCTION_5: '备注内容：签名',
					WARNING: '与上传的护照不一致会被拒绝',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER: '请输入银行账号的姓名',
				ACCOUNT_NUMBER: '输入少于50位的银行账号',
				ACCOUNT_NUMBER_MAX_LENGTH: '银行账号有50个字符的限制',
				CARD_NUMBER: '卡号各式不正确',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: '银行名称',
				BANK_NAME_PLACEHOLDER: '请输入银行名称',
				ACCOUNT_NUMBER_LABEL: '银行账号',
				ACCOUNT_NUMBER_PLACEHOLDER: '请输入银行账号',
				ACCOUNT_OWNER_LABEL: '银行账户所有人姓名',
				ACCOUNT_OWNER_PLACEHOLDER: '请输入银行账户名',
				CARD_NUMBER_LABEL: '银行卡号',
				CARD_NUMBER_PLACEHOLDER: '请输入银行卡号',
			},
		},
		WARNING: {
			TEXT_1: '通过验证你的身份，可以获得以下信息:',
			LIST_ITEM_1: '提高提款限额',
			LIST_ITEM_2: '提高充值限额',
			LIST_ITEM_3: '低手续费',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1: '可以改变账户设置',
		TITLE_TEXT_2: '设置后保存即可适用变更内容',
		TITLE_NOTIFICATION: '通知',
		TITLE_INTERFACE: '界面',
		TITLE_LANGUAGE: '语言',
		TITLE_CHAT: '聊天',
		TITLE_AUDIO_CUE: '声音',
		TITLE_MANAGE_RISK: '管理风险',
		ORDERBOOK_LEVEL: '交易委托账本级别（最多20个）',
		SET_TXT: '设置',
		CREATE_ORDER_WARING: '创建订单警告',
		RISKY_TRADE_DETECTED: '检测到的风险交易',
		RISKY_WARNING_TEXT_1: '该订单超过了设置的指定订单限价金额{0}',
		RISKY_WARNING_TEXT_2: '（投资组合的{0}）',
		RISKY_WARNING_TEXT_3: '请确认是否想进行此交易',
		GO_TO_RISK_MANAGMENT: '前往风险管理',
		CREATE_ORDER_WARING_TEXT:
			'当交易订单使用超过投资组合的{0}时，将创建一个警告弹出。',
		ORDER_PORTFOLIO_LABEL: '投资组合百分比金额:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: '交易弹窗',
			POPUP_ORDER_CONFIRMATION: '实施交易时确认弹窗',
			POPUP_ORDER_COMPLETED: '订单完成时弹窗',
			POPUP_ORDER_PARTIALLY_FILLED: '部分订单已满时弹窗',
		},
		AUDIO_CUE_FORM: {
			// new
			ALL_AUDIO: '所有声音提示',
			PUBLIC_TRADE_AUDIO: '公开交易播放提醒',
			ORDERS_PARTIAL_AUDIO: '当一个订单部分已满时，播放提醒',
			ORDERS_PLACED_AUDIO: '创建订单时',
			ORDERS_CANCELED_AUDIO: '取消订单时',
			ORDERS_COMPLETED_AUDIO: '当一个订单已满时，播放提醒',
			CLICK_AMOUNTS_AUDIO: '在订单页面点击数量和金额时',
			GET_QUICK_TRADE_AUDIO: '获得快速交易报价时 ',
			SUCCESS_QUICK_TRADE_AUDIO: '成功进行快速交易时',
			QUICK_TRADE_TIMEOUT_AUDIO: '快速交易超时时',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'当一个交易订单值超过投资组合的设定百分比金额，创建一个弹出警告。',
			PORTFOLIO: '站投资组合的百分比',
			TOMAN_ASSET: '近似值',
			ADJUST: '(设置百分比)',
			ACTIVATE_RISK_MANAGMENT: '激活风险管理',
			WARNING_POP_UP: '警告弹窗',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: '历史记录',
		TITLE_TRADES: '交易历史记录',
		TITLE_DEPOSITS: '充值历史记录',
		TITLE_WITHDRAWALS: '提款历史记录',
		TEXT_DOWNLOAD: '下载历史记录',
		TRADES: '交易',
		DEPOSITS: '充值',
		WITHDRAWALS: '提款',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT: '调整账户的安全设置，谷歌验证、密码、API密钥等安全相关功能。',
		OTP: {
			TITLE: '谷歌验证（2FA）',
			OTP_ENABLED: '启用OTP',
			OTP_DISABLED: '请激活2FA',
			ENABLED_TEXTS: {
				TEXT_1: '登录时需要OTP',
				TEXT_2: '提款时需要OTP',
			},
			DIALOG: {
				SUCCESS: '成功激活OTP',
				REVOKE: '成果解除OTP',
			},
			CONTENT: {
				TITLE: '激活双因素认证（2FA）',
				MESSAGE_1: '扫描',
				MESSAGE_2:
					'使用谷歌身份验证器或Authy扫描下方QR码，就可以在你的设备上自动设置双因素认证。',
				MESSAGE_3: '如果在扫描QR码时遇到问题，可以手动输入以下QR码。',
				MESSAGE_4: '你可以安全地保存该QR码，以便以后更换或丢失手机时恢复2FA。',
				MESSAGE_5: '指南',
				INPUT: '输入一次性密码（OTP)',
				WARNING: '强烈建议你设置谷歌验证（2FA），这将大幅提高资金的安全性。 ',
				ENABLE: '启用谷歌验证（2FA）',
				DISABLE: '禁用双因素认证（2FA）',
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
				PLACEHOLDER: '输入谷歌身份验证器提供的OTP',
				BUTTON: '启用2FA',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: '更改密码',
			ACTIVE: '激活',
			DIALOG: {
				SUCCESS: '成功更改密码',
			},
			FORM: {
				BUTTON: '更改密码',
				CURRENT_PASSWORD: {
					label: '当前密码',
					placeholder: '输入当前密码',
				},
				NEW_PASSWORD: {
					label: '新密码',
					placeholder: '输入新密码',
				},
				NEW_PASSWORD_REPEAT: {
					label: '确认新密码',
					placeholder: '重新输入新密码',
				},
			},
		},
		LOGIN: {
			TITLE: '登录记录',
			CONTENT: {
				TITLE: '交易记录',
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
	CURRENCY: '加密货币',
	TYPE: 'Type',
	TYPES_VALUES: {
		market: 'market',
		limit: 'limit',
	},
	TYPES: [
		{ value: 'market', label: '市价' },
		{ value: 'limit', label: '限价' },
	],
	SIDE: 'Side',
	SIDES_VALUES: {
		buy: '买入',
		sell: '卖出',
	},
	SIDES: [
		{ value: 'buy', label: '买入' },
		{ value: 'sell', label: '卖出' },
	],
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'on' },
		{ value: false, label: 'off' },
	],
	SIZE: '数量',
	PRICE: '价格',
	FEE: 'Fee',
	FEES: '手续费',
	LIMIT: 'Limit',
	TIME: 'Time',
	TIMESTAMP: 'Timestamp',
	MORE: 'More',
	VIEW: 'View',
	STATUS: '状态',
	AMOUNT: '数量',
	COMPLETE: 'Complete',
	PENDING: 'Pending',
	REJECTED: 'Rejected',
	ORDERBOOK: 'Order Book',
	CANCEL: 'Cancel',
	CANCEL_ALL: 'Cancel All',
	GO_TRADE_HISTORY: '前往交易历史',
	ORDER_ENTRY: '委托',
	TRADE_HISTORY: '交易记录',
	CHART: '价格表',
	ORDERS: '我的有效订单',
	TRADES: '我的交易记录',
	RECENT_TRADES: '最近交易', // ToDo
	PUBLIC_SALES: '实时成交', // ToDo
	REMAINING: 'Remaining',
	FULLFILLED: '{0} % Filled',
	PRICE_CURRENCY: 'PRICE',
	AMOUNT_SYMBOL: 'AMOUNT',
	MARKET_PRICE: '市场价格',
	ORDER_PRICE: '订购价格',
	TOTAL_ORDER: '订单总数',
	NO_DATA: '暂无数据',
	LOADING: 'Loading',
	CHART_TEXTS: {
		d: 'Date',
		o: 'Open',
		h: 'High',
		l: 'Low',
		c: 'Close',
		v: 'Volume',
	},
	QUICK_TRADE: '快速交易',
	PRO_TRADE: 'Pro交易',
	ADMIN_DASH: '管理页面',
	WALLET_TITLE: '钱包',
	TRADING_MODE_TITLE: '交易模式',
	TRADING_TITLE: '交易',
	LOGOUT: '退出',
	WITHDRAWALS_MIN_VALUE_ERROR: '交易金额太小导致无法发送，请尝试更高的金额',
	WITHDRAWALS_MAX_VALUE_ERROR: '交易金额太大导致无法发送，请尝试较小的金额',
	WITHDRAWALS_LOWER_BALANCE:
		'You don’t have enough {0} in your balance to send that transaction',
	WITHDRAWALS_FEE_TOO_LARGE:
		'The fee is more than {0}% of your total transaction',
	WITHDRAWALS_BTC_INVALID_ADDRESS: '比特币地址无效，请检查后重新输入',
	WITHDRAWALS_ETH_INVALID_ADDRESS: '以太坊地址无效，请检查后重新输入',
	WITHDRAWALS_BUTTON_TEXT: 'review withdrawal',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Destination address',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Type the address',
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} amount to withdraw',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'Transaction fee',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'Bank withdrawal fee',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'Type the amount of {0} you wish to use in the fee of the transaction',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'Optimal fee: {0} {1}', // TODO {0} -> amount {1} -> currency name
	DEPOSITS_FORM_AMOUNT_LABEL: '{0} amount to deposit',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	DEPOSITS_BUTTON_TEXT: 'review deposit',
	DEPOSIT_PROCEED_PAYMENT: 'Pay',
	DEPOSIT_BANK_REFERENCE:
		'Add this "{0}" code to the bank transation to identify the deposit',
	DEPOSIT_METHOD: '支付方式{0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: '信用卡',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1: '进入信用卡支付方式',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2: '将离开平台，进行支付',
	DEPOSIT_VERIFICATION_WAITING_TITLE: '支付确认中',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE: '请不要在核实付款人时关闭应用程序',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'如果在进行过程中出现问题，请联系客服中心。',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'This is the ID of the operation: "{0}", please provide us this ID to help you.',
	DEPOSIT_VERIFICATION_SUCCESS: '支付完成',
	DEPOSIT_VERIFICATION_ERROR: '充值核实出错',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: '充值已核实',
	DEPOSIT_VERIFICATION_ERROR_STATUS: '无效状态',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'充值的卡和注册的卡不一致，因此充值被拒绝，资金将在一小时内退还。',
	QUOTE_MESSAGE: 'You are going to {0} {1} {2} for {3} {4}',
	QUOTE_BUTTON: 'Accept',
	QUOTE_REVIEW: 'Review',
	QUOTE_COUNTDOWN_MESSAGE: 'You have {0} seconds to perform the trade',
	QUOTE_EXPIRED_TOKEN: 'The quote token has expired.',
	QUOTE_SUCCESS_REVIEW_TITLE: 'Quick Trade',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'You have successfully {0} {1} {2} for {3} {4}', // you have successfully buy 1 btc from x toman
	COUNTDOWN_ERROR_MESSAGE: 'Countdown is finished',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'Bank to Withdraw to',
		MESSAGE_ABOUT_SEND: 'You are about to send',
		MESSAGE_BTC_WARNING:
			'Please ensure the accuracy of this address since {0} transfers are irreversible',
		MESSAGE_ABOUT_WITHDRAW: 'You are about to transfer to your bank account',
		MESSAGE_FEE: 'Transactions fee of {0} ({1}) included',
		MESSAGE_FEE_BASE: 'Transactions fee of {0} included',
		BASE_MESSAGE_1:
			'You can only withdraw to a bank account in a name that matches the name registered with your HollaEx account.',
		BASE_MESSAGE_2: 'Withdrawal min amount',
		BASE_MESSAGE_3: 'Daily withdrawal max amount',
		BASE_INCREASE_LIMIT: 'Increase your daily limit',
		CONFIRM_VIA_EMAIL: 'Confirm via Email',
		CONFIRM_VIA_EMAIL_1: 'We have sent you a confirmation withdrawal email.',
		CONFIRM_VIA_EMAIL_2:
			'In order to complete the withdrawal process please confirm',
		CONFIRM_VIA_EMAIL_3: 'the withdrawal via your email within 5 minutes.',
		WITHDRAW_CONFIRM_SUCCESS_1: 'Your withdrawal is confirmed and sent.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'If you’d like to view your withdrawal please visit your withdrawal history page.',
		GO_WITHDRAWAL_HISTORY: 'Go To Withdrawal History',
	},
	WALLET_BUTTON_BASE_DEPOSIT: '充值',
	WALLET_BUTTON_BASE_WITHDRAW: '提款',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'receive',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'send',
	AVAILABLE_TEXT: 'Available',
	AVAILABLE_BALANCE_TEXT: 'Available {0} Balance: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Balance',
	CURRENCY_BALANCE_TEXT: '{0} Balance',
	WALLET_TABLE_AMOUNT_IN: `Amount in {0}`,
	WALLET_TABLE_TOTAL: '总计',
	WALLET_ALL_ASSETS: '全部资产',
	HIDE_TEXT: 'Hide',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Sellers',
	ORDERBOOK_BUYERS: 'Buyers',
	ORDERBOOK_SPREAD: '{0} spread', // 0 -> 660,000 T
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'Max',
	DATEFIELD_TOOGLE_DATE_GR: 'Gregorian calendar',
	VERIFICATION_WARNING_TITLE: 'Verification you bank details',
	VERIFICATION_WARNING_MESSAGE:
		'Before you withdraw, you need to verify your bank details.',
	ORDER_SPENT: 'Spent',
	ORDER_RECEIVED: 'Received',
	ORDER_SOLD: 'Sold',
	ORDER_BOUGHT: 'Bought',
	ORDER_AVERAGE_PRICE: 'Average price',
	ORDER_TITLE_CREATED: 'Successfully created a limit {0}', // 0 -> buy / sell
	ORDER_TITLE_FULLY_FILLED: '{0} order successfully filled', // 0 -> buy / sell
	ORDER_TITLE_PARTIALLY_FILLED: '{0} order partially filled', // 0 -> buy / sell
	ORDER_TITLE_TRADE_COMPLETE: '{0} {1} order was successful', // 0 -> buy / sell
	LOGOUT_TITLE: 'You have been logged out',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'Token is expired',
	LOGOUT_ERROR_LOGIN_AGAIN: 'Login again', // ip doesnt match
	LOGOUT_ERROR_INVALID_TOKEN: 'Invalid token',
	LOGOUT_ERROR_INACTIVE:
		'You have been logged out because you have been inactive',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	QUICK_TRADE_OUT_OF_LIMITS: 'Order size is out of the limits',
	QUICK_TRADE_TOKEN_USED: 'Token has been used',
	QUICK_TRADE_QUOTE_EXPIRED: 'Quote has expired',
	QUICK_TRADE_QUOTE_INVALID: 'Invalid quote',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'Error calculating the quote',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
		'The order with the current size can not be filled',
	QUICK_TRADE_ORDER_NOT_FILLED: 'Order is not filled',
	QUICK_TRADE_NO_BALANCE: 'Insufficient balance to perform the order',
	YES: 'Yes',
	NO: 'No',
	NEXT: 'Next',
	SKIP_FOR_NOW: 'Skip for now',
	SUBMIT: '提交',
	RESUBMIT: '重新提交',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Missing Documents!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'To get full access to withdrawal and deposit functions on HollaEx you must submit your identity documents in your account page.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Success!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'You will receive an email notification when your information has been processed. Processing can typically take 1-3 days.',
	VERIFICATION_NOTIFICATION_BUTTON: 'PROCEED TO HollaEx',
	ERROR_USER_ALREADY_VERIFIED: 'User already verified',
	ERROR_INVALID_CARD_USER: 'Bank or card information provided is incorrect',
	ERROR_INVALID_CARD_NUMBER: 'Invalid Card number',
	ERROR_LOGIN_USER_NOT_VERIFIED: 'User is not verified',
	ERROR_LOGIN_USER_NOT_ACTIVATED: 'User is not activated',
	ERROR_LOGIN_INVALID_CREDENTIALS: 'Credentials incorrect',
	SMS_SENT_TO: 'SMS sent to {0}', // TODO check msg
	SMS_ERROR_SENT_TO:
		'Error sending the SMS to {0}. Please refresh the page and try again.', // TODO check msg
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'Transaction ID:', // TODO check msg
	CHECK_ORDER: 'Check and confirm your order',
	CHECK_ORDER_TYPE: '{0} {1}', // 0 -> maker/limit  1 -> sell/buy
	CONFIRM_TEXT: 'Confirm',
	INVALID_CAPTCHA: 'Invalid captcha',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL: '语言设置（包括邮件）',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'Display order confirmation popup',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NO' },
		{ value: true, label: 'YES' },
	],
	SETTINGS_THEME_LABEL: '用户界面主题', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'White' },
		{ value: 'dark', label: 'Dark' },
	],
	SETTING_BUTTON: '保存',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: '提款失效',
	VERIFICATION_NO_WITHDRAW_MESSAGE: '你的账户已被禁止提款',
	UP_TO_MARKET: 'Up to market',
	VIEW_MY_FEES: '查看我的手续费', // new
	DEVELOPER_SECTION: {
		TITLE: 'API密钥',
		INFORMATION_TEXT:
			'该API提供的功能包括获取钱包余额、管理买入/卖出订单、请求提款以及最近交易、订单簿和行情等市场数据。',
		ERROR_INACTIVE_OTP: '若要生成API Kye，需要启用双因素认证（2FA）。',
		ENABLE_2FA: '启用谷歌验证',
		WARNING_TEXT: '不要与他人分享你的API Key',
		GENERATE_KEY: '生成API Kye',
		ACTIVE: '激活',
		INACTIVE: '禁用',
		INVALID_LEVEL: '需要升级你的验证级别，才能使用该功能', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: '生成API Key',
		GENERATE_TEXT:
			'请为你的API Kye命名，并在生成后将其保存为非公开，以后无法找回它。',
		GENERATE: '生成',
		DELETE_TITLE: '删除API Key',
		DELETE_TEXT:
			'虽然可以在任何时候生成一个新的API Key，但删除API Key是不可逆转的，你确定要删除API Kye吗？',
		DELETE: 'DELETE',
		FORM_NAME_LABEL: '名字',
		FORM_LABLE_PLACEHOLDER: 'AIi Key名称',
		API_KEY_LABEL: 'API Key',
		SECRET_KEY_LABEL: '秘钥',
		CREATED_TITLE: '复制API Key',
		CREATED_TEXT_1: 'API Key在以后无法确认，所以请复制。',
		CREATED_TEXT_2: '保持秘钥的私密性',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: '名称',
		API_KEY: 'API Key',
		SECRET: '保密',
		CREATED: '生成日期',
		REVOKE: '解除',
		REVOKED: '已解除',
		REVOKE_TOOLTIP: '必须启用2FA才可以解除token。', // TODO
	},
	CHAT: {
		CHAT_TEXT: '聊天',
		MARKET_CHAT: 'Market Chat',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: '阅读更多',
		SHOW_IMAGE: '显示图片',
		HIDE_IMAGE: '隐藏图片',
		CHAT_MESSAGE_BOX_PLACEHOLDER: '信息',
		SIGN_UP_CHAT: '注册聊天',
		JOIN_CHAT: '设置聊天用户名',
		TROLLBOX: 'Trollbox ({0})', // new
	},
	INVALID_USERNAME:
		'用户名长度必须在3~5个字符之间，只可包含小写、数字和下划线（_）',
	USERNAME_TAKEN: '该用户名已被注册，请重新输入。',
	USERNAME_LABEL: '用户名（聊天用名称）',
	USERNAME_PLACEHOLDER: '用户名',
	TAB_USERNAME: '用户名',
	USERNAME_WARNING: '用户名只可更改一次，请确保该用户名是最理想的。',
	USERNAME_CANNOT_BE_CHANGED: '用户名不可更改',
	UPGRADE_LEVEL: '升级账号级别',
	LEVELS: {
		LABEL_LEVEL: '级别',
		LABEL_LEVEL_1: 'One',
		LABEL_LEVEL_2: 'Two',
		LABEL_LEVEL_3: 'Three',
		LABEL_MAKER_FEE: 'Maker Fee',
		LABEL_TAKER_FEE: 'Taker Fee',
		LABEL_BASE_DEPOSIT: '每日欧元充值',
		LABEL_BASE_WITHDRAWAL: '每日欧元提款',
		LABEL_BTC_DEPOSIT: '每日比特币充值',
		LABEL_BTC_WITHDRAWAL: '每日比特币提款',
		LABEL_ETH_DEPOSIT: '每日以太坊充值',
		LABEL_ETH_WITHDRAWAL: '每日以太坊提款',
		LABEL_PAIR_MAKER_FEE: '{0} Maker Fee',
		LABEL_PAIR_TAKER_FEE: '{0} Taker Fee',
		UNLIMITED: '无限制',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: '生成{0}钱包',
	WALLET_ADDRESS_GENERATE: '生成',
	WALLET_ADDRESS_MESSAGE: '当生成一个钱包时，会创建一个充值和提款地址。',
	WALLET_ADDRESS_ERROR: '地址生成错误，请刷新再试。',
	DEPOSIT_WITHDRAW: '充值/提款',
	GENERATE_WALLET: '生成钱包',
	TRADE_TAB_CHART: '图表',
	TRADE_TAB_TRADE: '交易',
	TRADE_TAB_ORDERS: '订单',
	TRADE_TAB_POSTS: 'Posts', // new
	WALLET_TAB_WALLET: '钱包',
	WALLET_TAB_TRANSACTIONS: 'Transactions',
	RECEIVE_CURRENCY: '接收{0}',
	SEND_CURRENCY: '发送{0}',
	COPY_ADDRESS: '复制地址',
	SUCCESFUL_COPY: '成功复制！',
	QUICK_TRADE_MODE: '快速交易模式',
	JUST_NOW: 'just now',
	PAIR: 'Pair',
	ZERO_ASSET: '没有任何资产',
	DEPOSIT_ASSETS: '充值资产',
	SEARCH_TXT: '搜索',
	SEARCH_ASSETS: '搜索资产',
	TOTAL_ASSETS_VALUE: '总资产价值在{0}: {1}',
	SUMMARY: {
		TITLE: '摘要',
		TINY_PINK_SHRIMP_TRADER: 'Tiny Pink Shrimp Trader',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'Tiny Pink Shrimp Trader Account',
		LITTLE_RED_SNAPPER_TRADER: 'Little Red Snapper Trader',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'Little Red Snapper Trader Account',
		CUNNING_BLUE_KRAKEN_TRADING: 'Cunning Blue Kraken Trading',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: 'Cunning Blue Kraken Trading Account',
		BLACK_LEVIATHAN_TRADING: 'Black Leviathan Trading',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: 'Black Leviathan Trading Account',
		URGENT_REQUIREMENTS: 'Urgent Requirements',
		TRADING_VOLUME: 'Trading Volume',
		ACCOUNT_ASSETS: '账户资产',
		ACCOUNT_DETAILS: 'Account Details',
		SHRIMP_ACCOUNT_TXT_1: 'Your journey begins here!',
		SHRIMP_ACCOUNT_TXT_2:
			'Keep swimming true, you’ll soon stand out from the rest of the shoal',
		SNAPPER_ACCOUNT_TXT_1:
			'Congrats on staying your course through the swell of the market.',
		SNAPPER_ACCOUNT_TXT_2:
			'Forge through and fight the surge for more crypto treasures ahead.',
		KRAKEN_ACCOUNT_TXT_1:
			'Likelier to crack jokes than hulls, this crustacean has weathered his share of storms!',
		LEVIATHAN_ACCOUNT_TXT_1:
			'Beast from the abyss, seeing through altcoins into unfathomable depths, masters of midnight waters and tidal wave.',
		VIEW_FEE_STRUCTURE: '查看手续费结构和限额',
		UPGRADE_ACCOUNT: '升级账号',
		ACTIVE_2FA_SECURITY: '启用2FA验证',
		ACCOUNT_ASSETS_TXT_1: '显示的是所有资产的摘要',
		ACCOUNT_ASSETS_TXT_2:
			'持有大量资产将使你有权获得账户升级，其中包括一个独特的徽章和较低的交易手续费。',
		TRADING_VOLUME_TXT_1:
			'你的交易量历史记录显示在{0}中，是每个月末从所有交易对中计算出来的。',
		TRADING_VOLUME_TXT_2:
			'高交易活跃度将使你有资格获得账户升级，奖励你一个独特的徽章和其他特权。',
		ACCOUNT_DETAILS_TXT_1:
			'你的账户类型决定了你的账户徽章，交易手续费、充值和提款限额。',
		ACCOUNT_DETAILS_TXT_2:
			'你的交易账户年龄、活跃度和账户总资产将决定你的账户是否可以升级。',
		ACCOUNT_DETAILS_TXT_3:
			'为保持账户级别，需要不断进行交易并保持一定的存款资产。',
		ACCOUNT_DETAILS_TXT_4:
			'如果交易活动和资产没有得到维持，将定期对账户进行降级。',
		REQUIREMENTS: '必要条件',
		REQUEST_ACCOUNT_UPGRADE: '申请账户升级',
		FEES_AND_LIMIT: '{0}手续费及限额结构',
		FEES_AND_LIMIT_TXT_1:
			'开始加密货币交易意味着新的开始，用智慧、意志和速度来武装自己，只有承担风险和交易才能让你更新账户。',
		FEES_AND_LIMIT_TXT_2: '每个账户都有自己的手续费和存取款限额。',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: '充值和提款限额',
		TRADING_FEE_STRUCTURE: '交易手续费结构',
		WITHDRAWAL: '提款',
		DEPOSIT: '充值',
		TAKER: '吃单（Taker）',
		MAKER: '挂单（Maker）',
		WEBSITE: '网站',
		VIP_TRADER_ACCOUNT_ELIGIBLITY: 'VIP交易员账户升级资格',
		PRO_TRADER_ACCOUNT_ELIGIBLITY: '专业交易员账户升级资格',
		TRADER_ACCOUNT_ELIGIBILITY: '{0}级别资格',
		NOMINAL_TRADING: '名义交易',
		NOMINAL_TRADING_WITH_MONTH: '过去{0}名义上的交易',
		ACCOUNT_AGE_OF_MONTHS: '账户年龄为{0}个月',
		TRADING_VOLUME_EQUIVALENT: '{0} {1}交易量等值',
		LEVEL_OF_ACCOUNT: '{0}级账户',
		LEVEL_TXT_DEFAULT: '在此处添加你的等级描述',
		LEVEL_1_TXT:
			'加密交易员的旅程从这里开始！为了获得奖金，你可以验证身份，并获得更高的充值和提款限额、降低交易手续费。', // new
		LEVEL_2_TXT:
			'只需每月交易额超过3000美元或余额超过5000XHT以上，即可享受较低的交易手续费。', // new
		LEVEL_3_TXT:
			'这里是真正的交易场所！享受优惠的交易手续费和高额的充值和提款限额，要达到3级别，必须完成验证工作。', // new
		LEVEL_4_TXT:
			'只需每月交易额超过10000美元或余额超过10000XHT以上，即可享受较低的交易手续费。', // new
		LEVEL_5_TXT:
			'你已经成功了！5级账户是一个罕见的账户，仅适用于交易所运营商、Vault用户或HollaEx Affiliate Program(HAP)，可享受高额限额和零手续费（手续费）。', // new
		LEVEL_6_TXT:
			'只需每月交易额超过300000美元或余额超过100000XHT以上，即可享受较低的交易手续费，增加提款额度。', // new
		LEVEL_7_TXT:
			'只需每月交易额超过500000美元或余额超过300000XHT以上，即可享受较低的交易手续费，增加提款额度。 ', // new
		LEVEL_8_TXT:
			'只需每月交易额超过600000美元或余额超过400000XHT以上，即可先手较低的交易手续费。', // new
		LEVEL_9_TXT:
			'只需每月交易额超过2000000美元或余额超过1000000XHT以上，即可享受较低的交易手续费。', // new
		LEVEL_10_TXT:
			'鲸鱼（whale）交易员账户通过做市（market making）可获得利益。若要获得这个特殊账户，请与我们进行联系。', // new
		CURRENT_TXT: '当前',
		TRADER_ACCOUNT_XHT_TEXT:
			'你的账户处于XHT的预售期，这意味着你可以以$0.10的价格获得XHT，一旦交易完成，所有的押金将被转换为XHT。',
		TRADER_ACCOUNT_TITLE: '账户 - 预售期', // new
		HAP_ACCOUNT: 'HAP 账户', // new
		HAP_ACCOUNT_TXT:
			'你的账户是一个经过验证的HollaEx联盟计划账户，现在你每邀请一个购买XHT的用户，即可获得10%的奖金。 ', // new
		EMAIL_VERIFICATION: '邮箱验证', // new
		DOCUMENTS: '文件', // new
		HAP_TEXT: 'HollaEx联盟计划（HAP）{0}', // new
		LOCK_AN_EXCHANGE: '锁定交易所{0}', // new
		WALLET_SUBSCRIPTION_USERS: 'Vault订阅用户{0}', // new
		TRADE_OVER_XHT: '交易额查过{0} USDT', // new
		TRADE_OVER_BTC: '交易额查过{0} BTC', // new
		XHT_IN_WALLET: '{0}钱包里的XHT', // new
		REWARDS_BONUS: '奖励和奖金', // new
		COMPLETE_TASK_DESC: '完成任务，获取价值超过10000美元的奖金。', // new
		TASKS: '任务', // new
		MAKE_FIRST_DEPOSIT: '首次充值可获得1XHT', // new
		BUY_FIRST_XHT: '购买第一个XHT，可获得5XHT的奖励。', // new
		COMPLETE_ACC_VERIFICATION: '完成开户验证获得20XHT', // new
		INVITE_USER: '邀请用户并享受佣金', // new
		JOIN_HAP: '加入HAP，每售出HollaEx Kit，就能获取10%的利润。', // new
		EARN_RUNNING_EXCHANGE: '经营自己的交易所，赚取被动收入。', // new
		XHT_WAVE_AUCTION: 'XHT波段拍卖数据', // new
		XHT_WAVE_DESC_1: 'HollaEx 代币（XHT）的分发是通过波段拍卖完成的。', // new
		XHT_WAVE_DESC_2:
			'波段拍卖会在随机的时间向订单簿上出价最高的竞拍者随机出售一定数量的XHT。', // new
		XHT_WAVE_DESC_3: '下方显示的是波段拍卖的历史数据。', // new
		WAVE_AUCTION_PHASE: '波段拍卖阶段{0}', // new
		LEARN_MORE_WAVE_AUCTION: '了解更多关于波段拍卖的信息', // new
		WAVE_NUMBER: '波段号', // new
		DISCOUNT: '( {0}%折扣 )', // new
		MY_FEES_LIMITS: ' 我的手续费及限额', // ne
	},
	REFERRAL_LINK: {
		TITLE: '邀请好友', // new
		INFO_TEXT: '通过共享连接推荐给好友，并通过好友加入获得奖励。', // new
		INFO_TEXT_1:
			'通过用户的推荐加入并进行交易的好友，将每月获得该用户交易手续费的{0}%。', // new
		COPY_FIELD_LABEL: '与好友分享下方连接，并获取佣金:', // new
		REFERRED_USER_COUT: '你已经推荐了{0}个用户', // new
		COPY_LINK_BUTTON: '复制推荐链接', // new
		XHT_TITLE: '我的推荐', // new
		XHT_INFO_TEXT: '通过邀请好友获取佣金', // new
		XHT_INFO_TEXT_1: '佣金会定期支付到你的钱包中。', // new
		APPLICATION_TXT: '若要成为HollaEx Kit经销商，请填写一份申请书。', // new
		TOTAL_REFERRAL: 'Total bought from referrals:', // new
		PENDING_REFERRAL: 'Commissions Pending:', // new
		EARN_REFERRAL: 'Commissions Earn:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'APPLY', // new
	},
	STAKE_TOKEN: {
		TITLE: 'HollaEx代币股份', // new
		INFO_TXT1:
			'HollaEx 代币（XHT）需要抵押（押注）才可以运行HollaEx Kit交易软件。', // new
		INFO_TXT2:
			'可以以类似的方式抵押你的HollaEx 代币，并获取波段拍卖期间未售出的XHT。', // new
		INFO_TXT3:
			'简单来说，只要访问dash.bitholla.com，今天就可以到交易所做抵押，免费获取XHT。', // new
		BUTTON_TXT: '了解更多', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'HollaEx 代币购买协议',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: '进行',
		AGREE_TERMS_LABEL: '我已阅读并同意HollaEx 代币购买协议',
		RISK_INVOLVED_LABEL: '我了解其中的风险',
		DOWNLOAD_PDF: '下载PDF',
		DEPOSIT_FUNDS: '将资金存入你的钱包中，以获得HollaEx 代币（XHT）。',
		READ_FAG: '阅读HollaEx FAQ : {0}',
		READ_DOCUMENTATION: '点击这里阅读HollaEx 白皮书: {0}',
		READ_WAVES: '查看波段拍卖规则{0}', // new
		DOWNLOAD_BUY_XHT: '下载PDF文件，在{0}上确认可视化的步骤过程。',
		HOW_TO_BUY: '如何购买HollaEx 代币（XHT）？',
		PUBLIC_SALES: '公开波段拍卖', // new
		CONTACT_US: '如有任何问题，欢迎发送邮件至{0}，与我们进行联系。',
		VISUAL_STEP: '在{0}上确认直观的步骤流程。', // new
		WARNING_TXT:
			'我们将审查你的请求，并向你的电子邮件发送进一步的指示，说明如何访问HollaEx交易所。', // new
		WARNING_TXT1: '同时，你可以通过以下资源熟悉HollaEx网络。', // new
		XHT_ORDER_TXT_1: '要开始交易，必须先进行登录', // new
		XHT_ORDER_TXT_2:
			'HollaEx 토큰은 매일 랜덤으로 정해진 수량이 랜덤으로 정해진 시간에 주문서에서 가장 높은 금액을 호가한 매수자에게 판매되는 웨이브옥션을 통해 배포됩니다.', // new
		XHT_ORDER_TXT_3: '{0}或{1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: '登录查看近期交易', //new
		XHT_TRADE_TXT_2: '可以{0}查看近期交易记录', //new
		LOGIN_HERE: '在此登录',
	},
	WAVES: {
		// new
		TITLE: 'Wave Info',
		NEXT_WAVE: 'Next Wave',
		WAVE_AMOUNT: 'Amount in Wave',
		FLOOR: 'Floor',
		LAST_WAVE: 'Last wave',
	},
	TYPES_OF_POSTS: {
		// new
		TITLE: 'POSTS',
		ANNOUNCEMEN: 'Announcement',
		SYSTEM_UPDATE: 'System Update',
		LAST_WAVE: 'Last Wave',
		ANNOUNCEMENT_TXT: 'Free XHT will be distributed to all wallets that apply',
		SYSTEM_UPDATE_TIME: 'Time: 12:31 PM, December 19th, 2019	',
		SYSTEM_UPDATE_DURATION: '1 hour',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: ' 12: 31 PM, December 19th, 2019',
	},
	USER_LEVEL: '用户级别', // new
	LIMIT_AMOUNT: '限额', // new
	FEE_AMOUNT: '手续费金额', // new
	COINS: '币', // new
	PAIRS: '对', // new
	NOTE_FOR_EDIT_COIN: '注:关于{0}的添加和删除请参考{1}', // new
	REFER_DOCS_LINK: '文件', // new
	RESTART_TO_APPLY: '需要重新启动交易所才能应用这些更改。', // new
	TRIAL_EXCHANGE_MSG: '你使用的是{0}的试用版，它将在{1}天后失效。', // new
	EXPIRY_EXCHANGE_MSG:
		'你的交易所已经过期，请前往dash.bitholla.com重新进行激活。', // new
	EXPIRED_INFO_1: '试验版已经结束', // new
	EXPIRED_INFO_2: '抵押你的交易所，再次激活它。', // new
	EXPIRED_BUTTON_TXT: '激活交易所', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: '公告',
		ANNOUNCEMNT_TXT_3:
			'公开发行和波段拍卖改期至2020年1月1日，现已开放钱包充值和提款功能。',
		ANNOUNCEMNT_TXT_4:
			'新年快乐Hollaers！从2020年开始，我们将在大家的帮助下推出最开放的交易平台，再创辉煌。',
		ANNOUNCEMNT_TXT_1: '邀请好友到交易所，以获取XHT与HAP计划。 {0}.',
		DEFAULT_ANNOUNCEMENT: '此部分显示你的交易所公告！',
		ANNOUNCEMENT_TXT_2: '免费的XHT将分配给所有钱包{0}',
		LEARN_MORE: '了解更多',
		APPLY_TODAY: '立即申请', // new
	},
	OPEN_WALLET: 'Open 钱包', // new
	AGO: 'ago', // new
};
