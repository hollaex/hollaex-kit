'use strict';

const WebSocket = require('ws');
const moment = require('moment');
const toolsLib = require('hollaex-tools-lib');
const { handleHubData } = require('./sub');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const { isString } = require('lodash');

const apiExpires = moment().toISOString() + 60;
let ws;

const connect = () => {
	toolsLib.database.findOne('status', { raw: true })
		.then(({ api_key, api_secret }) => {
			const signature = toolsLib.auth.createHmacSignature(api_secret, 'CONNECT', '/stream', apiExpires);

			ws = new WebSocket('wss://api.testnet.hollaex.network/stream?exchange_id=106', {
				headers : {
					'api-key': api_key,
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

			ws.on('close', () => {
				console.log('close');
			});

			ws.on('message', (data) => {
				if (data !== 'pong') {
					try {
						data = JSON.parse(data);
					} catch (err) {
						console.log('err', err);
					}
					handleHubData(data);
				}
			});

			setWsHeartbeat(ws, 'ping', {
				pingTimeout: 60000,
				pingInterval: 25000,
			});
		});
};

const sendNetworkWsMessage = (op, topic, networkId) => {
	if (ws) {
		ws.send(JSON.stringify({ op, args: [`${topic}:${networkId}`] }));
	}
};

module.exports = {
	sendNetworkWsMessage,
	connect
};
