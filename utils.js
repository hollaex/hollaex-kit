var rp = require('request-promise');

const createRequest = (verb, url, headers, data) => {
	const body = JSON.stringify(data);
	var requestObj = {
		headers,
		url,
		body
	};
	return rp[verb.toLowerCase()](requestObj);
} 

module.exports = {
	createRequest,	
}