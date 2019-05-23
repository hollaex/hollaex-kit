const io = require('socket.io-client');
const EventEmitter = require('events');

const { createRequest } = require('./utils');

class HollaEx {
	constructor(
		opts = {
			apiURL: 'https://api.hollaex.com',
			baseURL: '/v0',
			accessToken: ''
		}
	) {
		this._url = opts.apiURL + opts.baseURL || 'https://api.hollaex.com/v0';
		this._wsUrl = opts.apiURL || 'https://api.hollaex.com';
		this._accessToken = opts.accessToken || '';
		this._headers = {
			'content-type': 'application/json',
			Accept: 'application/json',
			Authorization: 'Bearer ' + this._accessToken
		};
	}

	/* Public */
	/* events: ticker, orderbooks, trades, constant */

	/**
	 * Retrieve last, high, low, open and close price and volume within last 24 hours
	 * @param {string} symbol - The currency pair symbol e.g. 'btc-eur'
	 * @return {string} A stringified JSON object with keys high(number), low(number), open(number), close(number), volume(number), last(number)
	 */
	getTicker(symbol) {
		return createRequest(
			'GET',
			`${this._url}/ticker?symbol=${symbol}`,
			this._headers
		);
	}

	/**
	 * Retrieve orderbook containing lists of up to the last 20 bids and asks
	 * @param {string} symbol - The currency pair symbol e.g. 'btc-eur', leave empty to get orderbook for all symbol-pairs
	 * @return {string} A stringified JSON object with the symbol-pairs as keys where the values are objects with keys bids(array of active buy orders), asks(array of active sell orders), and timestamp(string)
	 */
	getOrderbook(symbol = '') {
		return createRequest(
			'GET',
			`${this._url}/orderbooks?symbol=${symbol}`,
			this._headers
		);
	}

	/**
	 * Retrieve list of up to the last 50 trades
	 * @param {string} symbol - The currency pair symbol e.g. 'btc-eur', leave empty to get trades for all symbol-pairs
	 * @return {string} A stringified JSON object with the symbol-pairs as keys where the values are arrays of objects with keys size(number), price(number), side(string), and timestamp(string)
	 */
	getTrade(symbol = '') {
		return createRequest(
			'GET',
			`${this._url}/trades?symbol=${symbol}`,
			this._headers
		);
	}

	/**
	 * Retrieve tick size, min price, max price, min size, and max size of each symbol-pair
	 * @return {string} A stringified JSON object with the keys pairs(information on each symbol-pair such as tick_size, min/max price, and min/max size) and currencies(array of all currencies involved in hollaEx)
	 */
	getConstant() {
		return createRequest('GET', `${this._url}/constant`, this._headers);
	}

	/*********************************************************************************************************

	/* Private */
	/* events: user, balance, deposits, withdrawals, trades */

	/**
	 * Retrieve user's personal information
	 * @return {string} A stringified JSON object showing user's information such as id, email, bank_account, crypto_wallet, balance, etc
	 */
	getUser() {
		return createRequest('GET', `${this._url}/user`, this._headers);
	}

	/**
	 * Retrieve user's wallet balance
	 * @return {string} A stringified JSON object with the keys updated_at(string), fiat_balance(number), fiat_pending(number), fiat_available(number), btc_balance, btc_pending, btc_available, eth_balance, eth_pending, eth_available, bch_balance, bch_pending, bch_available
	 */
	getBalance() {
		return createRequest('GET', `${this._url}/user/balance`, this._headers);
	}

	/**
	 * Retrieve list of the user's deposits
	 * @param {string} currency The currency to filter by, pass undefined to receive data on all currencies
	 * @param {number} limit The upper limit of deposits to return, max = 100
	 * @param {number} page The page of data to receive
	 * @param {string} orderBy The field to order data by e.g. amount, created_at
	 * @param {string} order asc or desc
	 * @return {string} A stringified JSON object with the keys count(total number of user's deposits) and data(array of deposits as objects with keys id(number), type(string), amount(number), transaction_id(string), currency(string), created_at(string), status(boolean), fee(number), dismissed(boolean), rejected(boolean), description(string))
	 */
	getDeposit(currency, limit = 50, page = 1, orderBy, order = 'asc') {
		return createRequest(
			'GET',
			`${
				this._url
			}/user/deposits?limit=${limit}&page=${page}&currency=${currency}&orderBy=${orderBy}&order=${order}`,
			this._headers
		);
	}

