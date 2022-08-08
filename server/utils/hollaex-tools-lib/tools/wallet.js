'use strict';

const { SERVER_PATH } = require('../constants');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { WITHDRAWALS_REQUEST_KEY } = require(`${SERVER_PATH}/constants`);
const { verifyOtpBeforeAction } = require('./security');
const { subscribedToCoin, getKitCoin, getKitSecrets, getKitConfig, sleep } = require('./common');
const {
	INVALID_OTP_CODE,
	INVALID_WITHDRAWAL_TOKEN,
	EXPIRED_WITHDRAWAL_TOKEN,
	INVALID_COIN,
	INVALID_AMOUNT,
	DEPOSIT_DISABLED_FOR_COIN,
	WITHDRAWAL_DISABLED_FOR_COIN,
	UPGRADE_VERIFICATION_LEVEL,
	NO_DATA_FOR_CSV,
	USER_NOT_FOUND,
	USER_NOT_REGISTERED_ON_NETWORK,
	INVALID_NETWORK,
	NETWORK_REQUIRED
} = require(`${SERVER_PATH}/messages`);
const { getUserByKitId, mapNetworkIdToKitId, mapKitIdToNetworkId } = require('./user');
const { findTier } = require('./tier');
const { client } = require('./database/redis');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const { all, reject } = require('bluebird');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const moment = require('moment');
const math = require('mathjs');
const { parse } = require('json2csv');
const { loggerWithdrawals } = require(`${SERVER_PATH}/config/logger`);
const { has } = require('lodash');
const WAValidator = require('multicoin-address-validator');
const { isEmail } = require('validator');

const isValidAddress = (currency, address, network) => {
	if (network === 'eth' || network === 'ethereum') {
		return WAValidator.validate(address, 'eth');
	} else if (network === 'stellar' || network === 'xlm') {
		return WAValidator.validate(address.split(':')[0], 'xlm');
	} else if (network === 'tron' || network === 'trx') {
		return WAValidator.validate(address, 'trx');
	} else if (network === 'bsc' || currency === 'bnb' || network === 'bnb') {
		return WAValidator.validate(address, 'eth');
	} else if (currency === 'btc' || currency === 'bch' || currency === 'xmr') {
		return WAValidator.validate(address, currency);
	} else if (currency === 'xrp') {
		return WAValidator.validate(address.split(':')[0], currency);
	} else if (currency === 'etn') {
		// skip the validation
		return true;
	} else {
		const supported = WAValidator.findCurrency(currency);
		if (supported) {
			return WAValidator.validate(address, currency);
		} else {
			return true;
		}
	}
};

const getWithdrawalFee = (currency, network, amount, level) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	const coinConfiguration = getKitCoin(currency);

	let fee = coinConfiguration.withdrawal_fee;
	let fee_coin = currency;

	if (network && coinConfiguration.withdrawal_fees && coinConfiguration.withdrawal_fees[network]) {
		fee = coinConfiguration.withdrawal_fees[network].value;
		fee_coin = coinConfiguration.withdrawal_fees[network].symbol;
	}

	// withdrawal fee calculation for fiat
	if (network === 'fiat') {
		if (coinConfiguration.withdrawal_fees && coinConfiguration.withdrawal_fees[currency]) {
			let value = coinConfiguration.withdrawal_fees[currency].value;
			fee_coin =  coinConfiguration.withdrawal_fees[currency].symbol;
			if (coinConfiguration.withdrawal_fees[currency].levels && coinConfiguration.withdrawal_fees[currency].levels[level]) {
				value = coinConfiguration.withdrawal_fees[currency].levels[level];
			}
			if (coinConfiguration.withdrawal_fees[currency].type === 'static') {
				fee = value;
			} else {
				fee = amount * value / 100;
			}
		}
	}

	if (network === 'email') {
		fee = 0;
	}

	return { fee, fee_coin };
};

