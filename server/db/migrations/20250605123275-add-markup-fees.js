'use strict';
const TABLE = 'Status';
const {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE
} = require('../../constants');

const rp = require('request-promise');
const models = require('../models');

module.exports = {
	async up(queryInterface) {

		try {
			const checkActivation = (name, url, activation_code, constants = {}) => {
				const body = {
					name,
					url,
					activation_code,
					constants
				};

				const options = {
					method: 'POST',
					body,
					uri: `${HOLLAEX_NETWORK_ENDPOINT}${HOLLAEX_NETWORK_BASE_URL}${HOLLAEX_NETWORK_PATH_ACTIVATE}`,
					json: true
				};
				return rp(options);
			};


			const statusModel = models[TABLE];
			const status = await statusModel.findOne({});

			if (status?.activation_code) {
				const exchange = await checkActivation(status.name,
					status.url,
					status.activation_code,
					status.constants);


				for (const [symbol, customization] of Object.entries(status?.kit?.coin_customizations || [])) {
					// Skip if already has fee_markups or no fee_markup defined
					if (customization.fee_markups || customization.fee_markup == null) continue;

					// Find the matching coin by symbol
					const coin = exchange.coins.find((c) => c.symbol === symbol);
					if (!coin || !coin.network) continue;

					const networks = coin.network.split(',').map((n) => n.trim().toLowerCase());
					customization.fee_markups = {};

					networks.forEach((network) => {
						customization.fee_markups[network] = {
							deposit_fee_markup: 0,
							withdrawal_fee_markup: customization.fee_markup
						};
					});
				}
				await statusModel.update(
					{ kit: status.kit },
					{ where: { id: status.id } }
				);
			}
		} catch (error) {
			return error;
		}

	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
