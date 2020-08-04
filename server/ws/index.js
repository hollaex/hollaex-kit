'use strict';

const io = require('./server');

const {
	WEBSOCKET_CHAT_CHANNEL
} = require('../constants');

const { initializeChatWS } = require('./chat');

const chat = io.of(WEBSOCKET_CHAT_CHANNEL);
initializeChatWS(chat);
