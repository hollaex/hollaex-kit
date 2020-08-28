'use strict';

const { SERVER_PATH } = require('../../constant');

module.exports = {
	publisher: require(`${SERVER_PATH}/db/pubsub`).publisher,
	subscriber: require(`${SERVER_PATH}/db/pubsub`).subscriber,
	cli9ent: require(`${SERVER_PATH}/db/redis`).duplicate(),
};