'use strict';

const moment = require('moment');
const { isBoolean } = require('lodash');
const { createRequest, generateHeaders, checkKit, createSignature } = require('./utils');
const HOLLAEX_NETWORK_URL = 'https://api.testnet.hollaex.network';
const HOLLAEX_NETWORK_VERSION = '/v2';
const WebSocket = require('ws');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const [ protocol, endpoint ] = HOLLAEX_NETWORK_URL.split('://');

class HollaExNetwork {
	constructor(
		opts = {
			apiKey: '',
			apiSecret: '',
			apiExpiresAfter: 60,
			activation_code: undefined // kit activation code used only for exchange operators to initialize the exchange
		}
	) {
		this.apiKey = opts.apiKey;
		this.apiSecret = opts.apiSecret;
		this.apiExpiresAfter = opts.apiExpiresAfter || 60;
		this.headers = {
			'content-type': 'application/json',
			Accept: 'application/json',
			'api-key': opts.apiKey,
		};
		this.activation_code = opts.activation_code;
		this.exchange_id = opts.exchange_id;
		this.ws = null;
		this.wsUrl = protocol === 'https'
			? `wss://${endpoint}/stream?exchange_id=${this.exchange_id}`
			: `ws://${endpoint}/stream?exchange_id=${this.exchange_id}`;
		this.wsEvents = [];
		this.wsReconnect = true;
		this.wsReconnectInterval = 5000;
		this.wsEventListeners = null;
	}

	/* Kit Operator Network Endpoints*/

	/**
	 * Initialize your Kit for HollaEx Network. Must have passed activation_code in constructor
	 * @return {object} Your exchange values
	 */
	async init() {
		checkKit(this.activation_code);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/init/${this.activation_code}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		let exchange = await createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
		this.exchange_id = exchange.id;
		return exchange;
	}

