'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Sehr geehrte/r ${name}`,
	CLOSING: {
		1: 'Mit freundlichen Grüßen',
		2: () => `${API_NAME()} team`
	},
	IP_ADDRESS: (ip) => `IP-Adresse: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Anfrage initiiert von: ${ip}`,
	TXID: (txid) => `Transaktionsnummer: ${txid}`,
	FEE: (fee) => `Gebühr: ${fee}`,
	AMOUNT: (amount) => `Betrag: ${amount}`,
	ADDRESS: (address) => `Adresse: ${address}`,
	TIME: (time) => `Zeit: ${time}`,
	COUNTRY: (country) => `Land: ${country}`,
	DEVICE: (device) => `Gerät: ${device}`,
	MESSAGE: (message) => `Nachricht: ${message}`,
	ERROR_REQUEST:
		'Wenn diese Anfrage fälschlicherweise gestellt wurde, können Sie sie getrost ignorieren; es werden keine Änderungen an Ihrem Konto vorgenommen.',
	EXPLORER:
		'Sie können den Status Ihrer Transaktion auf der Blockchain durch diese Block Explorers finden:',
	DEPOSIT: 'Einzahlung',
	WITHDRAWAL: 'Abbuchung'
};

const FOOTER = {
	FOLLOW_US: 'Folgen Sie uns auf',
	NEED_HELP: 'Brauchen Sie Hilfe? Antworten Sie einfach auf diese E-Mail',
	PRIVACY_POLICY: 'Datenschutzbestimmungen',
	TERMS: 'Konditionen und Bedingungen',
	INVITE_YOUR_FRIENDS: 'Laden Sie Ihre Freunde ein',
	POWERED_BY: 'Powered by'
};