	/****** Withdrawals ******/
	/**
	 * Retrieve list of the user's withdrawals
	 * @param {string} currency The currency to filter by, pass undefined to receive data on all currencies
	 * @param {number} limit The upper limit of withdrawals to return, max = 100
	 * @param {number} page The page of data to receive
	 * @param {string} orderBy The field to order data by e.g. amount, created_at
	 * @param {string} order asc or desc
	 * @return {string} A stringified JSON object with the keys count(total number of user's withdrawals) and data(array of withdrawals as objects with keys id(number), type(string), amount(number), transaction_id(string), currency(string), created_at(string), status(boolean), fee(number), dismissed(boolean), rejected(boolean), description(string))
	 */
	getWithdrawal(currency, limit = 50, page = 1, orderBy, order = 'asc') {
		return createRequest(
			'GET',
			`${
				this._url
			}/user/withdrawals?limit=${limit}&page=${page}&currency=${currency}&orderBy=${orderBy}&order=${order}`,
			this._headers
		);
	}

	// /**
	//  * Retrieve the withdrawal/transaction fee for a certain currency
	//  * @param {string} currency - The currency to find a fee for
	//  * @return {string} A stringified JSON object with the key fee(number)
	//  */
	// getWithdrawalFee(currency) {
	// 	if (currency === '') {
	// 		currency = undefined;
	// 	}
	// 	return createRequest(
	// 		'GET',
	// 		`${this._url}/user/withdraw/${currency}/fee`,
	// 		this._headers
	// 	);
	// }

	/**
	 * Make a withdrawal request
	 * @param {string} currency - The currency to withdrawal
	 * @param {number} amount - The amount of currency to withdrawal
	 * @param {string} address - The recipient's wallet address
	 * @return {string} A stringified JSON object {message:"Success"}
	 */
	requestWithdrawal(currency, amount, address) {
		let data = { currency, amount, address, fee: 0 };
		return createRequest(
			'POST',
			`${this._url}/user/request-withdrawal`,
			this._headers,
			data
		);
	}

	/**
	 * Retrieve list of the user's completed trades
	 * @param {string} symbol The symbol-pair to filter by, pass undefined to receive data on all currencies
	 * @param {number} limit The upper limit of completed trades to return, max = 100
	 * @param {number} page The page of data to receive
	 * @return {string} A stringified JSON object with the keys count(total number of user's completed trades) and data(array of up to the user's last 50 completed trades as objects with keys side(string), symbol(string), size(number), price(number), timestamp(string), and fee(number))
	 */
	getUserTrade(symbol, limit = 50, page = 1) {
		let queryString = `?limit=${limit}&page=${page}`;
		if (symbol) {
			queryString += `&symbol=${symbol}`;
		}
		return createRequest(
			'GET',
			`${this._url}/user/trades${queryString}`,
			this._headers
		);
	}

	/****** Orders ******/
	/**
	 * Retrieve information of a user's specific order
	 * @param {string} orderId - The id of the desired order
	 * @return {string} The selected order as a stringified JSON object with keys created_at(string), title(string), symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), filled(number)
	 */
	getOrder(orderId) {
		return createRequest(
			'GET',
			`${this._url}/user/orders/${orderId}`,
			this._headers
		);
	}

	/**
	 * Retrieve information of all the user's active orders
	 * @param {string} symbol - The currency pair symbol to filter by e.g. 'btc-eur', leave empty to retrieve information of orders of all symbols
	 * @return {string} A stringified JSON array of objects containing the user's active orders
	 */
	getAllOrder(symbol = '') {
		return createRequest(
			'GET',
			`${this._url}/user/orders?symbol=${symbol}`,
			this._headers
		);
	}

	/**
	 * Create a new order
	 * @param {string} symbol - The currency pair symbol e.g. 'btc-eur'
	 * @param {string} side - The side of the order e.g. 'buy', 'sell'
	 * @param {number} size - The amount of currency to order
	 * @param {string} type - The type of order to create e.g. 'market', 'limit'
	 * @param {number} price - The price at which to order (only required if type is 'limit')
	 * @return {string} The new order as a stringified JSON object with keys symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), and filled(number)
	 */
	createOrder(symbol, side, size, type, price) {
		let data = { symbol, side, size, type, price };
		return createRequest('POST', `${this._url}/order`, this._headers, data);
	}

