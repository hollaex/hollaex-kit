'use strict';
const { storeData, restoreData } = require('./utils');
const { getUserIdByUsername } = require('./username');
const { loggerChat } = require('../../config/logger');
const { getChannels } = require('../channel');
const { each } = require('lodash');
const { WEBSOCKET_CHANNEL } = require('../../constants');

const BANS_KEY = 'WS:BANS';

let BANS = {};

const banUser = (username) => {
	if (username) {
		getUserIdByUsername(username).then((id) => {
			BANS[id] = username;
			storeData(BANS_KEY, BANS);
			each(getChannels()[WEBSOCKET_CHANNEL('chat')], (ws) => {
				sendBannedUsers(ws);
			});
		});
	}
};

const unbanUser = (user_id) => {
	if (user_id) {
		BANS[user_id] = 0;
		delete BANS[user_id];
		storeData(BANS_KEY, BANS);
		each(getChannels()[WEBSOCKET_CHANNEL('chat')], (ws) => {
			sendBannedUsers(ws);
		});
	}
};

const getBannedUsers = () => {
	return BANS;
};

const sendBannedUsers = (ws) => {
	ws.send(JSON.stringify({
		topic: 'chat',
		action: 'bannedUsers',
		data: getBannedUsers()
	}));
};

const isUserBanned = (id) => {
	return BANS[id];
};

restoreData(BANS_KEY).then((bans = {}) => {
	loggerChat.debug('retore_bannedUsers', bans);
	BANS = bans;
});

module.exports = {
	banUser,
	unbanUser,
	isUserBanned,
	sendBannedUsers
};
