'use strict';

const { getModel } = require('./database/model');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { STAKE_SUPPORTED_PLANS } = require(`${SERVER_PATH}/constants`)
const { getUserByKitId, createAuditLog } = require('./user');
const { subscribedToCoin, getKitConfig, getAssetsPrices } = require('./common');
const { transferAssetByKitIds, getUserBalanceByKitId } = require('./wallet');
const { Op, fn, col } = require('sequelize');
const BigNumber = require('bignumber.js');
const { paginationQuery, timeframeQuery, orderingQuery } = require('./database/helpers');
const dbQuery = require('./database/query');
const moment = require('moment');
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');
const uuid = require('uuid/v4');

const {
	NO_DATA_FOR_CSV,
    STAKE_INVALID_STATUS,
    STAKE_ONBOARDING_STATUS_ERROR,
    STAKE_PERPETUAL_CONDITION_ERROR,
    ACCOUNT_ID_NOT_EXIST,
    SOURCE_ACCOUNT_INSUFFICIENT_BALANCE,
    STAKE_POOL_NOT_FOUND,
    TERMINATED_STAKE_POOL_INVALID_ACTION,
    INVALID_STAKE_POOL_ACTION,
    INVALID_ONBOARDING_ACTION,
    INVALID_TERMINATION_ACTION,
    FUNDING_ACCOUNT_INSUFFICIENT_BALANCE,
    STAKE_POOL_NOT_EXIST,
    USER_NOT_FOUND,
    STAKE_POOL_ACCEPT_USER_ERROR,
    STAKE_POOL_NOT_ACTIVE,
    AMOUNT_INSUFFICIENT_ERROR,
    STAKE_POOL_MAX_AMOUNT_ERROR,
    STAKE_POOL_MIN_AMOUNT_ERROR,
    STAKER_NOT_EXIST,
    STAKE_POOL_NOT_ACTIVE_FOR_UNSTAKING_ONBOARDING,
    STAKE_POOL_NOT_ACTIVE_FOR_UNSTAKING_STATUS,
    UNSTAKE_PERIOD_ERROR,
    STAKE_UNSUPPORTED_EXCHANGE_PLAN,
    REWARD_CURRENCY_CANNOT_BE_SAME,
    STAKE_MAX_ACTIVE
    
} = require(`${SERVER_PATH}/messages`);



