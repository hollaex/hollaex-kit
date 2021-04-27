import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';
import flatten from 'flat';

const options = { safe: true };
const nestedContent = {
	APP_TITLE: 'HollaEx',
	APP_SUB_TITLE: 'Open Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: '로그아웃 하시겠습니까?',
	ADD_TRADING_PAIR: '거래통화페어 추가',
	ACTIVE_TRADES: '실제 거래를 이용하기 위해 {0}을 해주시기바랍니다.',
	CANCEL_FIAT_WITHDRAWAL: '{0} 출금 취소',
	CANCEL_WITHDRAWAL: '출금 취소',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM: '진행중인 출금 거래를 취소하시겠습니까?:',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: '로그인',
	SIGN_IN: '로그인',
	SIGNUP_TEXT: '회원가입',
	REGISTER_TEXT: '가입하기',
	ACCOUNT_TEXT: '계정',
	HOME_TEXT: 'Home',
	CLOSE_TEXT: '닫기',
	COPY_TEXT: '복사',
	COPY_SUCCESS_TEXT: '성공적으로 복사되었습니다.',
	CANCEL_SUCCESS_TEXT: '성공적으로 취소되었습니다!',
	UPLOAD_TEXT: '업로드',
	ADD_FILES: '파일추가', // ToDo
	OR_TEXT: '또는',
	CONTACT_US_TEXT: '문의하기',
	HELPFUL_RESOURCES_TEXT: '도움말',
	HELP_RESOURCE_GUIDE_TEXT:
		'문의사항은 support@hollaex.com로 연락해주시기바랍니다.',
	HELP_TELEGRAM_TEXT: 'HollaEx의 오픈API 확인하기:',
	HELP_TELEGRAM_LINK: 'https://apidocs.hollaex.com',
	NEED_HELP_TEXT: '도움이 필요하십니까?', // new
	HELP_TEXT: 'help',
	SUCCESS_TEXT: '성공',
	ERROR_TEXT: '에러',
	PROCEED: '실행',
	EDIT_TEXT: '편집',
	BACK_TEXT: '돌아가기',
	NO_OPTIONS: '사용가능한 옵션이 없습니다.',
	SECONDS: 'seconds',
	VIEW_MARKET: '마켓보기', // new
	GO_TRADE: '거래하러가기', // new
	VIEW_INFO: '정보페이지보기', // new
	HOME: {
		SECTION_1_TITLE: 'HollaEx Exchange Kit에 오신 것을 환영합니다.',
		SECTION_1_TEXT_1:
			'HollaEx Kit으로 자신만의 확장 가능한 디지털 자산 거래소를 구축하여 미래금융을 이끌어보세요.',
		SECTION_1_TEXT_2:
			'트레이딩 기술을 간단한 접근과 알맞은 가격으로 구현하여 금융 기술 발전을 위해 노력합니다.',
		SECTION_1_BUTTON_1: '더 알아보기',
		SECTION_3_TITLE: '특징',
		SECTION_3_CARD_1_TITLE: '확장가능한 매칭 엔진',
		SECTION_3_CARD_1_TEXT:
			'가장 효율적인 알고리즘을 이용하여 고성능의 확장 가능한 주문 매칭 엔진',
		SECTION_3_CARD_2_TITLE: '은행 통합',
		SECTION_3_CARD_2_TEXT:
			'사용자 맞춤형 모듈의 플러그인을 통해 은행과의 통합이 가능합니다. 현지 시장에 맞추어 거래소를 만들 수 있도록 도울 수 있습니다.',
		SECTION_3_CARD_3_TITLE: '강력한 보안시스템',
		SECTION_3_CARD_3_TEXT:
			'보안을 최우선 순위로 두고 주의를 기울입니다. HollaEx는 자금을 안전하게 유지하기 위해 최상의 보안관행과 가장 안전하고 신뢰할 수 있는 알고리즘을 사용합니다.',
		SECTION_3_CARD_4_TITLE: '고급 리포팅 기능',
		SECTION_3_CARD_4_TEXT:
			'어드민 패널을 통해 시스템 및 트랜잭션 상태를 서포터 및 관리자에게 통지하기 위한 맞춤형의 이메일과 보고서 등을 제공합니다.',
		SECTION_3_CARD_5_TITLE: '고객지원',
		SECTION_3_CARD_5_TEXT:
			'고객의 니즈에 특별히 주의를 기울이며, 고객의 이슈와 문의에 도움을 줄 온라인 전문가를 제공합니다.',
		SECTION_3_CARD_6_TITLE: 'KYC 통합',
		SECTION_3_CARD_6_TEXT:
			'유연하고 통합가능한 모듈로 KYC 및 사용자 인증방법을 다른 관할구역에서 적용할 수 있습니다.',
		SECTION_3_BUTTON_1: '데모 보기',
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
		SECTIONS: {
			SECTION_1_TITLE: 'ABOUT',
			SECTION_1_LINK_1: 'About Us',
			SECTION_1_LINK_2: '이용약관',
			SECTION_1_LINK_3: '개인정보처리방침',
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
			SECTION_3_LINK_5: 'API문서',
			SECTION_3_LINK_6: 'API',
			SECTION_3_LINK_7: 'Developer tools',
			SECTION_3_LINK_8: 'Docs',
			SECTION_4_TITLE: 'EXCHANGE',
			SECTION_4_LINK_1: '로그인',
			SECTION_4_LINK_2: '회원가입',
			SECTION_4_LINK_3: 'Contact Us',
			SECTION_4_LINK_4: 'Terms of Use',
			SECTION_5_TITLE: 'RESOURCES',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'HollaEx Token(XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_6_TITLE: 'SOCIAL',
			SECTION_6_LINK_1: '트위터',
			SECTION_6_LINK_2: '텔레그램',
		},
		XHT_DESCRIPTION:
			'HollaEx는 비트홀라에서 개발 및 관리하는 HollaEx Kit기술에 기반하여 만들어진 오픈 암호화폐 거래소입니다. HollaEx 소프트웨어 Kit으로 만들어진 실시간 운영되고있는 거래소로 누구나 이와 같은 거래소를 직접 운영할 수 있다는 것을 보여주는 예입니다. 자신만의 거래소를 시작하기위해 {1}를 참조하시기바랍니다. HollaEx토큰은 HollaEx의 네이티브 토큰으로 웨이브옥션 시스템을 통해 HollaEx거래소에서 거래됩니다. 옥션이 어떻게 작동하는지 자세한 내용은 {0}에서 확인하실 수 있습니다.',
		CLICK_HERE: '이곳을 클릭하세요.',
		VISIT_HERE: '방문하기',
	},
	ACCOUNTS: {
		TITLE: '계정',
		TAB_VERIFICATION: '회원정보',
		TAB_SECURITY: '보안',
		TAB_NOTIFICATIONS: '알림',
		TAB_SETTINGS: '설정',
		TAB_PROFILE: '프로필',
		TAB_WALLET: '지갑',
		TAB_SUMMARY: '개요',
		TAB_HISTORY: '내역',
		TAB_API: 'API',
		TAB_SIGNOUT: '로그아웃',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: '접근링크요청',
		REQUEST_INVITE: '초대요청',
		CATEGORY_PLACEHOLDER: '회원님에게 해당하는 카테고리를 선택하시기바랍니다.',
		INTRODUCTION_LABEL: '자기소개',
		INTRODUCTION_PLACEHOLDER:
			'베이스가 어디십니까? 거래소 운영에 관심이 있으십니까?',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: '문의 유형',
		CATEGORY_PLACEHOLDER: '문의 유형을 선택하시기 바랍니다.',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: '본인인증 관련',
			OPTION_LEVEL: '회원등급 상향',
			OPTION_DEPOSIT: '입금 & 출금',
			OPTION_BUG: '오류 보고',
			OPTION_PERSONAL_INFO: '개인정보 변경', // ToDo:
			OPTION_BANK_TRANSFER: '은행송금', // new
			OPTION_REQUEST: 'HollaEx Exchange 초대요청', // new
		},
		SUBJECT_LABEL: '문의 제목',
		SUBJECT_PLACEHOLDER: '문의 제목을 작성하여 주시기바랍니다.',
		DESCRIPTION_LABEL: '문의 내용',
		DESCRIPTION_PLACEHOLDER: '문의내용을 상세하게 작성하여 주시기바랍니다.',
		ATTACHMENT_LABEL: '첨부파일(최대3개)',
		ATTACHMENT_PLACEHOLDER:
			'더 나은 상담을 위하여 문의내용과 관련된 이미지 파일을 첨부해주시기바랍니다.(PDF, JPG, PNG, GIF 파일첨부가능)',
		SUCCESS_MESSAGE: '고객센터로 이메일이 전송되었습니다.',
		SUCCESS_TITLE: '전송완료',
		SUCCESS_MESSAGE_1: '문의내용이 고객 센터로 전송되었습니다.',
		SUCCESS_MESSAGE_2: '영업일기준 1~3일이 소요됩니다.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: '{0} 입금 주소', // new
			DESTINATION_TAG: '{0} 데스티네이션 태그(Destination Tag)', // new
			BTC: '비트코인 입금 주소',
			ETH: '이더리움 입금 주소',
			BCH: '비트코인캐시 입금 주소',
		},
		INCREASE_LIMIT: '한도 증액이 필요하십니까?',
		QR_CODE:
			'회원님에게 할당된 입금 전용주소로 입금을 위해 이 QR 코드를 스캔하실 수 있습니다.',
		NO_DATA: '이용가능한 정보가 없습니다.',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: '{0} 로그인',
		CANT_LOGIN: '로그인이 안되십니까?',
		NO_ACCOUNT: '계정이 없으십니까?',
		CREATE_ACCOUNT: '계정만들기',
		HELP: 'Help',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: '이메일',
		EMAIL_PLACEHOLDER: '이메일 주소',
		PASSWORD_LABEL: '비밀번호',
		PASSWORD_PLACEHOLDER: '비밀번호 입력',
		PASSWORD_REPEAT_LABEL: '비밀번호 확인',
		PASSWORD_REPEAT_PLACEHOLDER: '비밀번호 확인',
	},
	VALIDATIONS: {
		OTP_LOGIN: '로그인을 위해 OTP코드를 입력해주시기 바랍니다.',
		CAPTCHA: 'Expired Session. Please refresh the page', // new
		FROZEN_ACCOUNT: 'This account is frozen.',
		INVALID_EMAIL: '사용할 수 없는 이메일 주소입니다.',
		TYPE_EMAIL: '이메일주소를 입력하세요.',
		REQUIRED: '필수입력란',
		INVALID_DATE: '유효하지 않은 날짜',
		INVALID_PASSWORD:
			'사용할 수 없는 비밀번호입니다.(비밀번호는 최소 8자 이상, 숫자 및 특수문자 사용)',
		INVALID_PASSWORD_2:
			'사용할 수 없는 비밀번호입니다.(비밀번호는 최소 8자 이상, 최소 하나이상의 숫자 및 특수문자 사용)',
		INVALID_CURRENCY: '잘못된 {0} 주소({1})',
		INVALID_BALANCE: '({1}) 을 수행할 ({0}) 사용 가능한 잔액이 부족합니다.',
		MIN_VALUE: '값은 반드시 {0} 또는 이보다 높아야 합니다.',
		MAX_VALUE: '값은 반드시 {0} 또는 이보다 낮아야 합니다.',
		INSUFFICIENT_BALANCE: '잔액이 부족합니다.',
		PASSWORDS_DONT_MATCH: '비밀번호가 일치하지 않습니다.',
		USER_EXIST: '이미 등록되어있는 이메일주소입니다.',
		ACCEPT_TERMS: '이용약관 및 개인정보 보호 정책에 동의하지 않으셨습니다.',
		STEP: '잘못된 값, step is {0}',
		ONLY_NUMBERS: '숫자만 입력가능합니다.',
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
			START_TRADING: '거래 시작하기',
			SEE_HISTORY: '거래내역 보기',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} 입금완료',
			TITLE_INCOMING: '{0} 입금진행중',
			SUBTITLE_RECEIVED: '{0} 입금이 완료되었습니다.',
			SUBTITLE_INCOMING: '{0}입금이 진행 중입니다.',
			INFORMATION_PENDING_1:
				'거래를 시작하려면 {0}은 최소 1개의 확인이 필요합니다.',
			INFORMATION_PENDING_2:
				'입금이 완료되는데 약 10-30분이 소요되지만, 상황에 따라 지연될 수 있습니다. {0}이 블록체인상 확인이 완료되면 이메일을 보내드립니다.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: '요청을 보냈습니다.',
		BUTTON_TEXT: 'Okay',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: '인증번호를 입력하여 계속 진행하시기 바랍니다.',
		OTP_LABEL: 'OTP 번호',
		OTP_PLACEHOLDER: '인증번호 입력',
		OTP_TITLE: '인증 번호',
		OTP_HELP: '도움',
		OTP_BUTTON: '확인',
		ERROR_INVALID: 'OTP 번호가 유효하지 않습니다.',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: '퀵트레이딩',
		TOTAL_COST: '총 금액',
		BUTTON: '{0} 주문 확인하기',
		INPUT: '{0} {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: '이전페이지',
	NEXT_PAGE: '다음페이지',
	WALLET: {
		TOTAL_ASSETS: '총 보유자산',
		AVAILABLE_WITHDRAWAL: '거래 가능 자산',
		AVAILABLE_TRADING: '출금 가능 자산',
		ORDERS_PLURAL: '주문',
		ORDERS_SINGULAR: '주문',
		HOLD_ORDERS:
			'You have {0} open {1}, resulting in a hold of {2} {3} placed on your {4} balance',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: '비밀번호 재설정',
		SUBTITLE: `아래 계정의 비밀번호를 재설정하실 수 있습니다.`,
		SUPPORT: '고객센터',
		BUTTON: '재설정 링크 보내기',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: '비밀번호 재설정을 위한 이메일이 전송되었습니다.',
		TEXT:
			'이메일에 대한 계정이 등록되어있다면 재설정 지침이 포함된 메일을 받아보실 수 있습니다. 이메일을 확인하시어 링크를 따라 비밀번호 재설정을 완료하시기 바랍니다.',
	},
	RESET_PASSWORD: {
		TITLE: '새 비밀번호 설정',
		SUBTITLE: '새 비밀번호 설정',
		BUTTON: '새 비밀번호 설정',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: '새 비밀번호가 성공적으로 설정되었습니다.',
		TEXT_2: '계속하려면 아래 로그인 버튼을 클릭하시기바랍니다.',
	},
	SIGN_UP: {
		SIGNUP_TO: '{0}에 가입하기',
		NO_EMAIL: '이메일을 받지 못하셨나요?',
		REQUEST_EMAIL: '이메일 재요청하기',
		HAVE_ACCOUNT: '이미 계정이 있으신가요?',
		GOTO_LOGIN: '로그인 페이지로 이동',
		AFFILIATION_CODE: '추천인코드(선택)',
		AFFILIATION_CODE_PLACEHOLDER: '추천인코드입력',
		TERMS: {
			terms: '이용약관',
			policy: '개인정보 처리방침',
			text: '{0}과 {1}을 확인하였으며 이에 동의합니다',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: '이메일 인증 링크가 전송되었습니다.',
		TEXT_1: '전송된 이메일의 링크를 따라 인증을 진행하시기 바랍니다.',
		TEXT_2:
			'이메일을 받지 못했을 경우 스팸 메일함을 확인해주시기 바랍니다. 또한, 아래의 요청을 통해 이메일을 재전송하실 수 있습니다.',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: '이메일인증 재전송하기',
		BUTTON: '전송하기',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: '이메일이 재전송되었습니다.',
		TEXT_1:
			'몇 분 후에도 인증 이메일을 받지 못하셨을 경우에는 아래로 연락해주시기 바랍니다.',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: '유효하지 않은 코드',
		TEXT_1: '성공적으로 이메일 인증되었습니다.',
		TEXT_2: '로그인을 진행해주시기 바랍니다.',
	},
	USER_VERIFICATION: {
		INFO_TXT: '개인정보 및 계정 업그레이드 진행상황을 확인하실 수 있습니다.',
		INFO_TXT_1:
			'아래 각 부문에 필요한 정보를 작성해주시기바랍니다. 모든 부문의 제출의 완료된 이후에 해당 정보를 검토하여 계정업그레이드 승인이 이루어집니다.',
		INFO_TXT_2: '*인증을 위해 {0}가 필수적입니다.',
		DOCUMENTATIONS: '문서업로드',
		COMPLETED: '완료',
		PENDING_VERIFICATION: '인증진행중',
		TITLE_EMAIL: '이메일',
		MY_EMAIL: '나의 이메일',
		MAKE_FIRST_DEPOSIT: '첫 입금하기', // new
		OBTAIN_XHT: 'XHT 받기', // new
		TITLE_USER_DOCUMENTATION: 'Identification', // not used
		TITLE_ID_DOCUMENTS: '문서업로드',
		TITLE_BANK_ACCOUNT: '은행계좌',
		TITLE_MOBILE_PHONE: '휴대폰',
		TITLE_PERSONAL_INFORMATION: '개인정보',
		VERIFY_EMAIL: '이메일 확인',
		VERIFY_MOBILE_PHONE: '휴대폰번호 확인',
		VERIFY_USER_DOCUMENTATION: '인증문서 확인',
		VERIFY_ID_DOCUMENTS: '신분증 확인',
		VERIFY_BANK_ACCOUNT: '은행계좌 확인',
		BUTTON: '인증요청제출하기',
		TITLE_IDENTITY: '개인정보',
		TITLE_MOBILE: '휴대폰',
		TITLE_MOBILE_HEADER: '휴대폰번호',
		TITLE_BANK: '은행',
		TITLE_BANK_HEADER: '은행상세정보',
		CHANGE_VALUE: '값 변경하기',
		PENDING_VERIFICATION_PERSONAL_INFORMATION: '개인정보 인증처리중입니다.',
		PENDING_VERIFICATION_BANK: '은행정보인증이 처리중입니다.',
		PENDING_VERIFICATION_DOCUMENTS: '문서인증이 처리중입니다.',
		GOTO_VERIFICATION: '인증페이지로 이동',
		GOTO_WALLET: '지갑으로 이동', // new
		CONNECT_BANK_ACCOUNT: '은행계좌연결',
		ACTIVATE_2FA: '이중인증(2FA) 활성화',
		INCOMPLETED: '완료되지않음',
		BANK_VERIFICATION: '은행인증',
		IDENTITY_VERIFICATION: '개인정보확인',
		PHONE_VERIFICATION: '휴대폰인증',
		DOCUMENT_VERIFICATION: '개인정보제출',
		START_BANK_VERIFICATION: '은행인증시작하기',
		START_IDENTITY_VERIFICATION: '개인정보작성하기',
		START_PHONE_VERIFICATION: '휴대폰 인증시작하기 ',
		START_DOCUMENTATION_SUBMISSION: '문서업로드 시작하기',
		GO_BACK: '되돌아가기',
		BANK_VERIFICATION_TEXT_1:
			'은행계좌는 3개까지 추가하실 수 있습니다. 해외은행계좌는 고객센터에 문의하여주시고, 출금한도에 제한이 있습니다.',
		BANK_VERIFICATION_TEXT_2:
			'은행계좌등록을 하시면 아래와 같은 서비스를 이용하실 수 있습니다:',
		FIAT_WITHDRAWAL: '화폐출금',
		FIAT_DEPOSITS: '화폐입금',
		ADD_ANOTHER_BANK_ACCOUNT: '은행계좌 추가하기',
		BANK_NAME: '은행이름',
		ACCOUNT_NUMBER: '계좌번호',
		CARD_NUMBER: '카드번호',
		BANK_VERIFICATION_HELP_TEXT:
			'{0} 를 완료한 이후 인증을 진행 하실 수 있습니다.',
		DOCUMENT_SUBMISSION: '문서업로드',
		REVIEW_IDENTITY_VERIFICATION: '개인정보 수정하기',
		PHONE_DETAILS: '연락처 상세정보',
		PHONE_COUNTRY_ORIGIN: '개통국가',
		MOBILE_NUMBER: '휴대폰번호',
		DOCUMENT_PROOF_SUBMISSION: '개인정보인증',
		START_DOCUMENTATION_RESUBMISSION: '문서 다시제출하기',
		SUBMISSION_PENDING_TXT:
			'*해당 정보는 이미 제출되었습니다. 변경사항 수정 후 다시 제출하시면 변경된 정보로 저장됩니다.',
		CUSTOMER_SUPPORT_MESSAGE: '고객센터 메세지',
		DOCUMENT_PENDING_NOTE:
			'문서가 제출되었으며 검토를 진행중입니다. 기다려주시기바랍니다.',
		DOCUMENT_VERIFIED_NOTE: '문서검토가 완료되었습니다.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: '검증부서로부터의 참고사항',
		CODE_EXPIRES_IN: '코드 만료',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: '이름',
				FIRST_NAME_PLACEHOLDER:
					'신분증과 동일하게 이름을 입력해주시기바랍니다.',
				LAST_NAME_LABEL: '성',
				LAST_NAME_PLACEHOLDER: '신분증과 동일하게 성을 입력해주시기바랍니다.',
				FULL_NAME_LABEL: '성명',
				FULL_NAME_PLACEHOLDER: '신분증과 동일하게 성명을 입력해주시기바랍니다.',
				GENDER_LABEL: '성별',
				GENDER_PLACEHOLDER: '성별을 선택해주시기바랍니다.',
				GENDER_OPTIONS: {
					MAN: '남성',
					WOMAN: '여성',
				},
				NATIONALITY_LABEL: '국적',
				NATIONALITY_PLACEHOLDER: '신분증 상의 국적을 선택해 주시기 바랍니다.',
				DOB_LABEL: '생년월일',
				COUNTRY_LABEL: '현재 거주중인 국가',
				COUNTRY_PLACEHOLDER:
					'회원님이 현재 거주하고 있는 국가를 선택해주시기 바랍니다.',
				CITY_LABEL: '도시',
				CITY_PLACEHOLDER: '현재 거주중인 도시를 입력해주시기 바랍니다.',
				ADDRESS_LABEL: '주소',
				ADDRESS_PLACEHOLDER: '현재 거주중인 곳의 주소를 입력해주시기 바랍니다.',
				POSTAL_CODE_LABEL: '우편번호',
				POSTAL_CODE_PLACEHOLDER: '우편번호를 입력해주시기 바랍니다.',
				PHONE_CODE_LABEL: '국가',
				PHONE_CODE_PLACEHOLDER:
					'사용중인 휴대폰이 개통된 국가를 선택해주시기 바랍니다.',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: '휴대폰 번호',
				PHONE_NUMBER_PLACEHOLDER: '휴대폰 번호를 입력해주시기 바랍니다.',
				SMS_SEND: 'SMS보내기',
				SMS_CODE_LABEL: 'SMS코드',
				SMS_CODE_PLACEHOLDER: '전송된 SMS코드를 입력해주시기 바랍니다.',
			},
			INFORMATION: {
				TEXT:
					'*중요: 회원님의 신분증과 동일하게 성명을 정확히 입력해주시기바랍니다. 기업 계정은 고객센터로 문의해주시기 바랍니다.',
				TITLE_PERSONAL_INFORMATION: '개인 정보',
				TITLE_PHONE: '연락처',
				PHONE_VERIFICATION_TXT:
					'유효한 세부 연락처를 제공하여 회원님의 계정에서 이뤄질 수 있는 원치않는 거래를 방지하고, HollaEx가 문제를 해결하는데 도움이 될 수 있습니다.',
				PHONE_VERIFICATION_TXT_1:
					'휴대폰 번호를 인증하여 회원님의 입출금내역을 실시간으로 제공받을 수 있습니다.',
				PHONE_VERIFICATION_TXT_2:
					'선택사항: LAN전화번호를 공유하여 추가인증을 하실 수 있습니다.',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: '신분증 유형을 선택해주시기 바랍니다.',
				ID_NUMBER: ' 신분증 번호를 입력해주시기 바랍니다.',
				ISSUED_DATE: '신분증 발급 날짜를 선택해주시기 바랍니다.',
				EXPIRATION_DATE: '신분증 만료날짜를 입력해주시기바랍니다.',
				FRONT: '신분증 복사본을 첨부해주시기바랍니다.',
				PROOF_OF_RESIDENCY:
					'현재 거주지 주소를 증명하는 증빙서류를 첨부해주시기 바랍니다.',
				SELFIE_PHOTO_ID:
					'메모가 부착된 신분증을 들고 있는 본인의 사진을 첨부해주시기바랍니다.',
			},
			FORM_FIELDS: {
				TYPE_LABEL: '신분증 유형',
				TYPE_PLACEHOLDER: '신분증 문서 유형을 선택해주시기바랍니다.',
				TYPE_OPTIONS: {
					ID: '주민등록증,신분증',
					PASSPORT: '여권',
				},
				ID_NUMBER_LABEL: '여권번호',
				ID_NUMBER_PLACEHOLDER: '여권번호를 입력해주시기바랍니다.',
				ID_PASSPORT_NUMBER_LABEL: '여권번호',
				ID_PASSPORT_NUMBER_PLACEHOLDER: '여권번호를 입력해주시기바랍니다',
				ISSUED_DATE_LABEL: '발급일',
				EXPIRATION_DATE_LABEL: '기간만료일',
				FRONT_LABEL: '여권사본',
				FRONT_PLACEHOLDER: '여권의 사본을 첨부해주시기바랍니다.',
				BACK_LABEL: '신분증(뒷면)',
				BACK_PLACEHOLDER: '신분증(뒷면)사본을 첨부해주시기바랍니다',
				PASSPORT_LABEL: '여권',
				PASSPORT_PLACEHOLDER: '여권사본을 첨부해주시기바랍니다.',
				POR_LABEL: '거주지 증빙서류',
				POR_PLACEHOLDER: '거주지를 증명하는 서류를 첨부해주시기바랍니다.',
				SELFIE_PHOTO_ID_LABEL: '여권을 들고있는 본인의 사진',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'메모가 부착된 여권을 들고 있는 본인의 사진을 첨부해주시기바랍니다.',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'Identity Document',
				PROOF_OF_RESIDENCY: '거주지 증빙서류',
				ID_SECTION: {
					TITLE: '다음사항을 확인 후 제출하시기 바랍니다.',
					LIST_ITEM_1: '고화질(컬러이미지, 300dpi 이상의 해상도)의 문서',
					LIST_ITEM_2: '문서전체가 명백히 보일것(워터마크허용)',
					LIST_ITEM_3: '유효한 기간내의 파일로 만료 날짜가 선명하게 표시될 것',
					WARNING_1:
						'유효한 여권만 허용됩니다. 고품질의 사진 또는 스캔된 이미지를 제출해주시기바랍니다:',
					WARNING_2:
						'회원 본인의 문서가 맞는지 확인하시기 바랍니다. 이유를 불문하고 잘못되거나 위조된 문서를 사용할 시 법적처벌을 받게되며 계좌는 즉시 동결됩니다.',
					WARNING_3: '여권을 거주지 증빙서류로 제출하실 수 없습니다.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'본인인증 검토과정의 지연을 방지하기 위해 다음의 내용을 확인해주시기 바랍니다:',
					SECTION_1_TEXT_2:
						'이름, 주소, 발급 날짜 및 발급인 등의 정보가 선명하게 보일것',
					SECTION_1_TEXT_3: '거증빙서류의 발급일로부터 3개월이 지나지 않은것.',
					SECTION_1_TEXT_4:
						'컬러 사진 또는 스캔 이미지가 고화질일것  (최소 300dpi)',
					SECTION_2_TITLE: '제출가능한 거주지 증빙서류:',
					SECTION_2_LIST_ITEM_1:
						'정부에서 발행한 문서(납세증명서, 주민등록등본 등)',
					SECTION_2_LIST_ITEM_2: '공공요금 지로용지(전기, 수도, 인터넷 등)',
					SECTION_2_LIST_ITEM_3: '예금증명서',
					WARNING:
						'신분증 상에 나타난 주소를 거주지 증빙서류로 사용할 수 없습니다.',
				},
				SELFIE: {
					TITLE: '메모가 부착된 여권을 들고있는 본인의 사진',
					INFO_TEXT:
						'아래의 예시를 확인하시어 해당내용을 포함한 메모가 부착된 여권을 들고있는 사진을 제출하시기바랍니다. 얼굴이 선명하게 보이고 여권의 세부정보를 명확하게 읽을 수 있어야합니다.',
					REQUIRED: '필요조건:',
					INSTRUCTION_1: '얼굴이 선명히 보일것',
					INSTRUCTION_2: '여권의 세부정보가 명확히 보일것',
					INSTRUCTION_3: '메모내용: 직접 쓴 ‘hollaex.com',
					INSTRUCTION_4: '메모내용: 신청 날짜',
					INSTRUCTION_5: '메모내용: 본인서명',
					WARNING: '첨부된 여권과 일치하지 않을 경우 거절됩니다.',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER: '은행계좌에 등록된 성과 이름을 입력해주시기바랍니다.',
				ACCOUNT_NUMBER: '은행계좌번호는 50자 이내로 적어주시기바랍니다.',
				ACCOUNT_NUMBER_MAX_LENGTH: '은행계좌번호는 50자 제한이 있습니다.',
				CARD_NUMBER: '카드번호 형식이 바르지않습니다.',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: '은행명',
				BANK_NAME_PLACEHOLDER: '은행명을 입력하세요.',
				ACCOUNT_NUMBER_LABEL: '계좌번호',
				ACCOUNT_NUMBER_PLACEHOLDER: '계좌번호를 입력하세요.',
				ACCOUNT_OWNER_LABEL: '예금주명',
				ACCOUNT_OWNER_PLACEHOLDER: '예금주명을 입력하세요.',
				CARD_NUMBER_LABEL: '은행카드번호',
				CARD_NUMBER_PLACEHOLDER: '은행카드번호를 입력하세요.',
			},
		},
		WARNING: {
			TEXT_1: '본인인증을 통해 아래와 같은 서비스를 이용하실 수 있습니다:',
			LIST_ITEM_1: '출금 한도 증가',
			LIST_ITEM_2: '입금 한도 증가',
			LIST_ITEM_3: '낮은 수수료',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1: '환경설정을 하실 수 있습니다.',
		TITLE_TEXT_2: '설정 후 저장하면 변경내용이 적용됩니다.',
		TITLE_NOTIFICATION: '알림창',
		TITLE_INTERFACE: '인터페이스',
		TITLE_LANGUAGE: '언어',
		TITLE_CHAT: '채팅',
		TITLE_AUDIO_CUE: '사운드',
		TITLE_MANAGE_RISK: '리스크관리',
		ORDERBOOK_LEVEL: '주문장 높이(최대20)',
		SET_TXT: '설정',
		CREATE_ORDER_WARING: '주문경고생성',
		RISKY_TRADE_DETECTED: '위험거래 탐지',
		RISKY_WARNING_TEXT_1: '이 주문 값이 지정해둔 주문한도 금액 {0} 을 초과함',
		RISKY_WARNING_TEXT_2: '(포트폴리오의 {0})',
		RISKY_WARNING_TEXT_3:
			'정말 이 거래를 실행하실지 다시한번 확인하시기 바랍니다.',
		GO_TO_RISK_MANAGMENT: '리스크관리로 가기',
		CREATE_ORDER_WARING_TEXT:
			'주문 값이 포트폴리오의 {0}을 초과하는 경우 경고 알림창을 만들 수 있습니다.',
		ORDER_PORTFOLIO_LABEL: '포트폴리오의 백분율 값:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: '주문 알림창',
			POPUP_ORDER_CONFIRMATION: '주문 실행시 확인알림창',
			POPUP_ORDER_COMPLETED: '주문 완료시 알림창',
			POPUP_ORDER_PARTIALLY_FILLED: '주문이 부분적으로 채워질 경우 알림창',
		},
		AUDIO_CUE_FORM: {
			ALL_AUDIO: '모든 사운드',
			PUBLIC_TRADE_AUDIO: '모든 일반적인 거래에 대해 알림사운드 재생',
			ORDERS_PARTIAL_AUDIO:
				'주문 중 하나가 부분적으로 채워질 경우 알림사운드 재생',
			ORDERS_PLACED_AUDIO: '주문 요청 시',
			ORDERS_CANCELED_AUDIO: '주문 취소 시',
			ORDERS_COMPLETED_AUDIO:
				'하나의 주문이 완전히 채워질 경우 알림 사운드 재생',
			CLICK_AMOUNTS_AUDIO: '주문 목록에 금액과 가격 클릭 시',
			GET_QUICK_TRADE_AUDIO: '퀵 트레이딩 요청 받을 시',
			SUCCESS_QUICK_TRADE_AUDIO: '퀵 트레이딩 성공 시',
			QUICK_TRADE_TIMEOUT_AUDIO: '퀵 트레이딩 시간 만료 시',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'거래 주문 값이 포트폴리오에 설정된 백분율 값을 초과할 경우 경고 알림창을 만들 수 있습니다.',
			PORTFOLIO: '포트폴리오 백분율',
			TOMAN_ASSET: '근사값',
			ADJUST: '(백분율 설정하기)',
			ACTIVATE_RISK_MANAGMENT: '리스크관리 실행',
			WARNING_POP_UP: '경고알림창',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: '나의 거래 히스토리',
		TITLE_TRADES: '주문체결내역',
		TITLE_DEPOSITS: '입금 내역',
		TITLE_WITHDRAWALS: '출금 내역',
		TEXT_DOWNLOAD: '기록 다운로드',
		TRADES: '주문체결',
		DEPOSITS: '입금',
		WITHDRAWALS: '출금',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'계정의 보안 설정을 변경하세요. 이중인증, 비밀번호, API 키 및 관련 보안기능',
		OTP: {
			TITLE: '2단계 인증(2FA)',
			OTP_ENABLED: ' OTP 사용',
			OTP_DISABLED: '2FA를 활성화 하시기바랍니다.',
			ENABLED_TEXTS: {
				TEXT_1: '로그인시 OTP가 요구됩니다.',
				TEXT_2: '자금 출금시 OTP가 요구됩니다.',
			},
			DIALOG: {
				SUCCESS: '성공적으로 OTP가 활성화 되었습니다',
				REVOKE: '성공적으로 OTP가 해지되었습니다.',
			},
			CONTENT: {
				TITLE: '2단계 인증(2FA) 활성화',
				MESSAGE_1: '스캔',
				MESSAGE_2:
					'아래의 QR코드를 Google Authenticator 또는 Authy로 스캔하여 자동으로 2단계 인증을 설정하시기 바랍니다.',
				MESSAGE_3:
					'만약 QR코드를 스캔하는데 문제가 있으시다면, 아래 코드를 수동으로 입력하실 수도 있습니다.',
				MESSAGE_4:
					'이 2단계 인증 키를 안전하게 저장하시어 향후 휴대전화의 변경 또는 분실의 경우 복구를 위한 대비를 하실 수 있습니다.',
				MESSAGE_5: '수동',
				INPUT: 'OTP 코드를 입력해주시기바랍니다.',
				WARNING:
					'2단계 인증(2FA) 설정을 적극권장합니다. 이를 통해 회원님의 자산의 보안이 크게 향상됩니다.',
				ENABLE: '2단계 인증(2FA)  사용함',
				DISABLE: '2단계 인증(2FA) 사용안함',
				SECRET_1: 'Enter yor secret key',
				SECRET_2: 'Please enter your secret key to confirm you wrote it down.',
				SECRET_3:
					'This secret key will help you recover your account if you lost access to your phone.',
				INPUT_1: 'Secret Key',

				TITLE_2: 'OTP 입력',
				MESSAGE_6: '6자리 OTP 숫자를 입력하세요.',
				INPUT_2: 'OTP 입력',
			},
			FORM: {
				PLACEHOLDER:
					'Google Authenticator에서 제공된 OTP를 입력해주시기바랍니다.',
				BUTTON: '2단계 인증(2FA)활성화',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: '비밀번호 변경',
			ACTIVE: '활성화',
			DIALOG: {
				SUCCESS: '비밀번호가 성공적으로 변경되었습니다',
			},
			FORM: {
				BUTTON: '비밀번호 변경',
				CURRENT_PASSWORD: {
					label: '현재 비밀번호',
					placeholder: '현재 사용중인 비밀번호를 입력해주시기바랍니다.',
				},
				NEW_PASSWORD: {
					label: '새 비밀번호',
					placeholder: '새 비밀번호를 입력해주시기바랍니다.',
				},
				NEW_PASSWORD_REPEAT: {
					label: '새 비밀번호 확인',
					placeholder: '새 비밀번호를 다시한번 입력해주시기바랍니다.',
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
	CURRENCY: 'Currency',
	TYPE: 'Type',
	TYPES_VALUES: {
		market: 'market',
		limit: 'limit',
	},
	TYPES: [
		{ value: 'market', label: 'market' },
		{ value: 'limit', label: 'limit' },
	],
	SIDE: 'Side',
	SIDES_VALUES: {
		buy: '매수',
		sell: '매도',
	},
	SIDES: [
		{ value: 'buy', label: '매수' },
		{ value: 'sell', label: '매도' },
	],
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: '켜기' },
		{ value: false, label: '끄기' },
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
	STATUS: '상태',
	AMOUNT: '수량',
	COMPLETE: 'Complete',
	PENDING: 'Pending',
	REJECTED: 'Rejected',
	ORDERBOOK: 'Order Book',
	CANCEL: 'Cancel',
	CANCEL_ALL: 'Cancel All',
	GO_TRADE_HISTORY: '거래내역 보러가기',
	ORDER_ENTRY: 'order entry',
	TRADE_HISTORY: 'trade history',
	CHART: 'price chart',
	ORDERS: '진행중인 주문',
	TRADES: '나의 거래 내역',
	RECENT_TRADES: '최근 체결 내역', // ToDo
	PUBLIC_SALES: 'public sales', // ToDo
	REMAINING: 'Remaining',
	FULLFILLED: '{0} % Filled',
	PRICE_CURRENCY: 'PRICE',
	AMOUNT_SYMBOL: 'AMOUNT',
	MARKET_PRICE: '시장가',
	ORDER_PRICE: '지정가',
	TOTAL_ORDER: '총액',
	NO_DATA: '데이터 없음',
	LOADING: 'Loading',
	CHART_TEXTS: {
		d: 'Date',
		o: 'Open',
		h: 'High',
		l: 'Low',
		c: 'Close',
		v: '거래량',
	},
	QUICK_TRADE: '퀵트레이딩',
	PRO_TRADE: '프로트레이딩',
	ADMIN_DASH: '어드민페이지',
	WALLET_TITLE: '지갑',
	TRADING_MODE_TITLE: '트레이딩 모드',
	TRADING_TITLE: '거래',
	LOGOUT: '로그아웃',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'최소 출금액보다 적어 보낼 수 없습니다. 변경 후 다시 시도하시기 바랍니다.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'최대 출금액을 초과하여 보낼 수 없습니다. 변경 후 다시 시도하시기 바랍니다.',
	WITHDRAWALS_LOWER_BALANCE:
		'You don’t have enough {0} in your balance to send that transaction',
	WITHDRAWALS_FEE_TOO_LARGE:
		'The fee is more than {0}% of your total transaction',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'비트코인 주소가 유효하지않습니다. 확인 후 다시 입력하시기바랍니다.',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'이더리움 주소가 유효하지않습니다. 확인 후 다시 입력하시기바랍니다.',
	WITHDRAWALS_BUTTON_TEXT: 'review withdrawal',
	WITHDRAWALS_FORM_ADDRESS_LABEL: '보내실 주소',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Type the address',
	WITHDRAWALS_FORM_AMOUNT_LABEL: '{0} 출금 금액',
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
	DEPOSIT_METHOD: '결제 수단{0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: '신용카드',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1: '신용카드 결제를 진행합니다.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'결제를 진행하기위해 플랫폼을 떠나게 됩니다.',
	DEPOSIT_VERIFICATION_WAITING_TITLE: '결제 확인 중',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'결제가 진행되는 동안 해당 애플리케이션을 닫지마십시오.',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'결제 진행과정에 문제가 있다면, 고객센터로 연락주시기 바랍니다.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'This is the ID of the operation: "{0}", please provide us this ID to help you.',
	DEPOSIT_VERIFICATION_SUCCESS: '결제 완료',
	DEPOSIT_VERIFICATION_ERROR: '입금을 진행하는데 오류가 발생하였습니다.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: '입금이 이미 확인되었습니다.',
	DEPOSIT_VERIFICATION_ERROR_STATUS: '오류상태',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'결제에 사용된 카드가 회원님께서 등록한 카드정보와 같지 않습니다. 해당 입금은 거절되었으며 한시간 이내로 환불됩니다.',
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
	WALLET_BUTTON_BASE_DEPOSIT: '입금',
	WALLET_BUTTON_BASE_WITHDRAW: '출금',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: '받기',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: '보내기',
	AVAILABLE_TEXT: 'Available',
	AVAILABLE_BALANCE_TEXT: '사용가능 {0} 잔고: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
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
	SUBMIT: '제출하기',
	RESUBMIT: '다시제출하기',
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
	SETTINGS_LANGUAGE_LABEL: '언어설정 (이메일수신포함)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'Display order confirmation popup',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NO' },
		{ value: true, label: 'YES' },
	],
	SETTINGS_THEME_LABEL: '사용자 인터페이스 테마', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'White' },
		{ value: 'dark', label: 'Dark' },
	],
	SETTING_BUTTON: '저장',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: '출금 비활성화',
	VERIFICATION_NO_WITHDRAW_MESSAGE: '회원님의 계정은 출금 불가합니다.',
	UP_TO_MARKET: 'Up to market',
	VIEW_MY_FEES: 'View my fees', // new
	DEVELOPER_SECTION: {
		TITLE: 'API 키',
		INFORMATION_TEXT:
			'API는 지갑 잔고정보, 매수/매도 주문관리, 출금요청 기능 뿐만 아니라 최근거래, 주문서, 티커와 같은 시장 자료도 제공합니다.  .',
		ERROR_INACTIVE_OTP:
			'API키를 생성하기 위해서는 이중인증(2FA)가 활성화되어있어야합니다.',
		ENABLE_2FA: '이중인증(2FA)활성화',
		WARNING_TEXT: 'API키를 다른사람과 공유하지마십시오 ',
		GENERATE_KEY: 'API키 생성하기',
		ACTIVE: '활성화',
		INACTIVE: '비활성화',
		INVALID_LEVEL: '해당 기능에 접근하기 위해서는 레벨업그레이드가 필요합니다.', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'API키 생성',
		GENERATE_TEXT:
			'API키의 이름을 지정한 후 생성된 키는 비공개로 보관하시기바랍니다. 나중에 다시 확인하실 수 없습니다.',
		GENERATE: '생성',
		DELETE_TITLE: 'API키 삭제',
		DELETE_TEXT:
			'언제든지 새로운 API키를 생성하실 수 있지만, 이미 생성된 API키를 삭제하는 것은 다시 되돌릴 수 없습니다. API키를 삭제하시겠습니까? ',
		DELETE: 'DELETE',
		FORM_NAME_LABEL: '이름',
		FORM_LABLE_PLACEHOLDER: 'Api키 이름',
		API_KEY_LABEL: 'API 키',
		SECRET_KEY_LABEL: '시크릿 키',
		CREATED_TITLE: 'API키 복사하기',
		CREATED_TEXT_1: '다시 확인하실 수 없습니다. API키를 복사해두시기 바랍니다.',
		CREATED_TEXT_2: '비공개로 보관하시기바랍니다.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: '이름',
		API_KEY: 'API 키',
		SECRET: '시크릿',
		CREATED: '생성된 날짜',
		REVOKE: '해지',
		REVOKED: '해지됨',
		REVOKE_TOOLTIP: '토큰을 해지하려면 이중인증(2FA) 활성화가 필요합니다.', // TODO
	},
	CHAT: {
		CHAT_TEXT: '채팅',
		MARKET_CHAT: 'Market Chat',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: '더 읽기',
		SHOW_IMAGE: '이미지보기',
		HIDE_IMAGE: '이미지숨기기',
		CHAT_MESSAGE_BOX_PLACEHOLDER: '메세지',
		SIGN_UP_CHAT: '로그인하여 채팅하기',
		JOIN_CHAT: '채팅 유저명 설정하기',
		TROLLBOX: 'Trollbox ({0})', // new
	},
	INVALID_USERNAME: '유저명은 3~15자로 영문소문자, 숫자, _만 사용가능합니다.',
	USERNAME_TAKEN: '이미 사용중인 유저명입니다. 다시 시도하시기바랍니다.',
	USERNAME_LABEL: '유저명 (채팅명으로 사용됩니다)',
	USERNAME_PLACEHOLDER: '유저명',
	TAB_USERNAME: '유저명',
	USERNAME_WARNING:
		'유저명은 한번만 변경가능합니다. 설정하신 유저명이 올바른지 다시한번 확인하시기바랍니다.',
	USERNAME_CANNOT_BE_CHANGED: '유저명을 변경하실 수 없습니다.',
	UPGRADE_LEVEL: '계정 레벨업그레이드',
	LEVELS: {
		LABEL_LEVEL: '레벨',
		LABEL_LEVEL_1: 'One',
		LABEL_LEVEL_2: 'Two',
		LABEL_LEVEL_3: 'Three',
		LABEL_MAKER_FEE: 'Maker Fee',
		LABEL_TAKER_FEE: 'Taker Fee',
		LABEL_BASE_DEPOSIT: '일일 유로입금',
		LABEL_BASE_WITHDRAWAL: '일일 유로출금',
		LABEL_BTC_DEPOSIT: '일일 비트코인입금',
		LABEL_BTC_WITHDRAWAL: '일일 비트코인출금',
		LABEL_ETH_DEPOSIT: '일일 이더리움입금',
		LABEL_ETH_WITHDRAWAL: '일일 이더리움출금l',
		LABEL_PAIR_MAKER_FEE: '{0} Maker Fee',
		LABEL_PAIR_TAKER_FEE: '{0} Taker Fee',
		UNLIMITED: '무제한',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: '{0} 지갑 생성하기',
	WALLET_ADDRESS_GENERATE: '발급',
	WALLET_ADDRESS_MESSAGE: '지갑을 생성하면 입금 및 출금 주소가 발급됩니다.',
	WALLET_ADDRESS_ERROR:
		'주소 발급에 문제가 발생하였습니다. 새로고침 후 다시 시도하시기 바랍니다',
	DEPOSIT_WITHDRAW: '입금/출금',
	GENERATE_WALLET: '지갑생성',
	TRADE_TAB_CHART: '차트',
	TRADE_TAB_TRADE: '거래',
	TRADE_TAB_ORDERS: '주문',
	TRADE_TAB_POSTS: 'Posts', // new
	WALLET_TAB_WALLET: '지갑',
	WALLET_TAB_TRANSACTIONS: 'Transactions',
	RECEIVE_CURRENCY: '{0} 받기',
	SEND_CURRENCY: '{0} 보내기',
	COPY_ADDRESS: '주소복사',
	SUCCESFUL_COPY: '성공적으로 복사되었습니다!',
	QUICK_TRADE_MODE: '퀵트레이드모드',
	JUST_NOW: 'just now',
	PAIR: 'Pair',
	ZERO_ASSET: '자산이 없습니다.',
	DEPOSIT_ASSETS: '입금하기',
	SEARCH_TXT: '찾기',
	SEARCH_ASSETS: '자산검색',
	TOTAL_ASSETS_VALUE: '{0}의 총 자산값: {1}',
	SUMMARY: {
		TITLE: '개요',
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
		VIEW_FEE_STRUCTURE: '수수료 구조 및 한도 보기',
		UPGRADE_ACCOUNT: '계정 업그레이드',
		ACTIVE_2FA_SECURITY: '2FA 보안 활성화',
		ACCOUNT_ASSETS_TXT_1: '보유하고계신 모든 자산을 나타냅니다.',
		ACCOUNT_ASSETS_TXT_2:
			'많은 자산을 보유함으로서 낮은 거래수수료 및 특별한 뱃지가 포함된 계정 업그레이드가 가능한 자격을 부여받으실 수 있습니다.',
		TRADING_VOLUME_TXT_1:
			'회원님의 거래금액은 {0}로 표시됩니다. 매월 말, 한달 동안 거래한 모든 거래내역의 금액이 계산됩니다.',
		TRADING_VOLUME_TXT_2:
			'높은 거래금액을 유지하시면 계정 업그레이드가 가능한 자격을 부여받으실 수 있습니다. 특별한 뱃지와 업그레이드 된 특권을 누러보시기바랍니다.',
		ACCOUNT_DETAILS_TXT_1:
			'계정은 회원님의 레벨에 따라 뱃지, 거래수수료, 입출금한도가 다르게 결정됩니다.',
		ACCOUNT_DETAILS_TXT_2:
			'계정유지기간, 활동수준, 총 자산금액 등을 통해 계정의 업그레이드 가능 여부가 결정됩니다.',
		ACCOUNT_DETAILS_TXT_3:
			'레벨을 계속 유지하기 위해서는 지속적인 거래활동과 일정금액 이상의 자산예치등의 조건이 유지되어야합니다.',
		ACCOUNT_DETAILS_TXT_4:
			'해당 레벨에 필요한 일정한 거래활동 및 일정수준의 자산유지가 되지않을경우 레벨 하향조정이 이루어질 수 있습니다.',
		REQUIREMENTS: '필요조건',
		REQUEST_ACCOUNT_UPGRADE: '계정 업그레이드 요청',
		FEES_AND_LIMIT: ' {0}의 수수료 및 입출금한도 구조',
		FEES_AND_LIMIT_TXT_1:
			'암호화폐 거래를 시작하는 것은 새로운 시작을 의미합니다. 리스크를 감내하고 지혜롭게 많은 거래를 함으로서 계정은 업데이트됩니다.',
		FEES_AND_LIMIT_TXT_2:
			'각 계정의 레벨에 따라 수수료와 입출금한도가 다릅니다. 자세한 정보 확인을 위해 {0}에 방문하시기바랍니다.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: '입출금 한도',
		TRADING_FEE_STRUCTURE: '거래수수료 구조',
		WITHDRAWAL: '출금',
		DEPOSIT: '입금',
		TAKER: '테이커',
		MAKER: '메이커',
		WEBSITE: '웹사이트',
		VIP_TRADER_ACCOUNT_ELIGIBLITY: 'VIP 트레이더레벨 업그레이드자격',
		PRO_TRADER_ACCOUNT_ELIGIBLITY: '프로 트레이더레벨 업그레이드자격',
		TRADER_ACCOUNT_ELIGIBILITY: '{0}레벨 자격',
		NOMINAL_TRADING: '명목상의 거래',
		NOMINAL_TRADING_WITH_MONTH: '지난 {0}의 명목상의 거래',
		ACCOUNT_AGE_OF_MONTHS: '계정활동기간 {0} 개월',
		TRADING_VOLUME_EQUIVALENT: '{0} {1} 거래볼륨 등가',
		LEVEL_OF_ACCOUNT: '레벨 {0} 계정',
		LEVEL_TXT_DEFAULT: '이곳에 레벨 설명을 추가하세요.',
		LEVEL_1_TXT:
			'크립토 트레이더로서의 여정이 이곳에서 시작되었습니다. 회원님의 개인정보인증을 통해 보너스도 받고 입출금한도 증액 및 수수료인하를 받으실 수 있습니다.', // new
		LEVEL_2_TXT:
			'월 3,000USDT 이상의 거래를 하거나 5,000XHT 이상의 잔고를 유지하시고 보다 낮아진 수수료를 즐겨보시기바랍니다.', // new
		LEVEL_3_TXT:
			'개인정보 인증을 완료하여 레벨 3에 도달하실 수 있습니다. 거래수수료 인하 및 늘어난 입출금한도! 진짜 트레이더가 될 준비가 되셨습니다.', // new
		LEVEL_4_TXT:
			'월 10,000USDT 이상의 거래를 하거나 10,000XHT 이상의 잔고를 유지하시고 보다 저렴한 수수료를 즐기시기바랍니다..', // new
		LEVEL_5_TXT:
			'해내셨네요! 레벨 5 계정은 오직 거래소 운영자, Vault사용자 또는 HollaEx Affiliate Program(HAP) 회원들에게만 적용되는 특별한 레벨입니다. 입출금한도는 더 높아졌고 메이커 수수료는 무료로 이용하실 수 있습니다.', // new
		LEVEL_6_TXT:
			'월 300,000USDT 이상의 거래를 하거나 100,000XHT 이상의 잔고를 유지하시고 더 낮아진 수수료를 즐기시기바랍니다. 출금액이 증가되었습니다. ', // new
		LEVEL_7_TXT:
			'월 500,000USDT 이상의 거래를 하거나 300,000XHT 이상의 잔고를 유지하시고 더 낮아진 수수료를 즐기시기바랍니다. 출금액이 증가되었습니다.', // new
		LEVEL_8_TXT:
			'월 600,000USDT 이상의 거래를 하거나 400,000XHT 이상의 잔고를 유지하시고 더 낮아진 수수료를 즐기시기바랍니다.', // new
		LEVEL_9_TXT:
			'월 2,000,000USDT 이상의 거래를 하거나 1,000,000XHT 이상의 잔고를 유지하시고 더 낮아진 수수료를 즐기시기바랍니다.', // new
		LEVEL_10_TXT:
			'웨일스 트레이더 계정은 마켓메이킹을 통해 이익을 얻을 수 있는 계정입니다. 이 특별 계정을 얻기 위해선 저희에게 연락해주시기바랍니다.', // new
		CURRENT_TXT: '현재',
		TRADER_ACCOUNT_XHT_TEXT:
			'회원님의 계정은 XHT 사전판매 그룹에 속해있으며 이는 1XHT를 $0,10에 얻는다는 것을 의미합니다. 모든 입금액은 거래가 종료되면 XHT로 전환됩니다.',
		TRADER_ACCOUNT_TITLE: '계정 - 사전판매기간', // new
		HAP_ACCOUNT: 'HAP 계정', // new
		HAP_ACCOUNT_TXT:
			'회원님의 계정은 인증된 HollaEx 가입프로그램(HAP) 계정입니다. 이제 XHT 구매를 원하는 모든 사람을 초대하여 10%의 보너스를 얻으시기바랍니다.', // new
		EMAIL_VERIFICATION: '이메일 인증', // new
		DOCUMENTS: '문서', // new
		HAP_TEXT: 'HollaEx 가입프로그램 (HAP) {0}', // new
		LOCK_AN_EXCHANGE: '거래소잠금 {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'Vault 가입사용자 {0}', // new
		TRADE_OVER_XHT: '{0} USDT 이상의 거래', // new
		TRADE_OVER_BTC: '{0} BTC 이상의 거래', // new
		XHT_IN_WALLET: '{0} XHT 지갑', // new
		REWARDS_BONUS: '리워드와 보너스', // new
		COMPLETE_TASK_DESC: '테스크를 완료하고 $10,000이상의 보너스를 획득하세요.', // new
		TASKS: '테스크', // new
		MAKE_FIRST_DEPOSIT: '첫 입금을 하고 1XHT를 받으세요.', // new
		BUY_FIRST_XHT: 'XHT 첫 구매를 통해 보너스 5 XHT를 받으세요.', // new
		COMPLETE_ACC_VERIFICATION:
			'개인정보인증을 완료하시고 보너스 20XHT를 받으세요.', // new
		INVITE_USER: '사용자를 초대하고 그들의 거래를 통해서 커미션을 받으세요.', // new
		JOIN_HAP:
			'HAP에 가입하시어 판매하는 모든 HollaEx Kit에 대해 10%의 이익을 얻으세요.', // new
		EARN_RUNNING_EXCHANGE:
			'자신의 거래소를 실행하여 지분증명으로 이익을 얻으세요.', // new
		XHT_WAVE_AUCTION: 'XHT 웨이브옥션 데이터', // new
		XHT_WAVE_DESC_1:
			'HollaEx 토큰(XHT)의 배포는 웨이브옥션을 통해 이루어집니다.', // new
		XHT_WAVE_DESC_2:
			'웨이브 옥션은 XHT 수량과 시간이 랜덤으로 정해지며 주문서에서 가장 높은 가격을 호가한 매수자에게 판매됩니다.', // new
		XHT_WAVE_DESC_3: '아래에서 웨이브옥션의 내역이 기록된 것을 확인해보세요.', // new
		WAVE_AUCTION_PHASE: '웨이브옥션 단계 {0}', // new
		LEARN_MORE_WAVE_AUCTION: '웨이브옥션에 대해 자세히 알아보기', // new
		WAVE_NUMBER: '웨이브 번호', // new
		DISCOUNT: '( {0}% 할인 )', // new
		MY_FEES_LIMITS: ' 나의 수수료와 한도', // ne
	},
	REFERRAL_LINK: {
		TITLE: '친구초대하기', // new
		INFO_TEXT:
			'링크를 공유하여 친구에게 추천하세요. 이 링크를 통해 가입함으로써 회원님의 친구는 {0}% 할인을 받게됩니다.', // new
		INFO_TEXT_1:
			'회원님의 추천으로 가입하여 거래하신 분의 거래 수수료의 {0}%가 매달 회원님의 계정으로 입금됩니다.', // new
		COPY_FIELD_LABEL: '아래 링크를 공유하여 커미션을 받으세요:', // new
		REFERRED_USER_COUT: '{0} 명의 추천을 받음', // new
		COPY_LINK_BUTTON: '추천인 링크 복사하기', // new
		XHT_TITLE: '나의 추천', // new
		XHT_INFO_TEXT: '친구를 초대하여 커미션 수익을 얻으세요.', // new
		XHT_INFO_TEXT_1: '커미션 수익은 주기적으로 회원님의 지갑으로 입금됩니다.', // new
		APPLICATION_TXT:
			'HollaEx Kit 배급자가 되려면 지원서를 작성해주시기바랍니다.', // new
		TOTAL_REFERRAL: 'Total bought from referrals:', // new
		PENDING_REFERRAL: 'Commissions Pending:', // new
		EARN_REFERRAL: 'Commissions Earn:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'APPLY', // new
	},
	STAKE_TOKEN: {
		TITLE: 'HollaEx토큰 지분증명', // new
		INFO_TXT1:
			'HollaEx Kit 거래소 소프트웨어를 실행하기 위해 HollaEx 토큰(XHT)이 담보로 요구됩니다.', // new
		INFO_TXT2:
			'비슷한 방식으로 HollaEx 토큰을 담보로 웨이브옥션 기간동안 팔리지않은 XHT를 얻을 수 있습니다.', // new
		INFO_TXT3:
			'간단하게 dash.bitholla.com를 방문하여 당신의 거래소를 실행하고 이를 담보로 XHT를 무료로 받으세요.', // new
		BUTTON_TXT: '자세히알아보기', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'HollaEx 토큰 구매 계약',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: '계속',
		AGREE_TERMS_LABEL:
			'나는 HollaEx 토큰 구매 계약서를 읽었으며 해당 내용에 동의합니다.',
		RISK_INVOLVED_LABEL: '나는 이와 관련된 위험이 있는 것을 이해합니다.',
		DOWNLOAD_PDF: 'PDF 다운로드',
		DEPOSIT_FUNDS:
			'HollaEx 토큰(XHT)을 얻기 위해 지갑에 입금을 하시기바랍니다.',
		READ_FAG: 'HollaEx FAQ 보기 : {0}',
		READ_DOCUMENTATION: 'HollaEx whitepaper 보기: {0}',
		READ_WAVES: '웨이브옥션 규정보기 {0}', // new
		DOWNLOAD_BUY_XHT:
			'PDF를 다운로드하여 {0} 단계별 프로세스를 확인하시기바랍니다.',
		HOW_TO_BUY: 'HollaEx 토큰(XHT)을 어떻게 살수있나요?',
		PUBLIC_SALES: '공개 웨이브옥션', // new
		CONTACT_US: '문의사항이 있으시다면 {0}으로 언제든지 메일주시기바랍니다.',
		VISUAL_STEP: '{0}에 대한 시각적인 단계별 프로세스보기', // new
		WARNING_TXT:
			'회원님의 요청을 검토한 이후 HollaEx거래소에 접근하는 법에 대한 추가 설명을 이메일로 보내드리도록하겠습니다.', // new
		WARNING_TXT1:
			'그 동안 아래의 지원을 통해 HollaEx 네트워크에 대해 더 알아보실 수 있습니다.', // new
		XHT_ORDER_TXT_1: 'HollaEx 토큰(XHT) 거래를 위해선 로그인이 필요합니다.', // new
		XHT_ORDER_TXT_2:
			'HollaEx 토큰은 매일 랜덤으로 정해진 수량이 랜덤으로 정해진 시간에 주문서에서 가장 높은 금액을 호가한 매수자에게 판매되는 웨이브옥션을 통해 배포됩니다.', // new
		XHT_ORDER_TXT_3: '{0} 웨이브옥션에 가입 또는 {1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: '최근 거래를 보기위해 로그인하세요.', //new
		XHT_TRADE_TXT_2: '최근 거래 내역을 보기위해 {0} 할 수 있습니다.', //new
		LOGIN_HERE: '로그인하기',
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
	USER_LEVEL: '사용자 레벨', // new
	LIMIT_AMOUNT: '한도액', // new
	FEE_AMOUNT: '수수료액', // new
	COINS: '코인', // new
	PAIRS: '페어', // new
	NOTE_FOR_EDIT_COIN: '참고: {0}의 추가 및 삭제를 위해 {1}를 참조하십시오.', // new
	REFER_DOCS_LINK: '문서', // new
	RESTART_TO_APPLY:
		'변경사항을 적용하기 위해서 거래소를 다시 시작하셔야합니다.', // new
	TRIAL_EXCHANGE_MSG:
		'회원님은 {0}의 테스트 버전을 사용중이며 {1}일 뒤에 만료됩니다.', // new
	EXPIRY_EXCHANGE_MSG:
		'회원님의 거래소 기한이 만료되었습니다. 다시 활성화하기위해 dash.bitholla.com로 이동하시기바랍니다.', // new
	EXPIRED_INFO_1: 'HollaEx 테스트 버전이 만료되었습니다.', // new
	EXPIRED_INFO_2: '거래소를 다시 활성화하려면 담보가 필요합니다.', // new
	EXPIRED_BUTTON_TXT: '거래소 활성화하기', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: '공지사항',
		ANNOUNCEMNT_TXT_3:
			'웨이브옥션과 HollaEx 공개오픈은 2020년 1월1일로 재조정되었습니다. 지갑과 입출금은 현재도 이용가능합니다.',
		ANNOUNCEMNT_TXT_4:
			'홀러즈 여러분! 새해복 많이받으시기바랍니다. 드디어 2020년부터 런칭하는 가장 개방적인 거래 플랫폼의 시작에 많은 활동부탁드립니다.',
		ANNOUNCEMNT_TXT_1:
			'친구들을 hollaex.com에 소개하여 HAP프로그램과 함께 XHT를 얻으세요. {0}.',
		DEFAULT_ANNOUNCEMENT:
			'이 페이지는 포스트는 회원님의 거래소의 공지사항입니다!',
		ANNOUNCEMENT_TXT_2: '{0}의 모든 지갑에 무료 XHT가 배포됩니다.',
		LEARN_MORE: '더 알아보기',
		APPLY_TODAY: '지금신청하기', // new
	},
	OPEN_WALLET: '오픈 지갑', // new
	AGO: 'ago', // new
};

const content = flatten(nestedContent, options);

export default content;
