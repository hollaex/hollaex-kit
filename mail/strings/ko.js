"use strict";

const { API_NAME, SUPPORT_EMAIL } = require("../../constants");

const COMMON = {
	GREETING: name => `${name}님`,
	CLOSING: {
		1: "이용해 주셔서 감사합니다.",
		2: `${API_NAME} 팀`
	},
	IP_ADDRESS: ip => `IP 주소: ${ip}`,
	IP_REQUEST_FROM: ip => `요청하신곳: ${ip}`,
	TXID: txid => `거래 ID 확인: ${txid}`,
	FEE: fee => `수수료: ${fee}`,
	AMOUNT: amount => `금액: ${amount}`,
	ADDRESS: address => `주소: ${address}`,
	TIME: time => `시간: ${time}`,
	COUNTRY: country => `위치: ${country}`,
	DEVICE: device => `브라우저: ${device}`,
	MESSAGE: message => `메세지: ${message}`,
	ERROR_REQUEST:
		"만약 이 요청을 원하지 않는다면, 회원님의 계정에는 변경사항이 없으니 본 메일을 무시해 주시기 바랍니다.",
	EXPLORER: "회원님이 요청하신 거래 상황을 이곳에서 확인하실 수 있습니다.",
	DEPOSIT: "입금",
	WITHDRAWAL: "출금"
};

const FOOTER = {
	FOLLOW_US: "Follow us on",
	NEED_HELP: "도움이 필요하시다면, 본메일에 회신해 주시기 바랍니다.",
	PRIVACY_POLICY: "개인정보 처리방침",
	TERMS: "이용약관",
	INVITE_YOUR_FRIENDS: "친구 초대:",
	POWERED_BY: "Powered by"
};

