'use strict';

const { VAULT_ENDPOINT, API_HOST } = require('../../constants');
const rp = require('request-promise');
const { difference, union } = require('lodash');
const API_NAME = process.env.API_NAME;
const VAULT_KEY = process.env.VAULT_KEY;
const VAULT_SECRET = process.env.VAULT_SECRET;
const WEBHOOK_URL = (coin) => `https://${API_HOST}/v1/deposit/${coin}`;
const WALLET_NAME = (coin) => `${API_NAME}-${coin}`;
const { all, delay } = require('bluebird');
const { updateConstants } = require('../../api/helpers/status');

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

const createVaultWallets = (coins, seed) => {
	const firstCoin = coins.shift();
	const firstOptions = {
		method: 'POST',
		headers: {
			key: VAULT_KEY,
			secret: VAULT_SECRET
		},
		body: {
			name: WALLET_NAME(firstCoin),
			currency: firstCoin,
			webhook: WEBHOOK_URL(firstCoin),
			type: 'multi'
		},
		uri: `${VAULT_ENDPOINT}/wallet`,
		json: true
	};
	if (seed) {
		firstOptions.body.seed = seed;
	}
	return rp(firstOptions)
		.then((data) => {
			return all([
				data.seed,
				...coins.map((coin, i) => {
					const options = {
						method: 'POST',
						headers: {
							key: VAULT_KEY,
							secret: VAULT_SECRET
						},
						body: {
							name: WALLET_NAME(coin),
							currency: coin,
							webhook: WEBHOOK_URL(coin),
							type: 'multi',
							seed: data.seed
						},
						uri: `${VAULT_ENDPOINT}/wallet`,
						json: true
					};
					return delay((i + 1) * 1500)
						.then(() => rp(options));
				})
			]);
		})
		.then(([ seed ]) => {
			return all([seed, addVaultCoinConnection([firstCoin, ...coins])]);
		});
};

const checkVaultConnection = (coin) => {
	const options = {
		method: 'GET',
		headers: {
			key: VAULT_KEY,
			secret: VAULT_SECRET
		},
		qs: {
			name: WALLET_NAME(coin),
			currency: coin
		},
		uri: `${VAULT_ENDPOINT}/user/wallets`,
		json: true
	};

	return rp(options)
		.then((data) => {
			const wallet = data.data[0];
			if (!wallet) {
				throw new Error(`Wallet with name ${WALLET_NAME(coin)} does not exist`)
			} else if (wallet.webhook !== WEBHOOK_URL(coin)) {
				throw new Error(`Wallet exists but has the wrong webhook: ${wallet.webhook}. Expected webhook: ${WEBHOOK_URL(coin)}`)
			} else {
				return addVaultCoinConnection([coin])
			}
		})
		.then(() => {
			const { getSecrets } = require('../../init');
			return getSecrets().vault.connected_coins;
		});
};

const addVaultCoinConnection = (coin) => {
	const vaultConstants = require('../../init').getSecrets().vault;
	return updateConstants({
		secrets: {
			vault: {
				name: vaultConstants.name,
				key: vaultConstants.key,
				secret: vaultConstants.secret,
				connected_coins: union(vaultConstants.connected_coins, coin)
			}
		}
	});
};

module.exports = {
	getVaultCoins,
	checkVaultNames,
	createVaultWallets,
	checkVaultConnection
};