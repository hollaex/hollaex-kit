'use strict';

const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const {
	subscribedToCoin,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig
} = require('./common');
const { getModel } = require('./database/model');
const dbQuery = require('./database/query');
const {
	COIN_CONFIGURATION_NOT_FOUND,
	WITHDRAWAL_FEE_SMALLER_THAN_NETWORK,
	DEPOSIT_FEE_SMALLER_THAN_NETWORK,
} = require(`${SERVER_PATH}/messages`);

const getNetworkCoins = (
	opts = {
		search: null,
		additionalHeaders: null
	}
) => {
	return getNodeLib().getCoins(opts);
};

const findCoinConfiguration = (symbol) => {
	return dbQuery.findOne('coinConfiguration', {
		where: {
			symbol
		}
	})
};

const createCoin = async (
	symbol,
	fullname,
	opts = {
		code: null,
		withdrawalFee: null,
		min: null,
		max: null,
		incrementUnit: null,
		logo: null,
		meta: null,
		estimatedPrice: null,
		type: null,
		network: null,
		standard: null,
		allowDeposit: null,
		allowWithdrawal: null,
		additionalHeaders: null
	}
) => {
	const formattedSymbol = symbol.trim().toLowerCase();

	return getNodeLib().createCoin(formattedSymbol, fullname, opts);
};

const updateCoin = async (
	code,
	fields = {
		fullname: null,
		withdrawalFee: null,
		description: null,
		withdrawalFees: null,
		depositFees: null,
		min: null,
		max: null,
		isPublic: null,
		incrementUnit: null,
		logo: null,
		meta: null,
		estimatedPrice: null,
		type: null,
		network: null,
		standard: null,
		allowDeposit: null,
		allowWithdrawal: null
	},
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().updateCoin(code, fields, opts);
};

const updateCoinConfiguration = async (id, data) => {
	const {
		symbol,
		withdrawal_fee,
		withdrawal_fees,
		deposit_fees,
	} = data

	const coinConfigurationModel = getModel('coinConfiguration');

	const coinConfiguration = await coinConfigurationModel.findOne({ where: { id } });
	if (!coinConfiguration) {
		throw new Error(COIN_CONFIGURATION_NOT_FOUND);
	}
	if (!subscribedToCoin(symbol)) {
           throw new Error('Invalid coin ' + symbol);
    }

	const coins = getKitCoinsConfig();
	const coin = coins[coinConfiguration.symbol];


	if(withdrawal_fee < coin?.withdrawal_fee) {
		throw new Error(WITHDRAWAL_FEE_SMALLER_THAN_NETWORK)
	}

	for(const network of Object.keys(coin?.withdrawal_fees || {})) {
		const withdrawalFeeValue = coin?.withdrawal_fees[network]?.value;
		if (withdrawal_fees?.[network]?.value < withdrawalFeeValue) {
			throw new Error(WITHDRAWAL_FEE_SMALLER_THAN_NETWORK)
		}
		
	}

	for(const network of Object.keys(coin?.deposit_fees || {})) {
		const depositFeeValue = coin?.deposit_fees[network]?.value;
		if (deposit_fees?.[network]?.value < depositFeeValue) {
			throw new Error(DEPOSIT_FEE_SMALLER_THAN_NETWORK)
		}
	}

	const updatedCoinObject = {
		...coinConfiguration.get({ plain: true }),
		...data,
	};


	return coinConfiguration.update(updatedCoinObject);

}

const getCoinConfiguration = () => {
	return dbQuery.findAndCountAllWithRows('coinConfiguration');
}

module.exports = {
	subscribedToCoin,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig,
	createCoin,
	updateCoin,
	getNetworkCoins,
	updateCoinConfiguration,
	getCoinConfiguration,
	findCoinConfiguration
};
