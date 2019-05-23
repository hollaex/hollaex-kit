const HollaEx = require('../index');
require('dotenv').load();

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
	events (emitted) : trades (trades), orderbook (orderbook), user (userInfo, userWallet, userOrder, userTrades, userUpdate), all

	symbols : btc-eur, eth-btc, eth-eur
*/

const socket = client.connect('all');

socket.on('trades', (data) => {
	console.log(data);
});
socket.on('orderbook', (data) => {
	console.log(data);
});

// You have to use a token to use these  otherwise the socket disconnects
socket.on('userInfo', (data) => {
	console.log(data);
});