	/**
	 * Cancel a user's specific order
	 * @param {string} orderId - The id of the order to be cancelled
	 * @return {string} The cancelled order as a stringified JSON object with keys symbol(string), side(string), size(number), type(string), price(number), id(string), created_by(number), and filled(number)
	 */
	cancelOrder(orderId) {
		return createRequest(
			'DELETE',
			`${this._url}/user/orders/${orderId}`,
			this._headers
		);
	}

	/**
	 * Cancel all the user's active orders, can filter by currency pair symbol
	 * @param {string} symbol - The currency pair symbol to filter by e.g. 'btc-eur', leave empty to cancel orders of all symbols
	 * @return {string} A stringified JSON array of objects containing the cancelled orders
	 */
	cancelAllOrder(symbol = '') {
		return createRequest(
			'DELETE',
			`${this._url}/user/orders?symbol=${symbol}`,
			this._headers
		);
	}

	/**
	 * Connect to hollaEx websocket and listen to an event
	 * @param {string} event - The event to listen to
	 * @return {class} A new socket class that listens to the hollaEx websocket server and emits the event being passed
	 */
	connect(events) {
		return new Socket(events, this._wsUrl, this._accessToken);
	}
}

/*******************
Websocket
*******************/
class Socket extends EventEmitter {
	constructor(events = '', url, accessToken) {
		super();
		if (!Array.isArray(events)) {
			let listeners = [];
			let ioLink;
			events = events.split(':');
			let [event, symbol] = events;
			switch (event) {
				case 'orderbook':
				case 'trades':
				// case 'ticker':
					if (symbol) {
						ioLink = io(`${url}/realtime`, { query: { symbol } });
					} else {
						ioLink = io(`${url}/realtime`);
					}
					listeners.push(ioLink);
					listeners[listeners.length - 1].on(event, (data) => {
						this.emit(event, data);
					});
					break;
				// case 'chart':
				// 	if (symbol) {
				// 		ioLink = io(`${url}/chart`, { query: { symbol } });
				// 	} else {
				// 		ioLink = io(`${url}/chart`);
				// 	}
				// 	listeners.push(ioLink);
				// 	listeners[listeners.length - 1].on('data', (data) => {
				// 		this.emit(event, data);
				// 	});
				// 	listeners[listeners.length - 1].on('ticker', (data) => {
				// 		this.emit(event, data);
				// 	});
				// 	break;
				case 'user':
					ioLink = io(`${url}/user`, {
						query: { token: `Bearer ${accessToken}` }
					});

					listeners.push(ioLink);
					listeners[listeners.length - 1].on('user', (data) => {
						this.emit('userInfo', data);
					});
					listeners[listeners.length - 1].on('wallet', (data) => {
						this.emit('userWallet', data);
					});
					listeners[listeners.length - 1].on('orders', (data) => {
						this.emit('userOrder', data);
					});
					listeners[listeners.length - 1].on('trades', (data) => {
						this.emit('userTrades', data);
					});
					listeners[listeners.length - 1].on('update', (data) => {
						this.emit('userUpdate', data);
					});
					break;
				case 'all':
					ioLink = io(`${url}/realtime`);

					listeners.push(ioLink);
					listeners[listeners.length - 1].on('orderbook', (data) => {
						this.emit('orderbook', data);
					});
					// listeners[listeners.length - 1].on('ticker', (data) => {
					// 	this.emit('ticker', data);
					// });
					listeners[listeners.length - 1].on('trades', (data) => {
						this.emit('trades', data);
					});

					// ioLink = io(`${url}/chart`);

					// listeners.push(ioLink);
					// listeners[listeners.length - 1].on('data', (data) => {
					// 	this.emit(event, data);
					// });
					// listeners[listeners.length - 1].on('ticker', (data) => {
					// 	this.emit(event, data);
					// });

					ioLink = io(`${url}/user`, {
						query: { token: `Bearer ${accessToken}` }
					});

					listeners.push(ioLink);
					listeners[listeners.length - 1].on('user', (data) => {
						this.emit('userInfo', data);
					});
					listeners[listeners.length - 1].on('wallet', (data) => {
						this.emit('userWallet', data);
					});
					listeners[listeners.length - 1].on('orders', (data) => {
						this.emit('userOrder', data);
					});
					listeners[listeners.length - 1].on('trades', (data) => {
						this.emit('userTrade', data);
					});
					listeners[listeners.length - 1].on('update', (data) => {
						this.emit('userUpdate', data);
					});
					break;
			}
		}
	}
}

module.exports = HollaEx;
