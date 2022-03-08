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

const ALERT = {
	TITLE: (title) => `WARNUNG: ${title}`,
	BODY: {
		1: (type) => `Warnung: ${type}`
	}
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

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	CONTACTFORM
};
