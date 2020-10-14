'use strict';
const { storeData, restoreData } = require('./utils');
const { getUserIdByUsername } = require('./username');
const { loggerChat } = require('../../config/logger');

const BANS_KEY = 'WS:BANS';

let BANS = {};

const banUser = (username) => {
	if (username) {
		return getUserIdByUsername(username).then((id) => {
			BANS[id] = username;
			storeData(BANS_KEY, BANS);
		});
	} else {
		return Promise.resolve();
	}
};

const unbanUser = (user_id) => {
	if (user_id) {
		BANS[user_id] = 0;
		delete BANS[user_id];
		storeData(BANS_KEY, BANS);
	}
};

const getBannedUsers = () => {
	return BANS;
};

const isUserBanned = (id) => {
	return BANS[id];
};

const initBanWS = (socket) => {
	socket.on('getBannedUsers', () => {
		socket.emit('bannedUsers', {
			bannedUsers: getBannedUsers()
		});
	});
	socket.on('banUser', (data) => {
		const { username } = data;
		loggerChat.debug('banUser', username);
		banUser(username).then(() => {
			socket.emit('bannedUsers', {
				bannedUsers: getBannedUsers()
			});
		});
	});

	socket.on('unbanUser', (data) => {
		const { user_id } = data;
		loggerChat.debug('unbanUser', user_id);
		unbanUser(user_id);
		socket.emit('bannedUsers', {
			bannedUsers: getBannedUsers()
		});
	});
};

restoreData(BANS_KEY).then((bans = {}) => {
	loggerChat.debug('retore_bannedUsers', bans);
	BANS = bans;
});

module.exports = {
	initBanWS,
	isUserBanned
};
