'use strict';

const { createServer } = require('http');
const SockerIO = require('socket.io');
const redis = require('socket.io-redis');
const config = require('../config/redis');
const { loggerWebsocket } = require('../config/logger');



const PORT = process.env.WEBSOCKET_PORT || 10080;

const server = createServer();

const io = new SockerIO(server);

const adapter = redis(config.redis);

adapter.pubClient.on('error', (err) => {
	loggerWebsocket.error('Error in PubClient');
	loggerWebsocket.error(err);
});

adapter.subClient.on('error', (err) => {
	loggerWebsocket.error('Error in SubClient');
	loggerWebsocket.error(err);
});

io.adapter(adapter);

server.listen(PORT, () => {
	loggerWebsocket.debug(`Ẃebsocket server listening on port: ${PORT}`);
});

server.on('error', (error) => {
	loggerWebsocket.error(error);
});

module.exports = io;
