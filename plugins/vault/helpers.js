'use strict';

const { VAULT_ENDPOINT, API_HOST } = require('../../constants');
const rp = require('request-promise');
const { difference } = require('lodash');
const API_NAME = process.env.API_NAME;
const VAULT_KEY = process.env.VAULT_KEY;
const VAULT_SECRET = process.env.VAULT_SECRET;
const WEBHOOK_URL = `https://${API_HOST}/v1/deposit/${firstCoin}`;
const WALLET_NAME = (coin) => `${API_NAME}-${coin}`;
const { all, delay, each } = require('bluebird');
const { isValidCurrency } = require('../../api/helpers/currency');
const { updateConstants } = require('../../api/helpers/status');

const getVaultCoins = (coins) => {
	each(coins, (coin) => {
		if (!isValidCurrency(coin)) {
			throw new Error(`${coin} does not exist in your exchange`);
		}
	});

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
			webhook: WEBHOOK_URL,
			type: 'multi'
		},
		uri: `${VAULT_ENDPOINT}/wallet`,
		json: true
	};
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
							webhook: WEBHOOK_URL,
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
		});
};

const checkVaultConnection = (coin) => {
	if (!isValidCurrency(coin)) {
		throw new Error(`${coin} does not exist in your exchange`);
	}
	const { getSecrets } = require('../../init');
	const vaultConstants = getSecrets().vault;
	if (!vaultConstants.connected_coins.includes(coin)) {
		throw new Error(`${coin} is already connected to vault`);
	}
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
			if (!WALLET_NAME) {
				throw new Error(`Wallet with name ${WALLET_NAME(coin)} does not exist`)
			} else if (wallet.webhook !== WEBHOOK_URL) {
				throw new Error(`Wallet exists but has the wrong webhook: '${wallet.webhook}'. Expected webhook: '${WEBHOOK_URL}'`)
			} else {
				return updateConstants({
					secrets: {
						vault: {
							name: vaultConstants.name,
							key: vaultConstants.key,
							secret: vaultConstants.secret,
							connected_coins: [...vaultConstants.connected_coins, coin]
						}
					}
				})
			}
		})
		.then(() => {
			return getSecrets().vault.connected_coins;
		});
};

module.exports = {
	getVaultCoins,
	checkVaultNames,
	createVaultWallets,
	checkVaultConnection
};