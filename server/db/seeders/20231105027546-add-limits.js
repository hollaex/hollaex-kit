'use strict';

const rp = require('request-promise');

const {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE
} = require('../../constants');

const models = require('../models');


const checkActivation = (activation_code) => {
	const body = {
		activation_code
	};

	const options = {
		method: 'POST',
		body,
		uri: `${HOLLAEX_NETWORK_ENDPOINT}${HOLLAEX_NETWORK_BASE_URL}${HOLLAEX_NETWORK_PATH_ACTIVATE}`,
		json: true
	};
	return rp(options);
};
const models = require('../models');
const TABLE = 'TransactionLimits';

module.exports = {
	up: (queryInterface) => {
		return checkActivation(process.env.ACTIVATION_CODE)
			.then(async (exchange) => {
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
			});
	},
	down: (queryInterface) => queryInterface.bulkDelete(TABLE)
};
