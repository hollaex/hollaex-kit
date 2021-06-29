'use strict';

const moment = require('moment');
const {
	isBoolean,
	isPlainObject,
	isNumber,
	isString,
	isArray,
	isDate
} = require('lodash');
const {
	createRequest,
	generateHeaders,
	checkKit,
	createSignature,
	parameterError
} = require('./utils');
const WebSocket = require('ws');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const { reject } = require('bluebird');

class HollaExNetwork {
	constructor(
		opts = {
			apiUrl: 'https://api.hollaex.network',
			baseUrl: '/v2',
			apiKey: '',
			apiSecret: '',
			apiExpiresAfter: 60,
			activation_code: undefined // kit activation code used only for exchange operators to initialize the exchange
		}
	) {
		this.apiUrl = opts.apiUrl || 'https://api.hollaex.network';
		this.baseUrl = opts.baseUrl || '/v2';
		this.apiKey = opts.apiKey;
		this.apiSecret = opts.apiSecret;
		this.apiExpiresAfter = opts.apiExpiresAfter || 60;
		this.headers = {
			'content-type': 'application/json',
			Accept: 'application/json',
			'api-key': opts.apiKey
		};
		this.activation_code = opts.activation_code;
		this.exchange_id = opts.exchange_id;
		const [ protocol, endpoint ] = this.apiUrl.split('://');
		this.wsUrl =
			protocol === 'https'
				? `wss://${endpoint}/stream?exchange_id=${this.exchange_id}`
				: `ws://${endpoint}/stream?exchange_id=${this.exchange_id}`;
		this.ws = null;
		this.wsEvents = [];
		this.wsReconnect = true;
		this.wsReconnectInterval = 5000;
		this.wsEventListeners = null;
		this.wsConnected = () => this.ws && this.ws.readyState === WebSocket.OPEN;
	}

	/* Kit Operator Network Endpoints*/

