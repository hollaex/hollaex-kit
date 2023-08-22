'use strict';

const { SERVER_PATH } = require('../../constants');
export const publisher = require(`${SERVER_PATH}/db/pubsub`).publisher;
export const subscriber = require(`${SERVER_PATH}/db/pubsub`).subscriber;
export const client = require(`${SERVER_PATH}/db/redis`).duplicate();

export default {
	publisher,
	subscriber,
	client
};