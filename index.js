var Promise = require('bluebird');
var io = require('socket.io-client');
const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const  { createRequest } = require('./utils');


class HollaEx  {
	constructor(opts = {
		apiURL: 'https://api.hollaex.com',
		baseURL: '/v0',
		accessToken: ''
	}) {
		this._url = opts.apiURL + opts.baseURL || 'https://api.hollaex.com/v0'
		this._wsUrl = opts.apiURL || 'https://api.hollaex.com'
		this._accessToken = opts.accessToken || ''
		this._headers = {
			'content-type': 'application/json',
			Accept: 'application/json',
			Authorization: 'Bearer ' + this._accessToken
		}
	}

	/* Public */
 	/* events: ticker, orderbooks, trades */

	// Ticker
	getTicker(symbol) {
		return createRequest('GET', `${this._url}/ticker?symbol=${symbol}`, this._headers);
	}
	
	// Orderbook
	getOrderbook(symbol) {
		return createRequest ('GET' , `${this._url}/orderbooks?symbol=${symbol}` , this._headers);
	}
	
	// Trades
	getTrade(symbol) {
		return createRequest ('GET', `${this._url}/trades?symbol=${symbol}` , this._headers )
	}

	/*********************************************************************************************************

	/* Private */
	/* events: user,balance,deposits,withdrawals,trades */

	// User
	getUser() {
		return createRequest('GET', `${this._url}/user`, this._headers);
	}
	
	// Balance
	getBalance() {
		return createRequest('GET',`${this._url}/user/balance` , this._headers);
	}
	
	// Deposits
	getDeposit() {
		return createRequest('GET',`${this._url}/user/deposits` , this._headers);
	}
	
	// Withdrawal
	getWithdrawal() {
		return createRequest('GET',`${this._url}/user/withdrawals` , this._headers);
	}
	
	// Trades
	getUserTrade() {
		return createRequest('GET',`${this._url}/user/trades` , this._headers);
	}

	/****** Orders ******/
	getOrder(orderId) {
		return createRequest('GET',`${this._url}/user/orders/${orderId}` , this._headers);
	}

	getAllOrder(symbol='') {
		return createRequest('GET',`${this._url}/user/orders?symbol=${symbol}` , this._headers);
	}

	createOrder(symbol, side, size, type, price) {
		let data = {symbol, side, size, type, price};
		return createRequest('POST',`${this._url}/order` , this._headers, data);
	}

	cancelOrder(orderId) {
		return createRequest('DELETE',`${this._url}/user/orders/${orderId}` , this._headers);
	}

	cancelAllOrder(symbol='') {
		let data = {symbol};
		return createRequest('DELETE',`${this._url}/user/orders?symbol=${symbol}` , this._headers);
	}

	// connect to websocket
	connectSocket(events) {
		return new Socket(events, this._wsUrl, this._accessToken);
	}
}


/*******************
Websocket
*******************/
class Socket extends EventEmitter {
	constructor(events='', url, accessToken) {
		super();
		if (!Array.isArray(events)) {
			let listeners = [];
			let ioLink;
			events = events.split(":");
			let [event, symbol] = events
			switch (event) {
				case 'orderbook':
				case 'trades':
				case 'ticker':
					if (symbol) {
						ioLink = io(`${url}/realtime`, {query: { symbol }});
					} else {
						ioLink = io(`${url}/realtime`);
					}
					listeners.push(ioLink);				
					listeners[listeners.length-1].on(event, (data) => {
						this.emit(event, data)
					});
				break;
				case 'chart':
					if (symbol) {
						ioLink = io(`${url}/chart`, {query: { symbol }});
					} else {
						ioLink = io(`${url}/chart`);
					}
					listeners.push(ioLink);		
					listeners[listeners.length-1].on("data", (data) => {
						this.emit(event, data)
					});
					listeners[listeners.length-1].on("ticker", (data) => {
						this.emit(event, data)
					});
				break;
				case 'user':
					ioLink = io(`${url}/user`, {query: {token: `Bearer ${accessToken}`}});

					listeners.push(ioLink);
					listeners[listeners.length-1].on("user", (data) => {
						this.emit("userInfo", data)
					});
					listeners[listeners.length-1].on("wallet", (data) => {
						this.emit("userWallet", data)
					});
					listeners[listeners.length-1].on("orders", (data) => {
						this.emit("userOrder", data)
					});
					listeners[listeners.length-1].on("trades", (data) => {
						this.emit("userTrades", data)
					});
					listeners[listeners.length-1].on("update", (data) => {
						this.emit("userUpdate", data)
					});
				break;
				case 'all':
					ioLink = io(`${url}/realtime`);
					
					listeners.push(ioLink);				
					listeners[listeners.length-1].on("orderbook", (data) => {
						this.emit("orderbook", data)
					});
					listeners[listeners.length-1].on("ticker", (data) => {
						this.emit("ticker", data)
					});
					listeners[listeners.length-1].on("trades", (data) => {
						this.emit("trades", data)
					});

					ioLink = io(`${url}/chart`);
					
					listeners.push(ioLink);		
					listeners[listeners.length-1].on("data", (data) => {
						this.emit(event, data)
					});
					listeners[listeners.length-1].on("ticker", (data) => {
						this.emit(event, data)
					});

					ioLink = io(`${url}/user`, {query: {token: `Bearer ${accessToken}`}});

					listeners.push(ioLink);
					listeners[listeners.length-1].on("user", (data) => {
						this.emit("userInfo", data)
					});
					listeners[listeners.length-1].on("wallet", (data) => {
						this.emit("userWallet", data)
					});
					listeners[listeners.length-1].on("orders", (data) => {
						this.emit("userOrder", data)
					});
					listeners[listeners.length-1].on("trades", (data) => {
						this.emit("userTrade", data)
					});
					listeners[listeners.length-1].on("update", (data) => {
						this.emit("userUpdate", data)
					});
				break;
			}
		}
	}
}

module.exports = HollaEx;
