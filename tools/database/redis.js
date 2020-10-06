'use strict';

const { SERVER_PATH } = require('../../constants');

module.exports = {
	publisher: require(`${SERVER_PATH}/db/pubsub`).publisher,
	subscriber: require(`${SERVER_PATH}/db/pubsub`).subscriber,
	client: require(`${SERVER_PATH}/db/redis`).duplicate(),
};