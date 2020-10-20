'use strict';

const { SERVER_PATH } = require('../constants');
const dbQuery = require('./database/query');
const { getModel } = require('./database');
const { getKitTiers, getKitPairs } = require('./common');
const { reject } = require('bluebird');
const { difference } = require('lodash');
const { publisher } = require('./database/redis');
const { CONFIGURATION_CHANNEL } = require(`${SERVER_PATH}/constants`);

const createTier = (level, name, description, deposit_limit, withdrawal_limit, fees = {}) => {
	const existingTiers = getKitTiers();

	if (existingTiers[level]) {
		return reject(new Error('Tier already exists'));
	}

	if (
		fees.maker
		&& Object.keys(fees.maker).length > 0
		&& difference(Object.keys(fees.maker), getKitPairs()).length > 0
	) {
		return reject(new Error('Fees includes a symbol that you are not subscribed to'));
	}

	if (
		fees.taker
		&& Object.keys(fees.taker).length > 0
		&& difference(Object.keys(fees.taker), getKitPairs()).length > 0
	) {
		return reject(new Error('Fees includes a symbol that you are not subscribed to'));
	}

	return getModel('tier').create({
		id: level,
		name,
		description,
		deposit_limit,
		withdrawal_limit,
		fees
	})
		.then((tier) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update',
					data: {
						tiers: {
							[tier.id]: tier
						}
					}
				})
			);
			return tier;
		});
};

module.exports = {
	createTier
};
