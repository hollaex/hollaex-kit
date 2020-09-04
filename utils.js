const rp = require('request-promise');
const crypto = require('crypto');
const moment = require('moment');

const createRequest = (verb, url, headers, data) => {
	const requestObj = {
		headers,
		url,
		body: data,
		json: true
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

const generateHeaders = (headers, secret, verb, path, expiresAfter, data) => {
	const expires = moment().unix() + expiresAfter;
	const signature = createSignature(secret, verb, path, expires, data);
	const header = {
		...headers,
		'api-signature': signature,
		'api-expires': expires
	};
	return header;
};

const checkKit = (kit) => {
	if (!kit) {
		throw new Error('Missing Kit ID. ID of the exchange Kit should be initialized in HollaEx constructor');
	}
	return true;
};

module.exports = {
	createRequest,
	createSignature,
	generateHeaders,
	checkKit
};
