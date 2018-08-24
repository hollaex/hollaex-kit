var Promise = require('bluebird');
var io = require('socket.io-client');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

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

	/* Make any request */
	/* types: publicAPI, privateAPI, socket */

	allRequest(allEvents){
		const promises = allEvents.map(([type, ...events])=>{
			if(type === 'publicAPI'){
				this.getPublicAPI(events);
			} else if (type === 'privateAPI'){
				this.getPrivateAPI(events);
			} else if (type === 'socket'){
				this.connectSocket(events);
			}
		})
		return Promise.all(promises);
	}


	/* Public */

 /* events: ticker, orderbooks, trades */

	getPublicAPI(events){
		const eventArr = events.map(oneEvent=>{
			 return oneEvent.split(":");
		 });
		const promises = eventArr.map(([event, symbol])=>{
			console.log('getting', symbol, event);
			return createRequest('GET', `${this._url}/${event}?symbol=${symbol}`, this._headers);
		});
		return Promise.all(promises);
	}

	// // Ticker
	// getTickers(symbol) {
	// 	return createRequest('GET', `${this._url}/ticker?symbol=${symbol}`, this._headers);
	// }
	//
	// // Orderbook
	// getOrderbooks(symbol) {
	// 	return createRequest ('GET' , `${this._url}/orderbooks?symbol=${symbol}` , this._headers);
	// }
	//
	// // Trades
	// getTrades(symbol) {
	// 	return createRequest ('GET', `${this._url}/trades?symbol=${symbol}` , this._headers )
	// }

	/*********************************************************************************************************

	/* Private */

	/* events: user,balance,deposits,withdrawals,trades */
	getPrivateAPI(events){
		const promises = events.map(event=>{
			console.log('getting', event);
			if (event === 'user'){
				return createRequest('GET', `${this._url}/user`, this._headers);
			} else {
				return createRequest('GET', `${this._url}/user/${event}`, this._headers);
			}
		});
		return Promise.all(promises);
	}

	// // User
	// getUser() {
	// 	return createRequest('GET', `${this._url}/user`, this._headers);
	// }
	//
	// // Balance
	// getBalance() {
	// 	return createRequest('GET',`${this._url}/user/balance` , this._headers);
	// }
	//
	// // Deposits
	// getDeposits() {
	// 	return createRequest('GET',`${this._url}/user/deposits` , this._headers);
	// }
	//
	// // Withdrawal
	// getWithdrawals() {
	// 	return createRequest('GET',`${this._url}/user/withdrawals` , this._headers);
	// }
	//
	// // Trades
	// getUserTrades() {
	// 	return createRequest('GET',`${this._url}/user/trades` , this._headers);
	// }

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
	/*********************************************************************************************************

	//Websocket
	/* Public */

	connectSocket(events){
		const realtime = ['trades', 'orderbook', 'ticker'];
		const chart = ['chartData', 'chartTicker'];
		const privateUser = ['privateUser', 'privateWallet', 'privateOrders', 'privateTrades', 'privateUpdate'];
		const myEmitter = new MyEmitter();

		const eventArr = events.map(oneEvent=>{
			 return oneEvent.split(":");
		 });

		eventArr.map(([event,symbol])=>{
			if(realtime.includes(event)) {
				if(symbol){
					this.publicSocket = io(`${this._wsUrl}/realtime`, {
						// if you dont pass anything it will return all symbols
						query: { symbol }
					});
				} else {
					this.publicSocket = io(`${this._wsUrl}/realtime`);
				}
				this.publicSocket.on(event, (data) => {
					myEmitter.emit(event, data)
				});
				console.log(`connecting to real time ${event} for ${symbol?symbol:'all symbols'}`);
			}
			if(chart.includes(event)){
				event = event.slice(5).toLowerCase();
				if(symbol){
					this.publicSocket = io(`${this._wsUrl}/chart`, {
						// if you dont pass anything it will return all symbols
						query: { symbol }
					});
				} else {
					this.publicSocket = io(`${this._wsUrl}/chart`);
				}
				this.publicSocket.on(event, (data) => {
					myEmitter.emit(event, data)
				});
				console.log(`connecting to chart ${event} for ${symbol?symbol:'all symbols'}`);
			}

			if(privateUser.includes(event)){
				event = event.slice(7).toLowerCase();
				this.privateSocket = io(`${this._wsUrl}/user`, {
					query: {
						token: `Bearer ${this._accessToken}`
					}
				});
				this.privateSocket.on(event, (data) => {
					myEmitter.emit(event, data)
				});
				console.log(`connecting to private ${event}`);
			}
		})
		return myEmitter;
	}


	// // Real Time Connect
	// connectRealTimeSocket(symbol) {
	// 	if(symbol){
	// 		this.publicSocket = io(`${this._wsUrl}/realtime`, {
	// 			// if you dont pass anything it will return all symbols
	// 			query: { symbol }
	// 		});
	// 		console.log('connecting realtime', symbol);
	// 	} else {
	// 		this.publicSocket = io(`${this._wsUrl}/realtime`);
	// 		console.log('connecting realtime all symbols');
	// 	}
	// }
	//
	// // Real Time Trades
	// socketRealTimeTrades(){
	// 	this.publicSocket.on('trades', (data) => {
	// 		console.log(data)
	// 	});
	// 	console.log('getting real time trades');
	// }
	//
	// // Real Time Orderbook
	// socketRealTimeOrderbook(){
	// 	this.publicSocket.on('orderbook', (data) => {
	// 		console.log(data)
	// 	});
	// 	console.log('getting real time orderbooks')
	// }
	//
	// // Real Time Ticker
	// socketRealTimeTicker(){
	// 	this.publicSocket.on('ticker', (data) => {
	// 		console.log(data)
	// 	});
	// 	console.log('getting real time ticker')
	// }
	//
	// // Chart Connect
	// connectChartSocket(symbol) {
	// 	if(symbol){
	// 		this.publicSocket = io(`${this._wsUrl}/chart`, {
	// 			// if you dont pass anything it will return all symbols
	// 			query: { symbol }
	// 		});
	// 		console.log('connecting chart', symbol);
	// 	} else {
	// 		this.publicSocket = io(`${this._wsUrl}/chart`);
	// 		console.log('connecting all symbols');
	// 	}
	// }
	//
	// // Chart data
	// socketChartData(){
	// 	this.publicSocket.on('data', (data) => {
	// 		console.log(data)
	// 	});
	// 	console.log('getting chart data');
	// }


	/*********************************************************************************************************
	/* Private */

	// connectPrivateSocket(event){
	// 	this.privateSocket = io(`${this._wsUrl}/user`, {
	// 		query: {
	// 			token: `Bearer ${this._accessToken}`
	// 		}
	// 	});
	//
	// 	this.privateSocket.on(event, (data) => {
	// 		console.log(data);
	// 	});
	// 	console.log(`connecting to ${event}`)
	//
	// }


		// Check current socket connection
		checkConnection(){
			if(this.publicSocket|| this.privateSocket){
				console.log(this.publicSocket || this.privateSocket);
				this.publicSocket ? console.log(`connected to public socket ${this.publicSocket['nsp']}`)
					: console.log(`connected to private socket ${this.privateSocket['nsp']}`);
			} else {
				console.log('no socket connecting established');
			}
		}


	/********************************************************************* TO BE ADDED MORE... */
}

module.exports = HollaEx;
