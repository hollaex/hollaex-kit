const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var client = new HollaEx({accessToken : ACCESS_TOKEN});

//Public rest API

client.getPublicAPI('trades', 'btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("Get Ticker: ", data)
	});

// client.getTickers('btc-eur')
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Ticker: ", data)
// 	});
//
// //Private rest API
// client.getUser()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get User: ", data)
// 	});

// client.getDeposits()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Deposit: ", data)
// 	});
// client.getWithdrawals()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Withdrawal: ", data)
// 	});
// client.getUserTrades()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get User Trades: ", data)
// 	});
// client.createOrder('btc-eur', 'buy', 1, 'market', 1);
// client.createOrder('btc-eur', 'buy', 1, 'market', 1);
// client.createOrder('btc-eur', 'sell', 1, 'market', 1);
// client.getAllOrders ()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Orders: ", data)
// 	});


// connect to websocket
/*
	events : trades, orderbook, ticker,chartData, chartTicker,privateUser, privateWallet, privateOrders

	symbols : btc-eur, eth-btc, eth-eur
*/

// const socket = client.connectSocket(['trades:btc-eur', 'chartData:eth-btc', 'privateUser']);
//
// // client.checkConnection();
// socket.on('trades', (data) => {
// 	console.log(data)
// })
// socket.on('user', (data) => {
// 	console.log(data)
// })
// socket.on('data', (data) => {
// 	console.log(data)
// })
