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

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	CONTACTFORM
};

