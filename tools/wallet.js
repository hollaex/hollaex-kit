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
	WITHDRAWAL_DISABLED_FOR_COIN,
	UPGRADE_VERIFICATION_LEVEL,
	NO_DATA_FOR_CSV,
	USER_NOT_FOUND,
	USER_NOT_REGISTERED_ON_NETWORK,
	INVALID_NETWORK,
	NETWORK_REQUIRED
} = require(`${SERVER_PATH}/messages`);
const { getUserByKitId } = require('./user');
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

const sendRequestWithdrawalEmail = (id, address, amount, currency, opts = {
	network: null,
	otpCode: null,
	ip: null,
	domain: null
}) => {

	const coinConfiguration = getKitCoin(currency);

	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	if (amount <= 0) {
		return reject(new Error(INVALID_AMOUNT(amount)));
	}

	if (!coinConfiguration.allow_withdrawal) {
		return reject(new Error(WITHDRAWAL_DISABLED_FOR_COIN(currency)));
	}

	if (
		coinConfiguration.network
		&& !coinConfiguration.network.split(',').includes(opts.network)
	) {
		if (!opts.network) {
			return reject(new Error(NETWORK_REQUIRED(currency, coinConfiguration.network)));
		} else {
			return reject(new Error(INVALID_NETWORK(opts.network, coinConfiguration.network)));
		}
	}

	return verifyOtpBeforeAction(id, opts.otpCode)
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return getUserByKitId(id);
		})
		.then(async (user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			if (user.verification_level < 1) {
				throw new Error(UPGRADE_VERIFICATION_LEVEL(1));
			}

			const balance = await getNodeLib().getUserBalance(user.network_id);
			if (balance[`${currency}_available`] < amount) {
				throw new Error('Insufficent balance for withdrawal');
			}

			return all([
				user,
				findTier(user.verification_level)
			]);
		})
		.then(async ([ user, tier ]) => {
			const limit = tier.withdrawal_limit;
			if (limit === -1) {
				throw new Error(WITHDRAWAL_DISABLED_FOR_COIN(currency));
			} else if (limit > 0) {
				await withdrawalBelowLimit(user.network_id, currency, limit, amount);
			}

			let fee = coinConfiguration.withdrawal_fee;

			if (opts.network && coinConfiguration.withdrawal_fees && coinConfiguration.withdrawal_fees[opts.network]) {
				fee = coinConfiguration.withdrawal_fees[opts.network];
			}

			return withdrawalRequestEmail(
				user,
				{
					user_id: id,
					email: user.email,
					amount,
					fee,
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
			const { email, amount, fee, currency, address, network } = data;
			sendEmail(
				MAILTYPE.WITHDRAWAL_REQUEST,
				email,
				{
					amount,
					fee,
					currency,
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

const cancelUserWithdrawalByKitId = (userId, withdrawalId) => {
	return getUserByKitId(userId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().cancelWithdrawal(user.network_id, withdrawalId);
		});
};

const cancelUserWithdrawalByNetworkId = (networkId, withdrawalId) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().cancelWithdrawal(networkId, withdrawalId);
};

const checkTransaction = (currency, transactionId, address, network, isTestnet = false) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	return getNodeLib().checkTransaction(currency, transactionId, address, network, { isTestnet });
};

const performWithdrawal = (userId, address, currency, amount, opts = {
	network: null
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
				await withdrawalBelowLimit(user.network_id, currency, limit, amount);
			}
			return getNodeLib().performWithdrawal(user.network_id, address, currency, amount, opts);
		});
};

const performWithdrawalNetwork = (networkId, address, currency, amount, opts) => {
	return getNodeLib().performWithdrawal(networkId, address, currency, amount, opts);
};

const get24HourAccumulatedWithdrawals = async (userId) => {
	const withdrawals = await getNodeLib().getUserWithdrawals(userId, {
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
		userId,
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

const transferAssetByKitIds = (senderId, receiverId, currency, amount, description = 'Admin Transfer', email = true) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	if (amount <= 0) {
		return reject(new Error(INVALID_AMOUNT(amount)));
	}

	return all([
		getUserByKitId(senderId),
		getUserByKitId(receiverId)
	])
		.then(([ sender, receiver ]) => {
			if (!sender || !receiver) {
				throw new Error(USER_NOT_FOUND);
			} else if (!sender.network_id || !receiver.network_id) {
				throw new Error('User not registered on network');
			}
			return getNodeLib().transferAsset(sender.network_id, receiver.network_id, currency, amount, { description, email });
		});
};

const transferAssetByNetworkIds = (senderId, receiverId, currency, amount, description = 'Admin Transfer', email = true) => {
	return getNodeLib().transferAsset(senderId, receiverId, currency, amount, { description, email });
};

const getUserBalanceByKitId = (userKitId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().getUserBalance(user.network_id);
		})
		.then((data) => {
			return {
				user_id: userKitId,
				...data
			};
		});
};

const getUserBalanceByNetworkId = (networkId) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().getUserBalance(networkId);
};

const getKitBalance = () => {
	return getNodeLib().getBalance();
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
	format
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
						address
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
						address
					});
				});
		}
	} else {
		if (type === 'deposit') {
			promiseQuery = getNodeLib().getDeposits({
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
				address
			});
		} else if (type === 'withdrawal') {
			promiseQuery = getNodeLib().getWithdrawals({
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
				address
			});
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
	format
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
		format
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
	format
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
		format
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
	address
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
		address
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
	address
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
		address
	});
};

const mintAssetByKitId = (
	kitId,
	currency,
	amount,
	opts = {
		description: null,
		transactionId: null,
		status: null,
		email: null,
		fee: null
	}) => {
	return getUserByKitId(kitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().mintAsset(user.network_id, currency, amount, opts);
		});
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
		fee: null
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
		updatedDescription: null
	}
) => {
	return getNodeLib().updatePendingMint(transactionId, opts);
};

const burnAssetByKitId = (
	kitId,
	currency,
	amount,
	opts = {
		description: null,
		transactionId: null,
		status: null,
		email: null,
		fee: null
	}) => {
	return getUserByKitId(kitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().burnAsset(user.network_id, currency, amount, opts);
		});
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
		fee: null
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
		updatedDescription: null
	}
) => {
	return getNodeLib().updatePendingBurn(transactionId, opts);
};

module.exports = {
	sendRequestWithdrawalEmail,
	validateWithdrawalToken,
	cancelUserWithdrawalByKitId,
	checkTransaction,
	performWithdrawal,
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
	updatePendingBurn
};