const fetchP2PDeals = async (opts = {
	user_id: null,
    limit: null,
    page: null,
    order_by: null,
    order: null,
    start_date: null,
    end_date: null,
    format: null
}) => {
    const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const query = {
		where: {
			created_at: timeframe,
			...(opts.user_id && { merchant_id: opts.user_id }),
			
		},
		order: [ordering],
		...(!opts.format && pagination),
		include: [
			{
				model: getModel('user'),
				as: 'merchant',
				attributes: ['id', 'full_name']
			}
		]
	}

	if (opts.format) {
		return dbQuery.fetchAllRecords('p2pDeal', query)
			.then((data) => {
				if (opts.format && opts.format === 'csv') {
					if (data.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(data.data, Object.keys(data.data[0]));
					return csv;
				} else {
					return data;
				}
			});
	} else {
        return dbQuery.findAndCountAllWithRows('p2pDeal', query)
	}
};

const fetchP2PTransactions = async (user_id, opts = {
    limit: null,
    page: null,
    order_by: null,
    order: null,
    start_date: null,
    end_date: null,
    format: null
}) => {

	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const query = {
		where: {
			created_at: timeframe,
			[Op.or]: [
				{ merchant_id: user_id },
				{ user_id },
			]
			
		},
		order: [ordering],
		...(!opts.format && pagination),
		include: [
			{
				model: getModel('p2pDeal'),
				as: 'deal',
			},
			{
				model: getModel('user'),
				as: 'merchant',
				attributes: ['id', 'full_name']
			}
		]
	}

	if (opts.format) {
		return dbQuery.fetchAllRecords('p2pTransaction', query)
			.then((data) => {
				if (opts.format && opts.format === 'csv') {
					if (data.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(data.data, Object.keys(data.data[0]));
					return csv;
				} else {
					return data;
				}
			});
	} else {
        return dbQuery.findAndCountAllWithRows('p2pTransaction', query)
	}
}

const getP2PAccountBalance = async (account_id, coin) => {
        
    const balance = await getUserBalanceByKitId(account_id);
    let symbols = {};

    for (const key of Object.keys(balance)) {
        if (key.includes('available') && balance[key]) {
            let symbol = key?.split('_')?.[0];
            symbols[symbol] = balance[key];
        }
    }

    return symbols[coin];
}

const editAdminP2pConfig = async (data) => {
    const {
		digital_currencies,
		fiat_currencies,
		side,
		fee,
    } = data;
    
	digital_currencies.forEach(currency => {
		if (!subscribedToCoin(currency)) {
           throw new Error('Invalid coin ' + currency);
    	}
	})
	fiat_currencies.forEach(currency => {
		if (!subscribedToCoin(currency)) {
           throw new Error('Invalid coin ' + currency);
    	}
	})
	if (fee < 0) {
		throw new Error('Fee cannot be less than 0');
	}

	if (side !== 'sell') {
		throw new Error('side can only be sell');
	}
    
    const exchangeInfo = getKitConfig().info;

    if(!STAKE_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
        throw new Error(STAKE_UNSUPPORTED_EXCHANGE_PLAN);
    }

	return getModel('p2pAdminConfig').create(data, {
		fields: [
			'enable',
			'bank_payment_methods',
			'starting_merchant_tier',
			'starting_user_tier',
			'digital_currencies',
			'fiat_currencies',
			'side',
			'fee',
		]
	});
};

const createP2PDeal = async (data) => {
	let {
		merchant_id,
		side,
		price_type,
		buying_asset,
		spending_asset,
		exchange_rate,
		margin,
		total_order_amount,
		min_order_value,
		max_order_value,
		status,
		auto_response
    } = data;
        
    const exchangeInfo = getKitConfig().info;

    if(!STAKE_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
        throw new Error(STAKE_UNSUPPORTED_EXCHANGE_PLAN);
    }

	//Check Merhcant Tier

	if (!subscribedToCoin(spending_asset)) {
        throw new Error('Invalid coin ' + spending_asset);
    }

	if (!subscribedToCoin(buying_asset)) {
        throw new Error('Invalid coin ' + buying_asset);
    }

	const balance = await getP2PAccountBalance(merchant_id, buying_asset);

	if(new BigNumber(balance).comparedTo(new BigNumber(total_order_amount)) !== 1) {
        throw new Error(FUNDING_ACCOUNT_INSUFFICIENT_BALANCE);
    }
	if(min_order_value < 0) {
			throw new Error('cannot be less than 0');
	}

	if(max_order_value < 0) {
		throw new Error('cannot be less than 0');
	}

	if(min_order_value > max_order_value) {
		throw new Error('cannot be bigger');
	}

	if (margin < 0) {
		throw new Error('Margin cannot be less than 0');
	}

	if (side !== 'sell') {
		throw new Error('side can only be sell');
	}

	data.status = true;

	return getModel('p2pDeal').create(data, {
		fields: [
			'merchant_id',
			'side',
			'price_type',
			'buying_asset',
			'spending_asset',
			'exchange_rate',
			'spread',
			'total_order_amount',
			'min_order_value',
			'max_order_value',
			'terms',
			'auto_response',
			'payment_methods',
			'status',
		]
	});
}

const createP2PTransaction = async (data) => {
	let {
		deal_id,
		user_id,
		amount_fiat,
		payment_method_used
    } = data;
    
	const exchangeInfo = getKitConfig().info;

    if(!STAKE_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
        throw new Error(STAKE_UNSUPPORTED_EXCHANGE_PLAN);
    }

	// Check User tier

 	const p2pDeal = await getModel('p2pDeal').findOne({ where: { id: deal_id } });

	const { max_order_value, min_order_value, exchange_rate, spread } = p2pDeal;
	const { merchant_id } = p2pDeal;

    if (!p2pDeal) {
        throw new Error('deal does not exist');
    }
	const buyer = await getUserByKitId(user_id);
   
    if (!buyer) {
        throw new Error(USER_NOT_FOUND);
    }

	if (merchant_id === user_id) {
		throw new Error('Merchant and Buyer cannot be same');
	}

	//Cant have more than 3 active transactions per user

	const merchant = await getUserByKitId(p2pDeal.merchant_id);

	const merchantBalance = await getP2PAccountBalance(merchant_id, p2pDeal.buying_asset);

	const amount_digital_currency = new BigNumber(amount_fiat).dividedBy(new BigNumber(exchange_rate).multipliedBy(1 + spread)).toNumber();

	if (new BigNumber(merchantBalance).comparedTo(new BigNumber(amount_digital_currency)) !== 1) {
        throw new Error('Transaction is not possible at the moment');
    }
	
	if (new BigNumber(amount_fiat).comparedTo(new BigNumber(max_order_value)) === 1) {
		throw new Error('input amount cannot be bigger than max allowable order amount')
	}

	if (new BigNumber(amount_fiat).comparedTo(new BigNumber(min_order_value)) === -1) {
		throw new Error('input amount cannot be lower than min allowable order amount')
	}

	//Check the payment method

	data.user_status = 'pending';
	data.merchant_status = 'pending';
	data.transaction_status = 'active';
	data.transaction_duration = 30;
	data.transaction_id = uuid();
	data.merchant_id = merchant_id;
	data.user_id = user_id;
	data.amount_digital_currency = amount_digital_currency
	data.deal_id = deal_id;
	const lock = await getNodeLib().lockBalance(merchant.network_id, p2pDeal.buying_asset, amount_digital_currency);
	data.locked_asset_id = lock.id;

	const firstChatMessage = {
		sender_id: merchant_id,
		receiver_id: user_id,
		message: p2pDeal.auto_response
	}

	data.messages = [firstChatMessage];

	return getModel('p2pTransaction').create(data, {
		fields: [
			'deal_id',
			'transaction_id',
			'locked_asset_id',
			'merchant_id',
			'user_id',
			'amount_digital_currency',
			'amount_fiat',
			'payment_method_used',
			'user_status',
			'merchant_status',
			'cancellation_reason',
			'transaction_expired',
			'transaction_timestamp',
			'merchant_release',
			'transaction_duration',
			'transaction_status',
			'messages'
		]
	});
}

const updateP2pTransaction = async (data) => {
	let {
		user_id,
		transaction_id,
		amount_digital_currency,
		amount_fiat,
		payment_method_used,
		user_status,
		merchant_status,
		cancellation_reason,
		transaction_expired,
		merchant_release,
		transaction_duration,
	} = data;

		
	const transaction = await getModel('p2pTransaction').findOne({ where: { transaction_id } });
	const p2pConfig = await getModel('p2pConfig').findOne({});
	const p2pDeal = await getModel('p2pDeal').findOne({ where: { id: deal_id } });
	const merchant = await getUserByKitId(p2pDeal.merchant_id);

	if (user_id === transaction.merchant_id && data.hasOwnProperty(user_status)) {
		 throw new Error('merchant cannot update buyer status');
	}

	if (user_id === transaction.user_id && data.hasOwnProperty(merchant_status)) {
		 throw new Error('buyer cannot update merchant status');
	}


    if (!transaction) {
        throw new Error('transaction does not exist');
    }

	if (transaction.transaction_status !== 'active') {
			throw new Error('Cannot update complete transaction');
	}
	if (transaction.merchant_status === 'confirmed' && transaction.user_status === 'confirmed') {
		throw new Error('Cannot update complete transaction');
	}

	if (user_status === 'confirmed' && transaction.merchant_status === 'confirmed') {
		await getNodeLib().unlockBalance(merchant.network_id, transaction.amount_digital_currency, p2pDeal.buying_asset);
		await transferAssetByKitIds(account_id, user.id, currency, totalAmount, 'P2P Transaction', false, { category: 'p2p' });
		data.transaction_status = 'complete';
		data.merchant_release = new Date();
	} 

	if(user_status === 'appeal' || merchant_status === 'appeal') {
		let initiator_id;
		if (user_status === 'appeal') {
			initiator_id = transaction.merchant_id;
		} else {
			initiator_id = transaction.user_id;
		}
		
		await createP2pDispute({ 
			transaction_id: transaction.id,
			initiator_id,
			reason: cancellation_reason,
			participant_ids: [transaction.merchant_id, transaction.user_id, p2pConfig.operator_id],
			operator_id:  p2pConfig.operator_id
		 })
	}

	if (user_status === 'cancelled' || merchant_status === 'cancelled') {
		data.transaction_status = 'cancelled';
	}
	
  return transaction.update(data, {
		fields: [
			'user_status',
			'merchant_status',
			'cancellation_reason',
			'transaction_expired',
			'transaction_timestamp',
			'merchant_release',
			'transaction_duration',
			'transaction_status'
		]
	});
}


const createP2pDispute = async (data) => {

		data.status = 'active';
		return getModel('p2pDispute').create(data, {
			fields: [
				'transaction_id',
				'initiator_id',
				'reason',
				'resolution',
				'status',
				'participant_ids',
			]
		});
}

const updateP2pDispute = async (data) => {
	   const p2pDispute = await getModel('p2pDispute').findOne({ id: data.id });

	   if(!p2pDispute) {
		throw new error('no record found');
	   }
	   return p2pDispute.update(data, {
		fields: [
			'reason',
			'resolution',
			'status'
		]
	});
}

const createP2pChatMessage = async (data) => {
	const transaction = await getModel('p2pTransaction').findOne({ where: { id: data.transaction_id } });
	if (!transaction) {
		throw new Error ('no transaction found');
	}
	return getModel('p2pChat').create(data, {
		fields: [
			'sender_id',
			'transaction_id',
			'message'		
		]
	});
}
 
const updateMerchantProfile = async (data) => {
	const p2pMerchant = await getModel('p2pMerchant').findOne({ id: data.id });

	if(!p2pMerchant) {
		return getModel('p2pMerchant').create(data, {
			fields: [
				'user_id',
				'blocked_users'
			]
		});
	} else {
		p2pMerchant.update(data, {
			fields: [
				'user_id',
				'blocked_users'
			]
		});
	}
}

const createMerchantFeedback = async (data) => {
	const transaction = await getModel('p2pTransaction').findOne({ where: { id: data.transaction_id } });
	if (!transaction) {
		throw new Error ('no transaction found');
	}
	
	return getModel('p2pMerchantFeedback').create(data, {
		fields: [
			'merchant_id',
			'user_id',
			'transaction_id',
			'rating',
			'comment',
		]
	});
}

module.exports = {
    editAdminP2pConfig,
	createP2PDeal,
	createP2PTransaction,
	createP2pDispute,
	updateP2pTransaction,
	updateP2pDispute,
	updateMerchantProfile,
	createMerchantFeedback,
	createP2pChatMessage,
	fetchP2PDeals,
	fetchP2PTransactions
};