export default {
	APP_TITLE: 'Hollaex',
	APP_NAME: 'hollaex',
	FIAT_NAME: 'EURO',
	FIAT_FULLNAME: 'Euro',
	FIAT_SHORTNAME: 'EUR',
	FIAT_CURRENCY_SYMBOL: '€',
	FIAT_PRICE_FORMAT: '{0} {1}', // 0-> amount  1 -> symbol  600,000 T

	BTC_NAME: 'Bitcoin',
	BTC_FULLNAME: 'Bitcoin',
	BTC_SHORTNAME: 'BTC',
	BTC_CURRENCY_SYMBOL: 'BTC',
	BTC_PRICE_FORMAT: '{0} {1}', // 0-> amount  1 -> symbol  6.00245 BTC

	ETH_NAME: 'Ethereum',
	ETH_FULLNAME: 'Ethereum',
	ETH_SHORTNAME: 'ETH',
	ETH_CURRENCY_SYMBOL: 'ETH',
	ETH_PRICE_FORMAT: '{0} {1}', // 0-> amount  1 -> symbol  6.00245 ETH

	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss A',
	HOUR_FORMAT: 'HH:mm:ss A',
	LOGIN_TEXT: 'Login',
	SIGNUP_TEXT: 'Sign Up',
	REGISTER_TEXT: 'Register',
	ACCOUNT_TEXT: 'Account',
	CLOSE_TEXT: 'Close',
	COPY_TEXT: 'Copy',
	UPLOAD_TEXT: 'Upload',
	CONTACT_US_TEXT: 'Contact us',
	NEED_HELP_TEXT: 'Need help',
	HELP_TEXT: 'help',
	SUCCESS_TEXT: 'Success',
	ERROR_TEXT: 'Error',
	EDIT_TEXT: 'Edit',
	BACK_TEXT: 'Back',
	NO_OPTIONS: 'No options availables',
	HOME: {
		SECTION_1_TITLE: 'Build your own Bitcoin exchange',
		SECTION_1_TEXT_1:
			'Build your own scalable Bitcoin exchange with HollaEx and be part of the future finance.',
		SECTION_1_TEXT_2:
			'We strive to bring the financial technology forward through afforable and simple access to Bitcoin and cryptocurrencies.',
		SECTION_1_BUTTON_1: 'Learn more',
		SECTION_3_TITLE: 'Features',
		SECTION_3_CARD_1_TITLE: 'SCALABLE MATCHING ENGINE',
		SECTION_3_CARD_1_TEXT:
			'High performance and scalable order matching engine using the most efficient algorithms',
		SECTION_3_CARD_2_TITLE: 'BANK INTEGRATION',
		SECTION_3_CARD_2_TEXT:
			'Plugins with customizable modules available for bank integration. We know the traditional finace and can help you to make your exchange local',
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
			'Flexible and integratable modules to apply KYC and user verification methods in diffrente jurisdiction.',
		SECTION_3_BUTTON_1: 'View Demo'
	},
	FOOTER: {
		FOOTER_LEGAL: [
			'Proudly made in Seoul, South Korea',
			'bitHolla Inc.'
		],
		FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
		FOOTER_LANGUAGE_LANGUAGES: [{ key: 'en', label: 'English' }],
		FOOTER_COPYRIGHT: 'COPYRIGHT 2018',
		SECTIONS: {
			SECTION_1_TITLE: 'ABOUT',
			SECTION_1_LINK_1: 'About Us',
			SECTION_1_LINK_2: 'Compliance',
			SECTION_1_LINK_3: 'Privacy Policy',
			SECTION_2_TITLE: 'INFORMATION',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Contact Us',
			SECTION_2_LINK_3: 'Career',
			SECTION_3_TITLE: 'DEVELOPERS',
			SECTION_3_LINK_1: 'API Explorer'
		}
	},
	ACCOUNTS: {
		TITLE: 'Account',
		TAB_VERIFICATION: 'Verification',
		TAB_SECURITY: 'Security',
		TAB_NOTIFICATIONS: 'Notifications',
		TAB_SETTINGS: 'Settings',
		TAB_PROFILE: 'Profile'
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'Category',
		CATEGORY_PLACEHOLDER: 'Select the category that best suits your issue',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'User verification',
			OPTION_LEVEL: 'Increase user level',
			OPTION_DEPOSIT: 'Deposit & Withdrawal',
			OPTION_BUG: 'Report bug'
		},
		SUBJECT_LABEL: 'Subject',
		SUBJECT_PLACEHOLDER: 'Type the subject of your issue',
		DESCRIPTION_LABEL: 'Description',
		DESCRIPTION_PLACEHOLDER: 'Type in detail what the issue is',
		ATTACHMENT_LABEL: 'Add an attachment',
		ATTACHMENT_PLACEHOLDER:
			'Add a file to help communicate your issue. PDF, JPG, PNG and GIF files are accepted',
		SUCCESS_MESSAGE: 'The email has been seent to our support',
		SUCCESS_TITLE: 'Message Sent',
		SUCCESS_MESSAGE_1: 'Your issue has been sent to customer support.',
		SUCCESS_MESSAGE_2: 'You can expect a reply in 1-3 days.'
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			BTC: 'Your Bitcoin receiving address',
			ETH: 'Your Ethereum receiving address'
		},
		INFORMATION_MESSAGES: [
			'Use the bank details below to deposit USD in to your account. Transfers usally take up to 1-2 business day.',
			'Deposits will only be accepeted from a bank account in a name that matches the name registered with your HOLLAEX account.'
		],
		INCREASE_LIMIT: 'Want to increase your daily limit?',
		QR_CODE:
			'This QR Code can be scanned by the person who wants to send you Bitcoins',
		NO_DATA: 'No information available',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}' //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: 'Login to {0}',
		CANT_LOGIN: "Can't login?",
		NO_ACCOUNT: "Don't have an account?",
		CREATE_ACCOUNT: 'Create one here',
		HELP: 'Help'
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'Email',
		EMAIL_PLACEHOLDER: 'Type your Email address',
		PASSWORD_LABEL: 'Password',
		PASSWORD_PLACEHOLDER: 'Type your password',
		PASSWORD_REPEAT_LABEL: 'Retype your password',
		PASSWORD_REPEAT_PLACEHOLDER: 'Retype your password'
	},
	VALIDATIONS: {
		OTP_LOGIN: 'Provide OTP code to login',
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
		INSUFFICIENT_BALANCE: 'Insufficient balance',
		PASSWORDS_DONT_MATCH: "Password don't match",
		USER_EXIST: 'Email has already been registered',
		ACCEPT_TERMS: 'You have not agreed to the Terms of use and Privacy Policy',
		STEP: 'Invalid value, step is {0}',
		ONLY_NUMBERS: 'Value can contain only numbers'
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'Privacy Policy',
			SUBTITLE:
				'Last updated April 1, 2017. Replaces the prior version in its entirety.',
			TEXTS: [
				'HollaEx (website: https://www.HollaEx.com) is a Bitcoin-based virtual trading platform that is wholly owned by bitHolla Inc. bitHolla Inc (hereinafter referred to as bitHolla) was incorporated in Seoul South Korea.',
				'Use of this HollaEx website (“Website”) and the service offered on the Website (“Service”) are governed by the terms contained on this Terms and Conditions page (“Terms”). This agreement entirely constitutes the agreement between the parties. All other information provided on the Website or oral/written statements made are excluded from this agreement; the exchange policy is provided for guidance only and does not constitute a legal agreement between the parties.',
				'By accessing, viewing or downloading information from the Website and using the Service provided by BitMEX you acknowledge that you have read, understand, and unconditionally agree to be bound by these Terms. BitMEX may at any time, without notice, amend the Terms. You agree to continue to be bound by any amended terms and conditions and that BitMEX has no obligation to notify you of such amendments. You acknowledge that it is your responsibility to check these Terms periodically for changes and that your continued use of the Website and Services offered by BitMEX following the posting of any changes to the Terms indicates your acceptance of any such changes.',
				'The Website and the copyright in all text, graphics, images, software and any other materials on the Website is owned by BitMEX including all trademarks and other intellectual property rights in respect of materials and Service on the Website. Materials on this Website may only be used for personal use and non-commercial purposes.',
				'You may display on a computer screen or print extracts from the Website for the above-stated purpose only provided that you retain any copyright and other proprietary notices or any BitMEX trademarks or logos, as shown on the initial printout or download without alteration, addition or deletion. Except as expressly stated herein, you may not without BitMEX’s prior written permission alter, modify, reproduce, distribute or use in any other commercial context any materials from the Website.',
				'You acknowledge that ‘BitMEX’ and the BitMEX logo are trademarks of HDR Global Trading Limited. You may reproduce such trademarks without alteration on material downloaded from this Website to the extent authorised above, but you may not otherwise use, copy, adapt or erase them.',
				'You shall not in any circumstances obtain any rights over or in respect of the Website (other than rights to use the Website pursuant to these Terms and any other terms and conditions governing a particular service or section of the Website) or hold yourself out as having any such rights over or in respect of the Website.'
			]
		},
		GENERAL_TERMS: {
			TITLE: 'General Terms of Service',
			SUBTITLE:
				'Last updated April 1, 2017. Replaces the prior version in its entirety.',
			TEXTS: [
				'HollaEx (website: https://www.hollaex.com) is a Bitcoin-based virtual trading platform that is wholly owned by HDR Global Trading Limited. HDR Global Trading Limited (hereinafter referred to as BitMEX) was incorporated under the International Business Companies Act of 1994 of the Republic of Seychelles with a company number of 148707.',
				'Use of this BitMEX website (“Website”) and the service offered on the Website (“Service”) are governed by the terms contained on this Terms and Conditions page (“Terms”). This agreement entirely constitutes the agreement between the parties. All other information provided on the Website or oral/written statements made are excluded from this agreement; the exchange policy is provided for guidance only and does not constitute a legal agreement between the parties.',
				'By accessing, viewing or downloading information from the Website and using the Service provided by BitMEX you acknowledge that you have read, understand, and unconditionally agree to be bound by these Terms. BitMEX may at any time, without notice, amend the Terms. You agree to continue to be bound by any amended terms and conditions and that BitMEX has no obligation to notify you of such amendments. You acknowledge that it is your responsibility to check these Terms periodically for changes and that your continued use of the Website and Services offered by BitMEX following the posting of any changes to the Terms indicates your acceptance of any such changes.',
				'The Website and the copyright in all text, graphics, images, software and any other materials on the Website is owned by BitMEX including all trademarks and other intellectual property rights in respect of materials and Service on the Website. Materials on this Website may only be used for personal use and non-commercial purposes.',
				'You may display on a computer screen or print extracts from the Website for the above-stated purpose only provided that you retain any copyright and other proprietary notices or any BitMEX trademarks or logos, as shown on the initial printout or download without alteration, addition or deletion. Except as expressly stated herein, you may not without BitMEX’s prior written permission alter, modify, reproduce, distribute or use in any other commercial context any materials from the Website.',
				'You acknowledge that ‘BitMEX’ and the BitMEX logo are trademarks of HDR Global Trading Limited. You may reproduce such trademarks without alteration on material downloaded from this Website to the extent authorised above, but you may not otherwise use, copy, adapt or erase them.',
				'You shall not in any circumstances obtain any rights over or in respect of the Website (other than rights to use the Website pursuant to these Terms and any other terms and conditions governing a particular service or section of the Website) or hold yourself out as having any such rights over or in respect of the Website.'
			]
		}
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'Okay',
			START_TRADING: 'start trading',
			SEE_HISTORY: 'see history'
		},
		DEPOSITS: {
			FIAT: {
				TITLE: '{0} Deposit received',
				SUBTITLE: 'You’ve received your {0} deposit'
			},
			BTC: {
				TITLE_RECEIVED: '{0} Deposit received',
				TITLE_INCOMING: 'Incoming {0}',
				SUBTITLE_RECEIVED: 'You’ve received your {0} deposit',
				SUBTITLE_INCOMING: 'You have incoming {0}',
				INFORMATION_PENDING_1:
					'Your {0} require 1 confirmations before you can begin trading.',
				INFORMATION_PENDING_2:
					'This may take 10-30 minutes. We will send an email once your {0} have completed Confirming.'
			},
			ETH: {
				TITLE_RECEIVED: '{0} Deposit received',
				TITLE_INCOMING: 'Incoming {0}',
				SUBTITLE_RECEIVED: 'You’ve received your {0} deposit',
				SUBTITLE_INCOMING: 'You have incoming {0}',
				INFORMATION_PENDING_1:
					'Your {0} require 1 confirmations before you can begin trading.',
				INFORMATION_PENDING_2:
					'This may take 10-30 minutes. We will send an email once your {0} have completed Confirming.'
			}
		}
	},
	OTP_FORM: {
		OTP_FORM_TITLE: 'Enter your authentication code to continue',
		OTP_LABEL: 'OTP Code',
		OTP_PLACEHOLDER: 'Enter the authentication code',
		OTP_TITLE: 'Authenticator Code',
		OTP_HELP: 'help',
		OTP_BUTTON: 'submit',
		ERROR_INVALID: 'Invalid OTP Code'
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Quick',
		TOTAL_COST: 'Total cost',
		BUTTON: 'Review {0} order',
		INPUT: '{0} to {1}',
		TRADE_TITLE: '{0} {1}' // quick buy
	},
	PREVIOUS_PAGE: 'previous page',
	NEXT_PAGE: 'next page',
	WALLET: {
		TOTAL_ASSETS: 'Total Assets',
		AVAILABLE_WITHDRAWAL: 'Available for trading',
		AVAILABLE_TRADING: 'Available for withdrawal',
		ORDERS_PLURAL: 'orders',
		ORDERS_SINGULAR: 'order',
		HOLD_ORDERS:
			'You have {0} open {1}, resulting in a hold of {2} {3} placed on your {4} balance'
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'Account Recovery',
		SUBTITLE: `Recover your account below`,
		SUPPORT: 'Contact Support',
		BUTTON: 'Send recovery link'
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'Password reset sent',
		TEXT:
			'If an account exists for the email address, an email has been sent to it with reset instructions. Please check your email and click the link to complete your password reset.'
	},
	RESET_PASSWORD: {
		TITLE: 'Set new password',
		SUBTITLE: 'Set new password',
		BUTTON: 'Set new password'
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'You’ve successfully set up a new password.',
		TEXT_2: 'Click login below to proceed.'
	},
	SIGN_UP: {
		SIGNUP_TO: 'Sign up to {0}',
		NO_EMAIL: "Haven't received the email?",
		REQUEST_EMAIL: 'Request another one here',
		HAVE_ACCOUNT: 'Already have an account?',
		GOTO_LOGIN: 'Go to the login page',
		TERMS: {
			terms: 'General Terms',
			policy: 'Privacy Policy',
			text: 'I have read and agree to the {0} and {1}.'
		}
	},
	VERIFICATION_TEXTS: {
		TITLE: 'verification sent',
		TEXT_1: 'Check your email and click the link to verifiy yourself.',
		TEXT_2:
			'If you have not received any email verification and you have checked your junk mail then you can try clicking resend below.'
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'Activation Email Request',
		BUTTON: 'Request Email'
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'Verification reset send',
		TEXT_1:
			'If after a few minutes you still have not received an email verification then please contact us below.'
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'Invalid code',
		TEXT_1: "You've successfully verified your email.",
		TEXT_2: 'You can now proceed to login'
	},
	USER_VERIFICATION: {
		COMPLETED: 'Completed',
		PENDING_VERIFICATION: 'Pending verification',
		TITLE_EMAIL: 'Email',
		TITLE_USER_DOCUMENTATION: 'Identification',
		TITLE_ID_DOCUMENTS: 'Documents',
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
					MAN: 'Man',
					WOMAN: 'Woman'
				},
				NATIONALITY_LABEL: 'Nationality',
				NATIONALITY_PLACEHOLDER:
					'Type what nationality is on your identity document',
				DOB_LABEL: 'Date of birth',
				COUNTRY_LABEL: 'Country you reside',
				COUNTRY_PLACEHOLDER: 'elect the country you reside in currently',
				CITY_LABEL: 'City',
				CITY_PLACEHOLDER: 'Type the city you live in',
				ADDRESS_LABEL: 'Address',
				ADDRESS_PLACEHOLDER: 'Type the address you are currently living',
				POSTAL_CODE_LABEL: 'Postal code',
				POSTAL_CODE_PLACEHOLDER: 'Type your postal code',
				PHONE_CODE_LABEL: 'Country',
				PHONE_CODE_PLACEHOLDER: 'Select the country your phone is connected to',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> Iran
				PHONE_NUMBER_LABEL: 'Phone number',
				PHONE_NUMBER_PLACEHOLDER: 'Type your phone number',
				SMS_SEND: 'Send SMS',
				SMS_CODE_LABEL: 'SMS Code',
				SMS_CODE_PLACEHOLDER: 'Input your SMS code'
			},
			INFORMATION: {
				TEXT:
					'IMPORTANT: Enter your name into the fields exactly as it appears on your identity document (full first name, any middle names/initials and full last name(s)). Are you a business? Contact customer support for a corporate account.',
				TITLE_PERSONAL_INFORMATION: 'Personal Information',
				TITLE_PHONE: 'Phone'
			}
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'Please select a type of identity document',
				ID_NUMBER: 'Please type your documents number',
				ISSUED_DATE: 'Please select the date in which your document was issued',
				EXPIRATION_DATE:
					'Please select the date when your document will expire',
				FRONT: 'Please upload a scan of your photo identity document',
				PROOF_OF_RESIDENCY:
					'Please upload a scan of document proving the address you current reside'
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'ID Document Type',
				TYPE_PLACEHOLDER: 'Select Type of identity document',
				TYPE_OPTIONS: {
					ID: 'ID',
					PASSPORT: 'Passport'
				},
				ID_NUMBER_LABEL: 'ID Document Number',
				ID_NUMBER_PLACEHOLDER: 'Type the documents number',
				ID_NATIONAL_NUMBER_LABEL: 'National Iranian Id',
				ID_NATIONAL_NUMBER_PLACEHOLDER: 'Type your National Iranian Id number',
				ID_PASSPORT_NUMBER_LABEL: 'Passport Number',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'Type your passport number',
				ISSUED_DATE_LABEL: 'ID Document Issue Date',
				EXPIRATION_DATE_LABEL: 'ID Document Expiration Date',
				FRONT_LABEL: 'Photo ID Document',
				FRONT_PLACEHOLDER: 'Add a copy of your photo ID document',
				BACK_LABEL: 'Back Side of Photo ID Document',
				BACK_PLACEHOLDER: 'Add a copy of the backside of your ID document',
				PASSPORT_LABEL: 'Passport Document',
				PASSPORT_PLACEHOLDER: 'Add a copy of your Passport document',
				POR_LABEL: 'Document proving your address',
				POR_PLACEHOLDER: 'Add a copy of a document that proves your address'
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
						'Only a valid government-issued identification document is accepted.',
					WARNING_2:
						'Make sure you are uploading your own documents. Any usage of wrong or fake documents will have legal consequences and result in freezing your account immediately.'
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
						'We cannot accept the address on your submitted identity document as a valid proof of residence.'
				}
			}
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'Please type your first and last name as associated with your bank account',
				ACCOUNT_NUMBER: 'Your bank account number should be 24 digits',
				ACCOUNT_NUMBER_MAX_LENGTH:
					'Your bank account number has a limit of 50 characters',
				SHABA_NUMBER_MAX_LENGTH:
					'Your shaba number has a limit of 50 characters',
				CARD_NUMBER: 'Your card number should be 16 digits'
			},
			FORM_FIELDS: {
				IRANIAN_ACCOUNT_LABEL: 'Do you have an Iranian Bank Account?',
				BANK_NAME_LABEL: 'Bank Name (We reccomend you to use Pasargad Bank for instant withdrawals. Otherwise your withdrawals will have 1 to 2 days delay.',
				BANK_NAME_PLACEHOLDER: 'Type the name of your bank',
				ACCOUNT_NUMBER_LABEL: 'Bank Account Number',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Type your bank account number',
				SHABA_NUMBER_LABEL: 'Shaba Number',
				SHABA_NUMBER_PLACEHOLDER: 'Type your Shaba number',
				ACCOUNT_OWNER_LABEL: 'Bank Account Owner’s Name',
				ACCOUNT_OWNER_PLACEHOLDER: 'Type the name as on your bank account',
				CARD_NUMBER_LABEL: 'Bank Card Number',
				CARD_NUMBER_PLACEHOLDER:
					'Type the 16 digit number that is on the front of your bank card'
			}
		},
		WARNING: {
			TEXT_1: 'By verifing your identity you can obtain the following:',
			LIST_ITEM_1: 'Increased withdrawal limits',
			LIST_ITEM_2: 'Increased deposits limits',
			LIST_ITEM_3: 'Lower fees'
		}
	},
	TRANSACTION_HISTORY: {
		TITLE: 'Transactions  History',
		TITLE_TRADES: 'Trades  History',
		TITLE_DEPOSITS: 'Deposits  History',
		TITLE_WITHDRAWALS: 'Withdrawals  History',
		TEXT_DOWNLOAD: 'DOWNLOAD HISTORY',
		TRADES: 'Trades',
		DEPOSITS: 'Deposits',
		WITHDRAWALS: 'Withdrawals'
	},
	ACCOUNT_SECURITY: {
		OTP: {
			TITLE: 'Two-Factor Authentication',
			OTP_ENABLED: 'otp enabled',
			OTP_DISABLED: 'PLEASE TURN ON 2FA',
			ENABLED_TEXTS: {
				TEXT_1: 'Require OTP when logging in',
				TEXT_2: 'Require OTP when withdrawing funds'
			},
			DIALOG: {
				SUCCESS: 'You have successfully activated the OTP',
				REVOKE: 'You have successfully revoked your OTP'
			},
			CONTENT: {
				TITLE: 'Activate Two-Factor Authentication',
				MESSAGE_1: 'Scan',
				MESSAGE_2:
					'Scan the qrcode below with Google Authenticator or Authy to automatically setup two-factor authentication in your device.',
				MESSAGE_3:
					'If you have problems scanning this, you can manually enter the code below',
				MESSAGE_4:
					'You can store this code securely to recover your 2FA in case you change or lose your mobile phone in future.',
				MESSAGE_5: 'Manual',
				INPUT: 'Enter One-Time Password (OTP)',
				WARNING:
					'We highly recommend you set up 2 factor authentication (2FA). Doing so will greatly increase the security of your funds.',
				ENABLE: 'Enable Two-Factor Authentication',
				DISABLE: 'Disable Two-Factor Authentication'
			},
			FORM: {
				PLACEHOLDER: 'Enter your OTP provided by Google Authenticator.',
				BUTTON: 'Enable 2FA'
			}
		},
		CHANGE_PASSWORD: {
			TITLE: 'Change Password',
			ACTIVE: 'ACTIVE',
			DIALOG: {
				SUCCESS: 'You have successfully changed your password'
			},
			FORM: {
				BUTTON: 'Change Password',
				CURRENT_PASSWORD: {
					label: 'Current Password',
					placeholder: 'Type your current password'
				},
				NEW_PASSWORD: {
					label: 'New Password',
					placeholder: 'Type a new password'
				},
				NEW_PASSWORD_REPEAT: {
					label: 'Confirm New Password',
					placeholder: 'Retype your new password'
				}
			}
		}
	},
	CURRENCY: 'Currency',
	TYPE: 'Type',
	TYPES_VALUES: {
		market: 'market',
		limit: 'limit'
	},
	TYPES: [
		{ value: 'market', label: 'market' },
		{ value: 'limit', label: 'limit' }
	],
	SIDE: 'Side',
	SIDES_VALUES: {
		buy: 'buy',
		sell: 'sell'
	},
	SIDES: [{ value: 'buy', label: 'buy' }, { value: 'sell', label: 'sell' }],
	SIZE: 'Size',
	PRICE: 'Price',
	FEE: 'Fee',
	FEES: 'Fees',
	TIME: 'Time',
	TIMESTAMP: 'Timestamp',
	STATUS: 'Status',
	AMOUNT: 'Amount',
	COMPLETE: 'Complete',
	PENDING: 'Pending',
	ORDERBOOK: 'Orderbook',
	CANCEL: 'Cancel',
	CANCEL_ALL: 'Cancel All',
	GO_TRADE_HISTORY: 'Go to Trade History',
	ORDER_ENTRY: 'order entry',
	TRADE_HISTORY: 'trade history',
	CHART: 'price chart',
	ORDERS: 'my active orders',
	TRADES: 'my trade history',
	REMAINING: 'Remaining',
	FULLFILLED: '{0} % Fullfilled',
	PRICE_CURRENCY: 'PRICE ({0})',
	AMOUNT_SYMBOL: 'AMOUNT ({0})',
	MARKET_PRICE: 'Market Price',
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
		v: 'Volume'
	},
	LANGUAGES: [{ key: 'en', label: 'English' }],
	QUICK_TRADE: 'Quick trade',
	PRO_TRADE: 'Pro trade',
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
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Destination address',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Type the address',
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} amount to withdraw',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	WITHDRAWALS_FORM_FEE_BTC_LABEL: 'Bitcoin transaction fee (This is Bitcoin mining fee. If you lower that amount there is chance your transaction takes significant time to get confirmed.)',
	WITHDRAWALS_FORM_FEE_ETH_LABEL: 'Ethereum transaction fee (This is Ethereum mining fee. If you lower that amount there is chance your transaction takes significant time to get confirmed.)', // TODO CHECK
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
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH: 'The card you made the deposit is not the same as your registered card. Therefore your deposit is rejected and your funds will be refunded in less than an hour.',
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
		MESSAGE_FEE_FIAT: 'Transactions fee of {0} included',
		FIAT_MESSAGE_1:
			'You can only withdraw to a bank account in a name that matches the name registered with your HOLLAEX account.',
		FIAT_MESSAGE_2: 'Withdrawal min amount',
		FIAT_MESSAGE_3: 'Daily withdrawal max amount',
		FIAT_INCREASE_LIMIT: 'Increase your daily limit'
	},
	WALLET_BUTTON_FIAT_DEPOSIT: 'deposit',
	WALLET_BUTTON_FIAT_WITHDRAW: 'withdraw',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'receive',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'send',
	AVAILABLE_TEXT: 'Available',
	AVAILABLE_BALANCE_TEXT: 'Available {0} Balance: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Balance',
	CURRENCY_BALANCE_TEXT: '{0} Balance',
	WALLET_TABLE_AMOUNT_IN: `Amount in {0}`,
	WALLET_TABLE_TOTAL: 'Grand Total',
	WALLET_ALL_ASSETS: 'All Assets',
	HIDE_TEXT: 'Hide',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Sellers',
	ORDERBOOK_BUYERS: 'Buyers',
	ORDERBOOK_SPREAD: '{0} spread', // 0 -> 660,000 T
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'Max',
	DATEFIELD_TOOGLE_DATE_PE: 'تاریخ شمسی‌',
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
	SUBMIT: 'submit',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Missing Documents!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'To get full access to withdrawal and deposit functions on HOLLAEX you must submit your identity documents in your account page.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Success!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'You will receive an email notification when your information has been processed. Processing can typically take 1-3 days.',
	VERIFICATION_NOTIFICATION_BUTTON: 'PROCEED TO HOLLAEX',
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
	SETTINGS_LANGUAGE_OPTIONS: [
		{ value: 'en', label: 'English', icon: `${process.env.PUBLIC_URL}/assets/flags/selected-en.png` }
	],
	SETTINGS_ORDERPOPUP_LABEL: 'Display order confirmation popup',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NO' },
		{ value: true, label: 'YES' }
	],
	SETTINGS_THEME_LABEL: 'Theme', // TODO set right labels
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'White' },
		{ value: 'dark', label: 'Dark' }
	],
	SETTING_BUTTON: 'save',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'Withdrawals disabled',
	VERIFICATION_NO_WITHDRAW_MESSAGE:
		'Your account is disabled for withdrawals',
	UP_TO_MARKET: 'Up to market',
	DEVELOPER_SECTION: {
		TITLE: 'API Key',
		INFORMATION_TEXT: 'The API provides functionality such as getting wallet balances, managing buy/sell orders, requesting withdrawals as well as market data such as recent trades, order book and ticker.',
		ERROR_INACTIVE_OTP: 'To generate an API key you need to enable 2-factor authentication.',
		ENABLE_2FA: 'Enable 2FA',
		WARNING_TEXT: 'Do not share your API key with others.',
		GENERATE_KEY: 'Generate API Key',
		ACTIVE: 'Active',
		INACTIVE: 'Inactive',
		INVALID_LEVEL: 'You need to upgrade your verification level to have access this feature' // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'Generate API Key',
		GENERATE_TEXT: 'Please name your API key and keep it in private after its generated. You wont be able to retrieve it again later.',
		GENERATE: 'Generate',
		DELETE_TITLE: 'Delete API Key',
		DELETE_TEXT: 'Deleting your API key is ireversalable although you can generate a new API key at anytime. Do you want to delete your API key?',
		DELETE: 'DELETE',
		FORM_NAME_LABEL: 'Name',
		FORM_LABLE_PLACEHOLDER: 'Name for the Api Key',
		API_KEY_LABEL: 'API Key',
		CREATED_TITLE: 'Copy your API Key',
		CREATED_TEXT_1: 'Please copy your API key as it will be unattainable in the future.',
		CREATED_TEXT_2: 'Keep your key private.'
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'Name',
		API_KEY: 'API Key',
		CREATED: 'Date Generated',
		REVOKE: 'Revoke',
		REVOKED: 'Revoked',
		REVOKE_TOOLTIP: 'You have to enable 2FA to revoke the token' // TODO
	},
	CHAT: {
		CHAT_TEXT: 'chat',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'Read More',
		SHOW_IMAGE: 'Show Image',
		HIDE_IMAGE: 'Hide Image',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'Message',
		SIGN_UP_CHAT: 'Sign Up To Chat',
		JOIN_CHAT: 'Set Username To Chat'
	},
	INVALID_USERNAME: 'Username must be between 3 and 15 characters long. Only contains lowercase, numbers and underscore',
	USERNAME_TAKEN: 'This username has already been taken. Please try another.',
	USERNAME_LABEL: 'Username (used for chat)',
	USERNAME_PLACEHOLDER: 'Username',
	TAB_USERNAME: 'Username',
	USERNAME_WARNING: 'Your username can only be changed once. Please assure your username is desirable.',
	USERNAME_CANNOT_BE_CHANGED: 'Username can not be changed',
	UPGRADE_LEVEL: 'Upgrade account level',
	LEVELS: {
		LABEL_LEVEL: 'Level',
		LABEL_LEVEL_1: 'One',
		LABEL_LEVEL_2: 'Two',
		LABEL_LEVEL_3: 'Three',
		LABEL_MAKER_FEE: 'Maker Fee',
		LABEL_TAKER_FEE: 'Taker Fee',
		LABEL_FIAT_DEPOSIT: 'Daily Euro Deposit',
		LABEL_FIAT_WITHDRAWAL: 'Daily Euro Withdrawal',
		LABEL_BTC_DEPOSIT: 'Daily Bitcoin Deposit',
		LABEL_BTC_WITHDRAWAL: 'Daily Bitcoin Withdrawal',
		LABEL_ETH_DEPOSIT: 'Daily Ethereum Deposit',
		LABEL_ETH_WITHDRAWAL: 'Daily Ethereum Withdrawal',
		LABEL_PAIR_MAKER_FEE: '{0} Maker Fee',
		LABEL_PAIR_TAKER_FEE: '{0} Taker Fee',
		UNLIMITED: 'Unlimited',
		BLOCKED: '0'
	},
	WALLET_ADDRESS_TITLE: 'Generate {0} Wallet',
	WALLET_ADDRESS_GENERATE: 'Generate',
	WALLET_ADDRESS_MESSAGE: 'When you generate a wallet you create a deposit and withdrawal address.',
	WALLET_ADDRESS_ERROR: 'Error generating the address, please refresh and try again.',
	DEPOSIT_WITHDRAW: 'Deposit/Withdraw',
	GENERATE_WALLET: 'Generate Wallet',
	TRADE_TAB_CHART: 'Chart',
	TRADE_TAB_TRADE: 'Trade',
	TRADE_TAB_ORDERS: 'Orders',
	WALLET_TAB_WALLET: 'Wallet',
	WALLET_TAB_TRANSACTIONS: 'Transactions',
	RECEIVE_CURRENCY: 'Receive {0}',
	SEND_CURRENCY: 'Send {0}',
	COPY_ADDRESS: 'Copy Address',
	SUCCESFUL_COPY: 'Successfully Copied!',
	QUICK_TRADE_MODE: 'Quick Trade Mode',
	JUST_NOW: 'just now',
	PAIR: 'Pair'
};
