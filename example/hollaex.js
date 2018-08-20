const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var client = new HollaEx({accessToken : ACCESS_TOKEN});

//Public rest API
client.getTickers('btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("Get Ticker: ", data)
	});

//Private rest API
client.getUser()
	.then(res => {
		let data = JSON.parse(res)
		console.log("Get User: ", data)
	});

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


// connect to Public websocket
const socket = client.connectPublicSocket('trades');
socket.on('trades', (data) => {
	console.log(data)
})
// client.connectPublicSocket('data', 'btc-eur');
// client.connectPublicSocket('orderbook', 'btc-eur');
client.checkConnection();

// client.connectRealTimeSocket();
// client.socketChartData();
// client.socketRealTimeTrades();
// client.socketRealTimeTicker();
// client.getLiveTrades('btc-eur');
// client.getLiveOrderbooks('btc-eur');
	// .then(res => {
	// 	let data = JSON.parse(res)
	// 	console.log("Get User Trades: ", data)
	// });


//connect to Private socket
client.connectPrivateSocket('wallet');
