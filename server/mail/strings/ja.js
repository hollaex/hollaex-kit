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

const SIGNUP = {
	TITLE: '会員登録',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `下のボタンをクリックして、お客様のメールアカウントを認証してください。 
		お問い合わせは、このメールにてご返信ください。`,
		2: '下のボタンをクリックして、登録プロセスを続行してください。',
		3: 'メールアカウント認証'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'ようこそ',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `${API_NAME()}をご利用いただき誠にありがとうございます。`,
		2: (account, deposit) => `
			取引を始めるため、まず仮想通貨、または資金をアカウントに入金する必要があります。
			お客様の${account}に移動して、${deposit}ページを訪問してください。`,
		3: 'アカウント',
		4: '入金',
		5: 'お問い合わせは、このメールにてご返信ください。'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'ログイン',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'お客様のアカウントが以下の情報からログインされました。',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: `本人のログインではない場合、${API_NAME()}でパスワードの変更および二段階認証を設定し、即時にこのメールにてご返信ください。`
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'パスワード再設定のリクエスト',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'お客様のアカウントから、パスワードの再設定がリクエストされました。',
		2: '下のリンクをクリックして、パスワードのアップデートを続行してください。',
		3: 'パスワード再設定',
		4: COMMON.ERROR_REQUEST,
		5: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
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
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'アカウントの認証完了',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'おめでとうございます。お客様のアカウントの認証が完了しました。',
		2: '取引を始める'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'アカウントのアップグレード完了',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`おめでとうございます。お客様のアカウントのレベルが、${level}にアップグレードされました。これから、より安い手数料や高い出金限度額など、様々なプレミアム特典をご利用になれます。`,
		2: '取引を始める'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		}失敗`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`お客様が${date}に${amount} ${currency.toUpperCase()}を入金した履歴を検索または処理できませんでした。これにより、取引がシステムにより拒否されました。`,
		WITHDRAWAL: (currency, date, amount) =>
			`お客様が${date}に${amount} ${currency.toUpperCase()}を出金した履歴を検索または処理できませんでした。これにより、取引がシステムにより拒否されました。お客様の保留中の出金は${API_NAME()}ウォレットに返金されました。`,
		1: 'お問い合わせは、このメールにてご返信ください。',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: '取引状態：拒否'
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
		7: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}リクエスト`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`お客様のアカウントから${address}へ${amount} ${currency.toUpperCase()}出金がリクエストされました。`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `アドレス：${address}`,
		5: (network) => `Network: ${network}`,
		6: '出金を承認するためには、下のボタンをクリックしてください。',
		7: '出金承認',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: '無効な出金アドレス',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `お客様の${amount} ${currency}出金が、無効なアドレスにリクエストされ取引が拒否されました。`,
		2: (address) => `アドレス：${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `警告：${title}`,
	BODY: {
		1: (type) => `警告：${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id' 
			? '本人確認失敗' 
			: '新しい銀行情報の登録失敗',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? '恐れ入りますが、お客様の本人確認に失敗しました。以下のメッセージを参考し、追加の処置を行ってください：'
				: '恐れ入りますが、お客様の新しい銀行情報の登録に失敗しました。以下のメッセージを参考し、追加の処置を行ってください：',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `アカウント${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `お客様のアカウント${email}が活性化されました。これからアカウントをご利用できます。`,
		DEACTIVATED: (email) => `お客様のアカウント${email}が非活性化されました。取引所管理者から活性化されるまでアカウントはご利用できません。`
	},
	CLOSING: COMMON.CLOSING
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

const USERVERIFICATION = {
	TITLE: 'ユーザー本人確認',
	BODY: {
		1: 'ユーザー本人確認要請',
		2: (email) =>
			`ユーザー"${email}"が本人確認書類をアップロードしました。書類の確認をお願いします。`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: '不明な入金',
	BODY: {
		1: '不明な入金',
		2: (email, currency) =>
			`ユーザー${email}が不明な${currency.toUpperCase()}入金を受け取りました。`,
		3: (txid) => COMMON.TXID(txid),
		4: '取引データ：',
		5: (data) => `${JSON.stringify(data)}`
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

const DISCOUNTUPDATE = {
	TITLE: 'Discount Rate Change',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (rate) => `Your discount rate has been changed to ${rate}%. This rate will be applied to your order fees.`
	},
	CLOSING: COMMON.CLOSING
};

const BANKVERIFIED = {
	TITLE: 'Bank Verified',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'A pending bank account has been verified. Your valid account can now be used for exchange operations requiring a bank account.',
		2: 'To view your current bank accounts, please visit the exchange\'s Verification Tab'
	},
	CLOSING: COMMON.CLOSING
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
	SMS,
	DISCOUNTUPDATE,
	BANKVERIFIED
};