const SIGNUP = {
	TITLE: "회원가입",
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: `반갑습니다. ${API_NAME}에 가입해주셔서 감사합니다.`,
		2: "아래 버튼을 클릭하여 이메일 인증을 진행해주시기바랍니다.",
		3: "이메일 인증하기"
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: "환영합니다",
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: ` ${API_NAME}애 가입해주셔서 감사합니다.`,
		2: (account, deposit) => `
			거래를 시작하기 위해 먼저, 암호화폐 또는 현금을 계좌에 입금하여야 합니다.
			${account}으로 이동하여 ${deposit} 페이지를 방문해주시기 바랍니다.`,
		3: "계정",
		4: "입금",
		5: `문의사항은 ${SUPPORT_EMAIL} 로 문의해주시기 바랍니다.`
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: "로그인",
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: "로그인 정보가 아래와 같이 확인되었습니다.",
		2: time => COMMON.TIME(time),
		3: country => COMMON.COUNTRY(country),
		4: device => COMMON.DEVICE(device),
		5: ip => COMMON.IP_ADDRESS(ip),
		6: "직접 로그인하신 것이 아니라면 즉시 웹사이트에 방문하여 비밀번호 변경 및 이중인증 보안을 설정하시고 고객센터로 연락주시기 바랍니다."
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: "비밀번호 재설정 요청",
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: "계정의 비밀번호 재설정을 요청하셨습니다.",
		2: "아래 버튼을 클릭하여 비밀번호 재설정을 진행하실 수 있습니다.",
		3: "비밀번호 재설정",
		4: COMMON.ERROR_REQUEST,
		5: ip => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSIT = {
	TITLE: currency => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation = 1, currency) =>
			`회원님의 ${API_NAME} 지갑으로 ${amount} ${currency.toUpperCase()} 입금 진행 중입니다. 거래는 블록체인 상 ${confirmation} 개의 승인이 요구됩니다. 거래가 승인되고 지갑에 자금이 입금될 때까지 기다려주십시오.`,
		COMPLETED: (amount, confirmation, currency) =>
			`회원님의 ${amount} ${currency.toUpperCase()} 입금이 완료되었습니다. 회원님의 ${currency.toUpperCase()} 지갑에서 확인 및 이용하실 수 있습니다.`,
		1: (amount, currency) =>
			`${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: status => `입금 상태: ${status}`,
		3: address => COMMON.ADDRESS(address),
		4: txid => COMMON.TXID(txid),
		5: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: "계정 인증완료",
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: "축하합니다. 계정인증이 완료되어 레벨상향되었습니다. 거래를 시작할 준비가 되었습니다.",
		2: "거래하기"
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: "계정 레벨상향",
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: level =>
			`축하합니다. 회원님의 계정이 레벨 ${level} 로 상향되었습니다. 더 낮아진 수수료와 높아진 출금한도를 비롯한 프리미엄 혜택을 받으실 수 있습니다.`,
		2: "거래하기"
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${COMMON[type.toUpperCase()]} 거래불가`,
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`회원님이 ${date}에 ${amount}의 ${currency.toUpperCase()} 을 입금하신 내역을 찾을 수 없거나 실행 할 수 없습니다. 해당 거래는 시스템에 의해 거부되었습니다.`,
		WITHDRAWAL: (currency, date, amount) =>
			`회원님이 ${date}에 ${amount}의 ${currency.toUpperCase()} 을 출금하신 내역을 찾을 수 없거나 실행 할 수 없습니다. 해당 거래는 시스템에 의해 거부되었으며, 해당 출금액은 ${API_NAME} 지갑으로 환불됩니다.`,
		1: "추가 문의 사항은 본 메일에 회신해주시기바랍니다.",
		2: txid => COMMON.TXID(txid),
		3: amount => COMMON.AMOUNT(amount),
		4: "상태 : 거절됨"
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: currency => `${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, address, currency) =>
			` ${amount} ${currency.toUpperCase()} 이 ${address}로 출금 요청되어 처리중입니다.`,
		COMPLETED: (amount, address, currency) =>
			`${address}로  ${amount} ${currency.toUpperCase()} 출금이 완료되었습니다.`,
		1: (amount, currency) =>
			`${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: fee => COMMON.FEE(fee),
		3: status => `상태: ${status}`,
		4: address => COMMON.ADDRESS(address),
		5: txid => COMMON.TXID(txid),
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: currency => `${currency.toUpperCase()} ${COMMON.WITHDRAWAL} 요청`,
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`회원님은 ${address} 로 ${amount}의 ${currency.toUpperCase()} 출금이 요청되었습니다.`,
		2: amount => COMMON.AMOUNT(amount),
		3: fee => COMMON.FEE(fee),
		4: address => `주소: ${address}`,
		5: "아래버튼을 클릭하시어 출금을 실행 하실 수 있습니다.",
		6: "실행",
		7: COMMON.ERROR_REQUEST,
		8: ip => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const USERVERIFICATIONREJECT = {
	TITLE: type => (type === "id" ? "ID 인증 불가" : "새로운 은행 등록 불가"),
	GREETING: name => COMMON.GREETING(name),
	BODY: {
		1: type =>
			type === "id"
				? "회원님의 ID인증을 진행하였으나 거절되었습니다. 자세한 내용은 아래의 메세지를 참조해주시기바랍니다:"
				: "회원님의 새로운 은행정보 등록이 진행되었으나 거절되었습니다. 자세한 내용은 아래의 메세지를 참조해주시기바랍니다:",
		2: message => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: "Contact Form",
	BODY: {
		1: "Contact Form Data",
		2: email =>
			`The client with email ${email} has submitted the contact form.`,
		3: data => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: "User Verification",
	BODY: {
		1: "User Verification Required",
		2: email =>
			`User "${email}" uploaded his documents for verification. Please verify his documents.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: "Suspicious Deposit",
	BODY: {
		1: "Suspicious Deposit",
		2: (email, currency) =>
			`The client with email ${email} has received a ${currency.toUpperCase()} deposit that is suspicious.`,
		3: txid => COMMON.TXID(txid),
		4: "Transaction data:",
		5: data => `${JSON.stringify(data)}`
	}
};

const SMS = {
	verificationCode: code => `Your verification code is ${code}`,
	deposit: (currency, amount) =>
		`Your ${currency.toUpperCase()} deposit for amount ${amount} is confirmed and deposited to your wallet`,
	withdrawal: (currency, amount) =>
		`Your ${currency.toUpperCase()} withdrawal for amount ${amount} is confirmed`
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
	SMS
};