'use strict';

const rp = require('request-promise');

const {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE,
	DEFAULT_FEES
} = require('../../migration-constants');
const Sequelize = require('sequelize');
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

const TABLE = 'Tiers';

module.exports = {
	up: (queryInterface) => {
		return checkActivation(process.env.ACTIVATION_CODE)
			.then((exchange) => {

				const minFees = DEFAULT_FEES[exchange.plan || 'basic'];
				const fees = {
					maker: {},
					taker: {}
				};

				for (let pair of exchange.pairs) {
					fees.maker[pair.name] = minFees.maker;
					fees.taker[pair.name] = minFees.taker;
				}

				const tiers = [
					{
						id: 1,
						name: 'basic',
						description: 'basic tier',
						icon: '',
						deposit_limit: 0,
						withdrawal_limit: 0,
						fees: fees
					},
					{
						id: 2,
						name: 'vip',
						description: 'vip tier',
						deposit_limit: 0,
						icon: '',
						withdrawal_limit: 0,
						fees: fees
					}
				];
				queryInterface.bulkInsert(TABLE, tiers, {}, {
					id: { type: new Sequelize.INTEGER() },
					name: { type: new Sequelize.STRING() },
					description: { type: new Sequelize.STRING() },
					deposit_limit: { type: new Sequelize.DOUBLE() },
					icon: { type: new Sequelize.STRING() },
					withdrawal_limit: { type: new Sequelize.DOUBLE() },
					fees: { type: new Sequelize.JSON() },
				});
			});
	},
	down: (queryInterface) => queryInterface.bulkDelete(TABLE)
};
