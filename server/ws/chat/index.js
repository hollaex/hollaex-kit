'use strict';
const { debounce } = require('lodash');
const {
	WEBSOCKET_CHAT_CHANNEL,
	WEBSOCKET_CHAT_PUBLIC_ROOM,
	CHAT_MESSAGE_CHANNEL,
	CHAT_MAX_MESSAGES
} = require('../../constants');
const { storeData, restoreData } = require('./utils');
const { isUserBanned } = require('./ban');

const redis = require('../../db/redis').duplicate();
const { subscriber, publisher } = require('../../db/pubsub');
const emitter = require('socket.io-emitter')(redis);

const MESSAGES_KEY = 'WS:MESSAGES';
let MESSAGES = [];

// redis subscriber, get message and updates MESSAGES array
subscriber.subscribe(CHAT_MESSAGE_CHANNEL);
subscriber.on('message', (channel, data) => {
	if (channel === CHAT_MESSAGE_CHANNEL) {
		data = JSON.parse(data);
		if (data.type === 'message') {
			MESSAGES.push(data.data);
		} else if (data.type === 'deleteMessage') {
			MESSAGES.splice(data.data, 1);
		}
	}
});

const getMessages = (limit = CHAT_MAX_MESSAGES) => {
	return MESSAGES.slice(-limit);
};

const addMessage = (username, userId, verification_level) => ({ message }) => {
	const timestamp = Date.now();
	if (!isUserBanned(userId)) {
		const data = {
			id: `${timestamp}-${username}`,
			username,
			verification_level,
			message,
			timestamp
		};
		publisher.publish(CHAT_MESSAGE_CHANNEL, JSON.stringify({ type: 'message', data }));
		publishChatMessage('message', data);
		maintenanceMessageList();
	}
};

const deleteMessage = (idToDelete) => {
	const indexOfMessage = MESSAGES.findIndex(({ id }) => id === idToDelete);
	if (indexOfMessage > -1) {
		publisher.publish(CHAT_MESSAGE_CHANNEL, JSON.stringify({ type: 'deleteMessage', data: indexOfMessage }));
		maintenanceMessageList();
	}
	publishChatMessage('deleteMessage', idToDelete);
};

const publishChatMessage = (event, data, room = WEBSOCKET_CHAT_PUBLIC_ROOM) => {
	emitter
		.of(WEBSOCKET_CHAT_CHANNEL)
		.to(room)
		.emit(event, data);
};

const maintenanceMessageList = debounce(() => {
	MESSAGES = getMessages();
	storeData(MESSAGES_KEY, MESSAGES);
}, 5000);

restoreData(MESSAGES_KEY).then((messages) => {
	MESSAGES = messages;
});

module.exports = {
	getMessages,
	addMessage,
	deleteMessage,
	publishChatMessage
};
