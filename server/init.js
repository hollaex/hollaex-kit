'use strict';

const Network = require('hollaex-network-lib');
const { all } = require('bluebird');
const moment = require('moment');
const rp = require('request-promise');
const { loggerInit } = require('./config/logger');
const { Op } = require('sequelize');
const { User, Status, Tier, Broker } = require('./db/models');
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
		switch(type) {
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
			user_payments: {}
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
					Broker.findAll(),
					status.dataValues
				]);
			}
		})
		.then(async ([exchange, tiers, deals, status]) => {
			loggerInit.info('init/checkStatus/activation', exchange.name, exchange.active);

			const exchangePairs = [];

			for (let coin of exchange.coins) {
				configuration.coins[coin.symbol] = coin;
			}

			for (let pair of exchange.pairs) {
				exchangePairs.push(pair.name);
				configuration.pairs[pair.name] = pair;
			}

			configuration.broker = deals;

			for (let tier of tiers) {
				const makerDiff = difference(exchangePairs, Object.keys(tier.fees.maker));
				const takerDiff = difference(exchangePairs, Object.keys(tier.fees.taker));
				const brokerDiff = difference(deals.map((d) => d.symbol), Object.keys(tier.fees.maker));

				if (makerDiff.length > 0 || takerDiff.length > 0 || brokerDiff.length > 0 || isNumber(tier.fees.maker.default) || isNumber(tier.fees.taker.default)) {
					const fees = {
						maker: {},
						taker: {}
					};

					const defaultFees = exchange.type === 'Enterprise'
						? { maker: 0, taker: 0 }
						: DEFAULT_FEES[exchange.collateral_level];

					for (let pair of exchangePairs) {
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
					for (let deal of deals) {
						const pair = deal.symbol;
						// checking if the deal is already among the pairs
						if (!exchangePairs.find((e) => e.name === pair)) {
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
		.then(([ users, networkNodeLib ]) => {
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
