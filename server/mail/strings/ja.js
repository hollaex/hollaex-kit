'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `${name}様`,
	CLOSING: {
		1: '敬具',
		2: () => `${API_NAME()}チーム`
	},
	IP_ADDRESS: (ip) => `IPアドレス：${ip}`,
	IP_REQUEST_FROM: (ip) => `リクエスト元：${ip}`,
	TXID: (txid) => `取引ID：${txid}`,
	FEE: (fee) => `手数料：${fee}`,
	AMOUNT: (amount) => `金額：${amount}`,
	ADDRESS: (address) => `アドレス：${address}`,
	TIME: (time) => `時間：${time}`,
	COUNTRY: (country) => `国家：${country}`,
	DEVICE: (device) => `デバイス：${device}`,
	MESSAGE: (message) => `メッセージ：${message}`,
	ERROR_REQUEST: 'このリクエストの続行を望まない場合、このメールは無視してください。お客様のアカウントに変更は一切適用されません。',
	EXPLORER: 'ブロックチェーン上の取引状態は、こちらの Block Explorers から確認できます：',
	DEPOSIT: '入金',
	WITHDRAWAL: '出金'
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: 'お問い合わせは、このメールにてご返信ください。',
	PRIVACY_POLICY: 'プライバシーポリシー',
	TERMS: '利用規約',
	INVITE_YOUR_FRIENDS: '友達を招待',
	POWERED_BY: 'Powered by'
};

const ALERT = {
	TITLE: (title) => `警告：${title}`,
	BODY: {
		1: (type) => `警告：${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'お問い合わせフォーム',
	BODY: {
		1: 'お問い合わせフォームデータ',
		2: (email) =>
			`ユーザー${email}がお問い合わせフォームを提出しました。`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`お客様の認証コードは${code}です。`
	,
	deposit: (currency, amount) =>
		`お客様の${amount} ${currency.toUpperCase()}入金が完了し、ウォレットに入金されました。`
	,
	withdrawal: (currency, amount) =>
		`お客様の${amount} ${currency.toUpperCase()}出金が完了しました。`
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation, currency) =>
			`現在、お客様の${API_NAME()}ウォレットへの${amount} ${currency.toUpperCase()}入金は保留中です。取引が承認されるまでお待ちください${confirmation ? ` お客様の取引には、ブロックチェーン上で${confirmation}個の承認が必要です。` : ''}`,
		COMPLETED: (amount, confirmation, currency) =>
			`お客様の${amount} ${currency.toUpperCase()}入金が完了しました。お客様の${
				currency.toUpperCase()
			}ウォレットから確認および利用が可能です。`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `取引状態：${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: (network) => `Network: ${network}`,
		6: (fee) => COMMON.FEE(fee),
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency, address = '') =>
			`お客様のアドレス${address}に${amount} ${currency.toUpperCase()}出金がリクエストされました。現在の取引状態は保留中ですが、まもなく完了する予定です。`,
		COMPLETED: (amount, currency, address = '') =>
			`お客様の${amount} ${currency.toUpperCase()}出金が完了し、アドレス${address}に振り込みされました。`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `取引状態：${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: (network) => `Network: ${network}`,
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	CONTACTFORM,
	DEPOSIT,
	WITHDRAWAL
};
