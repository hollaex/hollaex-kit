'use strict';

const models = require('../models');

module.exports = {
	async up(queryInterface) {
		const transactionLimitModel = models['TransactionLimit'];
		const tierModel = models['Tier'];
		const tiers = await tierModel.findAll({});
		const types = ['withdrawal', 'deposit'];
		const statusModel = models['Status'];
		const status = await statusModel.findOne({});

		for(const tier of tiers) {
			for(const type of types) {
				const limit = await transactionLimitModel.findOne({ where: { tier: tier.id, type } });
				if (!limit) {
					await transactionLimitModel.create({
						tier: tier.id,
						amount: type === 'withdrawal' ? tier.withdrawal_limit || 0 : tier.deposit_limit || 0,
						currency: status?.kit?.native_currency || 'usdt',
						limit_currency: 'default', 
						type, 
						period: '24h'
					})
				}
			}
		}

		await queryInterface.removeColumn('Tiers', 'withdrawal_limit');
		await queryInterface.removeColumn('Tiers', 'deposit_limit');
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