const SIGNUP = {
	TITLE: 'Sign Up',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Sie müssen Ihr E-Mail-Konto bestätigen, indem Sie auf die unten angezeigte Taste klicken. 
		Wenn Sie Fragen haben, können Sie uns gerne kontaktieren, indem Sie einfach auf diese E-Mail antworten.`,
		2: 'Bitte klicken Sie auf die Schaltfläche unten, um mit Ihrer Registrierung fortzufahren.',
		3: 'Bestätigen'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'Willkommen',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Vielen Dank, dass Sie sich bei ${API_NAME()} angemeldet haben.`,
		2: (account, deposit) => `
		Um mit dem Trading zu beginnen, müssen Sie zunächst Kryptowährungen oder Geld auf Ihr Konto einzahlen.
		Bitte gehen Sie zu Ihrem ${account} und besuchen Sie die ${deposit} Seite.`,
		3: 'Konto',
		4: 'Einzahlung',
		5: 'Wenn Sie Fragen oder Bedenken haben, kontaktieren Sie uns bitte einfach durch Beantwortung dieser E-Mail.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Login',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Wir haben eine Anmeldung zu Ihrem Konto mit den folgenden Daten aufgezeichnet',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'Wenn Sie das nicht waren, ändern Sie bitte Ihr Passwort, richten Sie eine Zwei-Faktor-Authentifizierung ein und kontaktieren Sie uns umgehend.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Passwort zurücksetzen',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Sie haben eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto gestellt.',
		2: 'Um Ihr Passwort zu aktualisieren, klicken Sie auf den unten stehenden Link.',
		3: 'Mein Passwort zurücksetzen',
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
			`Sie haben eine neue Einzahlung von ${amount} ${currency.toUpperCase()} in Ihrer ${API_NAME()} Geldbörse ausstehend. Bitte warten Sie, bis die Transaktion bestätigt ist und Ihr Guthaben in Ihrer Geldbörse verfügbar ist. Ihre Transaktion erfordert ${confirmation} Bestätigung(en) in der Blockchain.`,
		COMPLETED: (amount, confirmation, currency) =>
			`Ihre ${
				currency.toUpperCase()
			} Anzahlung für ${amount} ${currency.toUpperCase()} ist bestätigt und abgeschlossen und steht in Ihrer ${
				currency.toUpperCase()
			} Geldbörse zur Verfügung.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Konto verifiziert',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Herzlichen Glückwunsch! Ihr Konto wurde erfolgreich verifiziert.',
		2: 'Jetzt handeln'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'Konto aktualisiert',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`Herzlichen Glückwunsch. Ihre Kontozugriffsstufe wird auf Stufe ${level} hochgestuft. Sie profitieren von niedrigeren Gebühren, höheren Auszahlungslimits und anderen Premium-Funktionen.`,
		2: 'Jetzt handeln'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} abgelehnt`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`Wir waren nicht in der Lage, Ihre ${currency.toUpperCase()} Einzahlung zu finden oder zu bearbeiten, die am ${date} für ${amount} gemacht wurde. Daher wird die Transaktion von unserem System abgelehnt.`,
		WITHDRAWAL: (currency, date, amount) =>
			`Wir waren nicht in der Lage, Ihre ${currency.toUpperCase()} Auszahlung zu finden oder zu bearbeiten, die am ${date} für ${amount} gemacht wurde. Dadurch wird die Transaktion von unserem System abgelehnt und Ihr ausstehender Abhebungsbetrag wird Ihrer ${API_NAME()} Geldbörse wieder gutgeschrieben.`,
		1: 'Wenn Sie weitere Fragen haben, können Sie auf diese E-Mail antworten',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'Status: Abgelehnt'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency) =>
			`Sie haben eine Auszahlungsanforderung für ${amount} ${currency.toUpperCase()} gemacht. Ihr Auszahlungsstatus ist ausstehend und wird in Kürze bearbeitet.`,
		COMPLETED: (amount, currency) =>
			`Ihr Auszahlungsantrag für ${amount} ${currency.toUpperCase()} wurde bearbeitet.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Status: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} Anfrage`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`Sie haben einen ${currency.toUpperCase()}  Auszahlungsantrag von ${amount} an die Adresse ${address} gemacht`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Adresse: ${address}`,
		5: (network) => `Network: ${network}`,
		6: 'Um diese Auszahlung zu bestätigen, klicken Sie bitte auf die Taste unten.',
		7: 'Bestätigen',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'Ungültige Auszahlungsadresse',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `Ihre ${currency} Auszahlung für ${amount} wurde an eine ungültige Adresse gesendet und wurde abgelehnt.`,
		2: (address) => `Adresse: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `WARNUNG: ${title}`,
	BODY: {
		1: (type) => `Warnung: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id'
			? 'ID-Verifizierung abgelehnt'
			: 'Neuer Bankantrag abgelehnt',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? 'Ihre aktuelle ID-Verifizierung wurde bearbeitet und ist leider abgelehnt worden. Für weitere Aktionen lesen Sie die Nachricht unseres Experten unten:'
				: 'Ihre neue Bankanmeldung wurde bearbeitet und ist leider abgelehnt worden. Für weitere Aktionen lesen Sie die Nachricht unseres Experten unten:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `Account ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `Ihr Konto ${email} wurde aktiviert. Sie können nun Ihr Konto verwenden.`,
		DEACTIVATED: (email) => `Ihr Konto ${email} wurde deaktiviert. Sie können Ihr Konto erst wieder verwenden, wenn es vom Administrator aktiviert wurde.`
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: 'Kontakt-Formular',
	BODY: {
		1: 'Kontakt-Formular Daten',
		2: (email) =>
			`Der Kunde mit der E-Mail ${email} hat das Kontaktformular abgeschickt.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: 'Benutzerverifizierung',
	BODY: {
		1: 'Benutzerverifizierung erforderlich',
		2: (email) =>
			`Der Benutzer "${email}" hat seine Dokumente zur Überprüfung hochgeladen. Bitte verifizieren Sie seine Dokumente.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'Verdächtige Einzahlung',
	BODY: {
		1: 'Verdächtige Einzahlung',
		2: (email, currency) =>
			`Der Client mit der E-Mail ${email} hat eine ${currency.toUpperCase()} Einzahlung erhalten, die verdächtig ist.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Transaktionsdaten:',
		5: (data) => `${JSON.stringify(data)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Ihr Verifizierungscode lautet ${code}`
	,
	deposit: (currency, amount) =>
		`Ihre ${currency.toUpperCase()} Einzahlung für den Betrag von ${amount} wurde bestätigt und in Ihrer Geldbörse hinterlegt`
	,
	withdrawal: (currency, amount) =>
		`Ihre ${currency.toUpperCase()} Abhebung für den Betrag von ${amount} wurde bestätigt.`
};

const DISCOUNTUPDATE = {
	TITLE: 'Discount Rate Change',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (rate) => `Your discount rate has been changed to ${rate}%. This rate will be applied to your order fees.`
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
	DISCOUNTUPDATE
};
