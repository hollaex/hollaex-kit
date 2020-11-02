'use strict';

const { findIndex } = require('lodash');
const { loggerWebsocket } = require('../config/logger');

let channels = {};

let chatChannels = {};

const getChannels = () => {
	return channels;
};

const getChatChannels = () => {
	return chatChannels;
};

const addChatSubscriber = (channel, ws) => {
	if (!chatChannels[channel]) {
		chatChannels[channel] = [];
	}

	const index = findIndex(chatChannels[channel], socket => {
		return socket.id == ws.id;
	});

	if (index === -1) {
		chatChannels[channel].push(ws);
		loggerWebsocket.verbose('ws/channel/addChatSubscriber', channel, ws.id);
	} else {
		throw new Error(`Already subscribed to channel ${channel}`);
	}
};

const removeChatSubscriber = (channel, ws) => {
	const index = findIndex(chatChannels[channel], socket => {
		return socket.id == ws.id;
	});

	if (index > -1) {
		chatChannels[channel].splice(index, 1);
		if (channels[channel].length === 0) {
			delete channels[channel];
		}
		loggerWebsocket.verbose('ws/channel/removeChatSubscriber', channel, ws.id);
	} else {
		throw new Error(`Not subscribed to channel ${channel}`);
	}
};

const addSubscriber = (channel, ws) => {
	if (!channels[channel]) {
		channels[channel] = [];
	}

	const index = findIndex(channels[channel], socket => {
		return socket.id == ws.id;
	});

	if (index === -1) {
		channels[channel].push(ws);
		loggerWebsocket.verbose('ws/channel/addSubscriber', channel, ws.id);
	} else {
		throw new Error(`Already subscribed to channel ${channel}`);
	}
};

const removeSubscriber = (channel, ws, type = undefined) => {
	const index = findIndex(channels[channel], socket => {
		return socket.id == ws.id;
	});

	if (index > -1) {
		channels[channel].splice(index, 1);
		if (type === 'private' && channels[channel].length === 0) {
			delete channels[channel];
		}
		loggerWebsocket.verbose('ws/channel/removeSubscriber', channel, ws.id);
	} else {
		throw new Error(`Not subscribed to channel ${channel}`);
	}
};

const resetChannels = () => {
	channels = {};
	chatChannels = {};
};

module.exports = {
	getChannels,
	getChatChannels,
	addSubscriber,
	addChatSubscriber,
	removeSubscriber,
	removeChatSubscriber,
	resetChannels
};