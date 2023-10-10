'use strict';

const Network = require('hollaex-network-lib');
const { all } = require('bluebird');
const moment = require('moment');
const rp = require('request-promise');
const { loggerInit } = require('./config/logger');
const { Op } = require('sequelize');
const { User, Status, Tier, Broker, QuickTrade } = require('./db/models');
const packageJson = require('./package.json');

const { subscriber, publisher } = require('./db/pubsub');
const {
	INIT_CHANNEL,
	CONFIGURATION_CHANNEL,
	DEFAULT_FEES,
	WS_HUB_CHANNEL,
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE
} = require('./constants');
const { isNumber, difference } = require('lodash');

let nodeLib;

const getNodeLib = () => nodeLib;

subscriber.on('message', (channel, message) => {
	if (channel === INIT_CHANNEL) {
		const { type } = JSON.parse(message);
		switch (type) {
			case 'refreshInit':
				checkStatus();
				publisher.publish(
					WS_HUB_CHANNEL,
					JSON.stringify({ action: 'restart' })
				);
				break;
			default:
				break;
		}
	}
	return;
});

subscriber.subscribe(INIT_CHANNEL);

const checkStatus = () => {
	loggerInit.verbose('init/checkStatus', 'checking exchange status');

	let configuration = {
		coins: {},
		pairs: {},
		tiers: {},
		quicktrade: [],
		networkQuickTrades: [],
		kit: {
			info: {},
			color: {},
			interface: {},
			icons: {},
			links: {},
			strings: {},
			captcha: {},
			defaults: {},
			features: {},
			meta: {},
			injected_values: [],
			injected_html: {},
			user_meta: {},
			black_list_countries: [],
			onramp: {},
			offramp: {},
			user_payments: {},
			dust: {}
		},
		email: {}
	};

	let secrets = {
		security: {},
		accounts: {},
		captcha: {},
		emails: {},
		smtp: {}
	};

	let frozenUsers = {};

	let version = packageJson.version; // current exchange version

	return Status.findOne({})
		.then((status) => {
			loggerInit.info('init/checkStatus');
			if (!status) {
				stop();
				throw new Error('Exchange is not initialized yet');
			} else if (status.blocked) {
				stop();
				throw new Error('Exchange is locked');
			} else if (!status.activation_code) {
				stop();
				throw new Error('Exchange activation code is not set');
			} else if (!status.api_key || !status.api_secret) {
				stop();
				throw new Error('Exchange keys are not set.');
			} else if (!status.activated) {
				stop();
				throw new Error('Exchange is expired');
			} else {
				if (status.kit_version != version) {
					loggerInit.verbose('init/checkStatus version update', version, status.kit_version);
					status.update({ kit_version: version }, { fields: ['kit_version'] });
				}
				secrets = status.secrets;
				configuration.kit = status.kit;
				configuration.email = status.email;

				return all([
					checkActivation(
						status.name,
						status.url,
						status.activation_code,
						version,
						status.constants
					),
					Tier.findAll(),
					Broker.findAll({ attributes: ['id', 'symbol', 'buy_price', 'sell_price', 'paused', 'min_size', 'max_size']}),
					QuickTrade.findAll(),
					status.dataValues
				]);
			}
		})
		.then(async ([exchange, tiers, deals, quickTrades, status]) => {
			loggerInit.info('init/checkStatus/activation', exchange.name, exchange.active);

			const exchangePairs = [];

			for (let coin of exchange.coins) {
				configuration.coins[coin.symbol] = {
					...coin,
					...configuration?.kit?.coin_customizations?.[coin.symbol]
				}
			}

			for (let pair of exchange.pairs) {
				exchangePairs.push(pair.name);
				configuration.pairs[pair.name] = pair;
			}

			configuration.broker = deals;
			configuration.networkQuickTrades = [];

			const brokerPairs = deals.map((d) => d.symbol);
			const networkBrokerPairs = Object.keys(exchange.brokers).filter((e) => {
				// only add the network pair if both coins in the market are already subscribed in the exchange
				const [ base, quote ] = e.split('-');
				if (configuration.coins[base] && configuration.coins[quote]) {
					configuration.networkQuickTrades.push(exchange.brokers[e])
					return e;
				}
			});

			let quickTradePairs = quickTrades.map((q) => q.symbol)

			// check the status of quickTrades
			for (let qt of quickTrades) {
				if (qt.type === 'pro') {
					if (!configuration.pairs[qt.symbol]) {
						await qt.destroy();
					}
				}
				else if (qt.type === 'broker') {
					if (!brokerPairs.includes(qt.symbol)) {
						await qt.destroy();
					}
				}
				else if (qt.type === 'network') {
					if (!networkBrokerPairs.includes(qt.symbol)) {
						await qt.destroy();
					}
				}
			}

			// construct the missing quicktrades
			let newQuickTrades = {};
			difference(exchangePairs, quickTradePairs).forEach((symbol) => {
				newQuickTrades[symbol] = { symbol, type: 'pro' };
			});
			difference(brokerPairs, quickTradePairs).forEach((symbol) => {
				// it would override the symbol in the previous condition
				newQuickTrades[symbol] = { symbol, type: 'broker' };
			});
			difference(networkBrokerPairs, quickTradePairs).forEach((symbol) => {
				// it would override the symbol in the previous conditions
				newQuickTrades[symbol] = { symbol, type: 'network' };
			});

			if (Object.keys(newQuickTrades).length > 0) {
				for (let quicktrade in newQuickTrades) {
					loggerInit.info('init/checkStatus/activation adding new pair', quicktrade);
					await QuickTrade.upsert(newQuickTrades[quicktrade]);
					loggerInit.info('init/checkStatus/activation new pair successfully added', quicktrade);
				}
			}

			quickTrades = await QuickTrade.findAll();
			quickTradePairs = quickTrades.map((q) => q.symbol);

			// build the data for client
			quickTrades.forEach((qt) => {
				let item = {
					type: qt.type,
					symbol: qt.symbol,
					active: qt.active
				};
				configuration.quicktrade.push(item)
			})

			
			for (let tier of tiers) {
				if (!('maker' in tier.fees)) {
					tier.fees.maker = {};
				}
				if (!('taker' in tier.fees)) {
					tier.fees.taker = {};
				}
				const makerDiff = difference(quickTradePairs, Object.keys(tier.fees.maker));
				const takerDiff = difference(quickTradePairs, Object.keys(tier.fees.taker));

				if (makerDiff.length > 0 || takerDiff.length > 0) {
					const fees = {
						maker: {},
						taker: {}
					};
					const defaultFees = DEFAULT_FEES[exchange.plan]
						? DEFAULT_FEES[exchange.plan]
						: { maker: 0.2, taker: 0.2 }

					for (let pair of quickTradePairs) {
						if (!isNumber(tier.fees.maker[pair])) {
							fees.maker[pair] = defaultFees.maker;
						} else {
							fees.maker[pair] = tier.fees.maker[pair];
						}

						if (!isNumber(tier.fees.taker[pair])) {
							fees.taker[pair] = defaultFees.taker;
						} else {
							fees.taker[pair] = tier.fees.taker[pair];
						}
					}

					const t = await tier.update({ fees }, { fields: ['fees'] });

					configuration.tiers[t.id] = t.dataValues;
				} else {
					configuration.tiers[tier.id] = tier.dataValues;
				}
			}

			configuration.kit.info = {
				name: exchange.name,
				active: exchange.active,
				exchange_id: exchange.id,
				user_id: exchange.user_id,
				url: exchange.url,
				is_trial: exchange.is_trial,
				created_at: exchange.created_at,
				expiry: exchange.expiry,
				collateral_level: exchange.collateral_level,
				type: exchange.type,
				plan: exchange.plan,
				period: exchange.period,
				status: true,
				initialized: status.initialized
			};

			const networkNodeLib = new Network({
				apiUrl: HOLLAEX_NETWORK_ENDPOINT,
				baseUrl: HOLLAEX_NETWORK_BASE_URL,
				apiKey: status.api_key,
				apiSecret: status.api_secret,
				exchange_id: exchange.id,
				activation_code: exchange.activation_code,
				kit_version: status.kit_version
			});

			if (!networkNodeLib) {
				throw new Error('Node library failed to initialize');
			}

			nodeLib = networkNodeLib;

			return all([
				// get deactivated users in the last week. Its only set to week because
				// the sessions are assumed to be lower than a week for user to be logged in.
				User.findAll({
					where: {
						activated: false,
						updated_at: {
							[Op.gt]: moment().subtract(7, 'days').toDate()
						}
					}
				}),
				networkNodeLib
			]);
		})
		.then(([users, networkNodeLib]) => {
			loggerInit.info('init/checkStatus/activation', users.length, 'users deactivated');

			for (let user of users) {
				frozenUsers[user.dataValues.id] = true;
			}

			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'initial',
					data: { configuration, secrets, frozenUsers }
				})
			);
			loggerInit.info('init/checkStatus/activation complete');
			return networkNodeLib;
		});
};

const stop = () => {
	publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ type: 'stop' }));
};

const checkActivation = (name, url, activation_code, version, constants = {}) => {
	const body = {
		name,
		url,
		activation_code,
		constants
	};
	if (version) {
		// only sends version if its set
		body.version = version;
	}

	const options = {
		method: 'POST',
		body,
		uri: `${HOLLAEX_NETWORK_ENDPOINT}${HOLLAEX_NETWORK_BASE_URL}${HOLLAEX_NETWORK_PATH_ACTIVATE}`,
		json: true
	};
	return rp(options);
};

module.exports = {
	checkStatus,
	checkActivation,
	getNodeLib
};
