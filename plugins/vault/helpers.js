'use strict';

const { VAULT_ENDPOINT, API_HOST } = require('../../constants');
const rp = require('request-promise');
const { intersection, union } = require('lodash');
const WEBHOOK_URL = (coin) => `https://${API_HOST}/v1/deposit/${coin}`;
const WALLET_NAME = (name, coin) => `${name}-${coin}`;
const { all, delay } = require('bluebird');
const { updateConstants } = require('../../api/helpers/status');

const updateVaultValues = (key, secret) => {
	const API_NAME = require('../../init').getConfiguration().constants.api_name;
	const connected_coins = require('../../init').getSecrets().vault.connected_coins;
	return updateConstants({
		secrets: {
			vault: {
				name: API_NAME,
				key,
				secret,
				connected_coins
			}
		}
	});
};

const crossCheckCoins = (coins) => {
	const options = {
		method: 'GET',
		uri: `${VAULT_ENDPOINT}/coins`
	};

	if (coins) {
		return rp(options)
			.then((vaultCoins) => {
				vaultCoins = JSON.parse(vaultCoins);
				const validCoins = intersection(coins, vaultCoins);
				if (validCoins.length === 0) {
					throw new Error(`The coins ${coins} are not available in vault`);
				} else {
					return validCoins;
				}
			});
	} else {
		const { getCoinsPairs } = require('../../api/helpers/status');
		return getCoinsPairs()
			.then(({ coins }) => {
				const options = {
					method: 'GET',
					uri: `${VAULT_ENDPOINT}/coins`
				};
				return all([Object.keys(coins), rp(options)])
			})
			.then(([ exchangeCoins, vaultCoins ]) => {
				vaultCoins = JSON.parse(vaultCoins);
				const validCoins = intersection(exchangeCoins, vaultCoins);
				if (validCoins.length === 0) {
					throw new Error('Your exchange coins are not available in vault');
				} else {
					return validCoins;
				}
			});
	}
};

const createOrUpdateWallets = (coins, key, secret) => {
	const VAULT_NAME = require('../../init').getSecrets().vault.name;
	return all(
		coins.map((coin, i) => {
			const options = {
				method: 'GET',
				headers: {
					key,
					secret
				},
				qs: {
					name: WALLET_NAME(VAULT_NAME, coin),
					currency: coin
				},
				uri: `${VAULT_ENDPOINT}/user/wallets`,
				json: true
			};
			return delay((i + 1) * 2500)
				.then(() => rp(options))
				.then(({ data }) => {
					const wallet = data[0];
					if (!wallet) {
						return delay(1000)
							.then(() => createVaultWallet(coin, key, secret));
					} else {
						return delay(1000)
							.then(() => checkWebhook(wallet, key, secret));
					}
				})
				.then((wallet) => {
					addVaultCoinConnection(coin);
					return wallet;
				})
		})
	);
};

const createVaultWallet = (coin, key, secret) => {
	const VAULT_NAME = require('../../init').getSecrets().vault.name;
	const options = {
		method: 'POST',
		headers: {
			key,
			secret
		},
		body: {
			name: WALLET_NAME(VAULT_NAME, coin),
			currency: coin,
			webhook: WEBHOOK_URL(coin),
			type: 'multi'
		},
		uri: `${VAULT_ENDPOINT}/wallet`,
		json: true
	};
	return rp(options)
		.then((wallet) => {
			addVaultCoinConnection(wallet.currency);
			return wallet;
		});
};

const checkWebhook = (wallet, key, secret) => {
	if (wallet.webhook !== WEBHOOK_URL(wallet.currency)) {
		const options = {
			method: 'PUT',
			headers: {
				key,
				secret
			},
			body: {
				url: WEBHOOK_URL(wallet.currency)
			},
			uri: `${VAULT_ENDPOINT}/${wallet.name}/webhook`,
			json: true
		};
		return delay(1000)
			.then(() => rp(options));
	} else {
		return wallet;
	}
};

const addVaultCoinConnection = (coin) => {
	const vaultConstants = require('../../init').getSecrets().vault;
	console.log(vaultConstants.connected_coins, coin)
	return updateConstants({
		secrets: {
			vault: {
				...vaultConstants,
				connected_coins: union(vaultConstants.connected_coins, [ coin ])
			}
		}
	});
};

module.exports = {
	updateVaultValues,
	crossCheckCoins,
	createOrUpdateWallets
};