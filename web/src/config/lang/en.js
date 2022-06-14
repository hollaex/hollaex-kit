import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';

export default {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Open Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: 'Are you sure?. Do you want to logout',
	ADD_TRADING_PAIR: 'Select a market',
	CANCEL_BASE_WITHDRAWAL: 'Cancel {0} Withdrawal',
	CANCEL_WITHDRAWAL: 'Cancel Withdrawal',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM:
		'Do you want to cancel your pending withdrawal of:',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'Login',
	SIGN_IN: 'Sign In',
	SIGNUP_TEXT: 'Sign up',
	REGISTER_TEXT: 'Register',
	ACCOUNT_TEXT: 'Account',
	CLOSE_TEXT: 'Close',
	COPY_TEXT: 'Copy',
	COPY_SUCCESS_TEXT: 'Successfully Copied',
	CANCEL_SUCCESS_TEXT: 'Successfully Cancelled!',
	ADD_FILES: 'ADD FILES', // ToDo
	OR_TEXT: 'Or',
	CONTACT_US_TEXT: 'Contact us',
	HELPFUL_RESOURCES_TEXT: 'Helpful resources',
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
	VIEW_MARKET: 'view markets', // new
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
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
		TERMS_OF_SERVICE: 'Terms of Service',
		PRIVACY_POLICY: 'Privacy Policy',
		XHT_DESCRIPTION:
			'HollaEx Kit is an open source trading platform built by bitHolla Inc. You can create and list any digital assets and onboard users to trade on your exchange using this exchange Kit. In order to simply run one yourself {1}.',
		CLICK_HERE: 'click here',
		VISIT_HERE: 'visit here',
	},
	ACCOUNTS: {
		TITLE: 'Account',
		TAB_VERIFICATION: 'Verification',
		TAB_SECURITY: 'Security',
		TAB_SETTINGS: 'Settings',
		TAB_WALLET: 'Wallet',
		TAB_SUMMARY: 'Summary',
		TAB_HISTORY: 'History',
		TAB_SIGNOUT: 'Signout',
		TAB_STAKE: 'Stake', //new
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
		SUCCESS_TITLE: 'Message Sent',
		SUCCESS_MESSAGE_1: 'Your issue has been sent to customer support.',
		SUCCESS_MESSAGE_2: 'You can expect a reply in 1-3 days.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'Your {0} receiving address', // new
			DESTINATION_TAG: 'Your {0} destination tag', // new
			MEMO: 'Your {0} memo', // new
		},
		QR_CODE:
			'This QR Code can be scanned by the person who wants to send you funds',
		NO_DATA: 'No information available',
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
		OTP_BUTTON: 'submit',
		ERROR_INVALID: 'Invalid OTP Code',
	},
	EMAIL_CODE_FORM: {
		TITLE: 'Input you security codes',
		LABEL: 'Input code (please check your email)',
		PLACEHOLDER: 'Input the code sent to your email',
		FORM_TITLE:
			'A unique code was sent to your email that is required to finish the process. Please input the code sent to your email below along with your OTP code.',
		BUTTON: 'submit',
		ERROR_INVALID: "The code you've entered is incorrect. Please try again",
		OTP_LABEL: '2FA Code (OTP)',
		OTP_PLACEHOLDER: 'Enter your 6-digit two-factor authentication code',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Quick Trade', // updated
		BUTTON: 'Review Order', // updated
		INFO: 'Fastest and simplest way to trade your crypto', //new
		CHANGE_TEXT: 'change', //new
		HIGH_24H: '24H HIGH', //new
		LOW_24H: '24H LOW', //new
		BEST_BID: 'BEST BID', //new
		BEST_ASK: 'BEST ASK', //new
		FOOTER_TEXT: 'Quick trade fees use market taker rates', //new
		FOOTER_TEXT_1: 'Sourced from', //new
		GO_TO_TEXT: 'Go to', //new
		SOURCE_TEXT: 'Broker OTC deal', //new
	},
	PREVIOUS_PAGE: 'previous page',
	NEXT_PAGE: 'next page',
	WALLET: {
		LOADING_ASSETS: 'Loading assets...', // new
		TOTAL_ASSETS: 'Total Assets',
		AVAILABLE_WITHDRAWAL: 'Available for trading',
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
		COMPLETED: 'Completed',
		PENDING_VERIFICATION: 'Pending verification',
		TITLE_EMAIL: 'Email',
		MY_EMAIL: 'My Email',
		TITLE_USER_DOCUMENTATION: 'Identification',
		TITLE_ID_DOCUMENTS: 'Upload',
		TITLE_BANK_ACCOUNT: 'Bank Account',
		TITLE_MOBILE_PHONE: 'Mobile Phone',
		TITLE_PERSONAL_INFORMATION: 'Personal Information',
		VERIFY_EMAIL: 'Verify email',
		VERIFY_MOBILE_PHONE: 'Verify mobile phone',
		VERIFY_USER_DOCUMENTATION: 'Verify user documentation',
		VERIFY_ID_DOCUMENTS: 'Verify id documents',
		TITLE_IDENTITY: 'Identity',
		TITLE_MOBILE: 'Mobile',
		TITLE_BANK: 'Bank',
		CHANGE_VALUE: 'Change value',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'Your personal information is being processed',
		PENDING_VERIFICATION_DOCUMENTS: 'Your documents are being verified',
		GOTO_VERIFICATION: 'Go to verification',
		GOTO_WALLET: 'Go to wallet', // new
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
				ID_NUMBER: 'Please type your documents number',
				ISSUED_DATE: 'Please select the date in which your document was issued',
				EXPIRATION_DATE:
					'Please select the date when your document will expire',
				FRONT: 'Please upload a scan of your passport or national Id',
				PROOF_OF_RESIDENCY:
					'Please upload a scan of document proving the address you current reside',
				SELFIE_PHOTO_ID:
					'Please upload a selfie with passport or national Id and note',
			},
			FORM_FIELDS: {
				ID_NUMBER_LABEL: 'Passport Number or National Id Number',
				ID_NUMBER_PLACEHOLDER:
					'Type your passport Number or national Id number',
				ISSUED_DATE_LABEL: 'Passport or National Id Issue Date',
				EXPIRATION_DATE_LABEL: 'Passport or National ID Expiration Date',
				FRONT_LABEL: 'Passport or National Id',
				FRONT_PLACEHOLDER: 'Add a copy of your passport or national id',
				POR_LABEL: 'Document proving your address',
				POR_PLACEHOLDER: 'Add a copy of a document that proves your address',
				SELFIE_PHOTO_ID_LABEL:
					'Your Selfie with passport or national Id and Note',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'Add a copy of your Selfie with passport or national Id and Note',
			},
			INFORMATION: {
				PROOF_OF_RESIDENCY: 'Proof of residence',
				ID_SECTION: {
					TITLE: 'Please make sure that your submitted documents are:',
					LIST_ITEM_0: 'Total size of all docs should not exceed {0}mb', //new
					LIST_ITEM_1: 'Clear high quality color image', // updated
					LIST_ITEM_2: 'VISIBLE IN THEIR ENTIRETY (watermarks are permitted).',
					LIST_ITEM_3: 'VALID, with the expiry date clearly visible.',
					WARNING_1:
						'Only a valid passport is acceptedt; high quality photos or scanned images of these documents are acceptable:',
					WARNING_3:
						'Please do not submit the passport as your proof of residence.',
					VIOLATION_ERROR:
						'Total size of all your uploaded documents exceeds the upload limit of {0}mb. Please upload smaller files to proceed.',
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
				ACCOUNT_NUMBER_MAX_LENGTH:
					'Your bank account number has a limit of 50 characters',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'Bank Name',
				BANK_NAME_PLACEHOLDER: 'Type the name of your bank',
				ACCOUNT_NUMBER_LABEL: 'Bank Account Number',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Type your bank account number',
				ACCOUNT_OWNER_LABEL: 'Bank Account Owner’s Name',
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
			VALUE_ASSET: 'Approximate Value',
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
				INPUT: 'Please enter your OTP',
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
				EMAIL_CONFIRMATION:
					'An email is sent to you to authorize the password change.',
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
	STAKE: {
		NETWORK_WARNING: 'Incompatible network. Please change your network to {0}',
		EARN: 'Earn', //new
		TITLE: 'Stake',
		MODAL_TITLE: 'Stake and earn {0}',
		REVIEW_MODAL_TITLE: 'Check and confirm stake',
		AVAILABLE_TOKEN: '{0} ({1}) available to stake: {2}',
		DEFI_TITLE: 'DeFi asset staking',
		DEFI_TEXT:
			'Staking DeFi style will use your own wallet outside of the exchange. To start you are required to establish a connection, once connected you can stake and start earning directly from your wallet.',
		GET_STAKES: 'Get stakes', //new
		CURRENT_ETH_BLOCK: 'Current ETH block: {0}', //new
		ON_EXCHANGE_XHT: 'On exchange {0} balance: {1} {2}',
		LOGIN_HERE: 'Login here',
		MOVE_XHT: 'Move {0}',
		ESTIMATED_STAKED: 'Estimated value of total staked',
		ESTIMATED_EARNINGS: 'Estimated value of earnings',
		CONNECT_WALLET: 'Connect wallet',
		BACK: 'Back',
		NEXT: 'Next',
		REVIEW: 'Review',
		ESTIMATED: 'EST.',
		BLOCK: 'Block',
		CANCEL: 'Cancel',
		PROCEED: 'Proceed',
		GO_TO_WALLET: 'go to wallet',
		AMOUNT_LABEL: 'Amount to stake',
		PERIOD_SUBTITLE:
			'Longer you stake the more you are rewarded. Select the duration of stake below.',
		STAKE_AND_EARN_DETAILS: 'Stake for ~{0} and earn {1}',
		PREDICTED_EARNINGS: 'Predicted earnings',
		VARIABLE_TITLE: 'Variable*',
		VARIABLE_TEXT: '*{0} about how the variable rate works.',
		READ_MORE: 'Read more',
		CURRENT_BLOCK: 'Current block: {0}',
		END_BLOCK: 'End block: {0}',
		DURATION: 'Duration',
		END_ON_BLOCK: 'End on block: {0}',
		SLASHING_TITLE: 'Slashing (early unstake)',
		SLASHING_TEXT_1: '{0}% of your stakes principle',
		SLASHING_TEXT_2: 'All earnings forfeited',
		REVIEW_NOTE:
			'Duration is measured by the timing of the Ethereum blocks. Please check and confirm the details above before you stake as unstaking early will result in a percentage of your stakes principle to be deducted and earnings forfeited.',
		WAITING_TITLE: 'Waiting for confirmation',
		WAITING_TEXT: 'Confirm this transaction in your wallet',
		PENDING_TEXT: 'Transaction pending...',
		CHECKING_ALLOWANCE: 'Checking {0} allowance...',
		WAITING_PROMPT: '{0} {1} {2}',
		WAITING_STAKE: 'Confirm the stake amount',
		WAITING_WITHDRAW: 'Allowing spending',
		WAITING_UNSTAKE: 'Unstake',
		WAITING_STAKE_ING: 'Staking pending',
		WAITING_WITHDRAW_ING: 'Processing of allowing spending',
		WAITING_UNSTAKE_ING: 'Unstaking',
		SUCCESSFUL_STAKE_TITLE: "You've successfully staked {0}",
		SUCCESSFUL_STAKE_AMOUNT: 'Amount staked',
		SUCCESSFUL_STAKE_DURATION_KEY: 'Duration',
		SUCCESSFUL_STAKE_DURATION_DEF: 'Ends on block {0} ({1})',
		SUCCESSFUL_STAKE_DESTINATION: 'Destination',
		SUCCESSFUL_UNSTAKE_ADDRESS: 'My Address',
		OKAY: 'Okay',
		ERROR_TITLE: 'Error: {0} was rejected',
		ERROR_SUBTITLE: 'If this was a mistake you can go back and retry',
		SUCCESSFUL_UNSTAKE_TITLE: "You've successfully unstaked {0}",
		SUCCESSFUL_UNSTAKE_AMOUNT: 'Total to receive',
		EARNINGS: 'Earnings',
		ORIGINAL_AMOUNT: 'Original amount staked',
		CONNECT_A_WALLET: 'Connect to a wallet',
		CONNECT_WALLET_TABLE: '{0} to see historical stake events',
		ZERO_STAKES: 'Zero stakes',
		PENDING_TRANSACTIONS: 'Pending {0} {1}',
		VIEW_ON: 'View on the {0}',
		BLOCKCHAIN: 'blockchain',
		VIEW_POT: 'View distribution POT',
		COMPLETED: 'Matured',
		COMPLETED_TOOLTIP:
			'Stake is mature. Continue staking to earn more rewards or unstake to claim rewards.',
		CONNECT_ERROR: 'Please check your wallet',
		INSTALL_METAMASK:
			'You must install Metamask into your browser: https://metamask.io/download.html',
		REWARDS: {
			0: {
				CARD: 'Earn rewards (no bonuses)',
				TEXT: 'regular rewards.',
			},
			1: {
				CARD: 'Earn rewards + bonuses',
				TEXT: 'bonus rewards on your earnings',
			},
			2: {
				CARD: 'Highest rewards, highest bonuses',
				TEXT: 'the highest bonus rewards on your earnings',
			},
			3: {
				CARD: '',
				TEXT: '',
			},
			4: {
				CARD: '',
				TEXT: '',
			},
		},
	},
	UNSTAKE: {
		TITLE: 'Unstake',
		EARLY_TITLE: 'Unstake early',
		EARLY_WARNING_TITLE: 'Looks like you are trying to unstake early',
		EARLY_WARNING_TEXT_1:
			'This could lead to a percentage of your initial principle stake being deducted and all earnings being forfeited.',
		EARLY_WARNING_TEXT_2: 'Are you sure you want to proceed?',
		BACK: 'GO BACK',
		REVIEW: 'REMOVE STAKE',
		DURATION: 'EST. maturation duration',
		CANCEL: 'Cancel',
		PROCEED: 'Proceed',
		EARNINGS_FORFEITED: 'Earnings forfeited',
		PRICE_FORMAT: '{0} {1}',
		EST_PENDING: 'EST. pending: {0}',
		AMOUNT_SLASHED: 'Amount slashed*',
		AMOUNT_TO_RECEIVE: 'Amount to receive',
		SLASH_FOOTNOTE:
			'*All amounts slashed are distributed to remaining stakers. Please consider the slashed amount from initial principle, the earnings forfeited and duration remaining and determine if the value lost in unstaking early is worth the cost.',
		AMOUNT_NOTE: 'Amounts will be distributed to your wallet address',
		TOTAL_EARNT: 'Total earnt',
		PENDING_EARNINGS: 'Pending earnings*',
		PENDING_EARNINGS_FOOTNOTE:
			'*Pending earnings are amounts that have not cleared and require a blockchain transaction in order to be added to your total receiving amount.',
	},
	STAKE_TABLE: {
		CURRENCY: 'Currency',
		AVAILABLE: 'Available to stake',
		TOTAL: 'Total staked',
		REWARD_RATE: 'Reward rate',
		EARNINGS: 'Earnings',
		STAKE: 'Stake',
		VARIABLE: 'Variable',
	},
	STAKE_LIST: {
		AMOUNT: 'AMOUNTS STAKED',
		DURATION: 'EST. MATURATION DURATION',
		START: 'STARTED STAKING',
		END: 'END STAKE',
		EARNINGS: 'EARNINGS',
		STAKE: 'STAKE',
	},
	STAKE_DETAILS: {
		BACK_SUBTITLE: '{0} to staking page',
		GO_BACK: 'Go back',
		CONTRACT_SUBTITLE: 'Token contract: {0}',
		VIEW_MORE: 'VIEW MORE',
		VIEW: 'View',
		TOKEN: '{0} Token',
		TABS: {
			PUBLIC_INFO: 'Public info',
			DISTRIBUTIONS: 'Distributions',
			MY_STAKING: 'My staking',
		},
		PUBLIC_INFO: {
			TITLE: 'Staking information',
			SUBTITLE: 'Below is a staking tokenomics for {0} ({1}).',
			TOTAL_DISTRIBUTED_REWARDS: 'Total distributed rewards ({0})',
			POT_BALANCE: 'POT balance',
			UNCLAIMED_REWARDS: 'Unclaimed rewards',
			TOTAL_STAKED: 'Total staked',
			REWARD_RATE: 'Reward rate',
			MY_STAKE: 'My stake ({0}%)',
			MY_STAKE_PERCENTLESS: 'My stake',
			OTHER_STAKE: 'Others stake ({0}%)',
			EVENTS_TITLE: 'Recent distributed rewards',
		},
		DISTRIBUTIONS: {
			TITLE: 'Distributed {0} rewards',
			SUBTITLE:
				'Below is a historical list of distributions made to stakers of {0}.',
			TIME: 'Time distributed',
			TRANSACTION_ID: 'Transaction ID',
			AMOUNT: 'Amount distributed',
		},
		MY_STAKING: {
			TITLE: 'My staking',
			SUBTITLE:
				'Below displays information and some historical events related to your {0} staking.',
			EVENTS_TITLE: 'Historical stake events',
			TIME: 'Time',
			EVENT: 'Event',
			TRANSACTION_ID: 'Transaction ID',
			AMOUNT: 'Amount',
		},
	},
	MOVE_XHT: {
		TITLE: 'Move XHT',
		TEXT_1: 'To stake XHT you must first move your XHT into your own wallet.',
		TEXT_2: 'Your currently connected wallet address is:',
		LABEL: 'Wallet address',
		TEXT_3:
			'It is important to check that the above wallet address is secure. XHT will be moved to the above wallet address.',
	},
	MOVE_AMOUNT: {
		TITLE: 'Input amount',
		PROMPT: 'Input the amount you would like to move.',
		BALANCE: '{0} balance: {1}',
		LABEL: 'Amount to move',
		FEE: 'Transaction fee: {0} {1}',
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
	TIME: 'Time',
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
	ORDER_ENTRY: 'order entry',
	TRADE_HISTORY: 'history',
	CHART: 'price chart',
	ORDERS: 'my active orders',
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
	ESTIMATED_PRICE: 'Estimated Price',
	ORDER_PRICE: 'Order Price',
	NO_DATA: 'No Data',
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
	WALLET_TITLE: 'Wallet',
	LOGOUT: 'Logout',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'The transaction is too small to send. Try a larger amount.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'The transaction is too big to send. Try a smaller amount.',
	WITHDRAWALS_LOWER_BALANCE:
		'Insufficient balance to proceed. This transaction requires {0}.',
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
	WITHDRAWALS_FORM_FEE_WARNING:
		'{0} ({1}) is a requirement for this asset to be withdrawn',
	WITHDRAWALS_FORM_DESTINATION_TAG_WARNING:
		'Check if receiving address requires a Tag. Also known as Memo, digital ID, label, and notes.',
	WITHDRAWALS_FORM_NETWORK_PLACEHOLDER: 'Select a network',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Destination address',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Type the address',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'Destination tag (optional)', // new
	WITHDRAWALS_FORM_MEMO_LABEL: 'Memo (optional)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'Type the destination tag', // new
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} amount to withdraw',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'Transaction fee',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL_COIN: 'Transaction fee ({0})',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'Type the amount of {0} you wish to use in the fee of the transaction',
	DEPOSIT_BANK_REFERENCE:
		'Add this "{0}" code to the bank transation to identify the deposit',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'You have successfully {0} {1} {2}', // you have successfully buy 1 btc
	COUNTDOWN_ERROR_MESSAGE: 'Countdown is finished',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'Bank to Withdraw to',
		MESSAGE_ABOUT_SEND: 'You are about to send',
		MESSAGE_BTC_WARNING:
			'Please ensure the accuracy of this address since {0} transfers are irreversible',
		MESSAGE_FEE: 'Transactions fee of {0} ({1}) included',
		MESSAGE_FEE_COIN: 'Transactions fee of {0}',
		BASE_MESSAGE_1:
			'You can only withdraw to a bank account in a name that matches the name registered with your account.',
		BASE_MESSAGE_2: 'Withdrawal min amount',
		BASE_MESSAGE_3: 'Daily withdrawal max amount',
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
	AVAILABLE_BALANCE_TEXT: 'Available {0} Balance: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Balance',
	CURRENCY_BALANCE_TEXT: '{0} Balance',
	WALLET_ALL_ASSETS: 'All Assets',
	WALLET_HIDE_ZERO_BALANCE: 'Hide zero balance',
	WALLET_ESTIMATED_TOTAL_BALANCE: 'Estimated Total Balance',
	WALLET_ASSETS_SEARCH_TXT: 'Search',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Sellers',
	ORDERBOOK_BUYERS: 'Buyers',
	ORDERBOOK_SPREAD: 'spread {0}', // 0 -> 660,000 T
	CALCULATE_MAX: 'Max',
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
		'The slippage for the amount selected is too high in the market',
	QUICK_TRADE_ORDER_NOT_FILLED: 'Order is not filled',
	QUICK_TRADE_NO_BALANCE: 'Insufficient balance to perform the order',
	QUICK_TRADE_SUCCESS: 'Success!',
	QUICK_TRADE_INSUFFICIENT_FUND: 'Insufficient funds',
	QUICK_TRADE_INSUFFICIENT_FUND_MESSAGE:
		'You have insufficient funds in your wallet to complete this transaction.',
	QUICK_TRADE_BROKER_NOT_AVAILABLE_MESSAGE:
		'Broker OTC deal is currently not available.', //new
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
	INVALID_CAPTCHA: 'Invalid captcha',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL: 'Language preferences (Includes Emails)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
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
	DEVELOPERS_TOKEN: {
		API_KEY: 'API Key',
		SECRET_KEY: 'Secret Key',
		ACCESS: 'Access',
		BASIC_ACCESS: 'Basic access',
		BASIC_ACCESS_PROMPT: 'Select what this API key can access.',
		READING_ACCESS: 'Reading (wallets balances, etc)',
		TRADING_ACCESS: 'Trading',
		IP_ACCESS: 'IP access',
		IP_ACCESS_PROMPT: 'Configure what IP address will work with this API key.',
		ANY_IP_ADDRESS: 'Any IP address',
		ONLY_TRUSTED_IPS: 'Only trusted IPs',
		ADD_IP_PH: 'Enter IP address. You can add multiple IPs',
		ADD_IP: 'Add',
		ADVANCED_ACCESS: 'Advanced access',
		ADVANCED_ACCESS_PROMPT: 'Requires trusted IPs be activated.',
		WITHDRAWAL_ACCESS: 'Withdrawals',
		SAVE: 'Save',
		BEWARE: 'Beware, allowing withdrawals comes with certain risks!',
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
		READ_MORE: 'Read More',
		SHOW_IMAGE: 'Show Image',
		HIDE_IMAGE: 'Hide Image',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'Message',
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
	TRADE_TAB_POSTS: 'Announcements', // new
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
		URGENT_REQUIREMENTS: 'Urgent Requirements',
		TRADING_VOLUME: 'Trading Volume',
		ACCOUNT_ASSETS: 'Account Assets',
		ACCOUNT_DETAILS: 'Account Details',
		VIEW_FEE_STRUCTURE: 'View Fee Structure and Limits',
		UPGRADE_ACCOUNT: 'Upgrade Account',
		ACTIVE_2FA_SECURITY: 'Active 2FA Security',
		ACCOUNT_ASSETS_TXT_1: 'Displayed is a summary of all your assets.',
		ACCOUNT_ASSETS_TXT_2:
			'Holding a large amounts of assets will entitle you for an account upgrade which includes a unique badge and lower trading fees.',
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
		TRADING_FEE_STRUCTURE: 'Trading fee structure',
		WITHDRAWAL: 'Withdrawal',
		DEPOSIT: 'Deposit',
		TAKER: 'Taker',
		MAKER: 'Maker',
		NOMINAL_TRADING_WITH_MONTH: 'Nominal Trading Last {0}',
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
		HAP_ACCOUNT_TXT:
			'Your account is a verified HollaEx affiliate program account. You can now earn 10% bonus for every person you invite that buys XHT.', // new
		EMAIL_VERIFICATION: 'Email Verification', // new
		DOCUMENTS: 'Documents', // new
		HAP_TEXT: 'HollaEx Affiliate Program (HAP) {0}', // new
		LOCK_AN_EXCHANGE: 'Lock an Exchange {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'Vault Subscription users {0}', // new
		TRADE_OVER_XHT: 'Trade over {0} USDT worth', // new
		XHT_IN_WALLET: '{0} XHT in wallet', // new
		TASKS: 'Tasks', // new
		DISCOUNT: '( {0}% discount )', // new
		MY_FEES_LIMITS: ' My Fees and Limits', // new
		MARKETS: 'Markets', // new
		CHANGE_24H: '24H Change', // new
		VOLUME_24H: '24H Volume', // new
		VIEW_MORE_MARKETS: 'View more markets', // new
	},
	REFERRAL_LINK: {
		TITLE: 'Invite your friend', // new
		INFO_TEXT:
			'Refer your friends by giving out this link and receive benefits by onboarding other people.',
		COPY_FIELD_LABEL: 'Share the link below with friends and earn commissions:', // new
		REFERRED_USER_COUT: 'You have referred {0} users', // new
		COPY_LINK_BUTTON: 'COPY REFERRAL LINK', // new
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
		XHT_TRADE_TXT_1: 'Login to see your recent trades', //new
		XHT_TRADE_TXT_2: 'You can {0} to see your recent trade history', //new
		LOGIN_HERE: 'login here',
	},
	USER_LEVEL: 'User level', // new
	LIMIT_AMOUNT: 'Limit amount', // new
	FEE_AMOUNT: 'Fee amount', // new
	COINS: 'Coins', // new
	PAIRS: 'Pairs', // new
	NOTE_FOR_EDIT_COIN:
		'Note: For adding and removing {0} please refer to the{1}.', // new
	REFER_DOCS_LINK: 'docs', // new
	EXPIRED_INFO_1: 'Your trial has ended.', // new
	EXPIRED_INFO_2: 'Collateralize your exchange to activate it again.', // new
	EXPIRED_BUTTON_TXT: 'ACTIVATE EXCHANGE', // new
	TRADE_POSTS: {
		// new
		LEARN_MORE: 'Learn more',
	},
	OPEN_WALLET: 'Open wallet', // new
	CUMULATIVE_AMOUNT_SYMBOL: 'Total', //new
	POST_ONLY: 'Post only',
	CLEAR: 'Clear',
	ORDER_TYPE: 'Type',
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
		INFO_1: 'This will cancel your open orders for {0} market.',
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
	CHANGE_PASSWORD_FAILED: 'changing password failed', // new
	MARKET_OPTIONS: [
		{ value: 'List', label: 'List' }, // new
		{ value: 'Card', label: 'Card' }, // new
	],
	ALL: 'All', //new
	ASSET_TXT: 'Asset', //new
	ONE_DAY: '1 day', //new
	ONE_WEEK: '1 week', //new
	MONTH: '{0} month', //new
	START_DATE: 'Start date', //new
	END_DATE: 'End date', //new
	REGULAR: 'Regular', //new
	STOPS: 'Stops', //new
	VIEW_ALL: 'view all', //new
	TRIGGER_PRICE: 'Trigger price', //new
	SPEND_AMOUNT: 'Spend Amount', //new
	ESTIMATE_RECEIVE_AMOUNT: 'Estimated Receiving Amount', //new
	TOOLS: {
		ORDERBOOK: 'Orderbook', //new
		CHART: 'Chart', //new
		PUBLIC_SALES: 'Public sales', //new
		ORDER_ENTRY: 'Order entry', //new
		RECENT_TRADES: 'Recent trades', //new
		OPEN_ORDERS: 'Open orders', //new
		WALLET: 'Wallet',
		DEPTH_CHART: 'Depth chart', //new
		COMING_SOON: 'coming soon', //new
	},
	WALLET_BALANCE_LOADING: 'Balance loading...', //new
	LOADING: 'Loading...', //new,
	CONNECT_VIA_DESKTOP: {
		TITLE: 'Connect via desktop',
		SUBTITLE:
			"DeFi staking through your mobile devices aren't supported at this time.",
		TEXT: 'To connect your wallet please use a desktop/laptop computer.',
	},
	ORDER_HISTORY_CLOSED: 'Closed', //new
};
