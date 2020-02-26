const { VAULT_ENDPOINT, API_HOST } = require('../../constants');
const rp = require('request-promise');
const { difference } = require('lodash');
const API_NAME = process.env.API_NAME;
const VAULT_KEY = process.env.VAULT_KEY;
const VAULT_SECRET = process.env.VAULT_SECRET;
const { all, delay } = require('bluebird');

const getVaultCoins = (coins) => {
	const options = {
		method: 'GET',
		uri: `${VAULT_ENDPOINT}/coins`
	};

	return rp(options)
		.then((vaultCoins) => {
			vaultCoins = JSON.parse(vaultCoins);
			const diff = difference(coins, vaultCoins);
			if (diff.length > 0) {
				throw new Error(`Coins not included in vault: ${diff}`);
			}
		});
};

const checkVaultNames = (coins) => {
	return all(
		coins.map((coin, i) => {
			const options = {
				method: 'GET',
				uri: `${VAULT_ENDPOINT}/${API_NAME}-${coin}/check`
			};
			return delay((i + 1) * 1500)
				.then(() => rp(options));
		})
	);
};

const createVaultWallets = (coins) => {
	return all(
		coins.map((coin, i) => {
			const options = {
				method: 'POST',
				headers: {
					key: VAULT_KEY,
					secret: VAULT_SECRET
				},
				body: {
					name: `${API_NAME}-${coin}`,
					currency: coin,
					webhook: `https://${API_HOST}/v1/deposit/${coin}`,
					type: 'multi'
				},
				uri: `${VAULT_ENDPOINT}/wallet`,
				json: true
			};
			return delay((i + 1) * 1500)
				.then(() => rp(options));
		})
	);
};

module.exports = {
	getVaultCoins,
	checkVaultNames,
	createVaultWallets
};