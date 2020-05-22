'use strict';

const { VAULT_ENDPOINT, API_HOST, GET_CONFIGURATION, GET_SECRETS } = require('../../constants');
const rp = require('request-promise');
const { intersection, union, each } = require('lodash');
const WEBHOOK_URL = (coin) => `${API_HOST}/v1/deposit/${coin}`;
const WALLET_NAME = (name, coin) => `${name}-${coin}`;
const { all, delay } = require('bluebird');
const { updateConstants, logger, sleep } = require('../helpers/common');
const WAValidator = require('multicoin-address-validator');
const cron = require('node-cron');
const { processWithdrawals } = require('./crons/processWithdrawals');
const { lockWithdrawals } = require('./crons/lockWithdrawals');
const { checkWithdrawals } = require('./crons/checkWithdrawals');

const withdrawalCron = async () => {
	if (GET_CONFIGURATION().constants.plugins.enabled.indexOf('vault') !== -1) {
		checkWithdrawals();
		await sleep(1000);
		lockWithdrawals();
		await sleep(5000);
		processWithdrawals();
	}
};

const cronTask = cron.schedule(`*/${GET_SECRETS().vault.cron_task_interval} * * * *`, () => {
	withdrawalCron();
}, {
	timezone: 'Asia/Seoul'
});

const checkAddress = (address, symbol, network = 'prod') => {
	if (symbol === 'btc' || symbol === 'bch' || symbol === 'xrp' || symbol === 'xmr') {
		return WAValidator.validate(address, symbol, network);
	} else {
		return WAValidator.validate(address, 'eth', network);
	}
};

const updateVaultValues = (name, key, secret, connect = true) => {
	logger.debug('/plugins/vault/helpers updateVaultValues');
	return updateConstants({
		secrets: {
			vault: {
				name,
				key,
				secret,
				connected_coins: connect ? GET_SECRETS().vault.connected_coins : []
			}
		}
	});
};

const crossCheckCoins = (coins) => {
	logger.debug('/plugins/vault/helpers crossCheckCoins', coins);
	const options = {
		method: 'GET',
		uri: `${VAULT_ENDPOINT}/coins`
	};

	return rp(options)
		.then((vaultCoins) => {
			vaultCoins = JSON.parse(vaultCoins);
			const exchangeCoins = coins || Object.keys(GET_CONFIGURATION().coins);
			const validCoins = intersection(exchangeCoins, vaultCoins);

			if (validCoins.length === 0) {
				throw new Error(`None of these coins are available in vault: ${exchangeCoins}`);
			} else {
				return validCoins;
			}
		});
};

const createOrUpdateWallets = (coins) => {
	logger.debug('/plugins/vault/helpers createOrUpdateWallets', coins);
	const vaultConfig = GET_SECRETS().vault;
	return all(
		coins.map((coin, i) => {
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
				.catch((err) => {
					logger.error('/plugins/vault/helpers createOrUpdateWallets', err.message);
					return {
						error: err.message,
						currency: coin
					};
				});
		})
	)
		.then(async (wallets) => {
			const result = {};
			const connectedCoins = [];
			await each(wallets, (wallet) => {
				result[wallet.currency] = wallet;
				if (!wallet.error) connectedCoins.push(wallet.currency);
			});
			await addVaultCoinConnection(connectedCoins, vaultConfig);
			return result;
		});
};

const createVaultWallet = (coin, vaultConfig) => {
	logger.debug('/plugins/vault/helpers createVaultWallet', coin);
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
	logger.debug('/plugins/vault/helpers checkWebhook', wallet.name);
	if (wallet.webhook !== WEBHOOK_URL(wallet.currency)) {
		logger.debug('/plugins/vault/helpers checkWebhook update webhook', wallet.name);
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
	logger.debug('/plugins/vault/helpers addVaultCoinConnection', coins);
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
	checkAddress,
	updateVaultValues,
	crossCheckCoins,
	createOrUpdateWallets,
	cronTask
};