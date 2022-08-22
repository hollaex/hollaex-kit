'use strict';

const { SERVER_PATH } = require('../constants');
const dbQuery = require('./database/query');
const { getModel } = require('./database');
const { getKitTiers, getKitPairs, subscribedToPair, getTierLevels, getDefaultFees } = require('./common');
const { reject, all } = require('bluebird');
const { difference, omit, isNumber, each, isString, isBoolean } = require('lodash');
const { publisher } = require('./database/redis');
const { CONFIGURATION_CHANNEL } = require(`${SERVER_PATH}/constants`);
const flatten = require('flat');

const findTier = (level) => {
	return dbQuery.findOne('tier', {
		where: {
			id: level
		}
	})
		.then((tier) => {
			if (!tier) {
				throw new Error('Tier does not exist');
			}
			return tier;
		});
};

const createTier = (level, name, icon, description, deposit_limit, withdrawal_limit, fees = {}, note = '') => {
	const existingTiers = getKitTiers();

	if (existingTiers[level]) {
		return reject(new Error('Tier already exists'));
	} else if (
		withdrawal_limit < 0
		&& withdrawal_limit !== -1
	) {
		return reject(new Error('Withdrawal limit cannot be a negative number other than -1'));
	} else if (
		deposit_limit < 0
		&& deposit_limit !== -1
	) {
		return reject(new Error('Withdrawal limit cannot be a negative number other than -1'));
	}

	const givenMakerSymbols = Object.keys(omit(fees.maker, 'default'));
	const givenTakerSymbols = Object.keys(omit(fees.taker, 'default'));

	if (
		givenMakerSymbols.length > 0
		&& difference(givenMakerSymbols, getKitPairs()).length > 0
	) {
		return reject(new Error('Maker fees includes a symbol that you are not subscribed to'));
	} else if (
		givenTakerSymbols.length > 0
		&& difference(givenTakerSymbols, getKitPairs()).length > 0
	) {
		return reject(new Error('Taker fees includes a symbol that you are not subscribed to'));
	}

	const minFees = getDefaultFees();

	const invalidMakerFees = Object.values(flatten(fees.maker)).some((fee) => fee < minFees.maker);
	const invalidTakerFees = Object.values(flatten(fees.taker)).some((fee) => fee < minFees.taker);

	if (invalidMakerFees || invalidTakerFees) {
		return reject(new Error(`Invalid fee given. Minimum maker fee: ${minFees.maker}. Minimum taker fee: ${minFees.taker}`));
	}

	const tierFees = {
		maker: {},
		taker: {}
	};

	each(getKitPairs(), (pair) => {
		tierFees.maker[pair] = fees.maker[pair] || fees.maker.default;
		tierFees.taker[pair] = fees.taker[pair] || fees.taker.default;
	});

	return getModel('tier').create({
		id: level,
		name,
		icon,
		description,
		deposit_limit,
		withdrawal_limit,
		fees: tierFees,
		note
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
	} else if (updateData.deposit_limit !== undefined || updateData.withdrawal_limit !== undefined) {
		return reject(new Error('Cannot update limits through this endpoint'));
	} else if (updateData.fees !== undefined) {
		return reject(new Error('Cannot update fees through this endpoint'));
	}

	return findTier(level)
		.then((tier) => {
			const newData = {};

			if (isString(updateData.name)) {
				newData.name = updateData.name;
			}

			if (isString(updateData.icon)) {
				newData.icon = updateData.icon;
			}

			if (isString(updateData.note)) {
				newData.note = updateData.note;
			}

			if (isString(updateData.description)) {
				newData.description = updateData.description;
			}

			if (isBoolean(updateData.native_currency_limit)) {
				newData.native_currency_limit = updateData.native_currency_limit;
			}

			return tier.update(newData);
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

const updatePairFees = (pair, fees) => {
	if (!subscribedToPair(pair)) {
		return reject(new Error('Invalid pair'));
	}

	const tiersToUpdate = Object.keys(fees);

	if (difference(tiersToUpdate, getTierLevels()).length > 0) {
		return reject(new Error('Invalid tier level given'));
	}

	return getModel('sequelize').transaction((transaction) => {
		return all(tiersToUpdate.map(async (level) => {

			const minFees = getDefaultFees();

			if (fees[level].maker < minFees.maker || fees[level].taker < minFees.taker) {
				throw new Error(`Invalid fee given. Minimum maker fee: ${minFees.maker}. Minimum taker fee: ${minFees.taker}`);
			}

			const tier = await dbQuery.findOne('tier', { where: { id: level } });

			const updatedFees = {
				maker: { ...tier.fees.maker },
				taker: { ...tier.fees.taker }
			};
			updatedFees.maker[pair] = fees[level].maker;
			updatedFees.taker[pair] = fees[level].taker;

			return tier.update(
				{ fees: updatedFees },
				{ fields: ['fees'], transaction }
			);
		}));
	})
		.then((data) => {
			const updatedTiers = {};
			each(data, (tier) => {
				updatedTiers[tier.id] = {
					...tier.dataValues
				};
			});

			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update',
					data: {
						tiers: updatedTiers
					}
				})
			);
		});
};

const updateTiersLimits = (limits) => {
	if (!Object.keys(limits).length === 0) {
		return reject(new Error('No new limits given'));
	}

	const tiersToUpdate = Object.keys(limits);

	if (difference(tiersToUpdate, getTierLevels()).length > 0) {
		return reject(new Error('Invalid tier level given'));
	}

	if (Object.values(flatten(limits)).some((limit) => limit < 0 && limit !== -1)) {
		return reject(new Error('Limits can be either -1 or GTE 0'));
	}

	return getModel('sequelize').transaction((transaction) => {
		return all(tiersToUpdate.map(async (level) => {

			const tier = await dbQuery.findOne('tier', { where: { id: level } });

			const deposit_limit = isNumber(limits[level].deposit_limit) ? limits[level].deposit_limit : tier.deposit_limit;
			const withdrawal_limit = isNumber(limits[level].withdrawal_limit) ? limits[level].withdrawal_limit : tier.withdrawal_limit;

			return tier.update(
				{ deposit_limit, withdrawal_limit },
				{ fields: [ 'deposit_limit', 'withdrawal_limit' ], transaction }
			);
		}));
	})
		.then((data) => {
			const updatedTiers = {};
			each(data, (tier) => {
				updatedTiers[tier.id] = {
					...tier.dataValues
				};
			});

			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update',
					data: {
						tiers: updatedTiers
					}
				})
			);
		});
};

module.exports = {
	findTier,
	createTier,
	updateTier,
	updatePairFees,
	updateTiersLimits
};
