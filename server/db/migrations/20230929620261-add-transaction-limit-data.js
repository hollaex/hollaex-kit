'use strict';

const models = require('../models');


module.exports = {
	async up(queryInterface) {
		const transactionLimitModel = models['TransactionLimits'];
		const tierModel = models['Tiers'];
		const tiers = await tierModel.findAll({});
		const types = ['withdrawal', 'deposit'];

		for(const tier of tiers) {
			for(const type of types) {
				const limit = await transactionLimitModel.findOne({ tier: tier.id, type });
				if (!limit) {
					await transactionLimitModel.create({
						tier: tier.id,
						amount: 0,
						currency: getKitConfig().native_currency,
						limit_currency: 'default', 
						type, 
						period: '24h'
					})
				}
			}
		}
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
