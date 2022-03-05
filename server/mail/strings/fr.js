'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Bonjour ${name}`,
	CLOSING: {
		1: 'Bien cordialement',
		2: () => `${API_NAME()} team`
	},
	IP_ADDRESS: (ip) => `Adresse IP: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Demande initiée depuis: ${ip}`,
	TXID: (txid) => `Identité de la transaction: ${txid}`,
	FEE: (fee) => `Frais: ${fee}`,
	AMOUNT: (amount) => `Montant: ${amount}`,
	ADDRESS: (address) => `Addresse: ${address}`,
	TIME: (time) => `Heure: ${time}`,
	COUNTRY: (country) => `Pays ${country}`,
	DEVICE: (device) => `Device: ${device}`,
	MESSAGE: (message) => `Message: ${message}`,
	ERROR_REQUEST:
		'Si cette demande a été faite par erreur, il est prudent de l\'ignorer; aucune modification ne sera apportée à votre compte.',
	EXPLORER:
		'Vous pouvez trouver le statut de votre transaction sur la blockchain grâce à ces Block Explorers:',
	DEPOSIT: 'Dépôt',
	WITHDRAWAL: 'Retrait'
};

const FOOTER = {
	FOLLOW_US: 'Suivez-nous sur',
	NEED_HELP: 'Besoin d\'aide? Repondez simplement à cet email.',
	PRIVACY_POLICY: 'Politique de confidentialité',
	TERMS: 'Termes et conditions',
	INVITE_YOUR_FRIENDS: 'Inviter vos amis',
	POWERED_BY: 'Powered by'
};

const ALERT = {
	TITLE: (title) => `ALERTE: ${title}`,
	BODY: {
		1: (type) => `Alerte: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'Formulaire de contact',
	BODY: {
		1: 'Données du formulaire de contact',
		2: (email) =>
			`Le client avec l'email ${email} a soumis le formulaire de contact.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Votre code de vérification est ${code}`
	,
	deposit: (currency, amount) =>
		`Votre dépôt de ${currency.toUpperCase()} d'un montant de ${amount} est confirmé et déposé dans votre portefeuille`
	,
	withdrawal: (currency, amount) =>
		`Votre retrait de ${currency.toUpperCase()} d'un montant de ${amount} est confirmé`
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation, currency) =>
			`Vous avez un nouveau dépôt pour ${amount} ${currency.toUpperCase()} en attente dans votre portefeuille ${API_NAME()}. Veuillez attendre que la transaction soit confirmée et vos fonds seront disponible dans votre portefeuille.${confirmation ? ` Votre transaction nécessite ${confirmation} confirmation(s) sur la blockchain.` : ''}`,
		COMPLETED: (amount, confirmation, currency) =>
			`Votre ${
				currency.toUpperCase()
			} dépôt pour ${amount} ${currency.toUpperCase()} est confirmé et complété et il est disponible dans votre portefeuille ${
				currency.toUpperCase()
			} .`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
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
			`Vous avez fait une demande de retrait de ${amount} ${currency.toUpperCase()}. Le statut de votre retrait est en attente et sera traité sous peu.`,
		COMPLETED: (amount, currency) =>
			`Votre demande de retrait de ${amount} ${currency.toUpperCase()} est traité.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Status: ${status}`,
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

