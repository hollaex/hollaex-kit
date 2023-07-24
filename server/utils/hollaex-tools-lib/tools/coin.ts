'use strict';

import { getNodeLib } from '../../..//init';
import {
  subscribedToCoin,
  getKitCoin,
  getKitCoins,
  getKitCoinsConfig,
} from './common';


const getNetworkCoins = (
	opts = {
		search: null,
		additionalHeaders: null
	}
) => {
	return getNodeLib().getCoins(opts);
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


export {
	subscribedToCoin,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig,
	createCoin,
	updateCoin,
	getNetworkCoins
};