	/**
	 * Initialize your Kit for HollaEx Network. Must have passed activation_code in constructor
	 * @return {object} Your exchange values
	 */
	async init() {
		checkKit(this.activation_code);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/init/${
			this.activation_code
		}`;
		const headers = generateHeaders(
			this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		let exchange = await createRequest(
			verb,
			`${this.apiUrl}${path}`,
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

		if (!email) {
			return reject(parameterError('email', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/signup`;
		const data = { email };
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
	 * Get all trades for the exchange on the network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of trades. Leave blank to get trades for all symbols
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} Fields: Count, Data. Count is the number of trades on the page. Data is an array of trades
	 */
	getTrades(
		opts = {
			symbol: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'desc',
			startDate: null,
			endDate: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/user/trades?`;

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
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.symbol) {
			path += `&symbol=${opts.symbol}`;
		}

		const headers = generateHeaders(this.headers, this.apiSecret, verb, path, this.apiExpiresAfter);

		return createRequest(
			verb,
			`${this.apiUrl}${path}`,
			headers
		);
	}

	/**
	 * Get all trades for a user on the network
	 * @param {number} userId - User id on network. Leave blank to get all trades for the exchange
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of trades. Leave blank to get trades for all symbols
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} Fields: Count, Data. Count is the number of trades on the page. Data is an array of trades
	 */
	getUserTrades(
		userId,
		opts = {
			symbol: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'desc',
			startDate: null,
			endDate: null
		}
	) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/user/trades?user_id=${userId}`;

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
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.symbol) {
			path += `&symbol=${opts.symbol}`;
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
	 * Get user network data
	 * @param {number} userId - User's network id
	 * @return {object} User network data
	 */
	getUser(userId) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/user?user_id=${userId}`;
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
	 * Get all users for the exchange on the network
	 * @return {object} Fields: Count, Data. Count is the number of users for the exchange on the network. Data is an array of users
	 */
	getUsers() {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/${this.exchange_id}/users`;
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
	 * Create a crypto address for user
	 * @param {number} userId - User id on network.
	 * @param {string} crypto - Crypto to create address for.
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.network - Crypto's blockchain network
	 * @return {object} Object with new address
	 */
	createUserCryptoAddress(userId, crypto, opts = {
		network: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!crypto) {
			return reject(parameterError('crypto', 'cannot be null'));
		}

		const verb = 'GET';
		let path = `${this.baseUrl}/network/${this.exchange_id}/create-address?user_id=${userId}&crypto=${crypto}`;

		if (opts.network) {
			path += `&network=${opts.network}`;
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
	 * Create a withdrawal for an exchange's user on the network
	 * @param {number} userId - User id on network
	 * @param {string} address - Address to send withdrawal to
	 * @param {string} currency - Curreny to withdraw
	 * @param {number} amount - Amount to withdraw
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.network - Specify crypto currency network
	 * @return {object} Withdrawal made on the network
	 */
	performWithdrawal(userId, address, currency, amount, opts = {
		network: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!address) {
			return reject(parameterError('address', 'cannot be null'));
		} else if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/withdraw?user_id=${userId}`;
		const data = { address, currency, amount };
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
	 * Cancel a withdrawal for an exchange's user on the network
	 * @param {number} userId - User id on network
	 * @param {string} withdrawalId - Withdrawal's id on network (not transaction id).
	 * @return {object} Withdrawal canceled on the network
	 */
	cancelWithdrawal(userId, withdrawalId) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!withdrawalId) {
			return reject(parameterError('withdrawalId', 'cannot be null'));
		}

		const verb = 'DELETE';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/withdraw?user_id=${userId}&id=${withdrawalId}`;
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
	 * Get all deposits for the exchange on the network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.currency - Currency of deposits. Leave blank to get deposits for all currencies
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
	 * @param {string} opts.transactionId - Deposit with specific transaction ID.
	 * @param {string} opts.address - Deposits with specific address.
	 * @return {object} Fields: Count, Data. Count is the number of deposits on the page. Data is an array of deposits
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
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/deposits?`;

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

		if (isString(opts.address)) {
			path += `&address=${opts.address}`;
		}

		if (isString(opts.transactionId)) {
			path += `&transaction_id=${opts.transactionId}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.currency) {
			path += `&currency=${opts.currency}`;
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
	 * Get all deposits for a user on the network
	 * @param {number} userId - User id on network. Leave blank to get all deposits for the exchange
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.currency - Currency of deposits. Leave blank to get deposits for all currencies
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
	 * @param {string} opts.transactionId - Deposit with specific transaction ID.
	 * @param {string} opts.address - Deposits with specific address.
	 * @return {object} Fields: Count, Data. Count is the number of deposits on the page. Data is an array of deposits
	 */
	getUserDeposits(
		userId,
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
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null
		}
	) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';

		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/deposits?user_id=${userId}`;

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

		if (isString(opts.address)) {
			path += `&address=${opts.address}`;
		}

		if (isString(opts.transactionId)) {
			path += `&transaction_id=${opts.transactionId}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.currency) {
			path += `&currency=${opts.currency}`;
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
	 * Get all withdrawals for the exchange on the network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.currency - Currency of withdrawals. Leave blank to get withdrawals for all currencies
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
	 * @return {object} Fields: Count, Data. Count is the number of withdrawals on the page. Data is an array of withdrawals
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
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/withdrawals?`;

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

		if (isString(opts.address)) {
			path += `&address=${opts.address}`;
		}

		if (isString(opts.transactionId)) {
			path += `&transaction_id=${opts.transactionId}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.currency) {
			path += `&currency=${opts.currency}`;
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
	 * Get all withdrawals for a user on the network
	 * @param {number} userId - User id on network. Leave blank to get all withdrawals for the exchange
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.currency - Currency of withdrawals. Leave blank to get withdrawals for all currencies
	 * @param {boolean} opts.status - Confirmed status of the depowithdrawalssits to get. Leave blank to get all confirmed and unconfirmed withdrawals
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
	 * @return {object} Fields: Count, Data. Count is the number of withdrawals on the page. Data is an array of withdrawals
	 */
	getUserWithdrawals(
		userId,
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
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null
		}
	) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';

		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/withdrawals?user_id=${userId}`;

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

		if (isString(opts.address)) {
			path += `&address=${opts.address}`;
		}

		if (isString(opts.transactionId)) {
			path += `&transaction_id=${opts.transactionId}`;
		}

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.currency) {
			path += `&currency=${opts.currency}`;
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
	 * Get the balance for the exchange on the network
	 * @return {object} Available, pending, and total balance for all currencies for your exchange on the network
	 */
	getBalance() {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/balance`;

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
	 * Get the balance for an exchange's user on the network
	 * @param {number} userId - User id on network
	 * @return {object} Available, pending, and total balance for all currencies for your exchange on the network
	 */
	getUserBalance(userId) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/balance?user_id=${userId}`;

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
	 * Get an order for the exchange on the network
	 * @param {number} userId - Id of order's user
	 * @param {number} orderId - Order id
	 * @return {object} Order on the network with current data e.g. side, size, filled, etc.
	 */
	getOrder(userId, orderId) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!orderId) {
			return reject(parameterError('orderId', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/order?user_id=${userId}&order_id=${orderId}`;
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
	 * Create a new order for the exchange on the network
	 * @param {number} userId - User id on the network
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @param {string} side - The side of the order e.g. 'buy', 'sell'
	 * @param {number} size - The amount of currency to order
	 * @param {string} type - The type of order to create e.g. 'market', 'limit'
	 * @param {number} price - The price at which to order (only required if type is 'limit')
	 * @param {object} feeData - Object with fee data
	 * @param {object} feeData.fee_structure - Object with maker and taker fees
	 * @param {number} feeData.fee_structure.maker - Maker fee.
	 * @param {number} feeData.fee_structure.taker - Taker fee
	 * @param {object} opts - Optional parameters.
	 * @param {number} opts.stop - Stop price of order. This makes the order a stop loss order.
	 * @param {object} opts.meta - Meta values for order.
	 * @param {boolean} opts.meta.post_only - Whether or not the order should only be made if market maker.
	 * @param {string} opts.meta.note - Additional note to add to order data.
	 * @return {object} Newly created order values e.g. symbol, id, side, status, etc.
	 */
	createOrder(
		userId,
		symbol,
		side,
		size,
		type,
		price = 0,
		feeData = {
			fee_structure: null,
			fee_coin: null
		},
		opts = {
			stop: null,
			meta: null
		}
	) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		} else if (side !== 'buy' && side !== 'sell') {
			return reject(parameterError('side', 'must be buy or sell'));
		} else if (!size) {
			return reject(parameterError('size', 'cannot be null'));
		} else if (type !== 'market' && type !== 'limit') {
			return reject(parameterError('type', 'must be limit or market'));
		} else if (!price && type !== 'market') {
			return reject(parameterError('price', 'cannot be null for limit orders'));
		} else if (!isPlainObject(feeData) || !isPlainObject(feeData.fee_structure)) {
			return reject(parameterError('feeData', 'feeData must be an object and contain fee_structure'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/order?user_id=${userId}`;
		const data = { symbol, side, size, type, price };

		if (isPlainObject(feeData.fee_structure)) {
			data.fee_structure = feeData.fee_structure;
		}

		if (feeData.fee_coin) {
			data.fee_coin = feeData.fee_coin;
		}

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
	 * Cancel an order for the exchange on the network
	 * @param {number} userId - Id of order's user
	 * @param {number} orderId - Order id
	 * @return {object} Value of canceled order on the network with values side, size, filled, etc.
	 */
	cancelOrder(userId, orderId) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!orderId) {
			return reject(parameterError('orderId', 'cannot be null'));
		}

		const verb = 'DELETE';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/order?user_id=${userId}&order_id=${orderId}`;
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
	 * Get all orders for the exchange on the network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of orders. Leave blank to get orders for all symbols
	 * @param {string} opts.side - Side of orders to query e.g. buy, sell
	 * @param {string} opts.type - Type of orders to query e.g. active, stop
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {array} Array of queried orders
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
			startDate: null,
			endDate: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/orders?`;

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
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.symbol) {
			path += `&symbol=${opts.symbol}`;
		}

		if (opts.side) {
			path += `&side=${opts.side}`;
		}

		if (opts.status) {
			path += `&status=${opts.status}`;
		}

		if (isBoolean(opts.open)) {
			path += `&open=${opts.open}`;
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
	 * Get all orders for a user on the network
	 * @param {number} userId - User id on network. Leave blank to get all orders for the exchange
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of orders. Leave blank to get orders for all symbols
	 * @param {string} opts.side - Side of orders to query e.g. buy, sell
	 * @param {string} opts.type - Type of orders to query e.g. active, stop
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {array} Array of queried orders
	 */
	getUserOrders(
		userId,
		opts = {
			symbol: null,
			side: null,
			status: null,
			open: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'desc',
			startDate: null,
			endDate: null
		}
	) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/orders?user_id=${userId}`;

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
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.symbol) {
			path += `&symbol=${opts.symbol}`;
		}

		if (opts.side) {
			path += `&side=${opts.side}`;
		}

		if (opts.status) {
			path += `&status=${opts.status}`;
		}

		if (isBoolean(opts.open)) {
			path += `&open=${opts.open}`;
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
	 * Cancel all orders for an exchange's user on the network
	 * @param {number} userId - User id on network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of orders to cancel. Leave blank to cancel user's orders for all symbols
	 * @return {array} Array of canceled orders
	 */
	cancelAllOrders(userId, opts = { symbol: null }) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'DELETE';

		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/order/all?user_id=${userId}`;
		if (opts.symbol) {
			path += `&symbol=${opts.symbol}`;
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
	 * Get sum of user trades and its stats
	 * @param {number} userId - User id on network
	 * @return {object} Object with field data that contains stats info
	 */
	getUserStats(userId) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/user/stats?user_id=${userId}`;
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
	 * Check transaction in network. Will update transaction status on Kit accordingly
	 * @param {string} currency; - Currency of transaction
	 * @param {string} transactionId - Transaction id
	 * @param {string} address - Transaction receiving address
	 * @param {string} network - Crypto's blockchain network
	 * @param {object} opts - Optional parameters.
	 * @param {boolean} opts.isTestnet - Network transaction was made on. Default: false
	 * @return {object} Success or failed message
	 */
	checkTransaction(
		currency,
		transactionId,
		address,
		network,
		opts = { isTestnet: null }
	) {
		checkKit(this.exchange_id);

		if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		} else if (!transactionId) {
			return reject(parameterError('transactionId', 'cannot be null'));
		} else if (!address) {
			return reject(parameterError('address', 'cannot be null'));
		} else if (!network) {
			return reject(parameterError('network', 'cannot be null'));
		}

		const verb = 'GET';
		let path = `${this.baseUrl}/check-transaction?currency=${currency}&transaction_id=${transactionId}&address=${address}&network=${network}`;

		if (isBoolean(opts.isTestnet)) {
			path += `&is_testnet=${opts.isTestnet}`;
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
	 * Transfer funds between two users
	 * @param {number} senderId; - Network id of user that is sending funds
	 * @param {number} receiverId - Network id of user that is receiving funds
	 * @param {string} currency - Currency to transfer
	 * @param {number} amount - Amount to transfer
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.description - Description of transfer. Default: Empty string
	 * @param {boolean} opts.email - Send email to users after transfer. Default: true.
	 * @return {object} Object with field transaction_id
	 */
	transferAsset(
		senderId,
		receiverId,
		currency,
		amount,
		opts = { description: null, email: true }
	) {
		checkKit(this.exchange_id);

		if (!senderId) {
			return reject(parameterError('senderId', 'cannot be null'));
		} else if (!receiverId) {
			return reject(parameterError('receiverId', 'cannot be null'));
		} else if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		} else if (!amount) {
			return reject(parameterError('amount', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/transfer`;
		const data = {
			sender_id: senderId,
			receiver_id: receiverId,
			currency,
			amount
		};

		if (opts.description) {
			data.description = opts.description;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
		} else {
			data.email = true;
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
	 * Get trade history for exchange on network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of trades.
	 * @param {string} opts.side - Side of trades.
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: asc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} Count and data format.
	 */
	getTradesHistory(
		opts = {
			symbol: null,
			side: null,
			limit: 50,
			page: 1,
			orderBy: 'id',
			order: 'asc',
			startDate: null,
			endDate: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/trades/history?`;

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
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
		}

		if (opts.symbol) {
			path += `&symbol=${opts.symbol}`;
		}

		if (opts.side) {
			path += `&side=${opts.side}`;
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

	/* Network Engine Endpoints*/

	/**
	 * Get Public trades on network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol to get trades for. Leave blank to get trades of all symbols
	 * @return {object} Object with trades
	 */
	getPublicTrades(opts = { symbol: null }) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${this.baseUrl}/network/${this.exchange_id}/trades`;

		if (opts.symbol) {
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
	 * Get top orderbook for specific symbol
	 * @param {string} symbol - Symbol to get orderbook for. Leave blank to get orderbook of all symbols
	 * @return {object} Object with orderbook
	 */
	getOrderbook(symbol) {
		checkKit(this.exchange_id);

		if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		}

		const verb = 'GET';
		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/orderbook`;

		if (symbol) {
			path += `?symbol=${symbol}`;
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
	 * Get top orderbooks
	 * @param {string} symbol - Symbol to get orderbook for. Leave blank to get orderbook of all symbols
	 * @return {object} Object with orderbook
	 */
	getOrderbooks() {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/orderbooks`;

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
	 * Get TradingView trade history HOLCV
	 * @param {string} from - Starting date of trade history in UNIX timestamp format
	 * @param {string} to - Ending date of trade history in UNIX timestamp format
	 * @param {string} symbol - Symbol to get trade history for
	 * @param {string} resolution - Resolution of trade history. 1d, 1W, etc
	 * @return {object} Object with trade history info
	 */
	getChart(from, to, symbol, resolution) {
		checkKit(this.exchange_id);

		if (!from) {
			return reject(parameterError('from', 'cannot be null'));
		} else if (!to) {
			return reject(parameterError('to', 'cannot be null'));
		} else if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		} else if (!resolution) {
			return reject(parameterError('resolution', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/chart?from=${from}&to=${to}&symbol=${symbol}&resolution=${resolution}`;
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
	 * Get TradingView trade history HOLCV for all pairs
	 * @param {string} from - Starting date of trade history in UNIX timestamp format
	 * @param {string} to - Ending date of trade history in UNIX timestamp format
	 * @param {string} resolution - Resolution of trade history. 1d, 1W, etc
	 * @return {array} Array of objects with trade history info
	 */
	getCharts(from, to, resolution) {
		checkKit(this.exchange_id);

		if (!from) {
			return reject(parameterError('from', 'cannot be null'));
		} else if (!to) {
			return reject(parameterError('to', 'cannot be null'));
		} else if (!resolution) {
			return reject(parameterError('resolution', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/charts?from=${from}&to=${to}&resolution=${resolution}`;
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
	 * Get TradingView udf config
	 * @return {object} Object with TradingView udf config
	 */
	getUdfConfig() {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/udf/config`;
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
	 * Get TradingView udf history HOLCV
	 * @param {string} from - Starting date in UNIX timestamp format
	 * @param {string} to - Ending date in UNIX timestamp format
	 * @param {string} symbol - Symbol to get
	 * @param {string} resolution - Resolution of query. 1d, 1W, etc
	 * @return {object} Object with TradingView udf history HOLCV
	 */
	getUdfHistory(from, to, symbol, resolution) {
		checkKit(this.exchange_id);

		if (!from) {
			return reject(parameterError('from', 'cannot be null'));
		} else if (!to) {
			return reject(parameterError('to', 'cannot be null'));
		} else if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		} else if (!resolution) {
			return reject(parameterError('resolution', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/udf/history?from=${from}&to=${to}&symbol=${symbol}&resolution=${resolution}`;
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
	 * Get TradingView udf symbols
	 * @param {string} symbol - Symbol to get
	 * @return {object} Object with TradingView udf symbols
	 */
	getUdfSymbols(symbol) {
		checkKit(this.exchange_id);

		if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/udf/symbols?symbol=${symbol}`;
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
	 * Get historical data, time interval is 5 minutes
	 * @param {string} symbol - Symbol to get
	 * @return {object} Object with historical data
	 */
	getTicker(symbol) {
		checkKit(this.exchange_id);

		if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		}

		const verb = 'GET';
		let path = `${this.baseUrl}/network/${this.exchange_id}/ticker`;

		if (symbol) {
			path += `?symbol=${symbol}`;
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
	 * Get historical data for all symbols, time interval is 5 minutes
	 * @return {object} Object with historical data for all symbols
	 */
	getTickers() {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/tickers`;
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
	 * Mint an asset you own to a user
	 * @param {number} userId; - Network id of user.
	 * @param {string} currency - Currency to mint.
	 * @param {number} amount - Amount to mint.
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.description - Description of transfer. Default: Empty string
	 * @param {string} opts.transactionId - Custom transaction ID for mint.
	 * @param {boolean} opts.status - Status of mint created. Default: true.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @return {object} Object with created mint's data.
	 */
	mintAsset(userId, currency, amount, opts = { description: null, transactionId: null, status: null, email: null }) {
		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		} else if (!amount) {
			return reject(parameterError('amount', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/mint`;
		const data = {
			user_id: userId,
			currency,
			amount
		};

		if (opts.description) {
			data.description = opts.description;
		}

		if (opts.transactionId) {
			data.transaction_id = opts.transactionId;
		}

		if (isBoolean(opts.status)) {
			data.status = opts.status;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
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
	 * Update a pending mint
	 * @param {string} transactionId; - Transaction ID of pending mint.
	 * @param {object} opts - Optional parameters.
	 * @param {boolean} opts.status - Set to true to confirm pending mint.
	 * @param {boolean} opts.dismissed - Set to true to dismiss pending mint.
	 * @param {boolean} opts.rejected - Set to true to reject pending mint.
	 * @param {boolean} opts.processing - Set to true to set state to processing.
	 * @param {boolean} opts.waiting - Set to true to set state to waiting.
	 * @param {string} opts.updatedTransactionId - Value to update transaction ID of pending mint to.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @param {string} opts.updatedDescription - Value to update transaction description to.
	 * @return {object} Object with updated mint's data.
	 */
	updatePendingMint(
		transactionId,
		opts = {
			status: null,
			dismissed: null,
			rejected: null,
			processing: null,
			waiting: null,
			updatedTransactionId: null,
			email: null,
			updatedDescription: null
		}
	) {
		if (!transactionId) {
			return reject(parameterError('transactionId', 'cannot be null'));
		}

		const status = isBoolean(opts.status) ? opts.status : false;
		const rejected = isBoolean(opts.rejected) ? opts.rejected : false;
		const dismissed = isBoolean(opts.dismissed) ? opts.dismissed : false;
		const processing = isBoolean(opts.processing) ? opts.processing : false;
		const waiting = isBoolean(opts.waiting) ? opts.waiting : false;

		if (!status && !rejected && !dismissed && !processing && !waiting) {
			return reject(new Error('Must give one parameter to update'));
		} else if (
			status && (rejected || dismissed || processing || waiting)
			|| rejected && (status || dismissed || processing || waiting)
			|| dismissed && (status || rejected || processing || waiting)
			|| processing && (status || dismissed || rejected || waiting)
			|| waiting && (status || rejected || dismissed || processing)
		) {
			return reject(new Error('Can only update one parmaeter'));
		}

		const verb = 'PUT';
		const path = `${this.baseUrl}/network/mint`;
		const data = {
			transaction_id: transactionId,
			status,
			rejected,
			dismissed,
			processing,
			waiting
		};

		if (opts.updatedTransactionId) {
			data.updated_transaction_id = opts.updatedTransactionId;
		}

		if (opts.updatedDescription) {
			data.updated_description = opts.updatedDescription;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
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
	 * Burn an asset you own to a user
	 * @param {number} userId; - Network id of user.
	 * @param {string} currency - Currency to burn.
	 * @param {number} amount - Amount to burn.
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.description - Description of transfer. Default: Empty string
	 * @param {string} opts.transactionId - Custom transaction ID for burn.
	 * @param {boolean} opts.status - Status of burn created. Default: true.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @return {object} Object with created burn's data.
	 */
	burnAsset(userId, currency, amount, opts = { description: null, transactionId: null, status: null, email: null }) {
		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		} else if (!amount) {
			return reject(parameterError('amount', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/burn`;
		const data = {
			user_id: userId,
			currency,
			amount
		};

		if (opts.description) {
			data.description = opts.description;
		}

		if (opts.transactionId) {
			data.transaction_id = opts.transactionId;
		}

		if (isBoolean(opts.status)) {
			data.status = opts.status;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
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
	 * Update a pending burn
	 * @param {string} transactionId; - Transaction ID of pending burn.
	 * @param {object} opts - Optional parameters.
	 * @param {boolean} opts.status - Set to true to confirm pending burn.
	 * @param {boolean} opts.dismissed - Set to true to dismiss pending burn.
	 * @param {boolean} opts.rejected - Set to true to reject pending burn.
	 * @param {boolean} opts.processing - Set to true to set state to processing.
	 * @param {boolean} opts.waiting - Set to true to set state to waiting.
	 * @param {string} opts.updatedTransactionId - Value to update transaction ID of pending burn to.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @param {string} opts.updatedDescription - Value to update transaction description to.
	 * @return {object} Object with updated burn's data.
	 */
	updatePendingBurn(
		transactionId,
		opts = {
			status: null,
			dismissed: null,
			rejected: null,
			processing: null,
			waiting: null,
			updatedTransactionId: null,
			email: null,
			updatedDescription: null
		}
	) {
		if (!transactionId) {
			return reject(parameterError('transactionId', 'cannot be null'));
		}

		const status = isBoolean(opts.status) ? opts.status : false;
		const rejected = isBoolean(opts.rejected) ? opts.rejected : false;
		const dismissed = isBoolean(opts.dismissed) ? opts.dismissed : false;
		const processing = isBoolean(opts.processing) ? opts.processing : false;
		const waiting = isBoolean(opts.waiting) ? opts.waiting : false;

		if (!status && !rejected && !dismissed && !processing && !waiting) {
			return reject(new Error('Must give one parameter to update'));
		} else if (
			status && (rejected || dismissed || processing || waiting)
			|| rejected && (status || dismissed || processing || waiting)
			|| dismissed && (status || rejected || processing || waiting)
			|| processing && (status || dismissed || rejected || waiting)
			|| waiting && (status || rejected || dismissed || processing)
		) {
			return reject(new Error('Can only update one parmaeter'));
		}

		const verb = 'PUT';
		const path = `${this.baseUrl}/network/burn`;
		const data = {
			transaction_id: transactionId,
			status,
			rejected,
			dismissed,
			processing,
			waiting
		};

		if (opts.updatedTransactionId) {
			data.updated_transaction_id = opts.updatedTransactionId;
		}

		if (opts.updatedDescription) {
			data.updated_description = opts.updatedDescription;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
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
	 * Get generated fees for exchange
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.startDate - Start date of query in ISO8601 format. Default: 0
	 * @param {string} opts.endDate - End date of query in ISO8601 format: Default: current time in ISO8601 format
	 * @return {object} Object with generated fees
	 */
	getGeneratedFees(
		opts = {
			startDate: null,
			endDate: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/fees?`;

		if (isString(opts.startDate)) {
			path += `&start_date=${opts.startDate}`;
		} else if (isDate(opts.startDate)) {
			path += `&start_date=${opts.startDate.toISOString()}`;
		}

		if (isString(opts.endDate)) {
			path += `&end_date=${opts.endDate}`;
		} else if (isDate(opts.endDate)) {
			path += `&end_date=${opts.endDate.toISOString()}`;
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
	 * Settle exchange fees
	 * @return {object} Object with settled fees.
	 */
	settleFees() {
		checkKit(this.exchange_id);
		const verb = 'GET';

		const path = `${this.baseUrl}/network/${this.exchange_id}/fees/settle`;

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
	 * Convert assets to a quote asset
	 * @param {array} assets - Array of assets to convert as strings
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.quote - Quote asset to convert to. Default: USDT.
	 * @param {number} opts.amount - Amount of quote asset to convert to. Default: 1.
	 * @return {object} Object with converted assets.
	 */
	getOraclePrices(assets = [], opts = { quote: null, amount: null }) {
		checkKit(this.exchange_id);

		if (!assets || !isArray(assets) || assets.length === 0) {
			return reject(parameterError('assets', 'must be an array with length greater than one'));
		}

		assets = assets.join(',');

		const verb = 'GET';
		let path = `${this.baseUrl}/oracle/prices?exchange_id=${
			this.exchange_id
		}&assets=${assets}`;

		if (opts.quote) {
			path += `&quote=${opts.quote}`;
		}

		if (isNumber(opts.amount)) {
			path += `&amount=${opts.amount}`;
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
	 * Connect to websocket
	 * @param {array} events - Array of events to connect to
	 */
	connect(events = []) {
		checkKit(this.exchange_id);
		this.wsReconnect = true;
		this.wsEvents = events;
		const apiExpires = moment().unix() + this.apiExpiresAfter;
		const signature = createSignature(
			this.apiSecret,
			'CONNECT',
			'/stream',
			apiExpires
		);

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

				setWsHeartbeat(this.ws, 'ping', {
					pingTimeout: 60000,
					pingInterval: 25000
				});
			});
		}
	}

	/**
	 * Disconnect from Network websocket
	 */
	disconnect() {
		checkKit(this.exchange_id);
		if (this.wsConnected()) {
			this.wsReconnect = false;
			this.ws.close();
		} else {
			throw new Error('Websocket not connected');
		}
	}

	/**
	 * Subscribe to Network websocket events
	 * @param {array} events - The events to listen to
	 */
	subscribe(events = []) {
		checkKit(this.exchange_id);
		if (this.wsConnected()) {
			this.ws.send(
				JSON.stringify({
					op: 'subscribe',
					args: events
				})
			);
		} else {
			throw new Error('Websocket not connected');
		}
	}

	/**
	 * Unsubscribe to Network websocket events
	 * @param {array} events - The events to unsub from
	 */
	unsubscribe(events = []) {
		checkKit(this.exchange_id);
		if (this.wsConnected()) {
			this.ws.send(
				JSON.stringify({
					op: 'unsubscribe',
					args: events
				})
			);
		} else {
			throw new Error('Websocket not connected');
		}
	}
}

module.exports = HollaExNetwork;
