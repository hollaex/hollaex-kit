const io = require('socket.io-client');
const EventEmitter = require('events');
const moment = require('moment');
const { each, isBoolean } = require('lodash');
const { createRequest, createSignature, generateHeaders, checkKit } = require('./utils');
const HOLLAEX_NETWORK_URL = 'https://api.testnet.hollaex.network';
const HOLLAEX_NETWORK_VERSION = '/v2';

class HollaEx {
	constructor(
		opts = {
			apiURL: 'https://api.hollaex.com',
			baseURL: '/v2',
			apiKey: '',
			apiSecret: '',
			apiExpiresAfter: 60,
			activation_code: undefined // kit activation code used only for exchange operators to initialize the exchange
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
		this.activation_code = opts.activation_code;
		this.exchange_id = opts.exchange_id;
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
		const data = { currency, amount, address, fee: 0 };
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
		const path = `${this.baseUrl}/user/orders/${orderId}`;
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
		const path = `${this.baseUrl}/user/orders/${orderId}`;
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
	connect(events) {
		const apiExpires = moment().toISOString() + this.apiExpiresAfter;
		const signature = createSignature(this.apiSecret, 'CONNECT', '/socket', apiExpires);
		return new Socket(events, this.apiUrl, this.apiKey, signature, apiExpires);
	}

	/* Kit Operator Network Endpoints*/

	/**
	 * Initialize your Kit for HollaEx Network. Must have passed activation_code in constructor
	 * @return {object} Your exchange values
	 */
	async initNetwork() {
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
	createUserNetwork(email) {
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
	getAllTradeNetwork(userId, symbol, limit = 50, page = 1, orderBy = 'id', order = 'desc', startDate = 0, endDate = moment().toISOString()) {
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

	getUserNetwork(userId) {
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
	getAllUserNetwork() {
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
	createWithdrawalNetwork(userId, address, currency, amount, fee) {
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

	cancelWithdrawalNetwork(userId, transactionId) {
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
	getAllDepositNetwork(
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
			path += `$status=${status}`;
		}
		if (isBoolean(dismissed)) {
			path += `$dismissed=${dismissed}`;
		}
		if (isBoolean(rejected)) {
			path += `$rejected=${rejected}`;
		}
		if (isBoolean(processing)) {
			path += `$processing=${processing}`;
		}
		if (isBoolean(waiting)) {
			path += `$waiting=${waiting}`;
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
	getAllWithdrawalNetwork(
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
			path += `$status=${status}`;
		}
		if (isBoolean(dismissed)) {
			path += `$dismissed=${dismissed}`;
		}
		if (isBoolean(rejected)) {
			path += `$rejected=${rejected}`;
		}
		if (isBoolean(processing)) {
			path += `$processing=${processing}`;
		}
		if (isBoolean(waiting)) {
			path += `$waiting=${waiting}`;
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
	getBalanceNetwork(userId) {
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
	getOrderNetwork(userId, orderId) {
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
	createOrderNetwork(userId, symbol, side, size, type, price = 0) {
		checkKit(this.exchange_id);
		const verb = 'POST';
		const path = `${HOLLAEX_NETWORK_VERSION}/kit/${this.exchange_id}/order?user_id=${userId}`;
		const data = { symbol, side, size, type, price };
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
	cancelOrderNetwork(userId, orderId) {
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
	getAllOrderNetwork(userId, symbol, side, type, limit = 50, page = 1, orderBy = 'id', order = 'desc', startDate = 0, endDate = moment().toISOString()) {
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
		if (type) {
			path += `&type=${type}`;
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
	cancelAllOrderNetwork(userId, symbol) {
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
	getUserStatsNetwork(userId) {
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
	checkTransactionNetwork(currency, transactionId, address, isTestnet = false) {
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
	transferAssetsNetwork(senderId, receiverId, currency, amount, description = '') {
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
	getTradesEngine(symbol) {
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
	getOrderbooksEngine(symbol) {
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
	getChartEngine(from, to, symbol, resolution) {
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
	 * Get TradingView udf config
	 * @return {object} Object with TradingView udf config
	 */
	getUdfConfigEngine() {
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
	getUdfHistoryEngine(from, to, symbol, resolution) {
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
	getUdfSymbolsEngine(symbol) {
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
	getTickerEngine(symbol) {
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
	getAllTickersEngine() {
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
}

/**************************************
Websocket
**************************************/
class Socket extends EventEmitter {
	constructor(events = '', url, apiKey, apiSignature, apiExpires) {
		super();
		this.events = events;
		this.url = url;
		this.apiKey = apiKey;
		this.apiSignature = apiSignature;
		this.apiExpires = apiExpires;
		this.connect(this.events, this.url, this.apiKey, this.apiSignature, this.apiExpires);
	}

	disconnect() {
		each(this.ioLink, (ioLink) => {
			ioLink.close();
		});
		this.ioLink = [];
	}

	connect(events, url, apiKey, apiSignature, apiExpires) {
		if (!Array.isArray(events)) {
			this.subs = {};
			this.ioLink = [];
			events = events.split(':');
			let [event, symbol] = events;
			switch (event) {
				case 'orderbook':
				case 'trades':
					// case 'ticker':
					if (symbol) {
						this.ioLink.push(io(`${url}/realtime`, { query: { symbol } }));
					} else {
						this.ioLink.push(io(`${url}/realtime`));
					}
					this.ioLink[this.ioLink.length - 1].on(event, (data) => {
						this.emit(event, data);
					});
					this.ioLink[this.ioLink.length - 1].on('error', (error) => {
						this.emit('error', error);
					});
					this.ioLink[this.ioLink.length - 1].on('connect_error', (data) => {
						this.emit('connect_error', `Socket Connection Error: ${data}.`);
					});
					this.ioLink[this.ioLink.length - 1].on('connect_timeout', (data) => {
						this.emit('connect_timeout', `Socket Connection Timeout : ${data}.`);
					});
					this.ioLink[this.ioLink.length - 1].once('disconnect', (data) => {
						this.emit('disconnect', `Socket Disconnect: ${data}.`);
						this.subs = this._events;
						this.removeAllListeners();
					});
					this.ioLink[this.ioLink.length - 1].once('reconnect', (attempts) => {
						this._events = this.subs;
						this.emit('reconnect', `Successfully reconnected after ${attempts} attempts.`);
					});
					break;
				case 'user':
					this.ioLink.push(io(`${url}/user`, {
						query: {
							'api-key': apiKey,
							'api-signature': apiSignature,
							'api-expires': apiExpires
						}
					}));

					this.ioLink[this.ioLink.length - 1].on('user', (data) => {
						this.emit('userInfo', data);
					});
					this.ioLink[this.ioLink.length - 1].on('wallet', (data) => {
						this.emit('userWallet', data);
					});
					this.ioLink[this.ioLink.length - 1].on('orders', (data) => {
						this.emit('userOrder', data);
					});
					this.ioLink[this.ioLink.length - 1].on('trades', (data) => {
						this.emit('userTrade', data);
					});
					this.ioLink[this.ioLink.length - 1].on('update', (data) => {
						this.emit('userUpdate', data);
					});
					this.ioLink[this.ioLink.length - 1].on('error', (error) => {
						this.emit('error', error);
					});
					this.ioLink[this.ioLink.length - 1].on('connect_error', (data) => {
						this.emit('connect_error', `Socket Connection Error: ${data}.`);
					});
					this.ioLink[this.ioLink.length - 1].on('connect_timeout', (data) => {
						this.emit('connect_timeout', `Socket Connection Timeout : ${data}.`);
					});
					this.ioLink[this.ioLink.length - 1].once('disconnect', (data) => {
						this.emit('disconnect', `Socket Disconnect: ${data}.`);
						this.subs = this._events;
						this.removeAllListeners();
					});
					this.ioLink[this.ioLink.length - 1].once('reconnect', (attempts) => {
						this._events = this.subs;
						this.emit('reconnect', `Successfully reconnected after ${attempts} attempts.`);
					});
					break;
				case 'all':
					this.ioLink.push(io(`${url}/realtime`));

					this.ioLink[this.ioLink.length - 1].on('orderbook', (data) => {
						this.emit('orderbook', data);
					});
					this.ioLink[this.ioLink.length - 1].on('trades', (data) => {
						this.emit('trades', data);
					});

					this.ioLink.push(io(`${url}/user`, {
						query: {
							'api-key': apiKey,
							'api-signature': apiSignature,
							'api-expires': apiExpires
						}
					}));
					this.ioLink[this.ioLink.length - 1].on('user', (data) => {
						this.emit('userInfo', data);
					});
					this.ioLink[this.ioLink.length - 1].on('wallet', (data) => {
						this.emit('userWallet', data);
					});
					this.ioLink[this.ioLink.length - 1].on('orders', (data) => {
						this.emit('userOrder', data);
					});
					this.ioLink[this.ioLink.length - 1].on('trades', (data) => {
						this.emit('userTrade', data);
					});
					this.ioLink[this.ioLink.length - 1].on('update', (data) => {
						this.emit('userUpdate', data);
					});
					this.ioLink[this.ioLink.length - 1].on('error', (error) => {
						this.emit('error', error);
					});
					this.ioLink[this.ioLink.length - 1].on('connect_error', (data) => {
						this.emit('connect_error', `Socket Connection Error: ${data}.`);
					});
					this.ioLink[this.ioLink.length - 1].on('connect_timeout', (data) => {
						this.emit('connect_timeout', `Socket Connection Timeout : ${data}.`);
					});
					this.ioLink[this.ioLink.length - 1].once('disconnect', (data) => {
						this.emit('disconnect', `Socket Disconnect: ${data}.`);
						this.subs = this._events;
						this.removeAllListeners();
					});
					this.ioLink[this.ioLink.length - 1].once('reconnect', (attempts) => {
						this._events = this.subs;
						this.emit('reconnect', `Successfully reconnected after ${attempts} attempts.`);
					});
					break;
			}
		}
	}
}

module.exports = HollaEx;
