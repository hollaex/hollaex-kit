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

const updateTier = (level, updateData) => {
	const existingTiers = getKitTiers();

	if (!existingTiers[level]) {
		return reject(new Error('Tier does not exist'));
	}

	if (
		updateData.fees
		&& updateData.fees.maker
		&& Object.keys(updateData.fees.maker).length > 0
		&& difference(Object.keys(updateData.fees.maker), getKitPairs()).length > 0
	) {
		return reject(new Error('Fees includes a symbol that you are not subscribed to'));
	}

	if (
		updateData.fees
		&& updateData.fees.taker
		&& Object.keys(updateData.fees.taker).length > 0
		&& difference(Object.keys(updateData.fees.taker), getKitPairs()).length > 0
	) {
		return reject(new Error('Fees includes a symbol that you are not subscribed to'));
	}

	return dbQuery.findOne('tier', {
		where: {
			id: level
		}
	})
		.then((tier) => {
			const newData = {};

			let updatedMakerFee = tier.fees.maker;
			if (
				updateData.fees
				&& updateData.fees.maker
			) {
				updatedMakerFee = { ...updatedMakerFee, ...updateData.fees.maker };
			}

			let updatedTakerFee = tier.fees.taker;
			if (
				updateData.fees
				&& updateData.fees.taker
			) {
				updatedTakerFee = { ...updatedTakerFee, ...updateData.fees.taker };
			}

			if (updateData.name) {
				newData.name = updateData.name;
			}

			if (updateData.description) {
				newData.description = updateData.description;
			}

			if (updateData.deposit_limit) {
				newData.deposit_limit = updateData.deposit_limit;
			}

			if (updateData.withdrawal_limit) {
				newData.withdrawal_limit = updateData.deposit_limit;
			}

			newData.fees = {
				maker: updatedMakerFee,
				taker: updatedTakerFee
			};

			return tier.update(newData, { returning: true });
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
	createTier,
	updateTier
};
