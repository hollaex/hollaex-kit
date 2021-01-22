'use strict';

const rp = require('request-promise');

const {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE
} = require('../../constants');

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
				let makerFee = 0.3;
				let takerFee = 0.3;

				if (exchange.collateral_level === 'zero') {
					makerFee = 0.3;
					takerFee = 0.3;
				} else if (exchange.collateral_level === 'lite') {
					makerFee = 0.1;
					takerFee = 0.2;
				} else if (exchange.collateral_level === 'member') {
					makerFee = 0;
					takerFee = 0.05;
				}

				const tiers = [
					{
						id: 1,
						name: 'basic',
						description: 'basic tier',
						icon: '',
						deposit_limit: 0,
						withdrawal_limit: 0,
						fees: JSON.stringify({
							maker: {
								default: makerFee
							},
							taker: {
								default: takerFee
							}
						})
					},
					{
						id: 2,
						name: 'vip',
						description: 'vip tier',
						deposit_limit: 0,
						icon: '',
						withdrawal_limit: 0,
						fees: JSON.stringify({
							maker: {
								default: makerFee
							},
							taker: {
								default: takerFee
							}
						})
					}
				];
				queryInterface.bulkInsert(TABLE, tiers, {});
			});
	},
	down: (queryInterface) => queryInterface.bulkDelete(TABLE)
};