async function validateWithdrawal(user, address, amount, currency, network = null) {
	const coinConfiguration = getKitCoin(currency);

	if (!subscribedToCoin(currency)) {
		throw new Error(INVALID_COIN(currency));
	}

	if (amount <= 0) {
		throw new Error(INVALID_AMOUNT(amount));
	}

	if (!coinConfiguration.allow_withdrawal) {
		throw new Error(WITHDRAWAL_DISABLED_FOR_COIN(currency));
	}

	if (network === 'email') {
		// internal email transfer
		if (!isEmail(address)) {
			throw new Error(`Invalid ${currency} address: ${address}`);
		}
	} else if (network !== 'fiat') {
		// blockchain transfer
		if (coinConfiguration.network) {
			if (!network) {
				throw new Error(NETWORK_REQUIRED(currency, coinConfiguration.network));
			} else if (!coinConfiguration.network.split(',').includes(network)) {
				throw new Error(INVALID_NETWORK(network, coinConfiguration.network));
			}
		} else if (network)  {
			throw new Error(`Invalid ${currency} network given: ${network}`);
		}
		if (!isValidAddress(currency, address, network)) {
			throw new Error(`Invalid ${currency} address: ${address}`);
		}
	}

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	} else if (!user.network_id) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	} else if (user.verification_level < 1) {
		throw new Error(UPGRADE_VERIFICATION_LEVEL(1));
	}

	const { fee, fee_coin } = getWithdrawalFee(currency, network, amount, user.verification_level);

	const balance = await getNodeLib().getUserBalance(user.network_id);

	if (fee_coin === currency) {
		const totalAmount =
			fee > 0
				? math.number(math.add(math.bignumber(fee), math.bignumber(amount)))
				: amount;

		if (math.compare(totalAmount, balance[`${currency}_available`]) === 1) {
			throw new Error(
				`User ${currency} balance is lower than amount "${amount}" + fee "${fee}"`
			);
		}
	} else {
		if (math.compare(amount, balance[`${currency}_available`]) === 1) {
			throw new Error(
				`User ${currency} balance is lower than withdrawal amount "${amount}"`
			);
		}

		if (math.compare(fee, balance[`${fee_coin}_available`]) === 1) {
			throw new Error(
				`User ${fee_coin} balance is lower than fee amount "${fee}"`
			);
		}
	}
	const tier = await findTier(user.verification_level);

	const limit = tier.withdrawal_limit;
	if (limit === -1) {
		throw new Error(WITHDRAWAL_DISABLED_FOR_COIN(currency));
	} else if (limit > 0) {
		if (tier.native_currency_limit) {
			// limit is based on native_currency
			await withdrawalBelowLimit(user.network_id, currency, limit, amount);
		} else {
			await withdrawalBelowLimitSameCoin(user.network_id, currency, limit, amount);
		}
	}

	return {
		fee,
		fee_coin
	};
}

const sendRequestWithdrawalEmail = (user_id, address, amount, currency, opts = {
	network: null,
	otpCode: null,
	ip: null,
	domain: null
}) => {
	return verifyOtpBeforeAction(user_id, opts.otpCode)
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return getUserByKitId(user_id);
		})
		.then(async (user) => {
			const { fee, fee_coin } = await validateWithdrawal(user, address, amount, currency, opts.network);

			return withdrawalRequestEmail(
				user,
				{
					user_id,
					email: user.email,
					amount,
					fee,
					fee_coin,
					transaction_id: uuid(),
					address,
					currency,
					network: opts.network
				},
				opts.domain,
				opts.ip
			);
		});
};

const withdrawalRequestEmail = (user, data, domain, ip) => {
	data.timestamp = Date.now();
	let stringData = JSON.stringify(data);
	const token = crypto.randomBytes(60).toString('hex');

	return client.hsetAsync(WITHDRAWALS_REQUEST_KEY, token, stringData)
		.then(() => {
			const { email, amount, fee, fee_coin, currency, address, network } = data;
			sendEmail(
				MAILTYPE.WITHDRAWAL_REQUEST,
				email,
				{
					amount,
					fee,
					fee_coin: (getKitCoin(fee_coin).display_name) ? getKitCoin(fee_coin).display_name : fee_coin,
					currency: (getKitCoin(currency).display_name) ? getKitCoin(currency).display_name : currency,
					transaction_id: token,
					address,
					ip,
					network
				},
				user.settings,
				domain
			);
			return data;
		});
};

