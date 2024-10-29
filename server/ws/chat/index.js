'use strict';
const { debounce, each } = require('lodash');
const {
	CHAT_MESSAGE_CHANNEL,
	CHAT_MAX_MESSAGES,
	WEBSOCKET_CHANNEL,
	P2P_CHAT_MESSAGE_CHANNEL
} = require('../../constants');
const { storeData, restoreData } = require('./utils');
const { isUserBanned } = require('./ban');
const moment = require('moment');
const { subscriber, publisher } = require('../../db/pubsub');
const { getChannels } = require('../channel');
const WebSocket = require('ws');

const MESSAGES_KEY = 'WS:MESSAGES';
let MESSAGES = [];

// redis subscriber, get message and updates MESSAGES array
subscriber.subscribe(CHAT_MESSAGE_CHANNEL);
subscriber.subscribe(P2P_CHAT_MESSAGE_CHANNEL);

subscriber.on('message', (channel, data) => {
	if (channel === CHAT_MESSAGE_CHANNEL) {
		data = JSON.parse(data);
		if (data.type === 'message') {
			MESSAGES.push(data.data);
		} else if (data.type === 'deleteMessage') {
			MESSAGES.splice(data.data, 1);
		}
	} else if(P2P_CHAT_MESSAGE_CHANNEL) {
		data = JSON.parse(data);
		if (data.type === 'message') { 
			publishP2PChatMessage('addMessage', data.data);
		} else if(data.type === 'status') {
			publishP2PChatMessage('getStatus', data.data);
		}
	}
});

const getMessages = (limit = CHAT_MAX_MESSAGES) => {
	return MESSAGES.slice(-limit);
};

const sendInitialMessages = (ws) => {
	ws.send(JSON.stringify({
		topic: 'chat',
		action: 'init',
		data: getMessages()
	}));
};

const addMessage = (username, verification_level, userId, message) => {
	const timestamp = moment().unix();
	if (!isUserBanned(userId)) {
		const data = {
			id: `${timestamp}-${username}`,
			username,
			verification_level,
			message,
			timestamp
		};
		publisher.publish(CHAT_MESSAGE_CHANNEL, JSON.stringify({ type: 'message', data }));
		publishChatMessage('addMessage', data);
		maintenanceMessageList();
	} else {
		throw new Error('User is banned');
	}
};

const addP2PMessage = (user_id, p2pData) => {
	const created_at = moment();
	const data = {
		id: p2pData.id,
		user_id,
		...p2pData,
		created_at
	};
	publisher.publish(P2P_CHAT_MESSAGE_CHANNEL, JSON.stringify({ type: 'message', data }));
};

const getP2PStatus = (user_id, p2pData) => {
	const created_at = moment();
	const data = {
		id: p2pData.id,
		user_id,
		status: p2pData.status,
		...p2pData,
		created_at
	};
	publisher.publish(P2P_CHAT_MESSAGE_CHANNEL, JSON.stringify({ type: 'status', data }));

};

const deleteMessage = (idToDelete) => {
	const indexOfMessage = MESSAGES.findIndex(({ id }) => id === idToDelete);
	if (indexOfMessage > -1) {
		publisher.publish(CHAT_MESSAGE_CHANNEL, JSON.stringify({ type: 'deleteMessage', data: indexOfMessage }));
		maintenanceMessageList();
		publishChatMessage('deleteMessage', idToDelete);
	}
};

const publishChatMessage = (event, data) => {
	each(getChannels()[WEBSOCKET_CHANNEL('chat')], (ws) => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({
				topic: 'chat',
				action: event,
				data
			}));
		}
	});
};

const publishP2PChatMessage = (event, data) => {
	if (data.receiver_id) {
		each(getChannels()[WEBSOCKET_CHANNEL('p2pChat', data.receiver_id)], (ws) => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({
					topic: `p2pChat`,
					action: event,
					data
				}));
			}
		});
	};
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
	publishChatMessage,
	sendInitialMessages,
	addP2PMessage,
	getP2PStatus
};