	/**
	 * Create a user for the exchange on the network
	 * @param {string} email - Email of new user
	 * @return {object} Created user's values on network
	 */
	createUser(email) {
		checkKit(this.exchange_id);
		const verb = 'POST';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/signup`;
		const data = { email };
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers,
			data
		);
	}

	/**
	 * Get all trades for the exchange on the network
	 * @param {number} userId - User id on network. Leave blank to get all trades for the exchange
	 * @param {string} symbol - Symbol of trades. Leave blank to get trades for all symbols
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: desc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} Fields: Count, Data. Count is the number of trades on the page. Data is an array of trades
	 */
	getTrades(userId, symbol, limit = 50, page = 1, orderBy = 'id', order = 'desc', startDate = 0, endDate = moment().toISOString()) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/trades?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date=${endDate}`;
		if (userId) {
			path += `&user_id=${userId}`;
		}
		if (symbol) {
			path += `&symbol=${symbol}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	getUser(userId) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/user?user_id=${userId}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get all users for the exchange on the network
	 * @return {object} Fields: Count, Data. Count is the number of users for the exchange on the network. Data is an array of users
	 */
	getUsers() {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/users`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	createUserCryptoAddress(userId, crypto) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/create-address?user_id=${userId}&crypto=${crypto}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Create a withdrawal for an exchange's user on the network
	 * @param {number} userId - User id on network
	 * @param {string} address - Address to send withdrawal to
	 * @param {string} currency - Curreny to withdraw
	 * @param {number} amount - Amount to withdraw
	 * @param {number} fee - The withdrawal fee
	 * @return {object} Withdrawal made on the network
	 */
	createWithdrawal(userId, address, currency, amount, fee) {
		checkKit(this.exchange_id);
		const verb = 'POST';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/withdraw?user_id=${userId}`;
		const data = { address, currency, amount, fee };
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers,
			data
		);
	}

	cancelWithdrawal(userId, transactionId) {
		checkKit(this.exchange_id);
		const verb = 'DELETE';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/withdraw?user_id=${userId}`;
		const data = { transaction_id: transactionId };
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers,
			data
		);
	}

	/**
	 * Get all deposits for the exchange on the network
	 * @param {number} userId - User id on network. Leave blank to get all deposits for the exchange
	 * @param {string} currency - Currency of deposits. Leave blank to get deposits for all currencies
	 * @param {boolean} status - Confirmed status of the deposits to get. Leave blank to get all confirmed and unconfirmed deposits
	 * @param {boolean} dismissed - Dismissed status of the deposits to get. Leave blank to get all dismissed and undismissed deposits
	 * @param {boolean} rejected - Rejected status of the deposits to get. Leave blank to get all rejected and unrejected deposits
	 * @param {boolean} processing - Processing status of the deposits to get. Leave blank to get all processing and unprocessing deposits
	 * @param {boolean} waiting - Waiting status of the deposits to get. Leave blank to get all waiting and unwaiting deposits
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: asc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} Fields: Count, Data. Count is the number of deposits on the page. Data is an array of deposits
	 */
	getDeposits(
		userId,
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit = 50,
		page = 1,
		orderBy = 'id',
		order = 'asc',
		startDate = 0,
		endDate = moment().toISOString()
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/deposits?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date=${endDate}`;

		if (userId) {
			path += `&user_id=${userId}`;
		}
		if (currency) {
			path += `&currency=${currency}`;
		}
		if (isBoolean(status)) {
			path += `&status=${status}`;
		}
		if (isBoolean(dismissed)) {
			path += `&dismissed=${dismissed}`;
		}
		if (isBoolean(rejected)) {
			path += `&rejected=${rejected}`;
		}
		if (isBoolean(processing)) {
			path += `&processing=${processing}`;
		}
		if (isBoolean(waiting)) {
			path += `&waiting=${waiting}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get all withdrawals for the exchange on the network
	 * @param {number} userId - User id on network. Leave blank to get all withdrawals for the exchange
	 * @param {string} currency - Currency of withdrawals. Leave blank to get withdrawals for all currencies
	 * @param {boolean} status - Confirmed status of the depowithdrawalssits to get. Leave blank to get all confirmed and unconfirmed withdrawals
	 * @param {boolean} dismissed - Dismissed status of the withdrawals to get. Leave blank to get all dismissed and undismissed withdrawals
	 * @param {boolean} rejected - Rejected status of the withdrawals to get. Leave blank to get all rejected and unrejected withdrawals
	 * @param {boolean} processing - Processing status of the withdrawals to get. Leave blank to get all processing and unprocessing withdrawals
	 * @param {boolean} waiting - Waiting status of the withdrawals to get. Leave blank to get all waiting and unwaiting withdrawals
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: asc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} Fields: Count, Data. Count is the number of withdrawals on the page. Data is an array of withdrawals
	 */
	getWithdrawals(
		userId,
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit = 50,
		page = 1,
		orderBy = 'id',
		order = 'asc',
		startDate = 0,
		endDate = moment().toISOString()
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/withdrawals?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date=${endDate}`;

		if (userId) {
			path += `&user_id=${userId}`;
		}
		if (currency) {
			path += `&currency=${currency}`;
		}
		if (isBoolean(status)) {
			path += `&status=${status}`;
		}
		if (isBoolean(dismissed)) {
			path += `&dismissed=${dismissed}`;
		}
		if (isBoolean(rejected)) {
			path += `&rejected=${rejected}`;
		}
		if (isBoolean(processing)) {
			path += `&processing=${processing}`;
		}
		if (isBoolean(waiting)) {
			path += `&waiting=${waiting}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get the balance for the exchange or exchange's user on the network
	 * @param {number} userId - User id on network. Leave blank to get balance for exchange
	 * @return {object} Available, pending, and total balance for all currencies for your exchange on the network
	 */
	getBalance(userId) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/balance`;
		if (userId) {
			path += `?user_id=${userId}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get an order for the exchange on the network
	 * @param {number} userId - Id of order's user
	 * @param {number} orderId - Order id
	 * @return {object} Order on the network with current data e.g. side, size, filled, etc.
	 */
	getOrder(userId, orderId) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/order?user_id=${userId}&order_id=${orderId}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Create a new order for the exchange on the network
	 * @param {number} userId - User id on the network
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @param {string} side - The side of the order e.g. 'buy', 'sell'
	 * @param {number} size - The amount of currency to order
	 * @param {string} type - The type of order to create e.g. 'market', 'limit'
	 * @param {number} price - The price at which to order (only required if type is 'limit')
	 * @return {object} Newly created order values e.g. symbol, id, side, status, etc.
	 */
	createOrder(userId, symbol, side, size, type, price = 0, feeData = {}, stop, meta = {}) {
		checkKit(this.exchange_id);
		const verb = 'POST';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/order?user_id=${userId}`;
		const data = { symbol, side, size, type, price };

		if (feeData.fee !== undefined) {
			data.fee = feeData.fee;
		} else if (feeData.fee_structure !== undefined) {
			data.fee_structure = feeData.fee_structure;
		}

		if (feeData.fee_coin !== undefined) {
			data.fee_coin = feeData.fee_coin;
		}

		if (Object.keys(meta).length > 0) {
			data.meta = meta;
		}

		if (stop !== undefined) {
			data.stop = stop;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers,
			data
		);
	}

	/**
	 * Cancel an order for the exchange on the network
	 * @param {number} userId - Id of order's user
	 * @param {number} orderId - Order id
	 * @return {object} Value of canceled order on the network with values side, size, filled, etc.
	 */
	cancelOrder(userId, orderId) {
		checkKit(this.exchange_id);
		const verb = 'DELETE';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/order?user_id=${userId}&order_id=${orderId}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get all orders for the exchange on the network
	 * @param {number} userId - User id on network. Leave blank to get all orders for the exchange
	 * @param {string} symbol - Symbol of orders. Leave blank to get orders for all symbols
	 * @param {string} side - Side of orders to query e.g. buy, sell
	 * @param {string} type - Type of orders to query e.g. active, stop
	 * @param {number} limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} page - Page of trades data. Default: 1
	 * @param {string} orderBy The field to order data by e.g. amount, id. Default: id
	 * @param {string} order Ascending (asc) or descending (desc). Default: desc
	 * @param {string} startDate Start date of query in ISO8601 format. Default: 0
	 * @param {string} endDate End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {array} Array of queried orders
	 */
	getOrders(userId, symbol, side, status, open, limit = 50, page = 1, orderBy = 'id', order = 'desc', startDate = 0, endDate = moment().toISOString()) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/orders?limit=${limit}&page=${page}&order_by=${orderBy}&order=${order}&start_date=${startDate}&end_date=${endDate}`;
		if (userId) {
			path += `&user_id=${userId}`;
		}
		if (symbol) {
			path += `&symbol=${symbol}`;
		}
		if (side) {
			path += `&side=${side}`;
		}
		if (status) {
			path += `&status=${status}`;
		}
		if (open) {
			path += `&open=${open}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Cancel all orders for an exchange's user on the network
	 * @param {number} userId - User id on network
	 * @param {string} symbol - Symbol of orders to cancel. Leave blank to cancel user's orders for all symbols
	 * @return {array} Array of canceled orders
	 */
	cancelOrders(userId, symbol) {
		checkKit(this.exchange_id);
		const verb = 'DELETE';

		let path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/orders?user_id=${userId}`;
		if (symbol) {
			path += `&symbol=${symbol}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get sum of user trades and its stats
	 * @param {number} userId - User id on network
	 * @return {object} Object with field data that contains stats info
	 */
	getUserStats(userId) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/user/stats?user_id=${userId}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Check transaction in network. Will update transaction status on Kit accordingly
	 * @param {string} currency; - Currency of transaction
	 * @param {string} transactionId - Transaction id
	 * @param {string} address - Transaction receiving address
	 * @param {boolean} isTestnet - Network transaction was made on. Default: false
	 * @return {object} Success or failed message
	 */
	checkTransaction(currency, transactionId, address, isTestnet = false) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/check-transaction?currency=${currency}&transaction_id=${transactionId}&address=${address}&is_testnet=${isTestnet}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Transfer funds between two users
	 * @param {number} senderId; - Network id of user that is sending funds
	 * @param {number} receiverId - Network id of user that is receiving funds
	 * @param {string} currency - Currency to transfer
	 * @param {number} amount - Amount to transfer
	 * @param {string} description - Description of transfer. Default: Empty string
	 * @return {object} Object with field transaction_id
	 */
	transferAsset(senderId, receiverId, currency, amount, description = '') {
		checkKit(this.exchange_id);
		const verb = 'POST';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/transfer`;
		const data = {
			sender_id: senderId,
			receiver_id: receiverId,
			currency,
			description,
			amount
		};
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers,
			data
		);
	}

	/* Network Engine Endpoints*/

	/**
	 * Get time and sales on Nework engine
	 * @param {string} symbol - Symbol to get trades for. Leave blank to get trades of all symbols
	 * @return {object} Object with trades
	 */
	getEngineTrades(symbol) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/trades`;

		if (symbol) {
			path += `?symbol=${symbol}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get top orderbooks
	 * @param {string} symbol - Symbol to get orderbook for. Leave blank to get orderbook of all symbols
	 * @return {object} Object with orderbook
	 */
	getEngineOrderbooks(symbol) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/orderbooks`;

		if (symbol) {
			path += `?symbol=${symbol}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get TradingView trade history HOLCV
	 * @param {string} from - Starting date of trade history in UNIX timestamp format
	 * @param {string} to - Ending date of trade history in UNIX timestamp format
	 * @param {string} symbol - Symbol to get trade history for
	 * @param {string} resolution - Resolution of trade history. 1d, 1W, etc
	 * @return {object} Object with trade history info
	 */
	getEngineChart(from, to, symbol, resolution) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/chart?from=${from}&to=${to}&symbol=${symbol}&resolution=${resolution}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get TradingView trade history HOLCV for all pairs
	 * @param {string} from - Starting date of trade history in UNIX timestamp format
	 * @param {string} to - Ending date of trade history in UNIX timestamp format
	 * @param {string} resolution - Resolution of trade history. 1d, 1W, etc
	 * @return {array} Array of objects with trade history info
	 */
	getEngineCharts(from, to, resolution) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/charts?from=${from}&to=${to}&resolution=${resolution}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get TradingView udf config
	 * @return {object} Object with TradingView udf config
	 */
	getEngineUdfConfig() {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/udf/config`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get TradingView udf history HOLCV
	 * @param {string} from - Starting date in UNIX timestamp format
	 * @param {string} to - Ending date in UNIX timestamp format
	 * @param {string} symbol - Symbol to get
	 * @param {string} resolution - Resolution of query. 1d, 1W, etc
	 * @return {object} Object with TradingView udf history HOLCV
	 */
	getEngineUdfHistory(from, to, symbol, resolution) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/udf/history?from=${from}&to=${to}&symbol=${symbol}&resolution=${resolution}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get TradingView udf symbols
	 * @param {string} symbol - Symbol to get
	 * @return {object} Object with TradingView udf symbols
	 */
	getEngineUdfSymbols(symbol) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/udf/symbols?symbol=${symbol}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get historical data, time interval is 5 minutes
	 * @param {string} symbol - Symbol to get
	 * @return {object} Object with historical data
	 */
	getEngineTicker(symbol) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/ticker?symbol=${symbol}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	/**
	 * Get historical data for all symbols, time interval is 5 minutes
	 * @return {object} Object with historical data for all symbols
	 */
	getEngineTickers() {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/engine/${this.exchange_id}/ticker/all`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	mintAsset(userId, currency, description, amount) {
		const verb = 'POST';
		const path = `${HOLLAEX_NETWORK_VERSION}/mint`;
		const data = {
			user_id: userId,
			currency,
			description,
			amount
		};
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers,
			data
		);
	}

	burnAsset(userId, currency, description, amount) {
		const verb = 'POST';
		const path = `${HOLLAEX_NETWORK_VERSION}/burn`;
		const data = {
			user_id: userId,
			currency,
			description,
			amount
		};
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter, data);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers,
			data
		);
	}

	getGeneratedFees(limit = 50, page = 1, startDate = 0, endDate = moment().toISOString()) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/fee?exchange_id=${this.exchange_id}&limit=${limit}&page=${page}&start_date=${startDate}&end_date=${endDate}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	getOraclePrice(asset, quote = 'usdt', amount = 1) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/oracle/price?exchange_id=${this.exchange_id}&asset=${asset}&quote=${quote}&amount=${amount}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	getOraclePrices(assets = [], quote = 'usdt', amount = 1) {
		checkKit(this.exchange_id);
		assets = assets.join(',');

		const verb = 'GET';
		const path = `${HOLLAEX_NETWORK_VERSION}/oracle/prices?exchange_id=${this.exchange_id}&assets=${assets}&quote=${quote}&amount=${amount}`;
		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${HOLLAEX_NETWORK_URL}${path}`,
			headers
		);
	}

	connect(events = []) {
		this.wsReconnect = true;
		this.wsEvents = events;
		const apiExpires = moment().toISOString() + this.apiExpiresAfter;
		const signature = createSignature(this.apiSecret, 'CONNECT', '/stream', apiExpires);

		this.ws = new WebSocket(this.wsUrl, {
			headers: {
				'api-key': this.apiKey,
				'api-signature': signature,
				'api-expires': apiExpires
			}
		});

		if (this.wsEventListeners) {
			this.ws._events = this.wsEventListeners;
		} else {
			this.ws.on('unexpected-response', () => {
				if (this.ws.readyState === WebSocket.OPEN) {
					this.ws.close();
				} else {
					this.ws = null;
				}
			});

			this.ws.on('error', () => {
				if (this.ws.readyState === WebSocket.OPEN) {
					this.ws.close();
				} else {
					this.ws = null;
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

				setWsHeartbeat(this.ws, 'ping', {
					pingTimeout: 60000,
					pingInterval: 25000,
				});
			});
		}
	}

	disconnect() {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.wsReconnect = false;
			this.ws.close();
		}
	}

	subscribe(events = []) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({
				op: 'subscribe',
				args: events
			}));
		}
	}

	unsubscribe(events = []) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({
				op: 'unsubscribe',
				args: events
			}));
		}
	}
}

module.exports = HollaExNetwork;