const validateWithdrawalToken = (token) => {
	return client.hgetAsync(WITHDRAWALS_REQUEST_KEY, token)
		.then((withdrawal) => {
			if (!withdrawal) {
				throw new Error(INVALID_WITHDRAWAL_TOKEN);
			} else {
				withdrawal = JSON.parse(withdrawal);

				client.hdelAsync(WITHDRAWALS_REQUEST_KEY, token);

				if (Date.now() - withdrawal.timestamp > getKitSecrets().security.withdrawal_token_expiry) {
					throw new Error(EXPIRED_WITHDRAWAL_TOKEN);
				} else {
					return withdrawal;
				}
			}
		});
};

const cancelUserWithdrawalByKitId = async (userId, withdrawalId, opts = {
	additionalHeaders: null
}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userId]);

	if (!has(idDictionary, userId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}
	return getNodeLib().cancelWithdrawal(idDictionary[userId], withdrawalId, opts);
};

const cancelUserWithdrawalByNetworkId = (networkId, withdrawalId, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().cancelWithdrawal(networkId, withdrawalId, opts);
};

const checkTransaction = (currency, transactionId, address, network, isTestnet = false, opts = {
	additionalHeaders: null
}) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	return getNodeLib().checkTransaction(currency, transactionId, address, network, { isTestnet, ...opts });
};

const performWithdrawal = (userId, address, currency, amount, opts = {
	network: null,
	additionalHeaders: null
}) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}
	return getUserByKitId(userId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return all([
				user,
				findTier(user.verification_level)
			]);
		})
		.then(async ([ user, tier ]) => {
			const limit = tier.withdrawal_limit;
			if (limit === -1) {
				throw new Error('Withdrawals are disabled for this coin');
			} else if (limit > 0) {
				if (tier.native_currency_limit) {
					// limit is based on native_currency
					await withdrawalBelowLimit(user.network_id, currency, limit, amount);
				} else {
					await withdrawalBelowLimitSameCoin(user.network_id, currency, limit, amount);
				}	
			}
			return getNodeLib().performWithdrawal(user.network_id, address, currency, amount, opts);
		});
};

async function performDirectWithdrawal(userId, address, currency, amount, opts = {
	network: null,
	additionalHeaders: null
}) {
	const user = await getUserByKitId(userId);
	await validateWithdrawal(user, address, amount, currency, opts.network);
	return await getNodeLib().performWithdrawal(user.network_id, address, currency, amount, opts);
}

const performWithdrawalNetwork = (networkId, address, currency, amount, opts = {
	network: null,
	additionalHeaders: null
}) => {
	return getNodeLib().performWithdrawal(networkId, address, currency, amount, opts);
};

