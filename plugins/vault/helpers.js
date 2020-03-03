'use strict';

const { VAULT_ENDPOINT, API_HOST } = require('../../constants');
const rp = require('request-promise');
const { intersection, union } = require('lodash');
const WEBHOOK_URL = (coin) => `${API_HOST}/v1/deposit/${coin}`;
const WALLET_NAME = (name, coin) => `${name || process.env.API_NAME}-${coin}`;
const { all, delay } = require('bluebird');
const { updateConstants } = require('../../api/helpers/status');


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
	const { getConfiguration, getSecrets } = require('../../init');
	return all(
		coins.map((coin, i) => {
			const options = {
				method: 'GET',
				headers: {
					key,
					secret
				},
				qs: {
					name: WALLET_NAME(getSecrets().vault.name || getConfiguration().constants.api_name, coin),
					currency: coin
				},
				uri: `${VAULT_ENDPOINT}/user/wallets`,
				json: true
			};
			return delay((i + 1) * 2500)
				.then(() => rp(options))
				.then(({ data }) => all([ data, delay(1000)]))
				.then(([ data ]) => {
					const wallet = data[0];
					if (!wallet) {
						return createVaultWallet(coin, key, secret);
					} else {
						return checkWebhook(wallet, key, secret);
					}
				})
				.then((wallet) => {
					return all([ wallet, addVaultCoinConnection(coin) ]);
				})
				.then(([ wallet ]) => wallet);
		})
	);
};

const createVaultWallet = (coin, key, secret) => {
	const { getConfiguration, getSecrets } = require('../../init');
	const options = {
		method: 'POST',
		headers: {
			key,
			secret
		},
		body: {
			name: WALLET_NAME(getSecrets().vault.name || getConfiguration().constants.api_name, coin),
			currency: coin,
			webhook: WEBHOOK_URL(coin),
			type: 'multi'
		},
		uri: `${VAULT_ENDPOINT}/wallet`,
		json: true
	};
	return rp(options)
		.then((wallet) => {
			return all([ wallet, addVaultCoinConnection(wallet.currency) ]);
		})
		.then(([ wallet ]) => wallet);
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
		return rp(options);
	} else {
		return wallet;
	}
};

const addVaultCoinConnection = (coin) => {
	const vaultConstants = require('../../init').getSecrets().vault;
	return updateConstants({
		secrets: {
			vault: {
				...vaultConstants,
				connected_coins: union(vaultConstants.connected_coins, [ coin ])
			}
		}
	});
};

const updateVaultValues = (key, secret) => {
	const { getConfiguration, getSecrets } = require('../../init');
	return updateConstants({
		secrets: {
			vault: {
				name: getSecrets().vault.name || getConfiguration().constants.api_name,
				key,
				secret,
				connected_coins: getSecrets().vault.connected_coins
			}
		}
	});
};

const isUrl = (url) => {
	const pattern = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

module.exports = {
	updateVaultValues,
	crossCheckCoins,
	createOrUpdateWallets,
	updateVaultValues,
	isUrl
};