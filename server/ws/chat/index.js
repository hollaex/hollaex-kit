'use strict';
const {
	WEBSOCKET_CHAT_PUBLIC_ROOM,
	ROLES
} = require('../../constants');
const { verifyToken } = require('../../api/helpers/auth');
const { loggerChat } = require('../../config/logger');

const { getMessages, addMessage, deleteMessage } = require('./chat');
const { getUsername, changeUsername } = require('./username');
const { initBanWS } = require('./ban');

const initializeChatWS = (chat) => {
	chat.use((socket, next) => {
		const { token } = socket.handshake.query;
		socket.headers = { 'authorization': token };
		if (!token) {
			return next();
		} else {
			verifyToken(socket, null, token, (err) => {
				if (err) {
					socket.err = err.message;
					next(err);
				}
				next();
			}, true);
		}
	});

	chat.on('connection', (socket) => {
		if (socket.err) {
			loggerChat.error('connection error', socket.id, socket.err);
			return socket.disconnect(socket.err);
		}
		if (!socket.auth) {
			// user is not logged in
		}

		socket.join(WEBSOCKET_CHAT_PUBLIC_ROOM);

		loggerChat.info('init', socket.id);
		socket.emit('init', {
			messages: getMessages()
		});

		if (socket.auth) {
			const userId = socket.auth.sub.id;
			getUsername(userId).then((usernameOnDB) => {
				let { username, verification_level } = usernameOnDB;
				if (
					socket.auth.scopes.indexOf(ROLES.ADMIN) > -1 ||
					socket.auth.scopes.indexOf(ROLES.SUPERVISOR) > -1 ||
					socket.auth.scopes.indexOf(ROLES.SUPPORT) > -1
				) {
					loggerChat.info('connected admin', socket.id, username);
					socket.on('deleteMessage', deleteMessage);
					// TODO set to admin username
					socket.on('message', (data) => {
						addMessage(username, userId, verification_level)(data);
					});
					socket.on('changeUsername', (username) => {
						username = changeUsername(userId);
					});
					initBanWS(socket);
				} else {
					loggerChat.info('connected user', socket.id, username);
					socket.on('message', (data) => {
						addMessage(username, userId, verification_level)(data);
					});
					socket.on('changeUsername', () => {
						changeUsername(userId).then((newUsername) => {
							username = newUsername.username;
						});
					});
				}
			});
		}

		chat.on('disconnect', () => {});
	});
};

module.exports = {
	initializeChatWS
};
