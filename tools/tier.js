'use strict';

const { SERVER_PATH } = require('../constants');
const dbQuery = require('./database/query');
const { getModel } = require('./database');
const { getKitConfig, getKitTiers, getKitPairs, getKitPairsConfig, subscribedToPair, getTierLevels } = require('./common');
const { reject, all } = require('bluebird');
const { difference, each, omit } = require('lodash');
const { publisher } = require('./database/redis');
const { CONFIGURATION_CHANNEL } = require(`${SERVER_PATH}/constants`);
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const math = require('mathjs');
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
	} else if (Object.values(flatten(fees)).some(fee => fee < 0)) {
		return reject(new Error('Fees cannot be negative'));
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

	return getModel('tier').create({
		id: level,
		name,
		icon,
		description,
		deposit_limit,
		withdrawal_limit,
		fees,
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

			if (updateData.name) {
				newData.name = updateData.name;
			}

			if (updateData.icon) {
				newData.icon = updateData.icon;
			}

			if (updateData.note) {
				newData.note = updateData.note;
			}

			if (updateData.description) {
				newData.description = updateData.description;
			}

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

const estimateNativeCurrencyPrice = async (startingCurrency) => {

	if (!getKitConfig().native_currency) {
		throw new Error('Native currency is not set');
	} else if (startingCurrency === getKitConfig().native_currency) {
		return 1;
	}

	const pairs = Object.values(getKitPairsConfig());
	const tickers = await getNodeLib().getAllTickersEngine();
	const prices = {};

	each(tickers, (ticker, key) => {
		prices[key] = ticker.close;
	});

	if (prices[`${startingCurrency}-${getKitConfig().native_currency}`]) {
		return prices[`${startingCurrency}-${getKitConfig().native_currency}`];
	}

	const path = findPath(pairs, startingCurrency)[0];

	let estimatedPrice = 1;

	if(path) {
		convertPathToPairNames(path).forEach((pairKey) => {
			const { close = 0 } = tickers[pairKey] || {};
			estimatedPrice = math.number(math.multiply(math.bignumber(estimatedPrice), math.bignumber(close)));
		});
	} else {
		estimatedPrice = 0;
	}

	return estimatedPrice;
};

const findPath = (connections = [], start, end = getKitConfig().native_currency, source_key = 'pair_base', target_key = 'pair_2') => {
	const connectionsFromStart = connections.filter(({ [source_key]: source }) => source === start);
	const connectionsFromStartToEnd = connectionsFromStart.filter(({ [target_key]: target }) => target === end);

	if (connectionsFromStartToEnd.length !== 0) return [connectionsFromStartToEnd];

	const paths = [];

	connectionsFromStart.forEach((intermediaryNode) => {
		const connectionsFromIntermediaryToEnd = findPath(connections, intermediaryNode[target_key], end);
		connectionsFromIntermediaryToEnd.forEach((intermediaryConnections) => {
			paths.push([intermediaryNode, ...intermediaryConnections]);
		});
	});

	return paths;
};

const convertPathToPairNames = (path = [], from_key = 'pair_base', to_key = 'pair_2', separator = '-') =>{
	return path.map(({ [from_key]: from, [to_key]: to}) => `${from}${separator}${to}`);
};

const updatePairFees = (pair, fees) => {
	if (!subscribedToPair(pair)) {
		return reject(new Error('Invalid pair'));
	}

	const tiersToUpdate = Object.keys(fees);

	if (difference(tiersToUpdate, getTierLevels()).length > 0) {
		return reject(new Error('Invalid tier level given'));
	}

	if (Object.values(flatten(fees)).some(fee => fee < 0)) {
		return reject(new Error('Fees cannot be negative'));
	}

	return getModel('sequelize').transaction((transaction) => {
		return all(tiersToUpdate.map(async (level) => {

			const tier = await dbQuery.findOne('tier', { where: { id: level } });

			const updatedFees = {
				maker: { ...tier.fees.maker },
				taker: { ...tier.fees.taker }
			};
			updatedFees.maker[pair] = fees[level].maker;
			updatedFees.taker[pair] = fees[level].taker;

			const updatedTier = await tier.update(
				{ fees: updatedFees },
				{ fields: ['fees'], transaction }
			);

			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update',
					data: {
						tiers: {
							[updatedTier.id]: updatedTier
						}
					}
				})
			);

			return updatedTier;
		}));
	});
};

const updatePairLimits = (pair, limits) => {
	if (!subscribedToPair(pair)) {
		return reject(new Error('Invalid pair'));
	}

	const tiersToUpdate = Object.keys(limits);

	if (difference(tiersToUpdate, getTierLevels()).length > 0) {
		return reject(new Error('Invalid tier level given'));
	}

	if (Object.values(flatten(limits)).some(limit => limit < 0 && limit !== -1)) {
		return reject(new Error('Limits can be either -1 or GTE 0'));
	}

	return getModel('sequelize').transaction((transaction) => {
		return all(tiersToUpdate.map(async (level) => {

			const tier = await dbQuery.findOne('tier', { where: { id: level } });

			const deposit_limit = limits[level].deposit_limit || tier.deposit_limit;
			const withdrawal_limit = limits[level].withdrawal_limit || tier.withdrawal_limit;

			const updatedTier = await tier.update(
				{ deposit_limit, withdrawal_limit },
				{ fields: [ 'deposit_limit', 'withdrawal_limit' ], transaction }
			);

			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update',
					data: {
						tiers: {
							[updatedTier.id]: updatedTier
						}
					}
				})
			);

			return updatedTier;
		}));
	});
};

module.exports = {
	findTier,
	createTier,
	updateTier,
	estimateNativeCurrencyPrice,
	updatePairFees,
	updatePairLimits
};