const get24HourAccumulatedWithdrawals = async (userId, currency) => {
	const withdrawals = await getNodeLib().getUserWithdrawals(userId, {
		currency,
		dismissed: false,
		rejected: false,
		startDate: moment().subtract(24, 'hours').toISOString()
	});

	const withdrawalData = withdrawals.data;

	if (withdrawals.count > 50) {
		const numofPages = Math.ceil(withdrawals.count / 50);
		for (let i = 2; i <= numofPages; i++) {
			await sleep(500);

			const withdrawals = await getNodeLib().getUserWithdrawals(userId, {
				dismissed: false,
				rejected: false,
				page: i,
				startDate: moment().subtract(24, 'hours').toISOString()
			});

			withdrawalData.push(...withdrawals.data);
		}
	}

	loggerWithdrawals.debug(
		'toolsLib/wallet/get24HourAccumulatedWithdrawals',
		'withdrawals made within last 24 hours',
		withdrawals.count
	);

	const withdrawalAmount = {};

	for (let withdrawal of withdrawalData) {
		if (withdrawalAmount[withdrawal.currency] !== undefined) {
			withdrawalAmount[withdrawal.currency] = math.number(math.add(math.bignumber(withdrawalAmount[withdrawal.currency]), math.bignumber(withdrawal.amount)));
		} else {
			withdrawalAmount[withdrawal.currency] = withdrawal.amount;
		}
	}

	let totalWithdrawalAmount = 0;

	if (currency) {
		// specific currency accumulated withdrawal is only needed
		totalWithdrawalAmount = withdrawalData[currency];
		
	} else {
		for (let withdrawalCurrency in withdrawalAmount) {
			loggerWithdrawals.debug(
				'toolsLib/wallet/get24HourAccumulatedWithdrawals',
				`accumulated ${withdrawalCurrency} withdrawal amount`,
				withdrawalAmount[withdrawalCurrency]
			);

			await sleep(500);

			const convertedAmount = await getNodeLib().getOraclePrices([withdrawalCurrency], {
				quote: getKitConfig().native_currency,
				amount: withdrawalAmount[withdrawalCurrency]
			});

			if (convertedAmount[withdrawalCurrency] !== -1) {
				loggerWithdrawals.debug(
					'toolsLib/wallet/get24HourAccumulatedWithdrawals',
					`${withdrawalCurrency} withdrawal amount converted to ${getKitConfig().native_currency}`,
					convertedAmount[withdrawalCurrency]
				);

				totalWithdrawalAmount = math.number(math.add(math.bignumber(totalWithdrawalAmount), math.bignumber(convertedAmount[withdrawalCurrency])));
			} else {
				loggerWithdrawals.debug(
					'toolsLib/wallet/get24HourAccumulatedWithdrawals',
					`No conversion found between ${withdrawalCurrency} and ${getKitConfig().native_currency}`
				);
			}
		}
	}

	return totalWithdrawalAmount;
};

const withdrawalBelowLimit = async (userId, currency, limit, amount = 0) => {
	loggerWithdrawals.verbose(
		'toolsLib/wallet/withdrawalBelowLimit',
		'amount being withdrawn',
		amount,
		'currency',
		currency,
		'limit',
		limit,
		'userId',
		userId
	);

	let totalWithdrawalAmount = 0;

	const convertedWithdrawalAmount = await getNodeLib().getOraclePrices([currency], {
		quote: getKitConfig().native_currency,
		amount
	});


	if (convertedWithdrawalAmount[currency] !== -1) {
		loggerWithdrawals.debug(
			'toolsLib/wallet/withdrawalBelowLimit',
			`${currency} withdrawal request amount converted to ${getKitConfig().native_currency}`,
			convertedWithdrawalAmount[currency]
		);

		totalWithdrawalAmount = math.number(
			math.add(
				math.bignumber(totalWithdrawalAmount),
				math.bignumber(convertedWithdrawalAmount[currency])
			)
		);
	} else {
		loggerWithdrawals.debug(
			'toolsLib/wallet/withdrawalBelowLimit',
			`No conversion found between ${currency} and ${getKitConfig().native_currency}`
		);
		return;
	}

	const last24HourWithdrawalAmount = await get24HourAccumulatedWithdrawals(userId);

	loggerWithdrawals.verbose(
		'toolsLib/wallet/withdrawalBelowLimit',
		`total 24 hour withdrawn amount converted to ${getKitConfig().native_currency}`,
		last24HourWithdrawalAmount
	);

	totalWithdrawalAmount = math.number(
		math.add(
			math.bignumber(totalWithdrawalAmount),
			math.bignumber(last24HourWithdrawalAmount)
		)
	);

	loggerWithdrawals.verbose(
		'toolsLib/wallet/withdrawalBelowLimit',
		'total 24 hour withdrawn amount after performing current withdrawal',
		totalWithdrawalAmount,
		'24 hour withdrawal limit',
		limit
	);

	if (totalWithdrawalAmount > limit) {
		throw new Error(
			`Total withdrawn amount would exceed withdrawal limit of ${limit} ${getKitConfig().native_currency}. Withdrawn amount: ${last24HourWithdrawalAmount} ${getKitConfig().native_currency}. Request amount: ${convertedWithdrawalAmount[currency]} ${getKitConfig().native_currency}`
		);
	}

	return;
};

