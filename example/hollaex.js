const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var client = new HollaEx({accessToken : ACCESS_TOKEN});


// client.getTickers('btc-eur')
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Ticker: ", data)
// 	});


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

// client.connectPublicSocket('trades');
// client.connectPublicSocket('data', 'btc-eur');
// client.connectPublicSocket('orderbook', 'btc-eur');
// client.checkConnection();

//connect to private socket
client.connectPrivateSocket('update');


// client.connectChartSocket();
// client.socketChartData();
// client.socketRealTimeTrades
// client.socketRealTimeOrderbook();
// client.socketRealTimeTicker();


// client.getLiveTrades('btc-eur');
// client.getLiveOrderbooks('btc-eur');
	// .then(res => {
	// 	let data = JSON.parse(res)
	// 	console.log("Get User Trades: ", data)
	// });

// client.createOrder('btc-eur', 'buy', 1, 'market', 1);
// client.createOrder('btc-eur', 'buy', 1, 'market', 1);
// client.createOrder('btc-eur', 'sell', 1, 'market', 1);
//
// client.getAllOrders ()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Orders: ", data)
// 	});
