'use strict';

const { getModel } = require('./database/model');
const { SERVER_PATH } = require('../constants');
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

	if(new BigNumber(balance).comparedTo(total_order_amount) !== 1) {
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

	status = true;

	return getModel('p2pDeal').create(data, {
		fields: [
			'merchant_id',
			'side',
			'price_type',
			'buying_asset',
			'spending_asset',
			'exchange_rate',
			'margin',
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

const createP2pTransaction = async (data) => {
	let {
		deal_id,
		merchant_id,
		buyer_id,
		amount_digital_currency,
		cancellation_reason,
		merchant_release,
		transaction_duration,
    } = data;
    
	const exchangeInfo = getKitConfig().info;

    if(!STAKE_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
        throw new Error(STAKE_UNSUPPORTED_EXCHANGE_PLAN);
    }

	// Check User tier

 	const p2pDeal = await getModel('p2pDeal').findOne({ where: { id: deal_id } });

    if (!p2pDeal) {
        throw new Error('deal does not exist');
    }
	const buyer = await getUserByKitId(buyer_id);
   
    if (!buyer) {
        throw new Error(USER_NOT_FOUND);
    }


	//Cant have more than 3 active transactions per user

	const merchant = await getUserByKitId(p2pDeal.merchant_id);


	const balance = await getP2PAccountBalance(merchant_id, p2pDeal.buying_asset);

	if(new BigNumber(balance).comparedTo(amount_digital_currency) !== 1) {
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


	data.buyer_status = 'pending';
	data.merchant_status = 'pending';
	data.transaction_status = 'active';

	data.transaction_id = uuid();

	await getNodeLib().lockBalance(merchant.network_id, amount_digital_currency, p2pDeal.buying_asset);

	return getModel('p2pTransaction').create(data, {
		fields: [
			'deal_id',
			'merchant_id',
			'buyer_id',
			'amount_digital_currency',
			'amount_fiat',
			'payment_method_used',
			'buyer_status',
			'merchant_status',
			'cancellation_reason',
			'transaction_expired',
			'transaction_timestamp',
			'merchant_release',
			'transaction_duration',
			'transaction_status',
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
		buyer_status,
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

	if (user_id === transaction.merchant_id && data.hasOwnProperty(buyer_status)) {
		 throw new Error('merchant cannot update buyer status');
	}

	if (user_id === transaction.buyer_id && data.hasOwnProperty(merchant_status)) {
		 throw new Error('buyer cannot update merchant status');
	}


    if (!transaction) {
        throw new Error('transaction does not exist');
    }

	if (transaction.transaction_status !== 'active') {
			throw new Error('Cannot update complete transaction');
	}
	if (transaction.merchant_status === 'confirmed' && transaction.buyer_status === 'confirmed') {
		throw new Error('Cannot update complete transaction');
	}

	if (buyer_status === 'confirmed' && transaction.merchant_status === 'confirmed') {
		await getNodeLib().unlockBalance(merchant.network_id, transaction.amount_digital_currency, p2pDeal.buying_asset);
		await transferAssetByKitIds(account_id, user.id, currency, totalAmount, 'P2P Transaction', false, { category: 'p2p' });
		data.transaction_status = 'complete';
		data.merchant_release = new Date();
	} 

	if(buyer_status === 'appeal' || merchant_status === 'appeal') {
		let initiator_id;
		if (buyer_status === 'appeal') {
			initiator_id = transaction.merchant_id;
		} else {
			initiator_id = transaction.buyer_id;
		}
		
		await createP2pDispute({ 
			transaction_id: transaction.id,
			initiator_id,
			reason: cancellation_reason,
			participant_ids: [transaction.merchant_id, transaction.buyer_id, p2pConfig.operator_id],
			operator_id:  p2pConfig.operator_id
		 })
	}

	if (buyer_status === 'cancelled' || merchant_status === 'cancelled') {
		data.transaction_status = 'cancelled';
	}
	
  return transaction.update(data, {
		fields: [
			'buyer_status',
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
		await createP2pChatMessage({
			sender_id: data.operator_id,
			message: 'Chat initiated for dispute',
			transaction_id: data.transaction_id,

		});

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
	createP2pTransaction,
	createP2pDispute,
	updateP2pTransaction,
	updateP2pDispute,
	updateMerchantProfile,
	createMerchantFeedback,
	createP2pChatMessage
};