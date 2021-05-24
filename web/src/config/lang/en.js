import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';
import flatten from 'flat';

const options = { safe: true };
const nestedContent = {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Open Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: 'Are you sure?. Do you want to logout',
	ADD_TRADING_PAIR: 'Select a market',
	ACTIVE_TRADES: 'You must {0} to access your active trades',
	CANCEL_BASE_WITHDRAWAL: 'Cancel {0} Withdrawal',
	CANCEL_WITHDRAWAL: 'Cancel Withdrawal',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM:
		'Do you want to cancel your pending withdrawal of:',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'Login',
	SIGN_IN: 'Sign In',
	SIGNUP_TEXT: 'Sign up',
	REGISTER_TEXT: 'Register',
	ACCOUNT_TEXT: 'Account',
	HOME_TEXT: 'Home',
	CLOSE_TEXT: 'Close',
	COPY_TEXT: 'Copy',
	COPY_SUCCESS_TEXT: 'Successfully Copied',
	CANCEL_SUCCESS_TEXT: 'Successfully Cancelled!',
	UPLOAD_TEXT: 'Upload',
	ADD_FILES: 'ADD FILES', // ToDo
	OR_TEXT: 'Or',
	CONTACT_US_TEXT: 'Contact us',
	HELPFUL_RESOURCES_TEXT: 'Helpful resources',
	HELP_RESOURCE_GUIDE_TEXT:
		'Feel free to contact us for more information and any issues by sending us an email',
	HELP_RESOURCE_GUIDE: {
		CONTACT_US: 'contact us',
		TEXT:
			'Feel free to {0} for more information and any issues by sending us an email',
	},
	HELP_TELEGRAM_TEXT: 'Check out open API documentation:',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: 'Need help?', // new
	HELP_TEXT: 'help',
	SUCCESS_TEXT: 'Success',
	ERROR_TEXT: 'Error',
	PROCEED: 'PROCEED',
	EDIT_TEXT: 'Edit',
	BACK_TEXT: 'Back',
	NO_OPTIONS: 'No options availables',
	SECONDS: 'seconds',
	VIEW_MARKET: 'view market', // new
	GO_TRADE: 'Go Trade', // new
	VIEW_INFO: 'View info page', // new
	APPLY_HERE: 'Apply Here', // new
	CONVERT: 'Convert', // new
	TO: 'To', // new
	HOME: {
		MAIN_TITLE: 'Cryptocurrency trading exchange',
		MAIN_TEXT:
			'Easily buy and sell crypto assets. Simply sign up with your email and trade the major crypto assets 24/7.',
		TRADE_CRYPTO: 'Start trading',
		VIEW_EXCHANGE: 'View exchange',
		SECTION_1_TITLE: 'Welcome to HollaEx Exchange Kit!',
		SECTION_1_TEXT_1:
			'Build your own scalable digital asset exchange with HollaEx Kit and be part of the future of finance.',
		SECTION_1_TEXT_2:
			'We strive to bring the financial technology forward through affordable and simple access to trading technology.',
		SECTION_1_BUTTON_1: 'Learn more',
		SECTION_3_TITLE: 'Features',
		SECTION_3_CARD_1_TITLE: 'SCALABLE MATCHING ENGINE',
		SECTION_3_CARD_1_TEXT:
			'High performance and scalable order matching engine using the most efficient algorithms',
		SECTION_3_CARD_2_TITLE: 'BANK INTEGRATION',
		SECTION_3_CARD_2_TEXT:
			'Plugins with customizable modules available for bank integration. We know the traditional finance and can help you to make your exchange local',
		SECTION_3_CARD_3_TITLE: 'STRONG SECURITY',
		SECTION_3_CARD_3_TEXT:
			'HollaEx uses the best security practices and the most secure and reliable algorithms for keeping the funds secure. It is our top priority and we took a very special extra care of it.',
		SECTION_3_CARD_4_TITLE: 'ADVANCED REPORTING',
		SECTION_3_CARD_4_TEXT:
			'Admin panel with customizable email and reports for notifying support and administrator about the status of the system and transactions.',
		SECTION_3_CARD_5_TITLE: 'SUPPORT',
		SECTION_3_CARD_5_TEXT:
			'We can take an extra care for your needs and have an online professional to help with your issues and inquiries.',
		SECTION_3_CARD_6_TITLE: 'KYC INTEGRATION',
		SECTION_3_CARD_6_TEXT:
			'Flexible and integrable modules to apply KYC and user verification methods in different jurisdiction.',
		SECTION_3_BUTTON_1: 'View Demo',
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
		TERMS_OF_SERVICE: 'Terms of Service',
		PRIVACY_POLICY: 'Privacy Policy',
		SECTIONS: {
			SECTION_1_TITLE: 'ABOUT',
			SECTION_1_LINK_1: 'About Us',
			SECTION_1_LINK_2: 'Terms of Use',
			SECTION_1_LINK_3: 'Privacy Policy',
			SECTION_1_LINK_4: 'Contact Us',
			SECTION_2_TITLE: 'Information',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Contact Us',
			SECTION_2_LINK_3: 'Career',
			SECTION_3_TITLE: 'DEVELOPERS',
			SECTION_3_LINK_1: 'Documentation',
			SECTION_3_LINK_2: 'Forum',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'Library',
			SECTION_3_LINK_5: 'API doc',
			SECTION_3_LINK_6: 'Trading API',
			SECTION_3_LINK_7: 'Developer tools',
			SECTION_3_LINK_8: 'Documnetation',
			SECTION_4_TITLE: 'EXCHANGE',
			SECTION_4_LINK_1: 'Login',
			SECTION_4_LINK_2: 'Register',
			SECTION_4_LINK_3: 'Contact Us',
			SECTION_4_LINK_4: 'Terms of Use',
			SECTION_5_TITLE: 'RESOURCES',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'HollaEx Token (XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'FAQ', // new
			SECTION_6_TITLE: 'SOCIAL',
			SECTION_6_LINK_1: 'Twitter',
			SECTION_6_LINK_2: 'Telegram',
			SECTION_6_LINK_3: 'Facebook', // new
			SECTION_6_LINK_4: 'Instagram', // new
			SECTION_6_LINK_5: 'Linkedin', // new
			SECTION_6_LINK_6: 'Website', // new
			SECTION_6_LINK_7: 'Helpdesk', // new
			SECTION_6_LINK_8: 'Information', // new
			SECTION_6_LINK_9: 'YouTube', // new
		},
		XHT_DESCRIPTION:
			'HollaEx Kit is an open source trading platform built by bitHolla Inc. You can create and list any digital assets and onboard users to trade on your exchange using this exchange Kit. In order to simply run one yourself {1}.',
		CLICK_HERE: 'click here',
		VISIT_HERE: 'visit here',
	},
	ACCOUNTS: {
		TITLE: 'Account',
		TAB_VERIFICATION: 'Verification',
		TAB_SECURITY: 'Security',
		TAB_NOTIFICATIONS: 'Notifications',
		TAB_SETTINGS: 'Settings',
		TAB_PROFILE: 'Profile',
		TAB_WALLET: 'Wallet',
		TAB_SUMMARY: 'Summary',
		TAB_HISTORY: 'History',
		TAB_API: 'API',
		TAB_SIGNOUT: 'Signout',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: 'Request Access',
		REQUEST_INVITE: 'Request Invite',
		CATEGORY_PLACEHOLDER: 'Select the category that best suits your issue',
		INTRODUCTION_LABEL: 'Introduce yourself',
		INTRODUCTION_PLACEHOLDER:
			'Where are you based, are you interested in running an exchange?',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'Category',
		CATEGORY_PLACEHOLDER: 'Select the category that best suits your issue',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'User verification',
			OPTION_LEVEL: 'Increase user level',
			OPTION_DEPOSIT: 'Deposit & Withdrawal',
			OPTION_BUG: 'Report bug', // ToDo:
			OPTION_PERSONAL_INFO: 'Change personal information', // ToDo:
			OPTION_BANK_TRANSFER: 'Bank wire transfer', // new
			OPTION_REQUEST: 'Request Invite for the HollaEx Exchange', // new
		},
		SUBJECT_LABEL: 'Subject',
		SUBJECT_PLACEHOLDER: 'Type the subject of your issue',
		DESCRIPTION_LABEL: 'Description',
		DESCRIPTION_PLACEHOLDER: 'Type in detail what the issue is',
		ATTACHMENT_LABEL: 'Add attachments(3 max)', // ToDo:
		ATTACHMENT_PLACEHOLDER:
			'Add a file to help communicate your issue. PDF, JPG, PNG and GIF files are accepted',
		SUCCESS_MESSAGE: 'The email has been seent to our support',
		SUCCESS_TITLE: 'Message Sent',
		SUCCESS_MESSAGE_1: 'Your issue has been sent to customer support.',
		SUCCESS_MESSAGE_2: 'You can expect a reply in 1-3 days.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'Your {0} receiving address', // new
			DESTINATION_TAG: 'Your {0} destination tag', // new
			MEMO: 'Your {0} memo', // new
			BTC: 'Your Bitcoin receiving address',
			ETH: 'Your Ethereum receiving address',
			BCH: 'Your Bitcoin Cash receiving address',
		},
		INCREASE_LIMIT: 'Want to increase your daily limit?',
		QR_CODE:
			'This QR Code can be scanned by the person who wants to send you funds',
		NO_DATA: 'No information available',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: 'Login to {0}',
		CANT_LOGIN: "Can't login?",
		NO_ACCOUNT: "Don't have an account?",
		CREATE_ACCOUNT: 'Create one here',
		HELP: 'Help',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'Email',
		EMAIL_PLACEHOLDER: 'Type your Email address',
		PASSWORD_LABEL: 'Password',
		PASSWORD_PLACEHOLDER: 'Type your password',
		PASSWORD_REPEAT_LABEL: 'Retype your password',
		PASSWORD_REPEAT_PLACEHOLDER: 'Retype your password',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'Provide OTP code to login',
		CAPTCHA: 'Expired Session. Please refresh the page',
		FROZEN_ACCOUNT: 'This account is frozen',
		INVALID_EMAIL: 'Invalid email address',
		TYPE_EMAIL: 'Type your E-mail',
		REQUIRED: 'Required field',
		INVALID_DATE: 'Invalid date',
		INVALID_PASSWORD:
			'Invalid password. It has to contain at least 8 characters, a digit in the password and a special character.',
		INVALID_PASSWORD_2:
			'Invalid password. It has to contain at least 8 characters, at least one digit and one character.',
		INVALID_CURRENCY: 'Invalid {0} address ({1})',
		INVALID_BALANCE:
			'Insufficient balance available ({0}) to perform the operation ({1}).',
		MIN_VALUE: 'Value must be {0} or higher.',
		MAX_VALUE: 'Value must be {0} or lower.',
		MIN_VALUE_NE: 'Value must be higher than {0}.',
		MAX_VALUE_NE: 'Value must be lower than {0}.',
		INSUFFICIENT_BALANCE: 'Insufficient balance',
		PASSWORDS_DONT_MATCH: "Password don't match",
		USER_EXIST: 'Email has already been registered',
		ACCEPT_TERMS: 'You have not agreed to the Terms of use and Privacy Policy',
		STEP: 'Invalid value, step is {0}',
		ONLY_NUMBERS: 'Value can contain only numbers',
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
			START_TRADING: 'start trading',
			SEE_HISTORY: 'see history',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} Deposit received',
			TITLE_INCOMING: 'Incoming {0}',
			SUBTITLE_RECEIVED: 'You’ve received your {0} deposit',
			SUBTITLE_INCOMING: 'You have incoming {0}',
			INFORMATION_PENDING_1:
				'Your {0} require 1 confirmations before you can begin trading.',
			INFORMATION_PENDING_2:
				'This may take 10-30 minutes. We will send an email once your {0} is confirmed on the blockchain.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: 'Request Sent',
		BUTTON_TEXT: 'Okay',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: 'Enter your authentication code to continue',
		OTP_LABEL: 'OTP Code',
		OTP_PLACEHOLDER: 'Enter the authentication code',
		OTP_TITLE: 'Authenticator Code',
		OTP_HELP: 'help',
		OTP_BUTTON: 'submit',
		ERROR_INVALID: 'Invalid OTP Code',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Quick Trade', // updated
		TOTAL_COST: 'Total cost',
		BUTTON: 'Review Order', // updated
		INPUT: '{0} to {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: 'previous page',
	NEXT_PAGE: 'next page',
	WALLET: {
		LOADING_ASSETS: 'Loading assets...', // new
		TOTAL_ASSETS: 'Total Assets',
		AVAILABLE_WITHDRAWAL: 'Available for trading',
		AVAILABLE_TRADING: 'Available for withdrawal',
		ORDERS_PLURAL: 'orders',
		ORDERS_SINGULAR: 'order',
		HOLD_ORDERS:
			'You have {0} open {1}, resulting in a hold of {2} {3} placed on your {4} balance',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'Account Recovery',
		SUBTITLE: `Recover your account below`,
		SUPPORT: 'Contact Support',
		BUTTON: 'Send recovery link',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'Password reset sent',
		TEXT:
			'If an account exists for the email address, an email has been sent to it with reset instructions. Please check your email and click the link to complete your password reset.',
	},
	RESET_PASSWORD: {
		TITLE: 'Set new password',
		SUBTITLE: 'Set new password',
		BUTTON: 'Set new password',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'You’ve successfully set up a new password.',
		TEXT_2: 'Click login below to proceed.',
	},
	SIGN_UP: {
		SIGNUP_TO: 'Sign up to {0}',
		NO_EMAIL: "Haven't received the email?",
		REQUEST_EMAIL: 'Request another one here',
		HAVE_ACCOUNT: 'Already have an account?',
		GOTO_LOGIN: 'Go to the login page',
		AFFILIATION_CODE: 'Referral code (optional)',
		AFFILIATION_CODE_PLACEHOLDER: 'Type your referral code',
		TERMS: {
			terms: 'General Terms',
			policy: 'Privacy Policy',
			text: 'I have read and agree to the {0} and {1}',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'Email sent',
		TEXT_1: 'Check your email and click the link to verifiy your email.',
		TEXT_2:
			'If you have not received any email verification and you have checked your junk mail then you can try clicking resend below.',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'Resend Email Request',
		BUTTON: 'Request Email',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'Resent Email',
		TEXT_1:
			'If after a few minutes you still have not received an email verification then please contact us below.',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'Invalid code',
		TEXT_1: "You've successfully verified your email.",
		TEXT_2: 'You can now proceed to login',
	},
	USER_VERIFICATION: {
		INFO_TXT:
			'Here you can monitor your progress towards verification and an account upgrades.',
		INFO_TXT_1:
			'Please submit the relevant information needed for each section below.Only when all sections have submissions completed will your information be reviewed and approved for an account upgrade.',
		INFO_TXT_2:
			'* Verification for the identity section require you to {0} certain documents.',
		DOCUMENTATIONS: 'upload',
		COMPLETED: 'Completed',
		PENDING_VERIFICATION: 'Pending verification',
		TITLE_EMAIL: 'Email',
		MY_EMAIL: 'My Email',
		MAKE_FIRST_DEPOSIT: 'Make first deposit', // new
		OBTAIN_XHT: 'Obtain XHT', // new
		TITLE_USER_DOCUMENTATION: 'Identification',
		TITLE_ID_DOCUMENTS: 'Upload',
		TITLE_BANK_ACCOUNT: 'Bank Account',
		TITLE_MOBILE_PHONE: 'Mobile Phone',
		TITLE_PERSONAL_INFORMATION: 'Personal Information',
		VERIFY_EMAIL: 'Verify email',
		VERIFY_MOBILE_PHONE: 'Verify mobile phone',
		VERIFY_USER_DOCUMENTATION: 'Verify user documentation',
		VERIFY_ID_DOCUMENTS: 'Verify id documents',
		VERIFY_BANK_ACCOUNT: 'Verify bank account',
		BUTTON: 'Submit Verification Request',
		TITLE_IDENTITY: 'Identity',
		TITLE_MOBILE: 'Mobile',
		TITLE_MOBILE_HEADER: 'Mobile Phone Number',
		TITLE_BANK: 'Bank',
		TITLE_BANK_HEADER: 'Bank Details',
		CHANGE_VALUE: 'Change value',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'Your personal information is being processed',
		PENDING_VERIFICATION_BANK: 'Your bank details are being verified',
		PENDING_VERIFICATION_DOCUMENTS: 'Your documents are being verified',
		GOTO_VERIFICATION: 'Go to verification',
		GOTO_WALLET: 'Go to wallet', // new
		CONNECT_BANK_ACCOUNT: 'Connect Bank Account',
		ACTIVATE_2FA: 'Activate 2FA',
		INCOMPLETED: 'Incompleted',
		BANK_VERIFICATION: 'Bank Verification',
		IDENTITY_VERIFICATION: 'Identity Verification',
		PHONE_VERIFICATION: 'Phone Verification',
		DOCUMENT_VERIFICATION: 'Document Verification',
		START_BANK_VERIFICATION: 'Start Bank Verification',
		START_IDENTITY_VERIFICATION: 'Start Identity Verification',
		START_PHONE_VERIFICATION: 'Start Phone Verification',
		START_DOCUMENTATION_SUBMISSION: 'Start Documentation Submission',
		GO_BACK: 'Go Back',
		BANK_VERIFICATION_TEXT_1:
			'You can add your bank accounts here and get the verified. International bank accounts will require you contacting customer support and will have limited withdrawal limits.',
		BANK_VERIFICATION_TEXT_2:
			'By verifying your bank account you can obtain the following:',
		BASE_WITHDRAWAL: 'Fiat withdrawal',
		BASE_DEPOSITS: 'Fiat deposits',
		ADD_ANOTHER_BANK_ACCOUNT: 'Add Another Bank Account',
		BANK_NAME: 'Bank Name',
		ACCOUNT_NUMBER: 'Account Number',
		CARD_NUMBER: 'Card Number',
		BANK_VERIFICATION_HELP_TEXT:
			'In order for this section to be verified you must complete the {0} section.',
		DOCUMENT_SUBMISSION: 'Document Submission',
		REVIEW_IDENTITY_VERIFICATION: 'Review Identity Verification',
		PHONE_DETAILS: 'Phone Details',
		PHONE_COUNTRY_ORIGIN: 'Phone Country of Origin',
		MOBILE_NUMBER: 'Mobile Number',
		DOCUMENT_PROOF_SUBMISSION: 'Document Proof Submission',
		START_DOCUMENTATION_RESUBMISSION: 'Start Documentation Re-Submission',
		SUBMISSION_PENDING_TXT:
			'*This section has already been submitted. Making changes and resubmitting will overwrite your previous information.',
		CUSTOMER_SUPPORT_MESSAGE: 'Customer Support Message',
		DOCUMENT_PENDING_NOTE:
			'Your documents is submitted and is pending for review. Please be patient.',
		DOCUMENT_VERIFIED_NOTE: 'Your documents are completed.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: 'Note from the verification department',
		CODE_EXPIRES_IN: 'Code expires in',
		EMAIL_VERIFICATION: 'Send verification email',
		VERIFICATION_SENT: 'Verification Sent',
		VERIFICATION_SENT_INFO:
			'Check your email and click the link to verify email.',
		OKAY: 'Okay',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'First name',
				FIRST_NAME_PLACEHOLDER:
					'Type your first name as it appears on your identity document',
				LAST_NAME_LABEL: 'Last name',
				LAST_NAME_PLACEHOLDER:
					'Type your last name as it appears on your identity document',
				FULL_NAME_LABEL: 'Your Full Name',
				FULL_NAME_PLACEHOLDER:
					'Type your full name as it appears on your identity document',
				GENDER_LABEL: 'Gender',
				GENDER_PLACEHOLDER: 'Type what gender your are',
				GENDER_OPTIONS: {
					MAN: 'Male',
					WOMAN: 'Female',
				},
				NATIONALITY_LABEL: 'Nationality',
				NATIONALITY_PLACEHOLDER:
					'Type what nationality is on your identity document',
				DOB_LABEL: 'Date of birth',
				COUNTRY_LABEL: 'Country you reside',
				COUNTRY_PLACEHOLDER: 'Select the country you reside in currently',
				CITY_LABEL: 'City',
				CITY_PLACEHOLDER: 'Type the city you live in',
				ADDRESS_LABEL: 'Address',
				ADDRESS_PLACEHOLDER: 'Type the address you are currently living',
				POSTAL_CODE_LABEL: 'Postal code',
				POSTAL_CODE_PLACEHOLDER: 'Type your postal code',
				PHONE_CODE_LABEL: 'Country',
				PHONE_CODE_PLACEHOLDER: 'Select the country your phone is connected to',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: 'Phone number',
				PHONE_NUMBER_PLACEHOLDER: 'Type your phone number',
				CONNECTING_LOADING: 'Connecting',
				SMS_SEND: 'Send SMS',
				SMS_CODE_LABEL: 'SMS Code',
				SMS_CODE_PLACEHOLDER: 'Input your SMS code',
			},
			INFORMATION: {
				TEXT:
					'IMPORTANT: Enter your name into the fields exactly as it appears on your identity document (full first name, any middle names/initials and full last name(s)). Are you a business? Contact customer support for a corporate account.',
				TITLE_PERSONAL_INFORMATION: 'Personal Information',
				TITLE_PHONE: 'Phone',
				PHONE_VERIFICATION_TXT:
					'Providing valid contact details will assist us greatly in conflict resolution while preventing unwanted transactions on your account.',
				PHONE_VERIFICATION_TXT_1:
					'Receive real-time updates for deposits and withdrawals by sharing your mobile phone number.',
				PHONE_VERIFICATION_TXT_2:
					'Further prove your identity and address by sharing your LAN phone number (optional).',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'Please select a type of identity document',
				ID_NUMBER: 'Please type your documents number',
				ISSUED_DATE: 'Please select the date in which your document was issued',
				EXPIRATION_DATE:
					'Please select the date when your document will expire',
				FRONT: 'Please upload a scan of your passport',
				PROOF_OF_RESIDENCY:
					'Please upload a scan of document proving the address you current reside',
				SELFIE_PHOTO_ID: 'Please upload a selfie with passport and note',
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'ID Document Type',
				TYPE_PLACEHOLDER: 'Select Type of identity document',
				TYPE_OPTIONS: {
					ID: 'ID',
					PASSPORT: 'Passport',
				},
				ID_NUMBER_LABEL: 'Passport Number',
				ID_NUMBER_PLACEHOLDER: 'Type your passport number',
				ID_PASSPORT_NUMBER_LABEL: 'Passport Number',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'Type your passport number',
				ISSUED_DATE_LABEL: 'Passport Issue Date',
				EXPIRATION_DATE_LABEL: 'Passport Expiration Date',
				FRONT_LABEL: 'Passport',
				FRONT_PLACEHOLDER: 'Add a copy of your passport',
				BACK_LABEL: 'Back Side of passport',
				BACK_PLACEHOLDER:
					'Add a copy of the backside of your ID (if applicable)',
				PASSPORT_LABEL: 'Passport Document',
				PASSPORT_PLACEHOLDER: 'Add a copy of your Passport document',
				POR_LABEL: 'Document proving your address',
				POR_PLACEHOLDER: 'Add a copy of a document that proves your address',
				SELFIE_PHOTO_ID_LABEL: 'Your Selfie with passport and Note',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'Add a copy of your Selfie with passport and Note',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'Identity Document',
				PROOF_OF_RESIDENCY: 'Proof of residence',
				ID_SECTION: {
					TITLE: 'Please make sure that your submitted documents are:',
					LIST_ITEM_1:
						'HIGH QUALITY (colour images, 300dpi resolution or higher).',
					LIST_ITEM_2: 'VISIBLE IN THEIR ENTIRETY (watermarks are permitted).',
					LIST_ITEM_3: 'VALID, with the expiry date clearly visible.',
					WARNING_1:
						'Only a valid passport is acceptedt; high quality photos or scanned images of these documents are acceptable:',
					WARNING_2:
						'Make sure you are uploading your own documents. Any usage of wrong or fake documents will have legal consequences and result in freezing your account immediately.',
					WARNING_3:
						'Please do not submit the passport as your proof of residence.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'To avoid delays when verifying your account, please make sure:',
					SECTION_1_TEXT_2:
						'Your NAME, ADDRESS, ISSUE DATE and ISSUER are clearly visible.',
					SECTION_1_TEXT_3:
						'The submitted proof of residence document is NOT OLDER THAN THREE MONTHS.',
					SECTION_1_TEXT_4:
						'You submit color photographs or scanned images in HIGH QUALITY (at least 300 DPI)',
					SECTION_2_TITLE: 'AN ACCEPTABLE PROOF OF RESIDENCE IS:',
					SECTION_2_LIST_ITEM_1: 'A bank account statement.',
					SECTION_2_LIST_ITEM_2:
						'A utility bill (electricity, water, internet, etc.).',
					SECTION_2_LIST_ITEM_3:
						'A government-issued document (tax statement, certificate of residency, etc.).',
					WARNING:
						'We cannot accept the address on your submitted identity document as a valid proof of residence.',
				},
				SELFIE: {
					TITLE: 'Selfie with passport and Note',
					INFO_TEXT:
						"Please provide a photo of you holding your passport. In the same picture and have a reference to the exchange url’, today's date and your signature displayed.Make sure your face is clearly visible and that your ID details are clearly readable.",
					REQUIRED: 'Required:',
					INSTRUCTION_1: 'Your face clearly visable',
					INSTRUCTION_2: 'Passport clearly readable',
					INSTRUCTION_3: 'Write the exchange name',
					INSTRUCTION_4: "Write today's date",
					INSTRUCTION_5: 'Write your signature',
					WARNING:
						'Selfie with a different passport with uploaded content will be rejected',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'Please type your first and last name as associated with your bank account',
				ACCOUNT_NUMBER:
					'Your bank account number should be less than 50 digits',
				ACCOUNT_NUMBER_MAX_LENGTH:
					'Your bank account number has a limit of 50 characters',
				CARD_NUMBER: 'Your card number has an incorrect format',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'Bank Name',
				BANK_NAME_PLACEHOLDER: 'Type the name of your bank',
				ACCOUNT_NUMBER_LABEL: 'Bank Account Number',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Type your bank account number',
				ACCOUNT_OWNER_LABEL: 'Bank Account Owner’s Name',
				ACCOUNT_OWNER_PLACEHOLDER: 'Type the name as on your bank account',
				CARD_NUMBER_LABEL: 'Bank Card Number',
				CARD_NUMBER_PLACEHOLDER:
					'Type the 16 digit number that is on the front of your bank card',
			},
		},
		WARNING: {
			TEXT_1: 'By verifing your identity you can obtain the following:',
			LIST_ITEM_1: 'Increased withdrawal limits',
			LIST_ITEM_2: 'Increased deposits limits',
			LIST_ITEM_3: 'Lower fees',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			'Change the settings of your account. From interface, notifcations, username and other customizations.',
		TITLE_TEXT_2: 'Saving your settings will apply the changes and save it.',
		TITLE_NOTIFICATION: 'Notification',
		TITLE_INTERFACE: 'Interface',
		TITLE_LANGUAGE: 'Language',
		TITLE_CHAT: 'Chat',
		TITLE_AUDIO_CUE: 'Play Audio Cue', // new
		TITLE_MANAGE_RISK: 'Manage Risk',
		ORDERBOOK_LEVEL: 'Orderbook Levels (Max 20)',
		SET_TXT: 'SET',
		CREATE_ORDER_WARING: 'Create Order Warning',
		RISKY_TRADE_DETECTED: 'Risky Trade Detected',
		RISKY_WARNING_TEXT_1:
			'This orders value is over your designated order limit amount you’ve set {0} .',
		RISKY_WARNING_TEXT_2: '({0} of portfolio)',
		RISKY_WARNING_TEXT_3:
			' Please check and verify that you indeed want to make this trade.',
		GO_TO_RISK_MANAGMENT: 'GO TO RISK MANAGMENT',
		CREATE_ORDER_WARING_TEXT:
			'Create a warning pop up when your trade order uses more than {0} of your portfolio',
		ORDER_PORTFOLIO_LABEL: 'Portfolio Percentage Amount:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'Trade Pop ups',
			POPUP_ORDER_CONFIRMATION: 'Ask for confirmation before submitting orders',
			POPUP_ORDER_COMPLETED: 'Show pop up when order has been completed',
			POPUP_ORDER_PARTIALLY_FILLED:
				'Show pop up when order has partially filled',
		},
		AUDIO_CUE_FORM: {
			// new
			ALL_AUDIO: 'All Audio cues',
			PUBLIC_TRADE_AUDIO: 'When a public trade has been made',
			ORDERS_PARTIAL_AUDIO: 'When one of your orders is partially filled',
			ORDERS_PLACED_AUDIO: 'When an order is placed',
			ORDERS_CANCELED_AUDIO: 'When an order is canceled',
			ORDERS_COMPLETED_AUDIO: 'When one of your orders is fully filled',
			CLICK_AMOUNTS_AUDIO: 'When clicking amounts and prices on the orderbook',
			GET_QUICK_TRADE_AUDIO: 'When getting a quote for quick trading',
			SUCCESS_QUICK_TRADE_AUDIO: 'When a successful quick trade occurs',
			QUICK_TRADE_TIMEOUT_AUDIO: 'When quick trade timeout',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'Create a warning pop up when a trade order value goes over a set percentage amount of your portfolio',
			INFO_TEXT_1: 'Total assets value in {0}: {1}',
			PORTFOLIO: 'Percentage of portfolio',
			TOMAN_ASSET: 'Approximate Value',
			ADJUST: '(ADJUST PERCENTAGE)',
			ACTIVATE_RISK_MANAGMENT: 'Activate Risk Managment',
			WARNING_POP_UP: 'Warning pop ups',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'History',
		TITLE_TRADES: 'Trades  History',
		TITLE_DEPOSITS: 'Deposits  History',
		TITLE_WITHDRAWALS: 'Withdrawals  History',
		TEXT_DOWNLOAD: 'DOWNLOAD HISTORY',
		TRADES: 'Trades',
		DEPOSITS: 'Deposits',
		WITHDRAWALS: 'Withdrawals',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'Adjust the security settings for your account. From Two-factor authentication, password, API keys and other security related functions.',
		OTP: {
			TITLE: '2FA',
			OTP_ENABLED: 'otp enabled',
			OTP_DISABLED: 'PLEASE TURN ON 2FA',
			ENABLED_TEXTS: {
				TEXT_1: 'Require OTP when logging in',
				TEXT_2: 'Require OTP when withdrawing funds',
			},
			DIALOG: {
				SUCCESS: 'You have successfully activated 2FA',
				REVOKE: 'You have successfully deactivated 2FA',
			},
			CONTENT: {
				TITLE: 'Activate Two-Factor Authentication',
				MESSAGE_1: 'Scan',
				MESSAGE_2:
					'Scan the qrcode below with Google Authenticator or Authy to automatically setup two-factor authentication in your device.',
				MESSAGE_3:
					'If you have problems scanning this, you can manually enter the code below',
				MESSAGE_4:
					'You must store this code securely to recover your 2FA in case you change or lose your mobile phone in future.',
				MESSAGE_5: 'Manual',
				WARNING:
					'We highly recommend you set up two-factor authentication (2FA). Doing so will greatly increase the security of your funds.',
				ENABLE: 'Enable Two-Factor Authentication',
				DISABLE: 'Disable Two-Factor Authentication',
			},
			FORM: {
				PLACEHOLDER: 'Enter your OTP provided by Google Authenticator.',
				BUTTON: 'Enable 2FA',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'Password',
			ACTIVE: 'ACTIVE',
			DIALOG: {
				SUCCESS: 'You have successfully changed your password',
			},
			FORM: {
				BUTTON: 'Change Password',
				CURRENT_PASSWORD: {
					label: 'Current Password',
					placeholder: 'Type your current password',
				},
				NEW_PASSWORD: {
					label: 'New Password',
					placeholder: 'Type a new password',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'Confirm New Password',
					placeholder: 'Retype your new password',
				},
			},
		},
		LOGIN: {
			TITLE: 'Login History',
			IP_ADDRESS: 'IP Address',
			TIME: 'Date/Time',
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
	CURRENCY: 'Currency',
	TYPE: 'Type',
	TYPES_VALUES: {
		market: 'market',
		limit: 'limit',
	},
	TYPES: [
		{ value: 'market', label: 'market' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'limit', label: 'limit' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIDE: 'Side',
	SIDES_VALUES: {
		buy: 'buy',
		sell: 'sell',
	},
	SIDES_VERBS: {
		buy: 'bought',
		sell: 'sold',
	},
	SIDES: [
		{ value: 'buy', label: 'buy' },
		{ value: 'sell', label: 'sell' },
	], // DO NOT CHANGE value, ONLY TRANSLATE label
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'on' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: false, label: 'off' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIZE: 'Size',
	PRICE: 'Price',
	FEE: 'Fee',
	FEES: 'Fees',
	LIMIT: 'Limit',
	TIME: 'Time',
	TIMESTAMP: 'Timestamp',
	MORE: 'More',
	VIEW: 'View',
	STATUS: 'Status',
	AMOUNT: 'Amount',
	COMPLETE: 'Complete',
	PENDING: 'Pending',
	REJECTED: 'Rejected',
	ORDERBOOK: 'Order book',
	CANCEL: 'Cancel',
	CANCEL_ALL: 'Cancel All',
	GO_TRADE_HISTORY: 'Go to Transaction History',
	ORDER_ENTRY: 'order entry',
	TRADE_HISTORY: 'history',
	CHART: 'price chart',
	ORDERS: 'my active orders',
	TRADES: 'my transaction history',
	RECENT_TRADES: 'my recent trades', // ToDo
	ORDER_HISTORY: 'Order history',
	PUBLIC_SALES: 'public sales', // ToDo
	REMAINING: 'Remaining',
	FULLFILLED: '{0} % Filled',
	FILLED: 'Filled', // new
	LOWEST_PRICE: 'Lowest Price ({0})', // new
	PHASE: 'Phase', // new
	INCOMING: 'Incoming', // new
	PRICE_CURRENCY: 'Price',
	AMOUNT_SYMBOL: 'Amount',
	MARKET_PRICE: 'Market Price',
	ESTIMATED_PRICE: 'Estimated Price',
	ORDER_PRICE: 'Order Price',
	TOTAL_ORDER: 'Order Total',
	NO_DATA: 'No Data',
	LOADING: 'Loading',
	CHART_TEXTS: {
		d: 'Date',
		o: 'Open',
		h: 'High',
		l: 'Low',
		c: 'Close',
		v: 'Volume',
	},
	QUICK_TRADE: 'Quick trade',
	PRO_TRADE: 'Pro trade',
	ADMIN_DASH: 'Admin Page',
	WALLET_TITLE: 'Wallet',
	TRADING_MODE_TITLE: 'Trading Mode',
	TRADING_TITLE: 'Trading',
	LOGOUT: 'Logout',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'The transaction is too small to send. Try a larger amount.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'The transaction is too big to send. Try a smaller amount.',
	WITHDRAWALS_LOWER_BALANCE:
		'You don’t have enough {0} in your balance to send that transaction',
	WITHDRAWALS_FEE_TOO_LARGE:
		'The fee is more than {0}% of your total transaction',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'The Bitcoin address is invalid. Please check carefully and input again',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'The Ethereum address is invalid. Please check carefully and input again',
	WITHDRAWALS_BUTTON_TEXT: 'review withdrawal',
	WITHDRAWALS_FORM_NETWORK_LABEL: 'Network',
	DEPOSIT_FORM_NETWORK_WARNING:
		'Make sure the network selected is compatible with the senders wallets network',
	DEPOSIT_FORM_TITLE_WARNING_DESTINATION_TAG:
		'Enter both Address and Tag, which are required to deposit into your account successfully.',
	WITHDRAW_PAGE_DESTINATION_TAG_NONE: 'None',
	WITHDRAW_PAGE_DESTINATION_TAG_MESSAGE: 'Destination tag: {0}',
	WITHDRAW_PAGE_NETWORK_TYPE_MESSAGE: '{0} address network type: {1}',
	WITHDRAWALS_FORM_NETWORK_WARNING:
		'Make sure the network selected is compatible with the destination wallet',
	WITHDRAWALS_FORM_DESTINATION_TAG_WARNING:
		'Check if receiving address requires a Tag. Also known as Memo, digital ID, label, and notes.',
	WITHDRAWALS_FORM_NETWORK_PLACEHOLDER: 'Select a network',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Destination address',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Type the address',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'Destination tag (optional)', // new
	WITHDRAWALS_FORM_MEMO_LABEL: 'Memo (optional)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'Type the destination tag', // new
	WITHDRAWALS_FORM_MEMO_PLACEHOLDER: 'Type the transaction memo', // new
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
	DEPOSIT_METHOD: 'Paymen Method {0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'Credit card',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1:
		'Proceed to the credit card payment method.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'You will leave the platform to perform the payment.',
	DEPOSIT_VERIFICATION_WAITING_TITLE: 'Verifiying the payment',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'Please do not close the application while the paymen is being verified',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'If something went wrong in the verification, please contact us.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'This is the ID of the operation: "{0}", please provide us this ID to help you.',
	DEPOSIT_VERIFICATION_SUCCESS: 'Payment verified',
	DEPOSIT_VERIFICATION_ERROR: 'There has been an error verifying the deposit.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: 'The deposit has been already verified',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'Invalid status',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'The card you made the deposit is not the same as your registered card. Therefore your deposit is rejected and your funds will be refunded in less than an hour.',
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
			'You can only withdraw to a bank account in a name that matches the name registered with your account.',
		BASE_MESSAGE_2: 'Withdrawal min amount',
		BASE_MESSAGE_3: 'Daily withdrawal max amount',
		BASE_INCREASE_LIMIT: 'Increase your daily limit',
		CONFIRM_VIA_EMAIL: 'Confirm via Email',
		CONFIRM_VIA_EMAIL_1: 'We have sent you a confirmation withdrawal email.',
		CONFIRM_VIA_EMAIL_2:
			'In order to complete the withdrawal process please confirm',
		CONFIRM_VIA_EMAIL_3: 'the withdrawal via your email within 5 minutes.',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'Your withdrawal request is confirmed. It will be processed shortly.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'In order to view your withdrawal status please visit your withdrawal history page.',
		GO_WITHDRAWAL_HISTORY: 'Go To Withdrawal History',
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'deposit',
	WALLET_BUTTON_BASE_WITHDRAW: 'withdraw',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'receive',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'send',
	AVAILABLE_TEXT: 'Available',
	AVAILABLE_BALANCE_TEXT: 'Available {0} Balance: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Balance',
	CURRENCY_BALANCE_TEXT: '{0} Balance',
	WALLET_TABLE_AMOUNT_IN: `Amount in {0}`,
	WALLET_TABLE_TOTAL: 'Grand Total',
	WALLET_ALL_ASSETS: 'All Assets',
	WALLET_HIDE_ZERO_BALANCE: 'Hide zero balance',
	WALLET_ESTIMATED_TOTAL_BALANCE: 'Estimated Total Balance',
	WALLET_ASSETS_SEARCH_TXT: 'Search',
	HIDE_TEXT: 'Hide',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Sellers',
	ORDERBOOK_BUYERS: 'Buyers',
	ORDERBOOK_SPREAD: 'spread {0}', // 0 -> 660,000 T
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
	LOGOUT_ERROR_TOKEN_EXPIRED: 'Your session is expired. Please login again.',
	LOGOUT_ERROR_LOGIN_AGAIN: 'Login again', // ip doesnt match
	LOGOUT_ERROR_INVALID_TOKEN: 'Invalid token',
	LOGOUT_ERROR_INACTIVE:
		'You have been logged out because you have been inactive',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	ORDER_ENTRY_ADVANCED: 'Advanced',
	QUICK_TRADE_OUT_OF_LIMITS: 'Order size is out of the limits',
	QUICK_TRADE_TOKEN_USED: 'Token has been used',
	QUICK_TRADE_QUOTE_EXPIRED: 'Quote has expired',
	QUICK_TRADE_QUOTE_INVALID: 'Invalid quote',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'Error calculating the quote',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
		'The order with the current size can not be filled',
	QUICK_TRADE_ORDER_NOT_FILLED: 'Order is not filled',
	QUICK_TRADE_NO_BALANCE: 'Insufficient balance to perform the order',
	QUICK_TRADE_SUCCESS: 'Success!',
	QUICK_TRADE_INSUFFICIENT_FUND: 'Insufficient funds',
	QUICK_TRADE_INSUFFICIENT_FUND_MESSAGE:
		'You have insufficient funds in your wallet to complete this transaction.',
	YES: 'Yes',
	NO: 'No',
	NEXT: 'Next',
	SKIP_FOR_NOW: 'Skip for now',
	SUBMIT: 'submit',
	RESUBMIT: 'Resubmit',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Missing Documents!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'To get full access to withdrawal and deposit functions you must submit your identity documents in your account page.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Success!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'You will receive an email notification when your information has been processed. Processing can typically take 1-3 days.',
	VERIFICATION_NOTIFICATION_BUTTON: 'PROCEED TO EXCHANGE',
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
	GOTO_XHT_MARKET: 'Go to XHT market', // new
	INVALID_CAPTCHA: 'Invalid captcha',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL: 'Language preferences (Includes Emails)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'Display order confirmation popup',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NO' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: true, label: 'YES' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTINGS_THEME_LABEL: 'User Interface Theme', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'White' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'dark', label: 'Dark' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTING_BUTTON: 'save',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'Withdrawals disabled',
	VERIFICATION_NO_WITHDRAW_MESSAGE: 'Your account is disabled for withdrawals',
	UP_TO_MARKET: 'Up to market',
	VIEW_MY_FEES: 'View my fees', // new
	DEVELOPER_SECTION: {
		TITLE: 'API Key',
		INFORMATION_TEXT:
			'The API provides functionality such as getting wallet balances, managing buy/sell orders, requesting withdrawals as well as market data such as recent trades, order book and ticker.',
		ERROR_INACTIVE_OTP:
			'To generate an API key you need to enable 2-factor authentication.',
		ENABLE_2FA: 'Enable 2FA',
		WARNING_TEXT: 'Do not share your API key with others.',
		GENERATE_KEY: 'Generate API Key',
		ACTIVE: 'Active',
		INACTIVE: 'Inactive',
		INVALID_LEVEL:
			'You need to upgrade your verification level to have access this feature', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'Generate API Key',
		GENERATE_TEXT:
			'Please name your API key and keep it in private after its generated. You wont be able to retrieve it again later.',
		GENERATE: 'Generate',
		DELETE_TITLE: 'Delete API Key',
		DELETE_TEXT:
			'Deleting your API key is irreversible although you can generate a new API key at anytime. Do you want to delete your API key?',
		DELETE: 'DELETE',
		FORM_NAME_LABEL: 'Name',
		FORM_LABLE_PLACEHOLDER: 'Name for the Api Key',
		API_KEY_LABEL: 'API Key',
		SECRET_KEY_LABEL: 'SECRET Key',
		CREATED_TITLE: 'Copy your API Key',
		CREATED_TEXT_1:
			'Please copy your API key as it will be unattainable in the future.',
		CREATED_TEXT_2: 'Keep your key private.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'Name',
		API_KEY: 'API Key',
		SECRET: 'Secret',
		CREATED: 'Date Generated',
		REVOKE: 'Revoke',
		REVOKED: 'Revoked',
		REVOKE_TOOLTIP: 'You have to enable 2FA to revoke the token', // TODO
	},
	CHAT: {
		CHAT_TEXT: 'chat',
		MARKET_CHAT: 'Market Chat',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'Read More',
		SHOW_IMAGE: 'Show Image',
		HIDE_IMAGE: 'Hide Image',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'Message',
		SIGN_UP_CHAT: 'Sign Up To Chat',
		JOIN_CHAT: 'Set Username To Chat',
		TROLLBOX: 'Trollbox ({0})', // new
	},
	INVALID_USERNAME:
		'Username must be between 3 and 15 characters long. Only contains lowercase, numbers and underscore',
	USERNAME_TAKEN: 'This username has already been taken. Please try another.',
	USERNAME_LABEL: 'Username (used for chat)',
	USERNAME_PLACEHOLDER: 'Username',
	TAB_USERNAME: 'Username',
	USERNAME_WARNING:
		'Your username can only be changed once. Please assure your username is desirable.',
	USERNAME_CANNOT_BE_CHANGED: 'Username can not be changed',
	UPGRADE_LEVEL: 'Upgrade account level',
	LEVELS: {
		LABEL_LEVEL: 'Level',
		LABEL_LEVEL_1: 'One',
		LABEL_LEVEL_2: 'Two',
		LABEL_LEVEL_3: 'Three',
		LABEL_MAKER_FEE: 'Maker Fee',
		LABEL_TAKER_FEE: 'Taker Fee',
		LABEL_BASE_DEPOSIT: 'Daily Euro Deposit',
		LABEL_BASE_WITHDRAWAL: 'Daily Euro Withdrawal',
		LABEL_BTC_DEPOSIT: 'Daily Bitcoin Deposit',
		LABEL_BTC_WITHDRAWAL: 'Daily Bitcoin Withdrawal',
		LABEL_ETH_DEPOSIT: 'Daily Ethereum Deposit',
		LABEL_ETH_WITHDRAWAL: 'Daily Ethereum Withdrawal',
		LABEL_PAIR_MAKER_FEE: '{0} Maker Fee',
		LABEL_PAIR_TAKER_FEE: '{0} Taker Fee',
		UNLIMITED: 'Unlimited',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: 'Generate {0} Wallet',
	WALLET_ADDRESS_GENERATE: 'Generate',
	WALLET_ADDRESS_MESSAGE:
		'When you generate a wallet, you create a deposit address.',
	WALLET_ADDRESS_ERROR:
		'Error generating the address, please refresh and try again.',
	DEPOSIT_WITHDRAW: 'Deposit/Withdraw',
	GENERATE_WALLET: 'Generate Wallet',
	TRADE_TAB_CHART: 'Chart',
	TRADE_TAB_TRADE: 'Trade',
	TRADE_TAB_ORDERS: 'Orders',
	TRADE_TAB_POSTS: 'ANNOUNCEMENTS', // new
	WALLET_TAB_WALLET: 'Wallet',
	WALLET_TAB_TRANSACTIONS: 'Transactions',
	RECEIVE_CURRENCY: 'Receive {0}',
	SEND_CURRENCY: 'Send {0}',
	COPY_ADDRESS: 'Copy Address',
	SUCCESFUL_COPY: 'Successfully Copied!',
	QUICK_TRADE_MODE: 'Quick Trade Mode',
	JUST_NOW: 'just now',
	PAIR: 'Pair',
	ZERO_ASSET: 'You have zero assets',
	DEPOSIT_ASSETS: 'Deposit Assets',
	SEARCH_TXT: 'Search',
	SEARCH_ASSETS: 'Search Assets',
	TOTAL_ASSETS_VALUE: 'Total assets value in {0}: {1}',
	SUMMARY: {
		TITLE: 'Summary',
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
		ACCOUNT_ASSETS: 'Account Assets',
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
		VIEW_FEE_STRUCTURE: 'View Fee Structure and Limits',
		UPGRADE_ACCOUNT: 'Upgrade Account',
		ACTIVE_2FA_SECURITY: 'Active 2FA Security',
		ACCOUNT_ASSETS_TXT_1: 'Displayed is a summary of all your assets.',
		ACCOUNT_ASSETS_TXT_2:
			'Holding a large amounts of assets will entitle you for an account upgrade which includes a unique badge and lower trading fees.',
		TRADING_VOLUME_TXT_1:
			'Your trading volume history is displayed in {0} and is a nominally calculated at the end of every month from all trading pairs.',
		TRADING_VOLUME_TXT_2:
			'High trading activity will entitle you for an account upgrade rewarding you with a unique badge and other perks.',
		ACCOUNT_DETAILS_TXT_1:
			'Your account type determines your account badge, trading fee, deposits and withdrawal limits.',
		ACCOUNT_DETAILS_TXT_2:
			'Your trading account age, activity level and total account assets amount will determine if your account is legable for an upgrade.',
		ACCOUNT_DETAILS_TXT_3:
			'Maintaining your account level requires constant trading and maintaining a certain amount of deposited assets.',
		ACCOUNT_DETAILS_TXT_4:
			'Periodic downgrading of accounts will occur if activity and assets are not maintained.',
		REQUIREMENTS: 'Requirements',
		ONE_REQUIREMENT: 'One Requirement only:', // new
		REQUEST_ACCOUNT_UPGRADE: 'Request an Account Upgrade',
		FEES_AND_LIMIT: '{0} Fee & Limit Structure', // new
		FEES_AND_LIMIT_TXT_1:
			'Becoming a crypto trader marks new beginning. Armed with wits, will and speed only by taking risks and trading will you be allowed to update your account.',
		FEES_AND_LIMIT_TXT_2:
			'Each account has its own fees and deposit and withdrawal limits.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'Deposit & withdrawal allowance',
		TRADING_FEE_STRUCTURE: 'Trading fee structure',
		WITHDRAWAL: 'Withdrawal',
		DEPOSIT: 'Deposit',
		TAKER: 'Taker',
		MAKER: 'Maker',
		WEBSITE: 'website',
		VIP_TRADER_ACCOUNT_ELIGIBLITY: 'VIP Trader Account Upgrade Eligibility',
		PRO_TRADER_ACCOUNT_ELIGIBLITY: 'Pro Trader Account Upgrade Eligibility',
		TRADER_ACCOUNT_ELIGIBILITY: 'Level {0} Account Eligibility',
		NOMINAL_TRADING: 'Nominal Trading',
		NOMINAL_TRADING_WITH_MONTH: 'Nominal Trading Last {0}',
		ACCOUNT_AGE_OF_MONTHS: 'Account Age of {0} Months',
		TRADING_VOLUME_EQUIVALENT: '{0} {1} Trading Volume Equivalent',
		LEVEL_OF_ACCOUNT: 'Level {0} Account',
		TITLE_OF_ACCOUNT: '{0} Account',
		LEVEL_TXT_DEFAULT: 'Add your level description here',
		LEVEL_1_TXT:
			'Your journey starts here young crypto trader! To obtain bonuses you can verify your identiﬁcation and also get larger deposit and withdraw limits with reduced trading fees.', // new
		LEVEL_2_TXT:
			'Simply trade monthly over $3,000 USDT worth or have balance of over 5,000 XHT and enjoy lower trading fees.', // new
		LEVEL_3_TXT:
			'This is where things get real! Enjoy reduced trading fees and large deposit and withdrawal limits. To get to level 3 you must complete your veriﬁcation', // new
		LEVEL_4_TXT:
			'Simply trade monthly over $10,000 USDT worth or have balance of over 10,000 XHT and enjoy lower trading fees.', // new
		LEVEL_5_TXT:
			'You’ve made it! The level 5 account is a rare account only for exchange operators, Vault users or HollaEx Affiliate Program (HAP). Enjoy large limits and enjoy zero maker fees.', // new
		LEVEL_6_TXT:
			'Simply trade monthly over $300,000 USDT worth or have balance of over 100,000 XHT and enjoy lower trading fees. Increased withdraw amount.', // new
		LEVEL_7_TXT:
			'Simply trade monthly over $500,000 USDT worth or have balance of over 300,000 XHT and enjoy lower trading fees. Increased withdraw amount.', // new
		LEVEL_8_TXT:
			'Simply trade monthly over $600,000 USDT worth or have balance of over 400,000 XHT and enjoy lower trading fees.', // new
		LEVEL_9_TXT:
			'Simply trade monthly over $2,000,000 USDT worth or have balance of over 1,000,000 XHT and enjoy lower trading fees.', // new
		LEVEL_10_TXT:
			'The whale trader account that earns you money back for market making. To obtain this special account please get in touch with us.', // new
		CURRENT_TXT: 'Current',
		TRADER_ACCOUNT_XHT_TEXT:
			'Your account is in the presale period of XHT, this means you can obtain XHT for $0.10 per XHT. All deposit will be converted to XHT once the transaction has cleared.',
		TRADER_ACCOUNT_TITLE: 'Account - Presale Period', // new
		HAP_ACCOUNT: 'HAP Account', // new
		HAP_ACCOUNT_TXT:
			'Your account is a verified HollaEx affiliate program account. You can now earn 10% bonus for every person you invite that buys XHT.', // new
		EMAIL_VERIFICATION: 'Email Verification', // new
		DOCUMENTS: 'Documents', // new
		HAP_TEXT: 'HollaEx Affiliate Program (HAP) {0}', // new
		LOCK_AN_EXCHANGE: 'Lock an Exchange {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'Vault Subscription users {0}', // new
		TRADE_OVER_XHT: 'Trade over {0} USDT worth', // new
		TRADE_OVER_BTC: 'Trade over {0} BTC worth', // new
		XHT_IN_WALLET: '{0} XHT in wallet', // new
		REWARDS_BONUS: 'Rewards and Bonuses', // new
		COMPLETE_TASK_DESC: 'Complete tasks and earn bonuses worth over $10,000.', // new
		TASKS: 'Tasks', // new
		MAKE_FIRST_DEPOSIT: 'Make your first deposit receive 1 XHT', // new
		BUY_FIRST_XHT: 'Buy your first XHT and receive a bonus of 5 XHT', // new
		COMPLETE_ACC_VERIFICATION:
			'Complete account verification and get a 20 XHT bonus', // new
		INVITE_USER: 'Invite users and enjoy commissions from their trade', // new
		JOIN_HAP: 'Join HAP and earn 10% for every HollaEx Kit you sell', // new
		EARN_RUNNING_EXCHANGE: 'Earn passive income for running your own exchange', // new
		XHT_WAVE_AUCTION: 'XHT Wave Auction Data', // new
		XHT_WAVE_DESC_1:
			'The distribution of the HollaEx token (XHT) is done through a Wave Auction.', // new
		XHT_WAVE_DESC_2:
			'The Wave Auction sells a random amount of XHT at random times to the highest bidders on the orderbook', // new
		XHT_WAVE_DESC_3:
			'Below displays the historic data on the Wave Auction history', // new
		WAVE_AUCTION_PHASE: 'Wave Auction Phase {0}', // new
		LEARN_MORE_WAVE_AUCTION: 'Learn more about the Wave Auction', // new
		WAVE_NUMBER: 'Wave Number', // new
		DISCOUNT: '( {0}% discount )', // new
		MY_FEES_LIMITS: ' My Fees and Limits', // new
		MARKETS: 'Markets', // new
		CHANGE_24H: '24H Change', // new
		VOLUME_24H: '24H Volume', // new
		PRICE_GRAPH_24H: '24H Price graph', // new
		VIEW_MORE_MARKETS: 'View more markets', // new
	},
	REFERRAL_LINK: {
		TITLE: 'Invite your friend', // new
		INFO_TEXT:
			'Refer your friends by giving out this link and receive benefits by onboarding other people.',
		COPY_FIELD_LABEL: 'Share the link below with friends and earn commissions:', // new
		REFERRED_USER_COUT: 'You have referred {0} users', // new
		COPY_LINK_BUTTON: 'COPY REFERRAL LINK', // new
		XHT_TITLE: 'MY REFERRALS', // new
		XHT_INFO_TEXT: 'Earn commissions by inviting your friends.', // new
		XHT_INFO_TEXT_1: 'Commissions are paid periodically to your wallet', // new
		APPLICATION_TXT:
			'To become a HollaEx Kit distributor please fill out an application.', // new
		TOTAL_REFERRAL: 'Total bought from referrals:', // new
		PENDING_REFERRAL: 'Commissions Pending:', // new
		EARN_REFERRAL: 'Commissions Earn:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'APPLY', // new
	},
	STAKE_TOKEN: {
		TITLE: 'Stake HollaEx Token', // new
		INFO_TXT1:
			'HollaEx tokens (XHT) are required to be collateralized (staked) to run the HollaEx Kit exchange software.', // new
		INFO_TXT2:
			'You can collateralize your HollaEx token in a similar fashion and earn XHT not sold during the Wave Auction.', // new
		INFO_TXT3:
			'Simply go to dash.bitholla.com and collateralize your own exchange today and earn free XHT', // new
		BUTTON_TXT: 'FIND OUT MORE', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'HollaEx Token Purchase Agreement',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: 'PROCEED',
		AGREE_TERMS_LABEL:
			'I have read and agree to the HollaEx Token Purchase Agreement',
		RISK_INVOLVED_LABEL: 'I understand the risks involved',
		DOWNLOAD_PDF: 'Download the PDF',
		DEPOSIT_FUNDS:
			'Deposit funds into your wallet to obtain HollaEx Token (XHT)',
		READ_FAG: 'Read HollaEx FAQ here: {0}',
		READ_DOCUMENTATION: 'Read HollaEx whitepaper here: {0}',
		READ_WAVES: 'Rules for the coming December Public Wave Auction{0}', // new
		DOWNLOAD_BUY_XHT:
			'Download the PDF to see a visual step-by-step processes on {0}',
		HOW_TO_BUY: 'how to buy HollaEx Token (XHT)',
		PUBLIC_SALES: ' Public Wave Auction', // new
		CONTACT_US:
			'Feel free to contact us for more information and any issues by sending us an email to {0}',
		VISUAL_STEP: 'See a visual step-by-step processes on {0}', // new
		WARNING_TXT:
			'We will review your request and send further instructions to your email on how to access the HollaEx exchange.', // new
		WARNING_TXT1:
			'In the mean time you can familiarize yourself with the HollaEx network with the resources below', // new
		XHT_ORDER_TXT_1: 'To start trading you must login', // new
		XHT_ORDER_TXT_2: '', // new
		XHT_ORDER_TXT_3: '{0} or {1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: 'Login to see your recent trades', //new
		XHT_TRADE_TXT_2: 'You can {0} to see your recent trade history', //new
		LOGIN_HERE: 'login here',
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
	USER_LEVEL: 'User level', // new
	LIMIT_AMOUNT: 'Limit amount', // new
	FEE_AMOUNT: 'Fee amount', // new
	COINS: 'Coins', // new
	PAIRS: 'Pairs', // new
	NOTE_FOR_EDIT_COIN:
		'Note: For adding and removing {0} please refer to the{1}.', // new
	REFER_DOCS_LINK: 'docs', // new
	RESTART_TO_APPLY:
		'You need to restart your exchange for apply these changes.', // new
	TRIAL_EXCHANGE_MSG:
		'You are using a trial version of {0} and it will expire in {1} days.', // new
	EXPIRY_EXCHANGE_MSG:
		'Your exchange has expired. Go to dash.bitholla.com to activate it again.', // new
	EXPIRED_INFO_1: 'Your trial has ended.', // new
	EXPIRED_INFO_2: 'Collateralize your exchange to activate it again.', // new
	EXPIRED_BUTTON_TXT: 'ACTIVATE EXCHANGE', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: 'Announcement',
		ANNOUNCEMNT_TXT_3:
			'Public launch and Wave Auction is rescheduled to January 1st 2020. Wallet deposit and withdrawals are now open.',
		ANNOUNCEMNT_TXT_4:
			'Happy new year Hollaers. We are making a new mark starting from 2020 with launch of the most open trading platform with the help of you all.',
		ANNOUNCEMNT_TXT_1:
			'Earn XHT with HAP program by introducing your friends to the exchange. {0}.',
		DEFAULT_ANNOUNCEMENT:
			'This section displays your exchange public announcements!',
		ANNOUNCEMENT_TXT_2: 'Free XHT will be distributed to all wallets that {0}.',
		LEARN_MORE: 'Learn more',
		APPLY_TODAY: 'Apply today', // new
	},
	OPEN_WALLET: 'Open wallet', // new
	AGO: 'ago', // new
	CUMULATIVE_AMOUNT_SYMBOL: 'Total', //new
	POST_ONLY: 'Post only',
	CLEAR: 'Clear',
	ORDER_TYPE: 'type',
	ORDER_MODE: 'Order mode', //new
	TRIGGER_CONDITIONS: 'Trigger conditions',
	TRANSACTION_STATUS: {
		PENDING: 'Pending',
		REJECTED: 'Rejected',
		COMPLETED: 'Completed',
	},
	DEPOSIT_STATUS: {
		// new
		NEW: 'New',
		SEARCH_FIELD_LABEL: 'Paste your transaction ID',
		SEARCH: 'SEARCH',
		SEARCHING: 'SEARCHING',
		CHECK_DEPOSIT_STATUS: 'Check deposit status',
		STATUS_DESCRIPTION:
			'You can check the status of your deposit by passing the transaction ID (hash) below.',
		TRANSACTION_ID: 'Transaction ID (hash)',
		SEARCH_SUCCESS: 'Search complete', // new
		ADDRESS_FIELD_LABEL: 'Paste your address', // new
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
			'24h Deposit and withdrawal allowance for all assets ({0})',
		HEADER_ROW_TYPE: 'Type (All assets)',
		HEADER_ROW_AMOUNT: '24h Amount ({0})',
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
	PAGE_UNDER_CONSTRUCTION:
		'This page is under construction. Please revisit this page soon.',
	UNDEFINED_ERROR_TITLE: 'You’ve Encountered an Unidentified Error',
	UNDEFINED_ERROR:
		'Wow! An unknown error has occurred. This could be a connection issue or a number of other things. You can try again later or try refreshing.',
	POST_ONLY_TOOLTIP: 'Post only orders only execute as a limit order.', // new
	REFRESH: 'Refresh',
	FEE_REDUCTION: 'Fee reduction', // new
	FEE_REDUCTION_DESCRIPTION:
		'*your account has a fee discount applied to it. The reduction is applied to the trading fees based on your account.', // new
};

const content = flatten(nestedContent, options);

export default content;
