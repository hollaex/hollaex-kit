const HollaEx = require('../index');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
const client = new HollaEx({ accessToken: ACCESS_TOKEN });

client
	.getTicker('btc-eur')
	.then((res) => {
		let data = JSON.parse(res);
		console.log('The volume is', data.volume);
	})
	.catch((err) => {
		console.log(err);
	});

// connect to websocket
/*
	events : trades, orderbook, ticker, chart, user

	symbols : btc-eur, eth-btc, eth-eur
*/

const socket = client.connect('all');

// client.checkConnection();
socket.on('ticker', (data) => {
	console.log(data);
});
socket.on('userOrder', (data) => {
	console.log(data);
});
socket.on('chart', (data) => {
	console.log(data);
});
socket.on('orderbook', (data) => {
	console.log(data);
});

// You have to use a token to use this otherwise the socket disconnects
socket.on('userInfo', (data) => {
	console.log(data);
});
