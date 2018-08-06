const  { createRequest } = require('./utils');

class HollaEx  {
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



	// Data
	getTicker(symbol) {
		return createRequest('GET', `${this._url}/ticker?symbol=${symbol}`, this._headers);
	}



	// Deposit



	// Orderbook



	// Public



	// Token



	// User



	// Wallet



	// Withdraw

	getOrderbook(symbol) {
		return createRequest ('GET' , `${this._url}/orderbooks?symbol=${symbol}` , this._headers);
	}

	getTrades(symbol) {
		return createRequest ('GET', `${this._url}/trades?symbol=${symbol}` , this._headers )
	}

	getUser() {
		return createRequest('GET', `${this._url}/user`, this._headers);
	}

	getBalance() {
		return createRequest('GET',`${this._url}/user/balance` , this._headers);
	}

	createOrder(symbol, side, size, type, price) {
		let data = {symbol, side, size, type, price};
		return createRequest('POST',`${this._url}/order` , this._headers, data);
	}

	getOrder(orderId) {
		return createRequest('GET',`${this._url}/user/orders/${orderId}` , this._headers);
	}

	getAllOrders(symbol='') {
		return createRequest('GET',`${this._url}/user/orders?symbol=${symbol}` , this._headers);
	}

	cancelOrder(orderId) {
		return createRequest('DELETE',`${this._url}/user/orders/${orderId}` , this._headers);
	}

	cancelAllOrders(symbol='') {
		let data = {symbol};
		return createRequest('DELETE',`${this._url}/user/orders?symbol=${symbol}` , this._headers);
	}




	/********************************************************************* TO BE ADDED MORE... */
}

module.exports = HollaEx;
