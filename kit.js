'use strict';

const WebSocket = require('ws');
const moment = require('moment');
const { createRequest, createSignature, generateHeaders } = require('./utils');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const { each, union, isNumber, isString, isPlainObject, isBoolean } = require('lodash');

class HollaExKit {
	constructor(
		opts = {
			apiURL: 'https://api.hollaex.com',
			baseURL: '/v2',
			apiKey: '',
			apiSecret: '',
			apiExpiresAfter: 60
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
			'api-key': opts.apiKey
		};
		this.ws = null;
		const [protocol, endpoint] = this.apiUrl.split('://');
		this.wsUrl =
			protocol === 'https'
				? `wss://${endpoint}/stream`
				: `ws://${endpoint}/stream`;
		this.wsEvents = [];
		this.wsReconnect = true;
		this.wsReconnectInterval = 5000;
		this.wsEventListeners = null;
		this.wsConnected = () => this.ws && this.ws.readyState === WebSocket.OPEN;
	}

	/* Public Endpoints*/

	/**
	 * Get exchange information
	 * @return {object} A json object with the exchange information
	 */
	getKit() {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/kit`,
			this.headers
		);
	}

	/**
	 * Retrieve last, high, low, open and close price and volume within last 24 hours for a symbol
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @return {object} A JSON object with keys high(number), low(number), open(number), close(number), volume(number), last(number)
	 */
	getTicker(symbol = '') {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/ticker?symbol=${symbol}`,
			this.headers
		);
	}

	/**
	 * Retrieve last, high, low, open and close price and volume within last 24 hours for all symbols
	 * @return {object} A JSON object with symbols as keys which contain high(number), low(number), open(number), close(number), volume(number), last(number)
	 */
	getTickers() {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/tickers`,
			this.headers
		);
	}

	/**
	 * Retrieve orderbook containing lists of up to the last 20 bids and asks for a symbol
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @return {object} A JSON object with keys bids(array of active buy orders), asks(array of active sell orders), and timestamp(string)
	 */
	getOrderbook(symbol = '') {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/orderbook?symbol=${symbol}`,
			this.headers
		);
	}

	/**
	 * Retrieve orderbook containing lists of up to the last 20 bids and asks for all symbols
	 * @return {object} A JSON object with the symbol-pairs as keys where the values are objects with keys bids(array of active buy orders), asks(array of active sell orders), and timestamp(string)
	 */
	getOrderbooks() {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/orderbooks`,
			this.headers
		);
	}

	/**
	 * Retrieve list of up to the last 50 trades
	 * @param {object} opts - Optional parameters
	 * @param {string} opts.symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @return {object} A JSON object with the symbol-pairs as keys where the values are arrays of objects with keys size(number), price(number), side(string), and timestamp(string)
	 */
	getTrades(opts = { symbol: null }) {
		let path = `${this.apiUrl}${this.baseUrl}/trades`;

		if (isString(opts.symbol)) {
			path += `?symbol=${opts.symbol}`;
		}

		return createRequest('GET', path, this.headers);
	}

	/**
	 * Retrieve tick size, min price, max price, min size, and max size of each symbol-pair
	 * @return {object} A JSON object with the keys pairs(information on each symbol-pair such as tick_size, min/max price, and min/max size) and currencies(array of all currencies involved in hollaEx)
	 */
	getConstants() {
		return createRequest(
			'GET',
			`${this.apiUrl}${this.baseUrl}/constants`,
			this.headers
		);
	}

	/* Private Endpoints*/

	/**
	 * Retrieve user's personal information
	 * @return {string} A JSON object showing user's information such as id, email, bank_account, crypto_wallet, balance, etc
	 */
	getUser() {
		const verb = 'GET';
		const path = `${this.baseUrl}/user`;
		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Retrieve user's wallet balance
	 * @return {object} A JSON object with the keys updated_at(string), usdt_balance(number), usdt_pending(number), usdt_available(number), hex_balance, hex_pending, hex_available, eth_balance, eth_pending, eth_available, bch_balance, bch_pending, bch_available
	 */
	getBalance() {
		const verb = 'GET';
		const path = `${this.baseUrl}/user/balance`;
		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Retrieve list of the user's deposits
	 * @param {object} opts - Optional parameters
	 * @param {string} opts.currency - The currency to filter by, pass undefined to receive data on all currencies
	 * @param {boolean} opts.status - Confirmed status of the deposits to get. Leave blank to get all confirmed and unconfirmed deposits
	 * @param {boolean} opts.dismissed - Dismissed status of the deposits to get. Leave blank to get all dismissed and undismissed deposits
	 * @param {boolean} opts.rejected - Rejected status of the deposits to get. Leave blank to get all rejected and unrejected deposits
	 * @param {boolean} opts.processing - Processing status of the deposits to get. Leave blank to get all processing and unprocessing deposits
	 * @param {boolean} opts.waiting - Waiting status of the deposits to get. Leave blank to get all waiting and unwaiting deposits
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: asc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @param {string} opts.transactionId - Deposits with specific transaction ID.
	 * @param {string} opts.address - Deposits with specific address.
	 * @return {object} A JSON object with the keys count(total number of user's deposits) and data(array of deposits as objects with keys id(number), type(string), amount(number), transaction_id(string), currency(string), created_at(string), status(boolean), fee(number), dismissed(boolean), rejected(boolean), description(string))
	 */
	getDeposits(
		opts = {
			currency: null,
			status: null,
			dismissed: null,
			rejected: null,
			processing: null,
			waiting: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'asc',
			startDate: 0,
			endDate: moment().toISOString(),
			transactionId: null,
			address: null
		}
	) {
		const verb = 'GET';
		let path = `${this.baseUrl}/user/deposits?`;

		if (isString(opts.currency)) {
			path += `&currency=${opts.currency}`;
		}

		if (isNumber(opts.limit)) {
			path += `&limit=${opts.limit}`;
		}

		if (isNumber(opts.page)) {
			path += `&page=${opts.page}`;
		}

		if (isString(opts.orderBy)) {
			path += `&order_by=${opts.orderBy}`;
		}

		if (isString(opts.order)) {
			path += `&order=${opts.order}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		}

		if (isString(opts.address)) {
			path += `&address=${opts.address}`;
		}

		if (isString(opts.transactionId)) {
			path += `&transaction_id=${opts.transactionId}`;
		}

		if (isBoolean(opts.status)) {
			path += `&status=${opts.status}`;
		}

		if (isBoolean(opts.dismissed)) {
			path += `&dismissed=${opts.dismissed}`;
		}

		if (isBoolean(opts.rejected)) {
			path += `&rejected=${opts.rejected}`;
		}

		if (isBoolean(opts.processing)) {
			path += `&processing=${opts.processing}`;
		}

		if (isBoolean(opts.waiting)) {
			path += `&waiting=${opts.waiting}`;
		}

		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/****** Withdrawals ******/
	/**
	 * Retrieve list of the user's withdrawals
	 * @param {object} opts - Optional parameters
	 * @param {string} opts.currency - The currency to filter by, pass undefined to receive data on all currencies
	 * @param {boolean} opts.status - Confirmed status of the withdrawals to get. Leave blank to get all confirmed and unconfirmed withdrawals
	 * @param {boolean} opts.dismissed - Dismissed status of the withdrawals to get. Leave blank to get all dismissed and undismissed withdrawals
	 * @param {boolean} opts.rejected - Rejected status of the withdrawals to get. Leave blank to get all rejected and unrejected withdrawals
	 * @param {boolean} opts.processing - Processing status of the withdrawals to get. Leave blank to get all processing and unprocessing withdrawals
	 * @param {boolean} opts.waiting - Waiting status of the withdrawals to get. Leave blank to get all waiting and unwaiting withdrawals
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: asc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @param {string} opts.transactionId - Withdrawals with specific transaction ID.
	 * @param {string} opts.address - Withdrawals with specific address.
	 * @return {object} A JSON object with the keys count(total number of user's withdrawals) and data(array of withdrawals as objects with keys id(number), type(string), amount(number), transaction_id(string), currency(string), created_at(string), status(boolean), fee(number), dismissed(boolean), rejected(boolean), description(string))
	 */
	getWithdrawals(
		opts = {
			currency: null,
			status: null,
			dismissed: null,
			rejected: null,
			processing: null,
			waiting: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'asc',
			startDate: 0,
			endDate: moment().toISOString(),
			transactionId: null,
			address: null
		}
	) {
		const verb = 'GET';
		let path = `${this.baseUrl}/user/withdrawals?`;

		if (isString(opts.currency)) {
			path += `&currency=${opts.currency}`;
		}

		if (isNumber(opts.limit)) {
			path += `&limit=${opts.limit}`;
		}

		if (isNumber(opts.page)) {
			path += `&page=${opts.page}`;
		}

		if (isString(opts.orderBy)) {
			path += `&order_by=${opts.orderBy}`;
		}

		if (isString(opts.order)) {
			path += `&order=${opts.order}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		}

		if (isString(opts.address)) {
			path += `&address=${opts.address}`;
		}

		if (isString(opts.transactionId)) {
			path += `&transaction_id=${opts.transactionId}`;
		}

		if (isBoolean(opts.status)) {
			path += `&status=${opts.status}`;
		}

		if (isBoolean(opts.dismissed)) {
			path += `&dismissed=${opts.dismissed}`;
		}

		if (isBoolean(opts.rejected)) {
			path += `&rejected=${opts.rejected}`;
		}

		if (isBoolean(opts.processing)) {
			path += `&processing=${opts.processing}`;
		}

		if (isBoolean(opts.waiting)) {
			path += `&waiting=${opts.waiting}`;
		}

		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Make a withdrawal request
	 * @param {string} currency - The currency to withdrawal
	 * @param {number} amount - The amount of currency to withdrawal
	 * @param {string} address - The recipient's wallet address
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.network - Crypto network of currency being withdrawn.
	 * @param {string} opts.otpCode - Otp code for user if otp is enabled.
	 * @return {object} A JSON object {message:"Success"}
	 */
	requestWithdrawal(currency, amount, address, opts = {
		network: null,
		otpCode: null
	}) {
		const verb = 'POST';
		const path = `${this.baseUrl}/user/request-withdrawal`;
		const data = {
			currency,
			amount,
			address
		};

		if (opts.network) {
			data.otp_code = opts.otpCode;
		}

		if (opts.network) {
			data.network = opts.network;
		}

		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers, data);
	}

	/**
	 * Retrieve list of the user's completed trades
	 * @param {object} opts - Optional parameters
	 * @param {string} opts.symbol - The symbol-pair to filter by, pass undefined to receive data on all currencies
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} A JSON object with the keys count(total number of user's completed trades) and data(array of up to the user's last 50 completed trades as objects with keys side(string), symbol(string), size(number), price(number), timestamp(string), and fee(number))
	 */
	getUserTrades(
		opts = {
			symbol: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'desc',
			startDate: 0,
			endDate: moment().toISOString()
		}
	) {
		const verb = 'GET';
		let path = `${this.baseUrl}/user/trades?`;

		if (isString(opts.symbol)) {
			path += `&symbol=${opts.symbol}`;
		}

		if (isNumber(opts.limit)) {
			path += `&limit=${opts.limit}`;
		}

		if (isNumber(opts.page)) {
			path += `&page=${opts.page}`;
		}

		if (isString(opts.orderBy)) {
			path += `&order_by=${opts.orderBy}`;
		}

		if (isString(opts.order)) {
			path += `&order=${opts.order}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		}

		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/****** Orders ******/
	/**
	 * Retrieve information of a user's specific order
	 * @param {string} orderId - The id of the desired order
	 * @return {object} The selected order as a JSON object with keys created_at(string), title(string), symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), filled(number)
	 */
	getOrder(orderId) {
		const verb = 'GET';
		const path = `${this.baseUrl}/order?order_id=${orderId}`;
		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Retrieve information of all the user's active orders
	 * @param {object} opts - Optional parameters
	 * @param {string} opts.symbol - The currency pair symbol to filter by e.g. 'hex-usdt', leave empty to retrieve information of orders of all symbols
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} A JSON array of objects containing the user's active orders
	 */
	getOrders(
		opts = {
			symbol: null,
			side: null,
			status: null,
			open: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'desc',
			startDate: 0,
			endDate: moment().toISOString()
		}
	) {
		const verb = 'GET';
		let path = `${this.baseUrl}/orders?`;

		if (isString(opts.symbol)) {
			path += `&symbol=${opts.symbol}`;
		}

		if (isString(opts.side) && (opts.side.toLowerCase() === 'buy' || opts.side.toLowerCase() === 'sell')) {
			path += `&side=${opts.side}`;
		}

		if (isString(opts.status)) {
			path += `&status=${opts.status}`;
		}

		if (isBoolean(opts.open)) {
			path += `&open=${opts.open}`;
		}

		if (isNumber(opts.limit)) {
			path += `&limit=${opts.limit}`;
		}

		if (isNumber(opts.page)) {
			path += `&page=${opts.page}`;
		}

		if (isString(opts.orderBy)) {
			path += `&order_by=${opts.orderBy}`;
		}

		if (isString(opts.order)) {
			path += `&order=${opts.order}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		}

		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Create a new order
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @param {string} side - The side of the order e.g. 'buy', 'sell'
	 * @param {number} size - The amount of currency to order
	 * @param {string} type - The type of order to create e.g. 'market', 'limit'
	 * @param {number} price - The price at which to order (only required if type is 'limit')
	 * @param {object} opts - Optional parameters
	 * @param {number} opts.stop - Stop order price
	 * @param {object} opts.meta - Additional meta parameters in an object
	 * @param {boolean} opts.meta.post_only - Whether or not the order should only be made if market maker.
	 * @param {string} opts.meta.note - Additional note to add to order data.
	 * @return {object} The new order as a JSON object with keys symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), and filled(number)
	 */
	createOrder(
		symbol,
		side,
		size,
		type,
		price = 0,
		opts = {
			stop: null,
			meta: null
		}
	) {
		const verb = 'POST';
		const path = `${this.baseUrl}/order`;
		const data = { symbol, side, size, type, price };

		if (isPlainObject(opts.meta)) {
			data.meta = opts.meta;
		}

		if (isNumber(opts.stop)) {
			data.stop = opts.stop;
		}

		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers, data);
	}

	/**
	 * Cancel a user's specific order
	 * @param {string} orderId - The id of the order to be cancelled
	 * @return {object} The cancelled order as a JSON object with keys symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), and filled(number)
	 */
	cancelOrder(orderId) {
		const verb = 'DELETE';
		const path = `${this.baseUrl}/order?order_id=${orderId}`;
		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Cancel all the user's active orders, can filter by currency pair symbol
	 * @param {object} opts - Optional parameters
	 * @param {string} opts.symbol - The currency pair symbol to filter by e.g. 'hex-usdt', leave empty to cancel orders of all symbols
	 * @return {array} A JSON array of objects containing the cancelled orders
	 */
	cancelAllOrders(opts = { symbol: null }) {
		const verb = 'DELETE';
		let path = `${this.baseUrl}/order/all`;

		if (isString(opts.symbol)) {
			path += `?symbol=${opts.symbol}`;
		}

		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);
		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Connect to hollaEx websocket and listen to an event
	 * @param {array} events - The events to listen to
	 */
	connect(events = []) {
		this.wsReconnect = true;
		this.wsEvents = events;
		this.initialConnection = true;
		let url = this.wsUrl;
		if (this.apiKey && this.apiSecret) {
			const apiExpires = moment().unix() + this.apiExpiresAfter;
			const signature = createSignature(
				this.apiSecret,
				'CONNECT',
				'/stream',
				apiExpires
			);
			url = `${url}?api-key=${
				this.apiKey
			}&api-signature=${signature}&api-expires=${apiExpires}`;
		}

		this.ws = new WebSocket(url);

		if (this.wsEventListeners) {
			this.ws._events = this.wsEventListeners;
		} else {
			this.ws.on('unexpected-response', () => {
				if (this.ws.readyState !== WebSocket.CLOSING) {
					if (this.ws.readyState === WebSocket.OPEN) {
						this.ws.close();
					} else if (this.wsReconnect) {
						this.wsEventListeners = this.ws._events;
						this.ws = null;
						setTimeout(() => {
							this.connect(this.wsEvents);
						}, this.wsReconnectInterval);
					} else {
						this.wsEventListeners = null;
						this.ws = null;
					}
				}
			});

			this.ws.on('error', () => {
				if (this.ws.readyState !== WebSocket.CLOSING) {
					if (this.ws.readyState === WebSocket.OPEN) {
						this.ws.close();
					} else if (this.wsReconnect) {
						this.wsEventListeners = this.ws._events;
						this.ws = null;
						setTimeout(() => {
							this.connect(this.wsEvents);
						}, this.wsReconnectInterval);
					} else {
						this.wsEventListeners = null;
						this.ws = null;
					}
				}
			});

			this.ws.on('close', () => {
				if (this.wsReconnect) {
					this.wsEventListeners = this.ws._events;
					this.ws = null;
					setTimeout(() => {
						this.connect(this.wsEvents);
					}, this.wsReconnectInterval);
				} else {
					this.wsEventListeners = null;
					this.ws = null;
				}
			});

			this.ws.on('open', () => {
				if (this.wsEvents.length > 0) {
					this.subscribe(this.wsEvents);
				}

				this.initialConnection = false;

				setWsHeartbeat(this.ws, JSON.stringify({ op: 'ping' }), {
					pingTimeout: 60000,
					pingInterval: 25000
				});
			});
		}
	}

	/**
	 * Disconnect from hollaEx websocket
	 */
	disconnect() {
		if (this.wsConnected()) {
			this.wsReconnect = false;
			this.ws.close();
		} else {
			throw new Error('Websocket not connected');
		}
	}

	/**
	 * Subscribe to hollaEx websocket events
	 * @param {array} events - The events to listen to
	 */
	subscribe(events = []) {
		if (this.wsConnected()) {
			each(events, (event) => {
				if (!this.wsEvents.includes(event) || this.initialConnection) {
					const [topic, symbol] = event.split(':');
					switch (topic) {
						case 'orderbook':
						case 'trade':
							if (symbol) {
								if (!this.wsEvents.includes(topic)) {
									this.ws.send(
										JSON.stringify({
											op: 'subscribe',
											args: [`${topic}:${symbol}`]
										})
									);
									if (!this.initialConnection) {
										this.wsEvents = union(this.wsEvents, [event]);
									}
								}
							} else {
								this.ws.send(
									JSON.stringify({
										op: 'subscribe',
										args: [topic]
									})
								);
								if (!this.initialConnection) {
									this.wsEvents = this.wsEvents.filter(
										(e) => !e.includes(`${topic}:`)
									);
									this.wsEvents = union(this.wsEvents, [event]);
								}
							}
							break;
						case 'order':
						case 'wallet':
						case 'deposit':
							this.ws.send(
								JSON.stringify({
									op: 'subscribe',
									args: [topic]
								})
							);
							if (!this.initialConnection) {
								this.wsEvents = union(this.wsEvents, [event]);
							}
							break;
						default:
							break;
					}
				}
			});
		} else {
			throw new Error('Websocket not connected');
		}
	}

	/**
	 * Unsubscribe to hollaEx websocket events
	 * @param {array} events - The events to unsub from
	 */
	unsubscribe(events = []) {
		if (this.wsConnected()) {
			each(events, (event) => {
				if (this.wsEvents.includes(event)) {
					const [topic, symbol] = event.split(':');
					switch (topic) {
						case 'orderbook':
						case 'trade':
							if (symbol) {
								this.ws.send(
									JSON.stringify({
										op: 'unsubscribe',
										args: [`${topic}:${symbol}`]
									})
								);
							} else {
								this.ws.send(
									JSON.stringify({
										op: 'unsubscribe',
										args: [topic]
									})
								);
							}
							this.wsEvents = this.wsEvents.filter((e) => e !== event);
							break;
						case 'order':
						case 'wallet':
						case 'deposit':
							this.ws.send(
								JSON.stringify({
									op: 'unsubscribe',
									args: [topic]
								})
							);
							this.wsEvents = this.wsEvents.filter((e) => e !== event);
							break;
						default:
							break;
					}
				}
			});
		} else {
			throw new Error('Websocket not connected');
		}
	}
}

module.exports = HollaExKit;
