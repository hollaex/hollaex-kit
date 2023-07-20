'use strict';

const { SERVER_PATH } = require('../../constants');
const publisher = require(`${SERVER_PATH}/db/pubsub`).publisher;
const subscriber = require(`${SERVER_PATH}/db/pubsub`).subscriber;
const client = require(`${SERVER_PATH}/db/redis`).duplicate();

module.exports = {
	publisher,
	subscriber,
	client
};