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

const SIGNUP = {
	TITLE: 'S\'inscrire',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Vous devez confirmer votre email en cliquant sur le bouton ci-dessous.
		Si vous avez des questions, n'hésitez pas à nous contacter simplement en répondant à cet email.`,
		2: 'Veuillez cliquer sur le bouton ci-dessous pour procéder à votre inscription.',
		3: 'Confirmer'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'Bienvenue',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Merci pour votre inscription à ${API_NAME()}.`,
		2: (account, deposit) => `
		Pour faire du trading, vous devez d'abord déposer de la crypto-monnaie ou verser de l'argent sur votre compte.
		Veuillez aller à votre ${account} et visitez la page ${deposit}.`,
		3: 'compte',
		4: 'dépôt',
		5: 'Si vous avez des questions ou des préoccupations, veuillez nous contacter simplement en répondant à cet email.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Connexion',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Nous avons enregistré une connexion à votre compte avec les détails suivants',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'Si ce n\'était pas vous, veuillez changer votre mot de passe, configurer l\'authentification à deux facteurs et nous contacter immédiatement.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Réinitialiser la demande de mot de passe',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Vous avez fait une demande de réinitialisation du mot de passe de votre compte.',
		2: 'Pour mettre à jour votre mot de passe, cliquez sur le lien ci-dessous.',
		3: 'Réinitialiser mon mot de passe',
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
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Compte vérifié',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Félicitations. Votre compte a été vérifié correctement.',
		2: 'Commencer le trading maintenant.'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'Compte mis à jour',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`Félicitations. Le niveau d'accès de votre compte a été mis à jour au niveau ${level}. Vous bénéficierez de frais moins élevés, de limites de retrait plus élevées et d'autres fonctionnalités premium.`,
		2: 'Commencer le trading maintenant'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} rejeté`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`Nous n'avons pas pu trouver ni traiter votre dépôt ${currency.toUpperCase()} effectué le ${date} de ${amount}. Ainsi, la transaction a été rejetée par notre système.`,
		WITHDRAWAL: (currency, date, amount) =>
			`Nous n'avons pas pu trouver ni traiter votre retrait ${currency.toUpperCase()} fait le ${date} de ${amount}. Ainsi, la transaction a été rejetée par notre système et le montant de votre retrait en attente sera crédité sur votre portefeuille ${API_NAME()}.`,
		1: 'Si vous avez d\'autres questions, vous pouvez répondre à cet email',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'Status: Rejeté'
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
		7: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} Demande`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`Vous avez fait une demande de retrait ${currency.toUpperCase()} d'un montant de ${amount} à l'adresse suivante ${address}`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Addresse: ${address}`,
		5: (network) => `Network: ${network}`,
		6: 'Pour confirmer le retrait, veuillez cliquer dur le bouton ci-dessous.',
		7: 'Confirmer',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'Adresse de retrait invalide',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `Votre retrait ${currency} de ${amount} a été envoyé à une adresse invalide et est rejeté.`,
		2: (address) => `Addresse: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `ALERTE: ${title}`,
	BODY: {
		1: (type) => `Alerte: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'identité'
			? 'Vérification d\'identité refusée'
			: 'Nouvelle demande bancaire rejetée',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'identité'
				? 'Votre récente vérification d\'identité a été traitée et est malheureusement rejetée. Pour d\'autres actions, lisez le message de notre expert ci-dessous:'
				: 'Votre nouvelle inscription bancaire a été traitée et est malheureusement rejetée. Pour d\'autres actions, lisez le message de notre expert ci-dessous:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `Compte ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `Votre compte ${email} a été activé. Vous pouvez désormais utiliser votre compte.`,
		DEACTIVATED: (email) => `Votre compte ${email} a été désactivé. Vous ne pourrez pas utiliser votre compte tant qu'il ne sera pas activé par l'administrateur de l'échange.`
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: 'Formulaire de contact',
	BODY: {
		1: 'Données du formulaire de contact',
		2: (email) =>
			`Le client avec l\'email ${email} a soumis le formulaire de contact.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: 'Vérification de l\'utilisateur',
	BODY: {
		1: 'Vérification de l\'utilisateur requise',
		2: (email) =>
			`Utilisateur "${email}" a téléchargé ses documents pour vérification. Veuillez vérifier ses documents.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'Dépôt suspect',
	BODY: {
		1: 'Dépôt suspect',
		2: (email, currency) =>
			`Le client avec l\'email ${email} a reçu un retrait de ${currency.toUpperCase()} ce qui est suspect.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Données de la transaction:',
		5: (data) => `${JSON.stringify(data)}`
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

