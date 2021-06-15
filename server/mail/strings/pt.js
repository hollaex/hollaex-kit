'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Dear ${name}`,
	CLOSING: {
		1: 'Saudações',
		2: () => `${API_NAME()} equipe`
	},
	IP_ADDRESS: (ip) => `Endereço de IP: ${ip}`,
	IP_REQUEST_FROM: (ip) => ` Solicitação iniciada em: ${ip}`,
	TXID: (txid) => ` ID da transação: ${txid}`,
	FEE: (fee) => `Taxa: ${fee}`,
	AMOUNT: (amount) => ` Quantia: ${amount} `,
	ADDRESS: (address) => `Endereço: ${address}`,
	TIME: (time) => `Hora: ${time}`,
	COUNTRY: (country) => `País: ${country}`,
	DEVICE: (device) => `Dispositivo: ${device}`,
	MESSAGE: (message) => ` Mensagem: ${message}`,
	ERROR_REQUEST:
		'Se esta solicitação foi feita por engano, gentileza ignorá-la; nenhuma alteração será feita em sua conta.',
	EXPLORER:
		'Você pode ver o status de sua transação no blockchain através destes Block Explorers:',
	DEPOSIT: 'Depósito',
	WITHDRAWAL: 'Saque'
};

const FOOTER = {
	FOLLOW_US: 'Siga-nos no',
	NEED_HELP: 'Preciso de ajuda? Basta responder a este e-mail ',
	PRIVACY_POLICY: 'Política de Privacidade',
	TERMS: 'Termos e Condições',
	INVITE_YOUR_FRIENDS: 'Convide seus amigos',
	POWERED_BY: 'Powered by'
};

