const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
// var client = new HollaEx({accessToken : ACCESS_TOCKEN});
var client = new HollaEx({accessToken : ACCESS_TOKEN});


client.getTicker('btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("Get Ticker: ", data)
	});

	client.connectSocket();

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
//
// client.getAllOrders ()
// 	.then(res => {
// 		let data = JSON.parse(res)
// 		console.log("Get Orders: ", data)
// 	});
