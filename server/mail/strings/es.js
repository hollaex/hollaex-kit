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

const SIGNUP = {
	TITLE: 'Registro',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Tiene que confirmar su cuenta de correo electrónico haciendo clic en el botón de abajo.
		Si tiene alguna pregunta, no dude en contactarnos simplemente respondiendo a este correo electrónico.`,
		2: 'Por favor, haga clic en el botón de abajo para proceder a su registro.',
		3: 'Confirmar'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'Bienvenido',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Gracias por registrarse en ${API_NAME()}.`,
		2: (account, deposit) => `
		Para poder comerciar, primero debe depositar criptomonedas en su cuenta.
		Por favor, vaya a su ${account} y visite la página de ${deposit}.`,
		3: 'cuenta',
		4: 'depósito',
		5: 'Si tiene alguna pregunta o preocupación, por favor contáctenos simplemente respondiendo a este correo electrónico.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Inicio de sesión',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Hemos registrado un acceso a su cuenta con los siguientes detalles',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'Si no ha sido usted, por favor cambie su contraseña, establezca una autenticación de dos factores y póngase en contacto con nosotros inmediatamente.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Solicitud de restablecimiento de la contraseña.',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Ha solicitado que se restablezca la contraseña de su cuenta.',
		2: 'Para actualizar su contraseña, haga clic en el siguiente enlace.',
		3: 'Restablecer mi contraseña',
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
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Cuenta verificada',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Felicidades. Su cuenta ha sido verificada con éxito.',
		2: 'Comercie ahora'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'Cuenta actualizada',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`Felicidades. El nivel de acceso a su cuenta ha sido actualizado a nivel ${level}. Usted se beneficiará de tarifas más bajas, límites de retiro más altos y otras características premium.`,
		2: 'Comercie ahora'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} rechazado`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`No pudimos encontrar o procesar su ${currency.toUpperCase()} depósito hecho el ${date} de ${amount}. Por consiguiente, la transacción es rechazada por nuestro sistema.`,
		WITHDRAWAL: (currency, date, amount) =>
			`No pudimos encontrar o procesar su ${currency.toUpperCase()} retirada hecha el ${date} de ${amount}. Por consiguiente, la transacción es rechazada por nuestro sistema y el importe de la retirada pendiente se acredita de nuevo a su ${API_NAME()} billetera.`,
		1: 'Si tiene más preguntas, puede responder a este correo electrónico',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'Estado: Rechazado'
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
		7: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} Solicitud`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`Usted ha hecho una solicitud de retirada de ${currency.toUpperCase()} por ${amount} a ${address}`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Dirección: ${address}`,
		5: (network) => `Network: ${network}`,
		6: 'Para confirmar esta retirada, por favor haga clic en el botón de abajo.',
		7: 'Confirmar',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'Dirección de retiro inválida',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `Su retiro de ${currency} por ${amount} fue enviada a una dirección inválida y fue rechazada.`,
		2: (address) => `Dirección: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `ALERTA: ${title}`,
	BODY: {
		1: (type) => `Alerta: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id'
			? 'La verificación de identificación fue rechazada'
			: 'Solicitud de nuevo banco rechazada',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? 'Su reciente verificación de identidad ha sido procesada y desafortunadamente es rechazada. Para más información, lea el mensaje de nuestro experto a continuación:'
				: 'Su nuevo registro bancario se ha procesado y desafortunadamente ha sido rechazado. Para más información, lea el mensaje de nuestro experto a continuación:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `Cuenta ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `Su cuenta ${email} ha sido activada. Ahora puede usar su cuenta.`,
		DEACTIVATED: (email) => `Su cuenta ${email} ha sido desactivada. No podrá utilizar su cuenta hasta que sea activada por el administrador del intercambio.`
	},
	CLOSING: COMMON.CLOSING
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

const USERVERIFICATION = {
	TITLE: 'Verificación de usuario',
	BODY: {
		1: 'Se requiere la verificación del usuario',
		2: (email) =>
			`Usuario "${email}" subió sus documentos para verificarlos. Por favor, verifique sus documentos.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'Depósito sospechoso',
	BODY: {
		1: 'Depósito sospechoso',
		2: (email, currency) =>
			`El cliente con el correo electrónico ${email} ha recibido un depósito de ${currency.toUpperCase()} que es sospechoso.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Datos de la transacción:',
		5: (data) => `${JSON.stringify(data)}`
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

const DISCOUNTUPDATE = {
	TITLE: 'Descuento',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (rate) => `Su tasa de descuento se ha cambiado al ${rate}%.  Este descuento se aplicará a las tarifas de sus transacciones.`
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
