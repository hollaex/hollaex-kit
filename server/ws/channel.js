'use strict';

const { findIndex } = require('lodash');
const { loggerWebsocket } = require('../config/logger');

let channels = {};

const getChannels = () => {
	return channels;
};

const addSubscriber = (channel, ws) => {
	if (!channels[channel]) {
		channels[channel] = [];
	}

	const index = findIndex(channels[channel], (socket) => {
		return socket.id == ws.id;
	});

	if (index === -1) {
		channels[channel].push(ws);
		loggerWebsocket.verbose(ws.id, 'ws/channel/addSubscriber', channel, ws.id);
	} else {
		throw new Error(`Already subscribed to channel ${channel}`);
	}
};

const removeSubscriber = (channel, ws, type = undefined) => {
	const index = findIndex(channels[channel], (socket) => {
		return socket.id == ws.id;
	});

	if (index > -1) {
		channels[channel].splice(index, 1);
		if (type === 'private' && channels[channel].length === 0) {
			delete channels[channel];
		}
		loggerWebsocket.verbose(ws.id, 'ws/channel/removeSubscriber', channel, ws.id);
	} else {
		throw new Error(`Not subscribed to channel ${channel}`);
	}
};

const resetChannels = () => {
	channels = {};
};

module.exports = {
	getChannels,
	addSubscriber,
	removeSubscriber,
	resetChannels
};