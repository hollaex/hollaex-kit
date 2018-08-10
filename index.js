const  { createRequest } = require('./utils');

const io = require('socket.io-client');
const socket = io('http://api.hollaex.com/realtime');

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

	connectSocket() {
		this.publicSocket = io(`https://api.hollaex.com/realtime`, {
			// if you dont pass anything it will return all symbols
			query: {
				symbol: 'btc-eur'
			}
		});
		this.publicSocket.on('trades', (data) => {
			console.log(data)
		});
		this.publicSocket.on('orderbook', (data) => {
			console.log(data)
		});
	}

	connectPrivateSocket() {
		// need to pass user token in the query
	}


	/* Public */

	// Ticker
	getTickers(symbol) {
		return createRequest('GET', `${this._url}/ticker?symbol=${symbol}`, this._headers);
	}

	// Orderbook
	getOrderbooks(symbol) {
		return createRequest ('GET' , `${this._url}/orderbooks?symbol=${symbol}` , this._headers);
	}

	// Trades
	getTrades(symbol) {
		return createRequest ('GET', `${this._url}/trades?symbol=${symbol}` , this._headers )
	}

	/*********************************************************************************************************

	/* Private */

	// User
	getUser() {
		return createRequest('GET', `${this._url}/user`, this._headers);
	}

	// Balance
	getBalance() {
		return createRequest('GET',`${this._url}/user/balance` , this._headers);
	}

	// Deposits
	getDeposits() {
		return createRequest('GET',`${this._url}/user/deposits` , this._headers);
	}

	// Withdrawal
	getWithdrawals() {
		return createRequest('GET',`${this._url}/user/withdrawals` , this._headers);
	}

	// Trades
	getUserTrades() {
		return createRequest('GET',`${this._url}/user/trades` , this._headers);
	}

	// Orders
	getOrder(orderId) {
		return createRequest('GET',`${this._url}/user/orders/${orderId}` , this._headers);
	}

	getAllOrders(symbol='') {
		return createRequest('GET',`${this._url}/user/orders?symbol=${symbol}` , this._headers);
	}

	createOrder(symbol, side, size, type, price) {
		let data = {symbol, side, size, type, price};
		return createRequest('POST',`${this._url}/order` , this._headers, data);
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
