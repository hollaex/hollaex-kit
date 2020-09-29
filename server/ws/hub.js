'use strict';

const moment = require('moment');
const toolsLib = require('hollaex-tools-lib');
const { handleHubData } = require('./sub');

const apiExpires = moment().toISOString() + 60;
const signature = toolsLib.auth.createHmacSignature(toolsLib.getNetworkKeySecret().apiSecret, 'CONNECT', '/stream', apiExpires);
const ws = new WebSocket('ws://localhost/stream?exchange_id=1', {
	headers : {
		'api-key': toolsLib.getNetworkKeySecret().apiKey,
		'api-signature': signature,
		'api-expires': apiExpires
	}
});

ws.on('open', () => {
	ws.send(JSON.stringify({
		op: 'subscribe',
		args: ['orderbook', 'trade']
	}));
});

ws.on('error', (err) => {
	// ws.send('something');
	console.log('err', err);
});

ws.on('message', (data) => {
	try {
		data = JSON.parse(data);
	} catch (err) {
		console.log('err', err);
	}
	handleHubData(data);
	// publish to sub
});

const userNetworkSubscribe = (networkId, topic) => {
	ws.send(JSON.stringify({ op: 'subscribe', args: [`${topic}:${networkId}`] }));
};

module.exports = {
	userNetworkSubscribe
};