const withdrawalBelowLimitSameCoin = async (userId, currency, limit, amount = 0) => {
	loggerWithdrawals.verbose(
		'toolsLib/wallet/withdrawalBelowLimitSameCoin',
		'amount being withdrawn',
		amount,
		'currency',
		currency,
		'limit',
		limit,
		'userId',
		userId
	);

	const last24HourWithdrawalAmount = await get24HourAccumulatedWithdrawals(userId, currency);

	loggerWithdrawals.verbose(
		'toolsLib/wallet/withdrawalBelowLimit',
		`total 24 hour ${currency} withdrawn amount`,
		last24HourWithdrawalAmount
	);

	let totalWithdrawalAmount = math.number(
		math.add(
			math.bignumber(amount),
			math.bignumber(last24HourWithdrawalAmount)
		)
	);

	loggerWithdrawals.verbose(
		'toolsLib/wallet/withdrawalBelowLimit',
		'total 24 hour withdrawn amount after performing current withdrawal',
		totalWithdrawalAmount,
		'24 hour withdrawal limit',
		limit
	);

	if (totalWithdrawalAmount > limit) {
		throw new Error(
			`Total withdrawn amount would exceed withdrawal limit of ${limit} ${currency}. Withdrawn amount: ${last24HourWithdrawalAmount} ${currency}. Request amount: ${amount} ${currency}`
		);
	}

	return;
};

const transferAssetByKitIds = (senderId, receiverId, currency, amount, description = 'Admin Transfer', email = true, opts = {
	transactionId: null,
	additionalHeaders: null
}) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	if (amount <= 0) {
		return reject(new Error(INVALID_AMOUNT(amount)));
	}

	return all([
		mapKitIdToNetworkId([senderId]),
		mapKitIdToNetworkId([receiverId])
	])
		.then(([ sender, receiver ]) => {
			if (!has(sender, senderId) || !has(receiver, receiverId)) {
				throw new Error(USER_NOT_FOUND);
			} else if (!sender[senderId] || !receiver[receiverId]) {
				throw new Error('User not registered on network');
			}
			return getNodeLib().transferAsset(sender[senderId], receiver[receiverId], currency, amount, { description, email, ...opts });
		});
};

const transferAssetByNetworkIds = (senderId, receiverId, currency, amount, description = 'Admin Transfer', email = true, opts = {
	transactionId: null,
	additionalHeaders: null
}) => {
	return getNodeLib().transferAsset(senderId, receiverId, currency, amount, { description, email, ...opts });
};

const getUserBalanceByKitId = async (userKitId, opts = {
	additionalHeaders: null
}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userKitId]);

	if (!has(idDictionary, userKitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userKitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}

	return getNodeLib().getUserBalance(idDictionary[userKitId], opts)
		.then((data) => {
			return {
				user_id: userKitId,
				...data
			};
		});
};

const getUserBalanceByNetworkId = (networkId, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().getUserBalance(networkId, opts);
};

const getKitBalance = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getBalance(opts);
};

