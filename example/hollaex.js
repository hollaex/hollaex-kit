const HollaEx = require('../index');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
var client = new HollaEx({accessToken : ACCESS_TOKEN});


// connect to websocket
/*
	events : trades, orderbook, ticker, chart, user

	symbols : btc-eur, eth-btc, eth-eur
*/

const socket = client.connectSocket('all');
// const socket2 = client.connectSocket('ticker:eth-btc');

// client.checkConnection();
socket.on('ticker', (data) => {
	console.log(data)
})
socket.on('userOrder', (data) => {
	console.log(data)
})
socket.on('chart', (data) => {
	console.log(data)
})
socket.on('orderbook', (data) => {
	console.log(data)
})