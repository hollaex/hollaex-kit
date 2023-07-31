'use strict';
import { storeData, restoreData } from './utils';
import { getUserIdByUsername } from './username';
import { loggerChat } from '../../config/logger';
import { getChannels } from '../channel';
import { each } from 'lodash';
import { WEBSOCKET_CHANNEL } from '../../constants';


const BANS_KEY = 'WS:BANS';

let BANS: any = {};

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

export {
	banUser,
	unbanUser,
	isUserBanned,
	sendBannedUsers
};
