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

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	CONTACTFORM
};
