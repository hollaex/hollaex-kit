'use strict';

const { GET_CONFIGURATION } = require('../../constants');
const API_NAME = () => GET_CONFIGURATION().constants.api_name;

const COMMON = {
	GREETING: (name) => `${name}님`,
	CLOSING: {
		1: '이용해 주셔서 감사합니다.',
		2: () => `${API_NAME()} 팀`
	},
	IP_ADDRESS: (ip) => `IP 주소: ${ip}`,
	IP_REQUEST_FROM: (ip) => `요청하신 곳: ${ip}`,
	TXID: (txid) => `거래 ID: ${txid}`,
	FEE: (fee) => `수수료: ${fee}`,
	AMOUNT: (amount) => `금액: ${amount}`,
	ADDRESS: (address) => `주소: ${address}`,
	TIME: (time) => `시간: ${time}`,
	COUNTRY: (country) => `국가: ${country}`,
	DEVICE: (device) => `기기: ${device}`,
	MESSAGE: (message) => `메세지: ${message}`,
	ERROR_REQUEST:
		'만약 실수로 요청하시거나 요청하신 적이 없을 경우에는 이 메일을 무시해 주시기 바랍니다. 고객님의 계정에는 변경사항이 적용되지 않습니다.',
	EXPLORER: 
		'블록 체인상의 거래 상태는 Block Explorers 에서 확인하실 수 있습니다: ',
	DEPOSIT: '입금',
	WITHDRAWAL: '출금'
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: '문의사항은 본 메일에 회신해 주시기 바랍니다.',
	PRIVACY_POLICY: '개인정보 처리방침',
	TERMS: '이용 약관',
	INVITE_YOUR_FRIENDS: '친구 초대',
	POWERED_BY: 'Powered by'
};

