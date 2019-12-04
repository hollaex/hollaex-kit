const rp = require('request-promise');
const crypto = require('crypto');

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

module.exports = {
	createRequest,
	createSignature
};