const getUserTransactionsByKitId = (
	type,
	kitId,
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	transactionId,
	address,
	format,
	opts = {
		additionalHeaders: null
	}
) => {
	let promiseQuery;
	if (kitId) {
		if (type === 'deposit') {
			promiseQuery = getUserByKitId(kitId, false)
				.then((user) => {
					if (!user) {
						throw new Error(USER_NOT_FOUND);
					} else if (!user.network_id) {
						throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
					}
					return getNodeLib().getUserDeposits(user.network_id, {
						currency,
						status,
						dismissed,
						rejected,
						processing,
						waiting,
						limit,
						page,
						orderBy,
						order,
						startDate,
						endDate,
						transactionId,
						address,
						format: (format && format === 'csv') ? 'all' : null, // for csv get all data
						...opts
					});
				});
		} else if (type === 'withdrawal') {
			promiseQuery = getUserByKitId(kitId, false)
				.then((user) => {
					if (!user) {
						throw new Error(USER_NOT_FOUND);
					} else if (!user.network_id) {
						throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
					}
					return getNodeLib().getUserWithdrawals(user.network_id, {
						currency,
						status,
						dismissed,
						rejected,
						processing,
						waiting,
						limit,
						page,
						orderBy,
						order,
						startDate,
						endDate,
						transactionId,
						address,
						format: (format && format === 'csv') ? 'all' : null, // for csv get all data
						...opts
					});
				});
		}
	} else {
		if (type === 'deposit') {
			promiseQuery = getExchangeDeposits(
				currency,
				status,
				dismissed,
				rejected,
				processing,
				waiting,
				limit,
				page,
				orderBy,
				order,
				startDate,
				endDate,
				transactionId,
				address,
				opts
			);
		} else if (type === 'withdrawal') {
			promiseQuery = getExchangeWithdrawals(
				currency,
				status,
				dismissed,
				rejected,
				processing,
				waiting,
				limit,
				page,
				orderBy,
				order,
				startDate,
				endDate,
				transactionId,
				address,
				opts
			);
		}
	}
	return promiseQuery
		.then((transactions) => {
			if (format) {
				if (transactions.data.length === 0) {
					throw new Error(NO_DATA_FOR_CSV);
				}
				const csv = parse(transactions.data, Object.keys(transactions.data[0]));
				return csv;
			} else {
				return transactions;
			}
		});
};

const getUserDepositsByKitId = (
	kitId,
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	transactionId,
	address,
	format,
	opts = {
		additionalHeaders: null
	}
) => {
	return getUserTransactionsByKitId(
		'deposit',
		kitId,
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		transactionId,
		address,
		format,
		opts
	);
};

const getUserWithdrawalsByKitId = (
	kitId,
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	transactionId,
	address,
	format,
	opts = {
		additionalHeaders: null
	}
) => {
	return getUserTransactionsByKitId(
		'withdrawal',
		kitId,
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		transactionId,
		address,
		format,
		opts
	);
};

const getExchangeDeposits = (
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	transactionId,
	address,
	opts = {
		additionalHeaders: null
	}
) => {

	return getNodeLib().getDeposits({
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		transactionId,
		address,
		...opts
	})
		.then(async (deposits) => {
			if (deposits.data.length > 0) {
				const networkIds = deposits.data.map((deposit) => deposit.user_id);
				const idDictionary = await mapNetworkIdToKitId(networkIds);
				for (let deposit of deposits.data) {
					const user_kit_id = idDictionary[deposit.user_id];
					deposit.network_id = deposit.user_id;
					deposit.user_id = user_kit_id;
					deposit.User.id = user_kit_id;
				}
			}
			return deposits;
		});
};

const getExchangeWithdrawals = (
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	transactionId,
	address,
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().getWithdrawals({
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		transactionId,
		address,
		...opts
	})
		.then(async (withdrawals) => {
			if (withdrawals.data.length > 0) {
				const networkIds = withdrawals.data.map((withdrawal) => withdrawal.user_id);
				const idDictionary = await mapNetworkIdToKitId(networkIds);
				for (let withdrawal of withdrawals.data) {
					const user_kit_id = idDictionary[withdrawal.user_id];
					withdrawal.network_id = withdrawal.user_id;
					withdrawal.user_id = user_kit_id;
					withdrawal.User.id = user_kit_id;
				}
			}
			return withdrawals;
		});
};

