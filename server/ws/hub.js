'use strict';

const WebSocket = require('ws');
const moment = require('moment');
const toolsLib = require('hollaex-tools-lib');
const { handleHubData } = require('./sub');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const { loggerWebsocket } = require('../config/logger');
const { all } = require('bluebird');
const rp = require('request-promise');

const HE_NETWORK_ENDPOINT = 'https://api.testnet.hollaex.network';
const HE_NETWORK_BASE_URL = '/v2';
const PATH_ACTIVATE = '/exchange/activate';
const HE_NETWORK_WS_ENDPOINT = 'wss://api.testnet.hollaex.network/stream';

const apiExpires = moment().toISOString() + 60;
let ws;

const reconnectInterval = 5000; // 5 seconds

const connect = () => {
	toolsLib.database.findOne('status', { raw: true })
		.then((status) => {
			return all([
				checkActivation(
					status.name,
					status.url,
					status.activation_code,
					status.constants
				),
				status
			]);
		})
		.then(([ exchange, status ]) => {
			const signature = toolsLib.auth.createHmacSignature(status.api_secret, 'CONNECT', '/stream', apiExpires);
			ws = new WebSocket(`${HE_NETWORK_WS_ENDPOINT}?exchange_id=${exchange.id}`, {
				headers : {
					'api-key': status.api_key,
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
				loggerWebsocket.error('ws/hub err', err.message);
				ws.close();
			});

			ws.on('close', () => {
				loggerWebsocket.info('ws/hub close', ws.id);
				setTimeout(connect, reconnectInterval);
			});

			ws.on('message', (data) => {
				if (data !== 'pong') {
					try {
						data = JSON.parse(data);
					} catch (err) {
						loggerWebsocket.error('ws/hub message err', err.message);
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

const checkActivation = (name, url, activation_code, constants = {}) => {
	const options = {
		method: 'POST',
		body: {
			name,
			url,
			activation_code,
			constants
		},
		uri: `${HE_NETWORK_ENDPOINT}${HE_NETWORK_BASE_URL}${PATH_ACTIVATE}`,
		json: true
	};
	return rp(options);
};

module.exports = {
	sendNetworkWsMessage,
	connect
};