const SIGNUP = {
	TITLE: 'Registrar',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => ` Você precisa confirmar sua conta de e-mail clicando no botão abaixo.
Se você tiver alguma dúvida, basta entrar em contato através deste e-mail.`,
		2: 'Por favor, clique no botão abaixo para prosseguir.',
		3: 'Confirmar'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'Bem-vindo(a)',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Obrigado por se registrar-se no ${API_NAME()}.`,
		2: (account, deposit) => `
		Para começar a fazer trade, você deve primeiro fazer um depósito em criptomoedas ou dinheiro em sua conta.
Vá para sua ${account} e visite a página de ${deposit}.`,
		3: 'conta',
		4: 'depósito',
		5: 'Se você tiver alguma dúvida ou questão, basta entrar em contato conosco através deste e-mail.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Login',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Registramos um login em sua conta com os seguintes dados ',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'Caso não tenha sido você, altere sua senha, configure a autenticação de dois fatores e entre em contato conosco imediatamente.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Solicitação para redefinir a senha',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Você solicitou a redefinição da senha de sua conta.',
		2: 'Para atualizar sua senha, clique no link abaixo.',
		3: 'Criar nova senha',
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
			` Você tem um novo depósito de ${amount} ${currency.toUpperCase ()} pendente em sua carteira ${API_NAME ()}. Aguarde até que a transação seja confirmada e seus fundos estejam disponíveis em sua carteira. Sua transação requer ${confirmation} confirmação ou confirmações no blockchain.`,
		COMPLETED: (amount, confirmation, currency) =>
			` Seu ${currency.toUpperCase ()} O depósito de ${amount} ${currency.toUpperCase ()} foi confirmado e concluído e está disponível em sua ${currency.toUpperCase ()} carteira.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Conta verificada',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Parabéns. Sua conta foi verificada com sucesso.',
		2: 'Comece a fazer trade agora!'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'Realizado Upgrade da Conta',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (tier) =>
			`Parabéns! O nível de acesso da sua conta recebeu um upgrade e foi para o nível ${tier}. Você terá como benefícios taxas mais baixas, limites de saque mais altos e outros recursos premium.`,
		2: 'Faça trade agora!'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} rejeitado`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			` Não conseguimos encontrar ou processar seu depósito de ${currency.toUpperCase()} feito em ${date} para ${amount}. Por isso, a transação foi rejeitada pelo nosso sistema.`,
		WITHDRAWAL: (currency, date, amount) =>
			`Não foi possível encontrar ou processar sua retirada de ${currency.toUpperCase()} feita em ${date} para ${amount}. Por isso, a transação foi rejeitada pelo nosso sistema e o valor do saque pendente foi creditado de volta na sua carteira ${API_NAME ()}.`,
		1: 'Em caso de dúvidas, basta responder a este e-mail',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'Status: Rejeitado'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, address, currency) =>
			`Você fez uma solicitação de saque de $ amount} ${currency.toUpperCase()} para o endereço $ {address}. Seu status de retirada está pendente e será processado em breve.`,
		COMPLETED: (amount, address, currency) =>
			`Sua solicitação de saque de ${amount} ${currency.toUpperCase()} foi processada e transferida para o endereço $ {address}.`,
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
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} Solicitação`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`Você fez uma solicitação de saque de ${currency.toUpperCase()} de ${amount} para ${address}`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Endereço: ${address}`,
		5: 'Para confirmar este saque, por favor clique no botão abaixo.',
		6: 'Confirmar',
		7: COMMON.ERROR_REQUEST,
		8: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'Endereço de saque inválido',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `Seu saque de ${currency} de ${amount} estava prestes a ser enviado para um endereço inválido e por isso foi rejeitado.`,
		2: (address) => `Endereço: ${address}`
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
			? 'Verificação de ID rejeitada'
			: 'Novo pedido de banco rejeitado',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? 'Sua solicitação de identidade recente foi processada mas, infelizmente, rejeitada. Para mais ações, leia a mensagem do nosso especialista abaixo:'
				: 'Seu novo registro no banco foi processado e infelizmente foi rejeitado. Para outras ações, leia a mensagem do nosso especialista abaixo:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `Conta ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `Sua conta ${email} foi ativada. Agora você já pode usar sua conta.`,
		DEACTIVATED: (email) => `Sua conta ${email} foi desativada. Você não poderá usar sua conta até que ela seja ativada pelo administrador da Exchange.`
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: 'Formulário de Contato',
	BODY: {
		1: 'Dados do formulário de contato',
		2: (email) =>
			`O cliente com e-mail ${email} enviou o formulário de contato.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: 'Verificação de usuário',
	BODY: {
		1: 'Verificação de usuário necessária',
		2: (email) =>
			`O usuário" ${email} "fez o upload de seus documentos para verificação. Por favor, verifique-os.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'Depósito Suspeito',
	BODY: {
		1: 'Depósito Suspeito',
		2: (email, currency) =>
			`O cliente com o e-mail ${email} recebeu um depósito suspeito de ${currency.toUpperCase ()}.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Dados de transação:',
		5: (data) => `${JSON.stringify(data)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		` Seu código de verificação é ${code}`
	,
	deposit: (currency, amount) =>
		`Seu depósito de ${currency.toUpperCase()} no valor ${amount} foi confirmado e depositado em sua carteira`
	,
	withdrawal: (currency, amount) =>
		`Seu saque de ${currency.toUpperCase()} no valor ${amount} foi confirmado`
};

const INVITEDOPERATOR = {
	TITLE: 'Convite do Operador',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		CREATED: {
			1: (role, invitingEmail) => `Você foi convidado como operador de ${API_NAME()} com a função de ${role} pelo usuário ${invitingEmail}.`,
			2: 'Segue abaixo sua senha temporária. Altere sua senha após o login para fins de segurança.',
			3: (email) => `Email: ${email}`,
			4: (password) => `Senha: ${password}`,
			5: 'Login'
		},
		EXISTING: {
			1: (role, invitingEmail) => `Sua conta ${API_NAME()} foi atualizada para a função de ${role} pelo usuário ${invitingEmail}.`,
			2: 'Login'
		}
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
	INVITEDOPERATOR,
	BANKVERIFIED
};

