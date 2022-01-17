const rp = require('request-promise');
const crypto = require('crypto');
const moment = require('moment');
const { isDate } = require('lodash');

const createRequest = (verb, url, headers, opts = { data: null, formData: null }) => {
	const requestObj = {
		headers,
		url,
		json: true
	};

	if (opts.data) {
		requestObj.body = opts.data;
	}

	if (opts.formData) {
		requestObj.formData = opts.formData;
	}

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
		throw new Error(
			'Missing Kit ID. ID of the exchange Kit should be initialized in HollaEx constructor'
		);
	}
	return true;
};

const parameterError = (parameter, msg) => {
	return new Error(`Parameter ${parameter} error: ${msg}`);
};

const isDatetime = (date, formats = [ moment.ISO_8601 ]) => {
	return moment(date, formats, true).isValid();
};

const sanitizeDate = (date) => {
	let result = date;
	if (isDate(result)) {
		result = moment(result).toISOString();
	}

	return result;
};

const isUrl = (url) => {
	const pattern = /^(^|\s)((http(s)?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

module.exports = {
	createRequest,
	createSignature,
	generateHeaders,
	checkKit,
	parameterError,
	isDatetime,
	sanitizeDate,
	isUrl
};