const mintAssetByKitId = async (
	kitId,
	currency,
	amount,
	opts = {
		description: null,
		transactionId: null,
		status: null,
		email: null,
		fee: null,
		additionalHeaders: null
	}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([kitId]);

	if (!has(idDictionary, kitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[kitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}
	return getNodeLib().mintAsset(idDictionary[kitId], currency, amount, opts);
};

const mintAssetByNetworkId = (
	networkId,
	currency,
	amount,
	opts = {
		description: null,
		transactionId: null,
		status: null,
		email: null,
		fee: null,
		additionalHeaders: null
	}) => {
	return getNodeLib().mintAsset(networkId, currency, amount, opts);
};

const updatePendingMint = (
	transactionId,
	opts = {
		status: null,
		dismissed: null,
		rejected: null,
		processing: null,
		waiting: null,
		updatedTransactionId: null,
		email: null,
		updatedDescription: null,
		additionalHeaders: null
	}
) => {
	return getNodeLib().updatePendingMint(transactionId, opts);
};

const burnAssetByKitId = async (
	kitId,
	currency,
	amount,
	opts = {
		description: null,
		transactionId: null,
		status: null,
		email: null,
		fee: null,
		additionalHeaders: null
	}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([kitId]);

	if (!has(idDictionary, kitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[kitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}
	return getNodeLib().burnAsset(idDictionary[kitId], currency, amount, opts);
};

const burnAssetByNetworkId = (
	networkId,
	currency,
	amount,
	opts = {
		description: null,
		transactionId: null,
		status: null,
		email: null,
		fee: null,
		additionalHeaders: null
	}) => {
	return getNodeLib().burnAsset(networkId, currency, amount, opts);
};

const updatePendingBurn = (
	transactionId,
	opts = {
		status: null,
		dismissed: null,
		rejected: null,
		processing: null,
		waiting: null,
		updatedTransactionId: null,
		email: null,
		updatedDescription: null,
		additionalHeaders: null
	}
) => {
	return getNodeLib().updatePendingBurn(transactionId, opts);
};

const getDepositFee = (currency, network, amount, level) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}
	const { deposit_fees } = getKitCoin(currency);

	let fee = 0;
	let fee_coin = currency;
	if (deposit_fees && deposit_fees[currency]) {
		let value = deposit_fees[currency].value;
		fee_coin =  deposit_fees[currency].symbol;
		if (deposit_fees[currency].levels && deposit_fees[currency].levels[level]) {
			value = deposit_fees[currency].levels[level];
		}
		if (deposit_fees[currency].type === 'static') {
			fee = value;
		} else {
			fee = amount * value / 100;
		}
	}

	return {
		fee,
		fee_coin
	};
};

async function validateDeposit(user, amount, currency, network = null) {
	const coinConfiguration = getKitCoin(currency);

	if (!subscribedToCoin(currency)) {
		throw new Error(INVALID_COIN(currency));
	}

	if (amount <= 0) {
		throw new Error(INVALID_AMOUNT(amount));
	}

	if (!coinConfiguration.allow_deposit) {
		throw new Error(DEPOSIT_DISABLED_FOR_COIN(currency));
	}

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	} else if (!user.network_id) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	} else if (user.verification_level < 1) {
		throw new Error(UPGRADE_VERIFICATION_LEVEL(1));
	}

	const { fee, fee_coin } = getDepositFee(currency, network, amount, user.verification_level);

	return {
		fee,
		fee_coin
	};
}

module.exports = {
	sendRequestWithdrawalEmail,
	validateWithdrawal,
	validateWithdrawalToken,
	cancelUserWithdrawalByKitId,
	checkTransaction,
	performWithdrawal,
	performDirectWithdrawal,
	transferAssetByKitIds,
	getUserBalanceByKitId,
	getUserDepositsByKitId,
	getUserWithdrawalsByKitId,
	performWithdrawalNetwork,
	cancelUserWithdrawalByNetworkId,
	getExchangeDeposits,
	getExchangeWithdrawals,
	getUserBalanceByNetworkId,
	transferAssetByNetworkIds,
	mintAssetByKitId,
	mintAssetByNetworkId,
	burnAssetByKitId,
	burnAssetByNetworkId,
	getKitBalance,
	updatePendingMint,
	updatePendingBurn,
	isValidAddress,
	validateDeposit
};
