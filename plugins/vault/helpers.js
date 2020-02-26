const { VAULT_ENDPOINT } = require('../../constants');
const rp = require('request-promise');
const { difference } = require('lodash');
const API_NAME = process.env.API_NAME;
const { all } = require('bluebird');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

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
	return new Promise(async (resolve, reject) => {
		for (coin of coins) {
			const options = {
				method: 'GET',
				uri: `${VAULT_ENDPOINT}/${API_NAME}-${coin}/check`
			};
			await sleep(1000)
			try {
				await rp(options);
			} catch(err) {
				reject(new Error(`Vault name ${API_NAME} not available`));
			}
		}
		resolve();
	});
};

const createWallets = (coins) => {
	return all()
}

module.exports = {
	getVaultCoins,
	checkVaultNames
};