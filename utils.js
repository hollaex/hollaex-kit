const rp = require('request-promise');
const crypto = require('crypto');
const moment = require('moment');

const createRequest = (verb, url, headers, data) => {
	const body = JSON.stringify(data);
	const requestObj = {
		headers,
		url,
		body
	};
	return rp[verb.toLowerCase()](requestObj);
};

const createSignature = (secret = '', verb, path, expires, data = '') => {
	const stringData = typeof data === 'string' ? data : JSON.stringify(data);

	const signature = crypto
		.createHmac('sha256', secret)
		.update(verb + path + expires + stringData)
		.digest('hex');
	return signature;
};

const generateHeader = (headers, secret, verb, path, expiresAfter, data) => {
	const expires = moment().unix() + expiresAfter;
	const signature = createSignature(secret, verb, path, expires, data);
	const header = {
		...headers,
		'api-signature': signature,
		'api-expires': expires
	};
	return header;
};

module.exports = {
	createRequest,
	createSignature,
	generateHeader
};
