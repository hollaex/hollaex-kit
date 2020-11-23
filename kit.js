'use strict';

const WebSocket = require('ws');
const EventEmitter = require('events');
const moment = require('moment');
const { createRequest, createSignature, generateHeaders } = require('./utils');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const { each, union } = require('lodash');

class HollaExKit {
	constructor(
		opts = {
			apiURL: 'https://api.hollaex.com',
			baseURL: '/v2',
			apiKey: '',
			apiSecret: '',
			apiExpiresAfter: 60,
		}
	) {
		this.apiUrl = opts.apiURL || 'https://api.hollaex.com';
		this.baseUrl = opts.baseURL || '/v2';
		this.apiKey = opts.apiKey;
		this.apiSecret = opts.apiSecret;
		this.apiExpiresAfter = opts.apiExpiresAfter || 60;
		this.headers = {
			'content-type': 'application/json',
			Accept: 'application/json',
			'api-key': opts.apiKey,
		};
	}

	/* Public Endpoints*/

	/**
	 * Retrieve last, high, low, open and close price and volume within last 24 hours
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @return {string} A stringified JSON object with keys high(number), low(number), open(number), close(number), volume(number), last(number)
	 */
	getTicker(symbol) {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/ticker?symbol=${symbol}`,
			this.headers
		);
	}

	/**
	 * Retrieve orderbook containing lists of up to the last 20 bids and asks
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt', leave empty to get orderbook for all symbol-pairs
	 * @return {string} A stringified JSON object with the symbol-pairs as keys where the values are objects with keys bids(array of active buy orders), asks(array of active sell orders), and timestamp(string)
	 */
	getOrderbook(symbol = '') {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/orderbooks?symbol=${symbol}`,
			this.headers
		);
	}

	/**
	 * Retrieve list of up to the last 50 trades
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt', leave empty to get trades for all symbol-pairs
	 * @return {string} A stringified JSON object with the symbol-pairs as keys where the values are arrays of objects with keys size(number), price(number), side(string), and timestamp(string)
	 */
	getTrade(symbol = '') {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/trades?symbol=${symbol}`,
			this.headers
		);
	}

	/**
	 * Retrieve tick size, min price, max price, min size, and max size of each symbol-pair
	 * @return {string} A stringified JSON object with the keys pairs(information on each symbol-pair such as tick_size, min/max price, and min/max size) and currencies(array of all currencies involved in hollaEx)
	 */
	getConstant() {
		return createRequest('GET', `${this.apiUrl}${this.baseUrl}/constant`, this.headers);
	}

	/* Private Endpoints*/

	/**
	 * Retrieve user's personal information
	 * @return {string} A stringified JSON object showing user's information such as id, email, bank_account, crypto_wallet, balance, etc
	 */
	getUser() {
		const verb = 'GET';
		const path = `${this.baseUrl}/user`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Retrieve user's wallet balance
	 * @return {string} A stringified JSON object with the keys updated_at(string), usdt_balance(number), usdt_pending(number), usdt_available(number), hex_balance, hex_pending, hex_available, eth_balance, eth_pending, eth_available, bch_balance, bch_pending, bch_available
	 */
	getBalance() {
		const verb = 'GET';
		const path = `${this.baseUrl}/user/balance`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Retrieve list of the user's deposits
	 * @param {string} currency The currency to filter by, pass undefined to receive data on all currencies
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: asc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {string} A stringified JSON object with the keys count(total number of user's deposits) and data(array of deposits as objects with keys id(number), type(string), amount(number), transaction_id(string), currency(string), created_at(string), status(boolean), fee(number), dismissed(boolean), rejected(boolean), description(string))
	 */
	getDeposit(currency, limit = 50, page = 1, orderBy = 'id', order = 'asc', startDate = 0, endDate = moment().toISOString()) {
		const verb = 'GET';
		let path = `${this.baseUrl}/user/deposits?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date=${endDate}`;
		if (currency) {
			path += `&currency=${currency}`;
		}
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/****** Withdrawals ******/
	/**
	 * Retrieve list of the user's withdrawals
	 * @param {string} currency The currency to filter by, pass undefined to receive data on all currencies
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: asc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {string} A stringified JSON object with the keys count(total number of user's withdrawals) and data(array of withdrawals as objects with keys id(number), type(string), amount(number), transaction_id(string), currency(string), created_at(string), status(boolean), fee(number), dismissed(boolean), rejected(boolean), description(string))
	 */
	getWithdrawal(currency, limit = 50, page = 1, orderBy = 'id', order = 'asc', startDate = 0, endDate = moment().toISOString()) {
		const verb = 'GET';
		let path = `${this.baseUrl}/user/withdrawals?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date=${endDate}`;
		if (currency) {
			path += `&currency=${currency}`;
		}
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Make a withdrawal request
	 * @param {string} currency - The currency to withdrawal
	 * @param {number} amount - The amount of currency to withdrawal
	 * @param {string} address - The recipient's wallet address
	 * @return {string} A stringified JSON object {message:"Success"}
	 */
	requestWithdrawal(currency, amount, address) {
		const verb = 'POST';
		const path = `${this.baseUrl}/user/request-withdrawal`;
		const data = { currency, amount, address };
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers,
			data
		);
	}

	/**
	 * Retrieve list of the user's completed trades
	 * @param {string} symbol The symbol-pair to filter by, pass undefined to receive data on all currencies
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: desc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {string} A stringified JSON object with the keys count(total number of user's completed trades) and data(array of up to the user's last 50 completed trades as objects with keys side(string), symbol(string), size(number), price(number), timestamp(string), and fee(number))
	 */
	getUserTrade(symbol, limit = 50, page = 1, orderBy = 'id', order = 'desc', startDate = 0, endDate = moment().toISOString()) {
		const verb = 'GET';
		let path = `${this.baseUrl}/user/trades?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date${endDate}`;
		if (symbol) {
			path += `&symbol=${symbol}`;
		}
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/****** Orders ******/
	/**
	 * Retrieve information of a user's specific order
	 * @param {string} orderId - The id of the desired order
	 * @return {string} The selected order as a stringified JSON object with keys created_at(string), title(string), symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), filled(number)
	 */
	getOrder(orderId) {
		const verb = 'GET';
		const path = `${this.baseUrl}/user/order?order_id=${orderId}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Retrieve information of all the user's active orders
	 * @param {string} symbol - The currency pair symbol to filter by e.g. 'hex-usdt', leave empty to retrieve information of orders of all symbols
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: desc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {string} A stringified JSON array of objects containing the user's active orders
	 */
	getAllOrder(symbol, limit = 50, page = 1, orderBy = 'id', order = 'desc', startDate = 0, endDate = moment().toISOString()) {
		const verb = 'GET';
		let path = `${this.baseUrl}/user/orders?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date${endDate}`;
		if (symbol) {
			path += `&symbol=${symbol}`;
		}
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Create a new order
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @param {string} side - The side of the order e.g. 'buy', 'sell'
	 * @param {number} size - The amount of currency to order
	 * @param {string} type - The type of order to create e.g. 'market', 'limit'
	 * @param {number} price - The price at which to order (only required if type is 'limit')
	 * @return {string} The new order as a stringified JSON object with keys symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), and filled(number)
	 */
	createOrder(symbol, side, size, type, price) {
		const verb = 'POST';
		const path = `${this.baseUrl}/order`;
		const data = { symbol, side, size, type, price };
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);
		return createRequest(verb, `${this.apiUrl}${path}`, headers, data);
	}

	/**
	 * Cancel a user's specific order
	 * @param {string} orderId - The id of the order to be cancelled
	 * @return {string} The cancelled order as a stringified JSON object with keys symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), and filled(number)
	 */
	cancelOrder(orderId) {
		const verb = 'DELETE';
		const path = `${this.baseUrl}/user/order?order_id=${orderId}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Cancel all the user's active orders, can filter by currency pair symbol
	 * @param {string} symbol - The currency pair symbol to filter by e.g. 'hex-usdt', leave empty to cancel orders of all symbols
	 * @return {string} A stringified JSON array of objects containing the cancelled orders
	 */
	cancelAllOrder(symbol) {
		const verb = 'DELETE';
		let path = `${this.baseUrl}/user/orders`;
		if (symbol) {
			path += `?symbol=${symbol}`;
		}
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);
		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Connect to hollaEx websocket and listen to an event
	 * @param {string} event - The event to listen to
	 * @return {class} A new socket class that listens to the hollaEx websocket server and emits the event being passed
	 */
	connect(events = []) {
		const [ protocol, endpoint ] = this.apiUrl.split('://');
		const wsUrl = protocol === 'https'
			? `wss://${endpoint}/stream`
			: `ws://${endpoint}/stream`;

		const apiExpires = moment().toISOString() + this.apiExpiresAfter;
		const signature = createSignature(this.apiSecret, 'CONNECT', '/stream', apiExpires);
		return new Socket(events, wsUrl, this.apiKey, signature, apiExpires);
	}
}

