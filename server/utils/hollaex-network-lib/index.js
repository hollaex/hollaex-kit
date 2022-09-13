'use strict';

const moment = require('moment');
const {
	isBoolean,
	isPlainObject,
	isNumber,
	isString,
	isArray,
	isBuffer,
	omit,
	isNull,
	isEmpty,
	snakeCase
} = require('lodash');
const {
	createRequest,
	generateHeaders,
	checkKit,
	createSignature,
	parameterError,
	isDatetime,
	sanitizeDate,
	isUrl
} = require('./utils');
const WebSocket = require('ws');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const { reject } = require('bluebird');
const FileType = require('file-type');

class HollaExNetwork {
	constructor(
		opts = {
			apiUrl: 'https://api.hollaex.network',
			baseUrl: '/v2',
			apiKey: '',
			apiSecret: '',
			apiExpiresAfter: 60,
			activation_code: undefined, // kit activation code used only for exchange operators to initialize the exchange
			kit_version: null
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

		if (opts.kit_version) {
			this.headers['kit-version'] = opts.kit_version;
		}

		this.activation_code = opts.activation_code;
		this.exchange_id = opts.exchange_id;
		this.wsUrl = null;
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Your exchange values
	 */
	async init(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.activation_code);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/init/${this.activation_code}`;
		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Created user's values on network
	 */
	createUser(email, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	/**
	 * Get all trades for the exchange on the network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of trades. Leave blank to get trades for all symbols
	 * @param {number} opts.limit - Amount of trades per page
	 * @param {number} opts.page - Page of trades data
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format
	 * @param {string} opts.endDate - End date of query in ISO8601 format
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Fields: Count, Data. Count is the number of trades on the page. Data is an array of trades
	 */
	getTrades(
		opts = {
			symbol: null,
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			format: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/user/trades?`;

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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
		}

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb, path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get all trades for a user on the network
	 * @param {number} userId - User id on network
	 * @param {object} opts - Optional parameters
	 * @param {string} opts.symbol - Symbol of trades. Leave blank to get trades for all symbols
	 * @param {number} opts.limit - Amount of trades per page
	 * @param {number} opts.page - Page of trades data
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id. Default: id
	 * @param {string} opts.order - Ascending (asc) or descending (desc). Default: desc
	 * @param {string} opts.startDate - Start date of query in ISO8601 format
	 * @param {string} opts.endDate - End date of query in ISO8601 format
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Fields: Count, Data. Count is the number of trades on the page. Data is an array of trades
	 */
	getUserTrades(
		userId,
		opts = {
			symbol: null,
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			format: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/user/trades?user_id=${userId}`;

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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
		}

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} User network data
	 */
	getUser(userId, opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/user?user_id=${userId}`;
		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get all users for the exchange on the network
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Fields: Count, Data. Count is the number of users for the exchange on the network. Data is an array of users
	 */
	getUsers(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/${this.exchange_id}/users`;
		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with new address
	 */
	createUserCryptoAddress(userId, crypto, opts = {
		network: null,
		additionalHeaders: null
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get list of wallets in the exchange
	 * @param {object} opts - Optional parameters.
	 * @param {number} opts.userId - User's id to filter wallet addresses
	 * @param {string} opts.currency - Crypto currency of the wallet
	 * @param {string} opts.network - Crypto's blockchain network
	 * @param {string} opts.address - Cryptocurrency address for the wallet
	 * @param {string} opts.isValid - Whether wallet is still active or not
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.createdAt - Start date of wallet creation query in ISO8601 format.
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Fields: Count, Data. Count is the number of Wallets on the page. Data is an array of Wallets
	 */
	getExchangeWallets(opts = {
		userId: null,
		currency: null,
		network: null,
		address: null,
		isValid: null,
		limit: null,
		page: null,
		orderBy: null,
		order: null,
		createdAt: null,
		format: null,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/wallets?`;

		if (opts.userId) {
			path += `&user_id=${opts.userId}`;
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

		if (isString(opts.address)) {
			path += `&address=${opts.address}`;
		}

		if (isDatetime(opts.createdAt)) {
			path += `&created_at=${sanitizeDate(opts.createdAt)}`;
		}

		if (opts.currency) {
			path += `&currency=${opts.currency}`;
		}

		if (opts.network) {
			path += `&network=${opts.network}`;
		}

		if (isBoolean(opts.isValid)) {
			path += `&is_valid=${opts.isValid}`;
		}

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Withdrawal made on the network
	 */
	performWithdrawal(userId, address, currency, amount, opts = {
		network: null,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!address) {
			return reject(parameterError('address', 'cannot be null'));
		} else if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		} else if (!amount || amount <= 0) {
			return reject(parameterError('amount', 'cannot be null'));
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	/**
	 * Cancel a withdrawal for an exchange's user on the network
	 * @param {number} userId - User id on network
	 * @param {string} withdrawalId - Withdrawal's id on network (not transaction id).
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Withdrawal canceled on the network
	 */
	cancelWithdrawal(userId, withdrawalId, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {string} opts.transactionId - Deposit with specific transaction ID.
	 * @param {string} opts.address - Deposits with specific address.
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
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
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null,
			format: null,
			additionalHeaders: null
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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
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

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {string} opts.transactionId - Deposit with specific transaction ID.
	 * @param {string} opts.address - Deposits with specific address.
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
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
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null,
			format: null,
			additionalHeaders: null
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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
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

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {string} opts.transactionId - Withdrawals with specific transaction ID.
	 * @param {string} opts.address - Withdrawals with specific address.
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
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
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null,
			format: null,
			additionalHeaders: null
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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
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

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {string} opts.transactionId - Withdrawals with specific transaction ID.
	 * @param {string} opts.address - Withdrawals with specific address.
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
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
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			transactionId: null,
			address: null,
			format: null,
			additionalHeaders: null
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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
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

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get the balance for the exchange on the network
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Available, pending, and total balance for all currencies for your exchange on the network
	 */
	getBalance(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/balance`;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Available, pending, and total balance for all currencies for your exchange on the network
	 */
	getUserBalance(userId, opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/balance?user_id=${userId}`;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get the balance report of all assets
	 * @param {object} opts - Optional parameters.
	 * @param {number} opts.userId - User's id to get balance data
	 * @param {string} opts.currency - Currency symbol of assets to filter. Leave blank to get withdrawals for all currencies
	 * @param {string} opts.format - Custom format of data set. Enum: ['all']
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Fields: Count, Data. Count is the number of rows on the page. Data is an array of balances for assets
	 */
	getBalances(opts = {
		userId: null,
		currency: null,
		format: null,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/balances?`;

		if (opts.userId) {
			path += `&user_id=${opts.userId}`;
		}

		if (opts.currency) {
			path += `&currency=${opts.currency}`;
		}

		if (isString(opts.format)) {
			path += `&format=${opts.format}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Create a trade for the exchange on the network
	 * @param {string} symbol - The currency pair symbol e.g. 'hex-usdt'
	 * @param {string} side - Whether this is a buy or a sell trade
	 * @param {number} price - Price set by the broker
	 * @param {number} size - Size of the trade
	 * @param {number} makerId - Network id of the maker
	 * @param {number} takerId - Network id of the taker
	 * @param {object} feeStructure - Fee rates for maker and taker
	 * @param {object} feeStructure.maker - Fee rate for maker
	 * @param {object} feeStructure.taker - Fee rate for taker
	 * @return {object} Order on the network with current data e.g. side, size, filled, etc.
	 */
	createBrokerTrade(
		symbol,
		side,
		price,
		size,
		makerId,
		takerId,
		feeStructure,
		opts = {
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		} else if (!side) {
			return reject(parameterError('side', 'cannot be null'));
		} else if (!['buy', 'sell'].includes(side)) {
			return reject(parameterError('side', 'must be buy or sell'));
		} else if (!size) {
			return reject(parameterError('size', 'cannot be null'));
		} else if (!makerId) {
			return reject(parameterError('makerId', 'cannot be null'));
		} else if (!takerId) {
			return reject(parameterError('takerId', 'cannot be null'));
		} else if (!feeStructure) {
			return reject(parameterError('feeStructure', 'cannot be null'));
		} else if (isNull(feeStructure.maker)) {
			return reject(parameterError('feeStructure.maker', 'cannot be null'));
		} else if (isNull(feeStructure.taker)) {
			return reject(parameterError('feeStructure.taker', 'cannot be null'));
		}

		const verb = 'POST';
		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/trade`;

		const data = {
			side,
			price,
			symbol,
			size,
			maker_id: makerId,
			taker_id: takerId,
			fee_structure: feeStructure
		};

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	/**
	 * Get an order for the exchange on the network
	 * @param {number} userId - Id of order's user
	 * @param {number} orderId - Order id
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Order on the network with current data e.g. side, size, filled, etc.
	 */
	getOrder(userId, orderId, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
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
			meta: null,
			additionalHeaders: null
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	/**
	 * Cancel an order for the exchange on the network
	 * @param {number} userId - Id of order's user
	 * @param {number} orderId - Order id
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Value of canceled order on the network with values side, size, filled, etc.
	 */
	cancelOrder(userId, orderId, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {array} Array of queried orders
	 */
	getOrders(
		opts = {
			symbol: null,
			side: null,
			status: null,
			open: null,
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			additionalHeaders: null
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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {array} Array of queried orders
	 */
	getUserOrders(
		userId,
		opts = {
			symbol: null,
			side: null,
			status: null,
			open: null,
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			additionalHeaders: null
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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {array} Array of canceled orders
	 */
	cancelAllOrders(userId, opts = {
		symbol: null,
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with field data that contains stats info
	 */
	getUserStats(userId, opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/user/stats?user_id=${userId}`;
		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {boolean} opts.isTestnet - Specify transaction was made on testnet blockchain.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Success or failed message
	 */
	checkTransaction(
		currency,
		transactionId,
		address,
		network,
		opts = {
			isTestnet: null,
			additionalHeaders: null
		}
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.transactionId - Custom transaction ID for transfer.
	 * @param {string} opts.description - Description of transfer.
	 * @param {boolean} opts.email - Send email to users after transfer. Default: true.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with field transaction_id
	 */
	transferAsset(
		senderId,
		receiverId,
		currency,
		amount,
		opts = {
			transactionId: null,
			description: null,
			email: null,
			additionalHeaders: null
		}
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

		if (opts.transactionId) {
			data.transaction_id = opts.transactionId;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
		} else {
			data.email = true;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	/**
	 * Get trade history for exchange on network
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.symbol - Symbol of trades.
	 * @param {string} opts.side - Side of trades.
	 * @param {number} opts.limit - Amount of trades per page. Maximum: 50. Default: 50
	 * @param {number} opts.page - Page of trades data. Default: 1
	 * @param {string} opts.orderBy - The field to order data by e.g. amount, id.
	 * @param {string} opts.order - Ascending (asc) or descending (desc).
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Count and data format.
	 */
	getTradesHistory(
		opts = {
			symbol: null,
			side: null,
			limit: null,
			page: null,
			orderBy: null,
			order: null,
			startDate: null,
			endDate: null,
			additionalHeaders: null
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

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
		}

		if (opts.symbol) {
			path += `&symbol=${opts.symbol}`;
		}

		if (opts.side) {
			path += `&side=${opts.side}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with trades
	 */
	getPublicTrades(opts = {
		symbol: null,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${this.baseUrl}/network/${this.exchange_id}/trades`;

		if (opts.symbol) {
			path += `?symbol=${opts.symbol}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with orderbook
	 */
	getOrderbook(symbol, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get top orderbooks
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with orderbook
	 */
	getOrderbooks(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/orderbooks`;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with trade history info
	 */
	getChart(from, to, symbol, resolution, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {array} Array of objects with trade history info
	 */
	getCharts(from, to, resolution, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get TradingView udf config
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with TradingView udf config
	 */
	getUdfConfig(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/udf/config`;
		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with TradingView udf history HOLCV
	 */
	getUdfHistory(from, to, symbol, resolution, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with TradingView udf symbols
	 */
	getUdfSymbols(symbol, opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!symbol) {
			return reject(parameterError('symbol', 'cannot be null'));
		}

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/udf/symbols?symbol=${symbol}`;
		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with historical data
	 */
	getTicker(symbol, opts = {
		additionalHeaders: null
	}) {
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
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Get historical data for all symbols, time interval is 5 minutes
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with historical data for all symbols
	 */
	getTickers(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/tickers`;
		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.description - Description of transfer.
	 * @param {string} opts.transactionId - Custom transaction ID for mint.
	 * @param {string} opts.address - Custom address for mint.
	 * @param {boolean} opts.status - Status of mint created. Default: true.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @param {number} opts.fee - Optional fee to display in data.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with created mint's data.
	 */
	mintAsset(userId, currency, amount, opts = {
		description: null,
		transactionId: null,
		address: null,
		status: true,
		email: true,
		fee: null,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		} else if (!amount) {
			return reject(parameterError('amount', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${this.exchange_id}/mint`;
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

		if (opts.address) {
			data.address = opts.address;
		}

		if (isBoolean(opts.status)) {
			data.status = opts.status;
		} else {
			data.status = true;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
		} else {
			data.email = true;
		}

		if (isNumber(opts.fee)) {
			data.fee = opts.fee;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
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
	 * @param {string} opts.updatedAddress - Value to update address of pending mint to.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @param {string} opts.updatedDescription - Value to update transaction description to.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
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
			updatedAddress: null,
			email: true,
			updatedDescription: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

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
		const path = `${this.baseUrl}/network/${this.exchange_id}/mint`;
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

		if (opts.updatedAddress) {
			data.updated_address = opts.updatedAddress;
		}

		if (opts.updatedDescription) {
			data.updated_description = opts.updatedDescription;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
		} else {
			data.email = true;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	/**
	 * Burn an asset you own to a user
	 * @param {number} userId; - Network id of user.
	 * @param {string} currency - Currency to burn.
	 * @param {number} amount - Amount to burn.
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.description - Description of transfer.
	 * @param {string} opts.transactionId - Custom transaction ID for burn.
	 * @param {string} opts.address - Custom address for burn.
	 * @param {boolean} opts.status - Status of burn created. Default: true.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @param {number} opts.fee - Optional fee to display in data.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with created burn's data.
	 */
	burnAsset(userId, currency, amount, opts = {
		description: null,
		transactionId: null,
		address: null,
		status: true,
		email: true,
		fee: null,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!userId) {
			return reject(parameterError('userId', 'cannot be null'));
		} else if (!currency) {
			return reject(parameterError('currency', 'cannot be null'));
		} else if (!amount) {
			return reject(parameterError('amount', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${this.exchange_id}/burn`;
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

		if (opts.address) {
			data.address = opts.address;
		}

		if (isBoolean(opts.status)) {
			data.status = opts.status;
		} else {
			data.status = true;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
		} else {
			data.email = true;
		}

		if (isNumber(opts.fee)) {
			data.fee = opts.fee;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
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
	 * @param {string} opts.updatedAddress - Value to update address of pending burn to.
	 * @param {boolean} opts.email - Send email notification to user. Default: true.
	 * @param {string} opts.updatedDescription - Value to update transaction description to.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
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
			updatedAddress: null,
			email: true,
			updatedDescription: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

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
		const path = `${this.baseUrl}/network/${this.exchange_id}/burn`;
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

		if (opts.updatedAddress) {
			data.updated_address = opts.updatedAddress;
		}

		if (opts.updatedDescription) {
			data.updated_description = opts.updatedDescription;
		}

		if (isBoolean(opts.email)) {
			data.email = opts.email;
		} else {
			data.email = true;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	/**
	 * Get generated fees for exchange
	 * @param {object} opts - Optional parameters.
	 * @param {string} opts.startDate - Start date of query in ISO8601 format.
	 * @param {string} opts.endDate - End date of query in ISO8601 format.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with generated fees
	 */
	getGeneratedFees(
		opts = {
			startDate: null,
			endDate: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/fees?`;

		if (isDatetime(opts.startDate)) {
			path += `&start_date=${sanitizeDate(opts.startDate)}`;
		}

		if (isDatetime(opts.endDate)) {
			path += `&end_date=${sanitizeDate(opts.endDate)}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	/**
	 * Settle exchange fees
	 * @param {object} opts - Optional parameters.
	 * @param {object} opts.user_id - user id that receives the fee earnings.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with settled fees.
	 */
	settleFees(opts = {
		user_id: null,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';

		let path = `${this.baseUrl}/network/${this.exchange_id}/fees/settle?`;

		if (opts.user_id) {
			path += `&user_id=${opts.user_id}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
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
	 * @param {string} opts.quote - Quote asset to convert to. Default: usdt.
	 * @param {number} opts.amount - Amount of quote asset to convert to. Default: 1.
	 * @param {object} opts.additionalHeaders - Object storing addtional headers to send with request.
	 * @return {object} Object with converted assets.
	 */
	getOraclePrices(assets = [], opts = {
		quote: 'usdt',
		amount: 1,
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!assets || !isArray(assets) || assets.length === 0) {
			return reject(parameterError('assets', 'must be an array with length greater than one'));
		}

		assets = assets.join(',');

		const verb = 'GET';
		let path = `${this.baseUrl}/oracle/prices?exchange_id=${
			this.exchange_id
		}&assets=${assets}`;

		if (isString(opts.quote)) {
			path += `&quote=${opts.quote}`;
		} else {
			path += '&quote=usdt';
		}

		if (isNumber(opts.amount)) {
			path += `&amount=${opts.amount}`;
		} else {
			path += '&amount=1';
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	getConstants(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);
		const verb = 'GET';
		let path = `${this.baseUrl}/network/${this.exchange_id}/constants`;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	getExchange(opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${this.exchange_id}/exchange`;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	updateExchange(
		fields = {
			info: null,
			isPublic: null,
			type: null,
			name: null,
			displayName: null,
			url: null,
			businessInfo: null,
			pairs: null,
			coins: null
		},
		opts = {
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		const verb = 'PUT';
		const path = `${this.baseUrl}/network/${this.exchange_id}/exchange`;
		const data = {
			id: this.exchange_id
		};

		if (isPlainObject(fields.info)) {
			data.info = fields.info;
		}

		if (isBoolean(fields.isPublic)) {
			data.is_public = fields.isPublic;
		}

		if (isString(fields.type) && ['DIY', 'Cloud', 'Enterprise'].includes(fields.type)) {
			data.type = fields.type;
		}

		if (isString(fields.name)) {
			data.name = fields.name;
		}

		if (isString(fields.displayName)) {
			data.display_name = fields.displayName;
		}

		if (isString(fields.url)) {
			data.url = fields.url;
		}

		if (isPlainObject(fields.businessInfo)) {
			data.business_info = fields.businessInfo;
		}

		if (isArray(fields.pairs) && !fields.pairs.some((pair) => !isString(pair))) {
			data.pairs = fields.pairs;
		}

		if (isArray(fields.coins) && !fields.coins.some((coin) => !isString(coin))) {
			data.coins = fields.coins;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	getAllCoins(
		opts = {
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/coin/all`;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	createCoin(
		symbol,
		fullname,
		opts = {
			code: null,
			withdrawalFee: null,
			min: null,
			max: null,
			incrementUnit: null,
			logo: null,
			meta: null,
			estimatedPrice: null,
			type: null,
			network: null,
			standard: null,
			allowDeposit: null,
			allowWithdrawal: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		if (!isString(symbol)) {
			return reject(parameterError('symbol', 'cannot be null'));
		} else if (!isString(fullname)) {
			return reject(parameterError('fullname', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/coin`;
		const data = {
			symbol,
			fullname
		};

		if (isString(opts.code)) {
			data.code = opts.code;
		}

		if (isNumber(opts.withdrawalFee) && opts.withdrawalFee >= 0) {
			data.withdrawal_fee = opts.withdrawalFee;
		}

		if (isNumber(opts.min)) {
			data.min = opts.min;
		}

		if (isNumber(opts.max)) {
			data.max = opts.max;
		}

		if (isNumber(opts.incrementUnit) && opts.incrementUnit >= 0) {
			data.increment_unit = opts.incrementUnit;
		}

		if (isUrl(opts.logo)) {
			data.logo = opts.logo;
		}

		if (isPlainObject(opts.meta)) {
			data.meta = opts.meta;
		}

		if (isNumber(opts.estimatedPrice) && opts.estimatedPrice >= 0) {
			data.estimated_price = opts.estimatedPrice;
		}

		if (isString(opts.type) && ['blockchain', 'fiat', 'other'].includes(opts.type)) {
			data.type = opts.type;
		}

		if (isString(opts.network)) {
			data.network = opts.network;
		}

		if (isString(opts.standard)) {
			data.standard = opts.standard;
		}

		if (isBoolean(opts.allowDeposit)) {
			data.allow_deposit = opts.allowDeposit;
		}

		if (isBoolean(opts.allowWithdrawal)) {
			data.allow_withdrawal = opts.allowWithdrawal;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	getCoins (
		opts = {
			search: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		const verb = 'GET';
		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/coins?`;

		if (isString(opts.search)) {
			path += `&search=${opts.search}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	updateCoin(
		code,
		fields = {
			fullname: null,
			withdrawalFee: null,
			description: null,
			withdrawalFees: null,
			depositFees: null,
			min: null,
			max: null,
			isPublic: null,
			incrementUnit: null,
			logo: null,
			meta: null,
			estimatedPrice: null,
			type: null,
			network: null,
			standard: null,
			allowDeposit: null,
			allowWithdrawal: null
		},
		opts = {
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		if (!isString(code)) {
			return reject(parameterError('code', 'cannot be null'));
		}

		if (isEmpty(fields)) {
			return reject(parameterError('fields', 'cannot be empty'));
		}

		const verb = 'PUT';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/coin`;
		const data = {};

		for (const field in fields) {
			const value = fields[field];
			const formattedField = snakeCase(field);

			switch (field) {
				case 'type':
					if (['blockchain', 'fiat', 'other'].includes(value)) {
						data[formattedField] = value;
					}
					break;
				case 'fullname':
				case 'description':
				case 'network':
				case 'standard':
					if (isString(value)) {
						data[formattedField] = value;
					}
					break;
				case 'withdrawalFee':
				case 'min':
				case 'max':
				case 'incrementUnit':
				case 'estimatedPrice':
					if (isNumber(value)) {
						data[formattedField] = value;
					}
					break;
				case 'isPublic':
				case 'allowDeposit':
				case 'allowWithdrawal':
					if (isBoolean(value)) {
						data[formattedField] = value;
					}
					break;
				case 'logo':
					if (isUrl(value)) {
						data[formattedField] = value;
					}
					break;
				case 'meta':
				case 'withdrawalFees':
					if (isPlainObject(value)) {
						data[formattedField] = value;
					}
					break;
				case 'depositFees':
					if (isPlainObject(value)) {
						data[formattedField] = value;
					}
					break;
				default:
					break;
			}
		}

		if (isEmpty(data)) {
			return reject(new Error('No updatable fields given'));
		}

		data.code = code;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	getAllPairs(
		opts = {
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		const verb = 'GET';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/pair/all`;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	createPair(
		name,
		baseCoin,
		quoteCoin,
		opts = {
			code: null,
			active: null,
			minSize: null,
			maxSize: null,
			minPrice: null,
			maxPrice: null,
			incrementSize: null,
			incrementPrice: null,
			estimatedPrice: null,
			isPublic: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		if (!isString(name)) {
			return reject(parameterError('symbol', 'cannot be null'));
		} else if (!isString(baseCoin)) {
			return reject(parameterError('baseCoin', 'cannot be null'));
		} else if (!isString(quoteCoin)) {
			return reject(parameterError('quoteCoin', 'cannot be null'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/pair`;
		const data = {
			name,
			pair_base: baseCoin,
			pair_2: quoteCoin
		};

		if (isString(opts.code)) {
			data.code = opts.code;
		}

		if (isBoolean(opts.active)) {
			data.active = opts.active;
		}

		if (isNumber(opts.minSize)) {
			data.min_size = opts.minSize;
		}

		if (isNumber(opts.maxSize)) {
			data.max_size = opts.maxSize;
		}

		if (isNumber(opts.minPrice)) {
			data.min_price = opts.minPrice;
		}

		if (isNumber(opts.maxPrice)) {
			data.max_price = opts.maxPrice;
		}

		if (isNumber(opts.incrementSize) && opts.incrementSize >= 0) {
			data.increment_size = opts.incrementSize;
		}

		if (isNumber(opts.incrementPrice) && opts.incrementPrice >= 0) {
			data.increment_price = opts.incrementPrice;
		}

		if (isNumber(opts.estimatedPrice) && opts.estimatedPrice >= 0) {
			data.estimated_price = opts.estimatedPrice;
		}

		if (isNumber(opts.incrementUnit) && opts.incrementUnit >= 0) {
			data.increment_unit = opts.incrementUnit;
		}

		if (isBoolean(opts.isPublic)) {
			data.is_public = opts.isPublic;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	getPairs (
		opts = {
			search: null,
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		const verb = 'GET';
		let path = `${this.baseUrl}/network/${
			this.exchange_id
		}/pairs?`;

		if (isString(opts.search)) {
			path += `&search=${opts.search}`;
		}

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers);
	}

	updatePair(
		code,
		fields = {
			minSize: null,
			maxSize: null,
			minPrice: null,
			maxPrice: null,
			incrementSize: null,
			incrementPrice: null,
			estimatedPrice: null,
			isPublic: null,
			circuitBreaker: null
		},
		opts = {
			additionalHeaders: null
		}
	) {
		checkKit(this.exchange_id);

		if (!isString(code)) {
			return reject(parameterError('code', 'cannot be null'));
		}

		if (isEmpty(fields)) {
			return reject(parameterError('fields', 'cannot be empty'));
		}

		const verb = 'PUT';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/pair`;
		const data = {};

		for (const field in fields) {
			const value = fields[field];
			const formattedField = snakeCase(field);

			switch (field) {
				case 'minSize':
				case 'maxSize':
				case 'minPrice':
				case 'maxPrice':
				case 'incrementSize':
				case 'incrementPrice':
				case 'estimatedPrice':
					if (isNumber(value)) {
						data[formattedField] = value;
					}
					break;
				case 'isPublic':
				case 'circuitBreaker':
					if (isBoolean(value)) {
						data[formattedField] = value;
					}
					break;
				default:
					break;
			}
		}

		if (isEmpty(data)) {
			return reject(new Error('No updatable fields given'));
		}

		data.code = code;

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders) ? { ...this.headers, ...opts.additionalHeaders } : this.headers,
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			data
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { data });
	}

	async uploadIcon(image, name, opts = {
		additionalHeaders: null
	}) {
		checkKit(this.exchange_id);

		if (!isBuffer(image)) {
			return reject(parameterError('image', 'must be a buffer'));
		} else if (!isString(name)) {
			return reject(parameterError('name', 'cannot be null'));
		}

		const { ext, mime } = await FileType.fromBuffer(image);

		if (mime.indexOf('image/') !== 0) {
			return reject(parameterError('image', 'must be an image'));
		}

		const verb = 'POST';
		const path = `${this.baseUrl}/network/${
			this.exchange_id
		}/icon`;

		const formData = {
			file: {
				value: image,
				options: {
					filename: `${name}.${ext}`,
					contentType: mime
				}
			},
			file_name: name
		};

		const headers = generateHeaders(
			isPlainObject(opts.additionalHeaders)
				? { ...this.headers, ...opts.additionalHeaders, 'content-type': 'multipart/form-data' }
				: { ...this.headers, 'content-type': 'multipart/form-data' },
			this.apiSecret,
			verb,
			path,
			this.apiExpiresAfter,
			omit(formData, [ 'file' ])
		);

		return createRequest(verb, `${this.apiUrl}${path}`, headers, { formData });
	}

	/**
	 * Connect to websocket
	 * @param {array} events - Array of events to connect to
	 */
	connect(events = []) {
		checkKit(this.exchange_id);

		const [ protocol, baseUrl ] = this.apiUrl.split('://');
		this.wsUrl =
			protocol === 'https'
				? `wss://${baseUrl}/stream?exchange_id=${this.exchange_id}`
				: `ws://${baseUrl}/stream?exchange_id=${this.exchange_id}`;

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