const SIGNUP = {
	TITLE: '회원가입',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `아래 버튼을 클릭하여 고객님의 이메일 계정을 인증해주시기바랍니다. 
		문의사항은 본 메일에 회신하여 문의하실 수 있습니다.`,
		2: '아래 버튼을 클릭하여 등록 절차를 진행해주시기 바랍니다.',
		3: '이메일 계정 인증'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: '환영합니다',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `${API_NAME()}를 이용해주셔서 감사합니다.`,
		2: (account, deposit) => `
			거래를 시작하기 위해, 먼저 가상화폐 또는 자금을 계정에 입금해 주셔야 합니다.
			고객님의 ${account} 로 이동하여 ${deposit} 페이지를 방문해주시기 바랍니다.`,
		3: '계정',
		4: '입금',
		5: '문의사항은 본 메일에 회신하여 문의하실 수 있습니다.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: '로그인',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '고객님의 계정이 아래 정보에서 로그인 되었습니다',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: `고객님이 로그인하신 것이 아니라면, ${API_NAME()}에 방문하여 비밀번호 변경 및 이중인증 보안을 설정하시고, 즉시 본 메일에 회신하여 문의주시기 바랍니다.`
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: '비밀번호 재설정 요청',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '고객님의 계정에 대한 비밀번호 재설정을 요청하셨습니다.',
		2: '아래 링크를 클릭하여 비밀번호 업데이트를 진행해주시기 바랍니다.',
		3: '비밀번호 재설정',
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
			`고객님의 ${API_NAME()} 지갑으로 ${amount} ${currency.toUpperCase()} 의 입금은 현재 보류중입니다. 거래가 승인될 때까지 기다려주세요. 고객님의 거래는 블록체인 상에서 ${confirmation} 개의 승인이 필요합니다.`,
		COMPLETED: (amount, confirmation, currency) =>
			`고객님의 ${
				amount} ${currency.toUpperCase()
				} 의 입금이 완료되었습니다. 고객님의 ${
				currency.toUpperCase()
			} 지갑에서 확인 및 이용하실 수 있습니다.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `거래 상태: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: '계정 인증 완료',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '축하드립니다. 고객님의 계정 인증이 완료되었습니다.',
		2: '거래하기'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: '계정 업그레이드 완료',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`축하드립니다. 고객님의 계정 레벨이 ${level} 로 업그레이드 되었습니다. 이제 더 낮은 수수료와 높아진 출금한도를 비롯한 다양한 프리미엄 혜택을 받으실 수 있습니다.`,
		2: '거래하기'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} 실패`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`고객님이 ${date}에 ${amount} ${currency.toUpperCase()} 를 입금하신 내역을 찾을 수 없거나 처리할 수 없습니다. 해당 거래는 시스템에 의해 거부되었습니다.`,
		WITHDRAWAL: (currency, date, amount) =>
			`고객님이 ${date}에 ${amount} ${currency.toUpperCase()} 를 출금하신 내역을 찾을 수 없거나 처리할 수 없습니다. 해당 거래는 시스템에 의해 거부되었습니다. 고객님의 보류 중인 출금금액은 ${API_NAME()} 지갑으로 환불되었습니다.`,
		1: '문의사항은 본 메일에 회신하여 문의하실 수 있습니다.',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: '거래 상태 : 거절됨'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, address, currency) =>
			`고객님의 주소 ${address} 로 ${amount} ${currency.toUpperCase()} 의 출금이 요청되었습니다. 현재 거래상태는 보류 중이며, 곧 완료될 예정입니다.`,
		COMPLETED: (amount, address, currency) =>
			`고객님의 ${amount} ${currency.toUpperCase()} 의 출금이 완료되어 주소 ${address} 로 이체되었습니다.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `거래 상태: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} 요청`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`고객님의 계정에서 ${address} 로 ${amount} ${currency.toUpperCase()} 의 출금이 요청되었습니다.`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `주소: ${address}`,
		5: '출금을 승인하시려면 아래 버튼을 클릭해주시기 바랍니다.',
		6: '출금 승인',
		7: COMMON.ERROR_REQUEST,
		8: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: '잘못된 출금 주소',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `고객님의 ${amount} ${currency} 의 출금이 잘못된 주소로 요청되어 거래가 거부되었습니다.`,
		2: (address) => `주소: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `경고: ${title}`,
	BODY: {
		1: (type) => `경고: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id' 
			? 'ID 인증 거절' 
			: '새로운 은행 정보 등록 거절',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? '고객님의 본인 인증이 실패하였습니다. 아래의 메세지를 참고하여 추가 조치를 취해주시기 바랍니다:'
				: '고객님의 새로운 은행 정보 등록이 실패하였습니다. 아래의 메세지를 참고하여 추가 조치를 취해주시기 바랍니다:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `계정 ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `고객님의 계정 ${email} 이(가) 활성화되었습니다. 이제 계정을 사용하실 수 있습니다.`,
		DEACTIVATED: (email) => `고객님의 계정 ${email} 이(가) 비활성화되었습니다. 관리자로 인해 활성화 될 때까지 계정을 사용할 수 없습니다.`
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: '문의 양식',
	BODY: {
		1: '문의 양식 정보',
		2: (email) =>
			`유저 ${email} 이(가) 문의 양식을 제출하였습니다.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: '사용자 확인',
	BODY: {
		1: '유저 본인 확인 요청',
		2: (email) =>
			`유저 "${email}" 이(가) 본인 확인 문서를 업로드 하였습니다. 문서 확인을 부탁드립니다.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: '알 수 없는 입금',
	BODY: {
		1: '알 수 없는 입금',
		2: (email, currency) =>
			`유저 ${email} 이(가) 알 수 없는 입금 ${currency.toUpperCase()} 을 받았습니다.`,
		3: (txid) => COMMON.TXID(txid),
		4: '거래 정보: ',
		5: (data) => `${JSON.stringify(data)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`고객님의 인증번호는 ${code} 입니다.`
	,
	deposit: (currency, amount) =>
		`고객님의 ${amount} ${currency.toUpperCase()} 입금이 완료되어, 지갑으로 입금되었습니다.`
	,
	withdrawal: (currency, amount) =>
		`고객님의 ${amount} ${currency.toUpperCase()} 출금이 완료되었습니다.`
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
	SMS
};