/**************************************
Websocket
**************************************/
class Socket extends EventEmitter {
	constructor(events, url, apiKey, apiSignature, apiExpires) {
		super();
		this.url = url;
		this.apiKey = apiKey;
		this.apiSignature = apiSignature;
		this.apiExpires = apiExpires;
		if (this.apiKey && this.apiSignature && this.apiExpires) {
			this.url = `${this.url}?api-key=${this.apiKey}&api-signature=${this.apiSignature}&api-expires=${this.apiExpires}`;
		}
		this.reconnectInterval = 5000; // 5 seconds
		this.ws = null;
		this.events = [];
		this.reconnect = true;
		this.connect(events);
	}

	disconnect() {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.reconnect = false;
			this.removeAllListeners();
			this.ws.close();
		}
	}

	connect(events) {
		this.ws = new WebSocket(this.url);

		this.ws.on('unexpected-response', (data) => {
			this.emit('error', data);
			if (this.ws.readyState === WebSocket.OPEN) {
				this.ws.close();
			} else {
				this.ws = null;
			}
		});

		this.ws.on('error', (error) => {
			this.emit('error', error);
			if (this.ws.readyState === WebSocket.OPEN) {
				this.ws.close();
			} else {
				this.ws = null;
			}
		});

		this.ws.on('close', () => {
			this.ws = null;
			this.emit('close');
			if (this.reconnect) {
				setTimeout(() => {
					this.connect(this.events);
				}, this.reconnectInterval);
			}
		});

		this.ws.on('open', () => {
			this.emit('open');

			this.ws.on('message', (data) => {
				try {
					data = JSON.parse(data);
				} catch (err) {
					this.emit('error', err.message);
				}
				this.emit('message', data);
			});

			if (events.length > 0) {
				this.ws.subscribe(events);
			}

			setWsHeartbeat(this.ws, JSON.stringify({ 'op': 'ping' }), {
				pingTimeout: 60000,
				pingInterval: 25000,
			});
		});
	}

	subscribe(events) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			each(events, (event) => {
				const [ topic, symbol ] = event.split(':');
				switch(topic) {
					case 'public':
						if (symbol) {
							this.ws.send(JSON.stringify({
								op: 'subscribe',
								args: [`orderbook:${symbol}`, `trade:${symbol}`]
							}));
						} else {
							this.ws.send(JSON.stringify({
								op: 'subscribe',
								args: ['orderbook', 'trade']
							}));
						}
						this.events = union(this.events, [event]);
						break;
					case 'private':
						this.ws.send(JSON.stringify({
							op: 'subscribe',
							args: ['order', 'wallet']
						}));
						this.events = union(this.events, [event]);
						break;
					case 'all':
						this.ws.send(JSON.stringify({
							op: 'subscribe',
							args: ['orderbook', 'trade', 'order', 'wallet']
						}));
						this.events = union(this.events, [event]);
						break;
					case 'orderbook':
					case 'trade':
						if (symbol) {
							this.ws.send(JSON.stringify({
								op: 'subscribe',
								args: [`${topic}:${symbol}`]
							}));
						} else {
							this.ws.send(JSON.stringify({
								op: 'subscribe',
								args: [topic]
							}));
						}
						this.events = union(this.events, [event]);
						break;
					case 'order':
					case 'wallet':
					case 'deposit':
						this.ws.send(JSON.stringify({
							op: 'subscribe',
							args: [topic]
						}));
						this.events = union(this.events, [event]);
						break;
					default:
						break;
				}
			});
		}
	}

	unsubscribe(events) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			each(events, (event) => {
				const [ topic, symbol ] = event.split(':');
				switch(topic) {
					case 'public':
						if (symbol) {
							this.ws.send(JSON.stringify({
								op: 'unsubscribe',
								args: [`orderbook:${symbol}`, `trade:${symbol}`]
							}));
						} else {
							this.ws.send(JSON.stringify({
								op: 'unsubscribe',
								args: ['orderbook', 'trade']
							}));
						}
						this.events = this.events.filter((e) => e !== event);
						break;
					case 'private':
						this.ws.send(JSON.stringify({
							op: 'unsubscribe',
							args: ['order', 'wallet']
						}));
						this.events = this.events.filter((e) => e !== event);
						break;
					case 'all':
						this.ws.send(JSON.stringify({
							op: 'unsubscribe',
							args: ['orderbook', 'trade', 'order', 'wallet']
						}));
						this.events = this.events.filter((e) => e !== event);
						break;
					case 'orderbook':
					case 'trade':
						if (symbol) {
							this.ws.send(JSON.stringify({
								op: 'unsubscribe',
								args: [`${topic}:${symbol}`]
							}));
						} else {
							this.ws.send(JSON.stringify({
								op: 'unsubscribe',
								args: [topic]
							}));
						}
						this.events = this.events.filter((e) => e !== event);
						break;
					case 'order':
					case 'wallet':
					case 'deposit':
						this.ws.send(JSON.stringify({
							op: 'unsubscribe',
							args: [topic]
						}));
						this.events = this.events.filter((e) => e !== event);
						break;
					default:
						break;
				}
			});
		}
	}

	close() {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.close();
		}
	}
}

module.exports = HollaExKit;
