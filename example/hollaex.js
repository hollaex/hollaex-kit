const HollaEx = require('../index');
require('dotenv').load();

const API_KEY = process.env.API_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
const client = new HollaEx({ apiKey: API_KEY, apiSecret: API_SECRET });

client
	.getTicker('xht-usdt')
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

	symbols : xht-usdt
*/

const socket1 = client.connect('trades:xht-usdt');

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
