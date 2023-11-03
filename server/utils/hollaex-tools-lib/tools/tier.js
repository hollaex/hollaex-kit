'use strict';

const { SERVER_PATH } = require('../constants');
const dbQuery = require('./database/query');
const { getModel } = require('./database');
const { getKitTiers, getKitPairs, subscribedToPair, getTierLevels, getDefaultFees, subscribedToCoin } = require('./common');
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

const createTier = (level, name, icon, description, fees = {}, note = '') => {
	const existingTiers = getKitTiers();

	if (existingTiers[level]) {
		return reject(new Error('Tier already exists'));
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

const findTransactionLimitPerTier = async (tier, type) => {
	const transactionLimitModel = getModel('transactionLimit');
	return transactionLimitModel.findAll({ where: { tier, type } });

};

const findTransactionLimit = async (opts = {
	id,
	tier,
	amount,
	currency,
	limit_currency,
	type,
	monthly_amount,
}) => {
	const transactionLimitModel = getModel('transactionLimit');

	return transactionLimitModel.findOne({ where: { 
		...(opts.id && { id: opts.id }),
		...(opts.tier && { tier: opts.tier }),
		...(opts.amount && { amount: opts.amount }),
		...(opts.currency && { currency: opts.currency }),
		...(opts.limit_currency && { limit_currency: opts.limit_currency }),
		...(opts.type && { type: opts.type }),
		...(opts.monthly_amount && { monthly_amount: opts.monthly_amount }),
	} });
};


const updateTransactionLimit = async (id, data) => {
	const {
		tier,
		currency,
		amount,
		limit_currency,
		type,
		monthly_amount
	} = data;

	if (currency && !subscribedToCoin(currency)) {
		throw new Error('Invalid coin ' + currency);
	}

	if (limit_currency && limit_currency !== 'default' && !subscribedToCoin(limit_currency)) {
		throw new Error('Invalid coin ' + limit_currency);
	}

	if(tier && tier < 0) {
		throw new Error('tier cannot be a negative number other than -1');
	}

	if (amount < 0 && amount !== -1) {
		throw new Error('amount cannot be a negative number other than -1');
	}

	if (monthly_amount < 0 && monthly_amount !== -1) {
		throw new Error('monthly amount cannot be a negative number other than -1');
	}

	if(monthly_amount > 0 && amount > 0 && monthly_amount < amount) {
		throw new Error('monthly amount cannot be lower than last 24 hour amount');
	}

	if(amount === 0 && monthly_amount > 0) {
		throw new Error('last 24 hour amount cannot be limitless when the monthly amount has a limit');
	}

	if (type === 'deposit') {
		throw new Error('operation is not available at the moment');
	}

	if (id) {
		const transactionLimit = await findTransactionLimit({ id });
		const updatedTransactionObject = {
			...transactionLimit.get({ plain: true }),
			...data,
		};

		return transactionLimit.update(updatedTransactionObject);

	} else {
		const isExist = await findTransactionLimit({ tier, limit_currency, type });

		if (isExist) {
			throw new Error('Transaction limit record already exist');
		}

		const transactionLimitModel = getModel('transactionLimit');

		return transactionLimitModel.create(data);
	}

};

const getTransactionLimits = () => {
	return dbQuery.findAndCountAllWithRows('transactionLimit');
};

const deleteTransactionLimit = async (id) => {
	const transactionLimitModel = getModel('transactionLimit');

	const limit = await transactionLimitModel.findOne({ where: { id } });

	if (!limit) {
		throw new Error('Record does not exist');
	}
	return limit.destroy();
};

module.exports = {
	findTier,
	createTier,
	updateTier,
	updatePairFees,
	updateTiersLimits,
	updateTransactionLimit,
	getTransactionLimits,
	findTransactionLimit,
	findTransactionLimitPerTier,
	deleteTransactionLimit
};
