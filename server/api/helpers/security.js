'use strict';

const crypto = require('crypto');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const { loggerUser } = require('../../config/logger');
const { CAPTCHA_ENDPOINT, NODE_ENV } = require('../../constants');
const { getSecrets } = require('../../init');
const CAPTCHA_SECRET_KEY = () => getSecrets().captcha.secret_key;
const ADMIN_WHITELIST = () => getSecrets().admin_whitelist;
const TOKEN_TIME = () => getSecrets().security.token_time;
const { INVALID_CAPTCHA } = require('../../messages');
const {
	BASE_SCOPES,
	ROLES,
	ISSUER,
	SECRET
} = require('../../constants');

const calculateSignature = (secret = '', verb, path, nonce, data = '') => {
	const stringData = typeof data === 'string' ? data : JSON.stringify(data);

	const signature = crypto
		.createHmac('sha256', secret)
		.update(verb + path + nonce + stringData)
		.digest('hex');
	return signature;
};

const checkHmacSignature = (
	secret,
	{ body, headers, method, originalUrl }
) => {
	const signature = headers['api-signature'];
	const expires = headers['api-expires'];

	const calculatedSignature = calculateSignature(
		secret,
		method,
		originalUrl,
		expires,
		body
	);
	return calculatedSignature === signature;
};

const checkAdminIp = (whiteListedIps = [], ip = '') => {
	if (whiteListedIps.length === 0) {
		return true; // no ip restriction for admin
	} else {
		return whiteListedIps.includes(ip);
	}
};

const checkCaptcha = (captcha = '', remoteip = '') => {
	loggerUser.verbose('helpers/captcha/checkCaptcha params', captcha, remoteip);

	if (!captcha) {
		if (NODE_ENV === 'development') {
			return new Promise((resolve) => resolve());
		} else {
			throw new Error(INVALID_CAPTCHA);
		}
	} else if (!CAPTCHA_SECRET_KEY()) {
		return new Promise((resolve) => resolve());
	}

	const options = {
		method: 'POST',
		form: {
			secret: CAPTCHA_SECRET_KEY(),
			response: captcha,
			remoteip
		},
		uri: CAPTCHA_ENDPOINT
	};

	return rp(options)
		.then((response) => JSON.parse(response))
		.then((response) => {
			loggerUser.verbose('helpers/captcha/checkCaptcha response', response);
			if (!response.success) {
				throw new Error(INVALID_CAPTCHA);
			}
			return;
		});
};

const issueToken = (
	id,
	email,
	ip,
	isAdmin = false,
	isSupport = false,
	isSupervisor = false,
	isKYC = false,
	isTech = false
) => {
	// Default scope is ['user']
	let scopes = [].concat(BASE_SCOPES);

	if (checkAdminIp(ADMIN_WHITELIST(), ip)) {
		if (isAdmin) {
			scopes = scopes.concat(ROLES.ADMIN);
		}
		if (isSupport) {
			scopes = scopes.concat(ROLES.SUPPORT);
		}
		if (isSupervisor) {
			scopes = scopes.concat(ROLES.SUPERVISOR);
		}
		if (isKYC) {
			scopes = scopes.concat(ROLES.KYC);
		}
		if (isTech) {
			scopes = scopes.concat(ROLES.TECH);
		}
	}

	const token = jwt.sign(
		{
			sub: {
				id,
				email
			},
			scopes,
			ip,
			iss: ISSUER
		},
		SECRET,
		{
			expiresIn: TOKEN_TIME()
		}
	);
	return token;
};

module.exports = {
	calculateSignature,
	checkAdminIp,
	checkHmacSignature,
	checkCaptcha,
	issueToken
};
