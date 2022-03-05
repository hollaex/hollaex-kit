'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Estimado/ Estimada ${name}`,
	CLOSING: {
		1: 'Saludos',
		2: () => `Equipo de ${API_NAME()}`
	},
	IP_ADDRESS: (ip) => `Dirección IP: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Solicitud iniciada de: ${ip}`,
	TXID: (txid) => `ID de transacción: ${txid}`,
	FEE: (fee) => `Tarifa: ${fee}`,
	AMOUNT: (amount) => `Cantidad: ${amount}`,
	ADDRESS: (address) => `Dirección: ${address}`,
	TIME: (time) => `Tiempo: ${time}`,
	COUNTRY: (country) => `País: ${country}`,
	DEVICE: (device) => `Dispositivo: ${device}`,
	MESSAGE: (message) => `Mensaje: ${message}`,
	ERROR_REQUEST:
		'Si esta solicitud se hizo por error, es seguro ignorarla; no se harán cambios en su cuenta.',
	EXPLORER:
		'Puede encontrar el estado de su transacción en Blockchain a través de estos Block Explorers:',
	DEPOSIT: 'Depósito',
	WITHDRAWAL: 'Retirada'
};

const FOOTER = {
	FOLLOW_US: 'Síganos en',
	NEED_HELP: 'Necesita ayuda? Sólo tiene que contestar a este correo electrónico',
	PRIVACY_POLICY: 'Política de privacidad',
	TERMS: 'Términos y condiciones',
	INVITE_YOUR_FRIENDS: 'Invita a tus amigos',
	POWERED_BY: 'Accionado por'
};

const ALERT = {
	TITLE: (title) => `ALERTA: ${title}`,
	BODY: {
		1: (type) => `Alerta: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'Formulario de contacto',
	BODY: {
		1: 'Datos del formulario de contacto',
		2: (email) =>
			`El cliente con el correo electrónico ${email} ha enviado el formulario de contacto.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Su código de verificación es ${code}`
	,
	deposit: (currency, amount) =>
		`Su depósito de ${currency.toUpperCase()} por la cantidad de ${amount} fue confirmado y depositado en su billetera.`
	,
	withdrawal: (currency, amount) =>
		`Su retiro de ${currency.toUpperCase()} de la cantidad de ${amount} fue confirmado`
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation, currency) =>
			`Tiene un nuevo depósito por ${amount} ${currency.toUpperCase()} pendiente en su ${API_NAME()} billetera. Por favor espere hasta que la transacción se confirme y sus fondos estarán disponibles en su billetera.${confirmation ? ` Su transacción requiere ${confirmation} confirmación(es) en la cadena de bloqueo.` : ''}`,
		COMPLETED: (amount, confirmation, currency) =>
			`Su ${
				currency.toUpperCase()
			} depósito por ${amount} ${currency.toUpperCase()} está confirmado y completado y está disponible en su ${
				currency.toUpperCase()
			} billetera.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Estado: ${status}`,
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
		PENDING: (amount, currency) =>
			`Usted hizo una solicitud de retiro de ${amount} ${currency.toUpperCase()}. El estado de su retirada está pendiente y se procesará en breve.`,
		COMPLETED: (amount, currency) =>
			`Su solicitud de retirada de ${amount} ${currency.toUpperCase()} se está procesando.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Estado: ${status}`,
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
