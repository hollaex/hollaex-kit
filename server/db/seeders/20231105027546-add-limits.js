'use strict';

const models = require('../models');

const TABLE = 'TransactionLimits';

module.exports = {
	up: async () => {
		const transactionLimitModel = models['TransactionLimit'];
		const types = ['withdrawal', 'deposit'];
		const tierLevels = [1, 2];
		for (const level of tierLevels) {
			for (const type of types) {
				const limit = await transactionLimitModel.findOne({ where: { tier: level, type } });
				if (!limit) {
					await transactionLimitModel.create({
						tier: level,
						amount: 0,
						monthly_amount: 0,
						currency: 'usdt',
						limit_currency: 'default', 
						type, 
					});
				}
			}
		}
	},
	down: (queryInterface) => queryInterface.bulkDelete(TABLE)
};
