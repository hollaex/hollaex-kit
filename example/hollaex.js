const HollaEx = require('../index');
require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
const client = new HollaEx({ accessToken: ACCESS_TOKEN });

client
	.getTicker('hex-usdt')
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

	symbols : hex-usdt
*/

const socket1 = client.connect('trades:hex-usdt');

socket1.on('trades', (data) => {
	console.log(data);
});

const socket2 = client.connect('all');

socket2.on('orderbook', (data) => {
	console.log(data);
});

// You have to use a token to use these  otherwise the socket disconnects
socket2.on('userInfo', (data) => {
	console.log(data);
});
