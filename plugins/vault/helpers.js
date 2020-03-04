'use strict';

const { VAULT_ENDPOINT, API_HOST } = require('../../constants');
const rp = require('request-promise');
const { intersection, union, each } = require('lodash');
const WEBHOOK_URL = (coin) => `${API_HOST}/v1/deposit/${coin}`;
const WALLET_NAME = (name, coin) => `${name}-${coin}`;
const { all, delay } = require('bluebird');
const { updateConstants, getConfiguration } = require('../helpers/common');

const updateVaultValues = (key, secret) => {
	return getConfiguration()
		.then((configuration) => {
			const constants = configuration.constants;
			return updateConstants({
				secrets: {
					vault: {
						name: constants.api_name,
						key,
						secret,
						connected_coins: constants.secrets.vault.connected_coins
					}
				}
			});
		});
};

const crossCheckCoins = (coins) => {
	const options = {
		method: 'GET',
		uri: `${VAULT_ENDPOINT}/coins`
	};

	return all([getConfiguration(), rp(options)])
		.then(([configuration, vaultCoins]) => {
			vaultCoins = JSON.parse(vaultCoins);
			const exchangeCoins = coins || Object.keys(configuration.coins);
			const validCoins = intersection(exchangeCoins, vaultCoins);

			if (validCoins.length === 0) {
				throw new Error(`None of these coins are available in vault: ${exchangeCoins}`);
			} else {
				return validCoins;
			}
		});
};

const createOrUpdateWallets = (coins) => {
	return getConfiguration()
		.then((configuration) => {
			const vaultConfig = configuration.constants.secrets.vault;
			return all([
				vaultConfig,
				...coins.map((coin, i) => {
					const options = {
						method: 'GET',
						headers: {
							key: vaultConfig.key,
							secret: vaultConfig.secret
						},
						qs: {
							name: WALLET_NAME(vaultConfig.name, coin),
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
								return createVaultWallet(coin, vaultConfig);
							} else {
								return checkWebhook(wallet, vaultConfig);
							}
						})
				})
			]);
		})
		.then(async ([ vaultConfig, ...wallets ]) => {
			await addVaultCoinConnection(coins, vaultConfig);
			const result = {};
			await each(wallets, (wallet) => {
				result[wallet.currency] = wallet;
			});
			return result;
		});
};

const createVaultWallet = (coin, vaultConfig) => {
	const options = {
		method: 'POST',
		headers: {
			key: vaultConfig.key,
			secret: vaultConfig.secret
		},
		body: {
			name: WALLET_NAME(vaultConfig.name, coin),
			currency: coin,
			webhook: WEBHOOK_URL(coin),
			type: 'multi'
		},
		uri: `${VAULT_ENDPOINT}/wallet`,
		json: true
	};
	return rp(options);
};

const checkWebhook = (wallet, vaultConfig) => {
	if (wallet.webhook !== WEBHOOK_URL(wallet.currency)) {
		const options = {
			method: 'PUT',
			headers: {
				key: vaultConfig.key,
				secret: vaultConfig.secret
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

const addVaultCoinConnection = (coins, vaultConfig) => {
	return updateConstants({
		secrets: {
			vault: {
				...vaultConfig,
				connected_coins: union(vaultConfig.connected_coins, coins)
			}
		}
	});
};

module.exports = {
	updateVaultValues,
	crossCheckCoins,
	createOrUpdateWallets,
	updateVaultValues
};