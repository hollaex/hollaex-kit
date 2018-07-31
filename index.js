const  { createRequest } = require('./utils');

class HollaEx {
	constructor(opts = {
		apiURL: 'https://api.hollaex.com',
		baseURL: '/v0',
		accessToken: ''
	}) {
		this._url = opts.apiURL + opts.baseURL || 'https://api.hollaex.com/v0'
		this._accessToken = opts.accessToken || ''
		this._headers = {
			'content-type': 'application/json',
			Accept: 'application/json',
			Authorization: 'Bearer ' + this._accessToken 
		}
	}

	getTicker(symbol) {
		return createRequest('GET', `${this._url}/ticker?symbol=${symbol}`, this._headers);
	}

	getUser() {
		return createRequest('GET', `${this._url}/user`, this._headers);
	}

	/********************************************************************* TO BE ADDED MORE... */
}

module.exports = HollaEx;