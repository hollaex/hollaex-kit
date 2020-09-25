'use strict';

const { findIndex } = require('lodash');
const { loggerWebsocket } = require('../config/logger');

var channels = {};

const getChannels = () => {
	return channels;
};

const addSubscriber = (channel, ws) => {
	if (!channels[channel]) {
		channels[channel] = [];
	}
	channels[channel].push(ws);
	loggerWebsocket.verbose('ws/channel/addSubscriber', channel, ws.id);
};

const removeSubscriber = (channel, ws) => {
	const index = findIndex(channels[channel], socket => {
		return socket.id == ws.id;
	});

	if (index > -1) {
		channels[channel].splice(index, 1);
		loggerWebsocket.verbose('ws/channel/removeSubscriber', channel, ws.id);
	}
};

module.exports = {
	getChannels,
	addSubscriber,
	removeSubscriber
};