'use strict';

const { getModel } = require('./database/model');
const { SERVER_PATH } = require('../constants');
const { STAKE_SUPPORTED_PLANS } = require(`${SERVER_PATH}/constants`);
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



const calculateSlashAmount = async (staker, stakePool) => {
	let slashingPrinciple = new BigNumber(0);
	let slashingEarning = new BigNumber(0);

	let isSlashed = false;


	const unstakedDate = moment();
	const closedDate = staker.closing && moment(staker.closing);


	// If we unstaked before the closing date, it means we unstaked early, set isSlashed to true in this case.
	// If there is no closing date, it means we are in a perpatual stake pool, so no slashing.
	if (closedDate && unstakedDate && closedDate > unstakedDate) {
		isSlashed = true;
	}

	if (isSlashed) {

		if (stakePool.slashing_principle_percentage) {
			const stakeAmount = new BigNumber(staker.amount);
			const slashingPrinciplePercentage = new BigNumber(stakePool.slashing_principle_percentage);
			slashingPrinciple = stakeAmount.multipliedBy(slashingPrinciplePercentage).dividedBy(100);
		}

		if (stakePool.slashing_earning_percentage) {
			const stakerReward = new BigNumber(staker.reward);
			const slashingEarningPercentage = new BigNumber(stakePool.slashing_earning_percentage);
			slashingEarning = stakerReward.multipliedBy(slashingEarningPercentage).dividedBy(100);
		}

	}

	return { slashingPrinciple: slashingPrinciple.toNumber(), slashingEarning: slashingEarning.toNumber() };
};

const calculateStakingRewards = (stakers) => {
	const rewards = stakers.map(staker => staker.reward).reduce((a, b) => a + b, 0);
	const slashes = stakers.map(staker => staker.slashed).reduce((a, b) => a + b, 0);

	return (new BigNumber(rewards).minus(new BigNumber(slashes))).toNumber();
};

const calculateStakingAmount = (stakers) => {
	const totalAmount = stakers.map(staker => staker.amount).reduce((a, b) => a + b, 0);
	return totalAmount;
};

const distributeStakingRewards = async (stakers, account_id, currency, reward_currency, admin_id) => {
	for (const staker of stakers) {

		await staker.update({ status: 'closed' }, {
	        	fields: ['status']
		});

		const amountAfterSlash =  new BigNumber(staker.reward).minus(new BigNumber(staker.slashed)).toNumber();
		let totalAmount = staker.amount;

		//Add them together since they are of same currency.
		if (reward_currency === currency) {
			totalAmount = (new BigNumber(staker.amount).plus(amountAfterSlash)).toNumber();
		}
                
		const user = await getUserByKitId(staker.user_id);

		try {
			if(totalAmount > 0) {
				await transferAssetByKitIds(account_id, user.id, currency, totalAmount, 'Admin transfer stake', false, { category: 'stake' });
			}
			if (reward_currency !== currency && amountAfterSlash > 0) { 
				await transferAssetByKitIds(account_id, user.id, reward_currency, amountAfterSlash, 'Admin transfer stake', false, { category: 'stake' });
			}

		} catch (error) {
			const adminAccount = await getUserByKitId(admin_id);
			sendEmail(
				MAILTYPE.ALERT,
				adminAccount.email,
				{
					type: 'Error! Unstaking failed for an exchange user',
					data: `Unstaking failed while transfering funds for user id ${user.id} Error message: ${error.message}`
				},
				adminAccount.settings
			);
		}
	}
};

const getSourceAccountBalance = async (account_id, coin) => {
        
	const balance = await getUserBalanceByKitId(account_id);
	let symbols = {};

	for (const key of Object.keys(balance)) {
		if (key.includes('available') && balance[key] != null) {
			let symbol = key?.split('_')?.[0];
			symbols[symbol] = balance[key];
		}
	}

	return symbols[coin];
};

const fetchStakers = async (stakePoolId) => {
	return getModel('staker').findAll({ where: { stake_id: stakePoolId } });
};

const validateExchangeStake = (stake) => {
	if (new BigNumber(stake.min_amount).comparedTo(0) !== 1) {
		throw new Error('Stake minimum amount must be bigger than zero.');
	} 
	if (new BigNumber(stake.max_amount).comparedTo(0) !== 1) {
		throw new Error('Stake maximum amount must be bigger than zero.');
	} 
	if (new BigNumber(stake.max_amount).comparedTo(new BigNumber(stake.min_amount)) !== 1) {
		throw new Error('Stake minimum amount cannot be bigger than maximum amount');
	} 
	if (new BigNumber(stake.apy).comparedTo(0) !== 1) {
		throw new Error('Stake apy must be bigger than zero.');
	} 
	if (stake.duration !== null && new BigNumber(stake.duration).comparedTo(0) !== 1) {
		throw new Error('Stake duration must be bigger than zero.');
	} 
	if (stake.slashing_principle_percentage && new BigNumber(stake.slashing_principle_percentage).comparedTo(100) === 1) {
		throw new Error('Stake slash principle cannot be bigger than 100.');
	} 
	if (stake.slashing_earning_percentage && new BigNumber(stake.slashing_earning_percentage).comparedTo(100) === 1) {
		throw new Error('Stake slash earnings cannot be bigger than 100.');
	} 
	if (stake.slashing_principle_percentage && new BigNumber(stake.slashing_principle_percentage).comparedTo(0) !== 1) {
		throw new Error('Stake slash principle cannot be smaller than 0.');
	} 
	if (stake.slashing_earning_percentage && new BigNumber(stake.slashing_earning_percentage).comparedTo(0) !== 1) {
		throw new Error('Stake slash earnings cannot be smaller than 0.');
	} 

};

const getExchangeStakePools = async (opts = {
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
		},
		order: [ordering],
		...(!opts.format && pagination),
	};

     	
	if (opts.format) {
		return dbQuery.fetchAllRecords('stake', query)
			.then((stakes) => {
				if (opts.format && opts.format === 'csv') {
					if (stakes.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(stakes.data, Object.keys(stakes.data[0]));
					return csv;
				} else {
					return stakes;
				}
			});
	} else {
		return dbQuery.findAndCountAllWithRows('stake', query)
			.then(async (stakePools) => {
            
				//Calculate reward amount per stake pool
				for (const stakePool of stakePools.data) {
					const stakers = await fetchStakers(stakePool.id);
					stakePool.reward = calculateStakingRewards(stakers);
				}

				return stakePools;
			});
	}
};

const createExchangeStakePool = async (stake) => {
	validateExchangeStake(stake);

	const {
		currency,
		reward_currency,
		account_id,
		duration,
		slashing,
		early_unstake,
		max_amount,
		status,
		onboarding,
	} = stake;
    
	if (status !== 'uninitialized') {
		throw new Error(STAKE_INVALID_STATUS);
	}

	if (onboarding) {
		throw new Error(STAKE_ONBOARDING_STATUS_ERROR);
	}

	if (duration === null && (early_unstake || slashing)) {
		throw new Error(STAKE_PERPETUAL_CONDITION_ERROR);
	}

	if (!subscribedToCoin(currency)) {
		throw new Error('Invalid coin ' + currency);
	}

	if (reward_currency && !subscribedToCoin(reward_currency)) {
		throw new Error('Invalid coin ' + reward_currency);
	}

	if (reward_currency !== currency) {
		const conversions = await getAssetsPrices([currency], reward_currency, 1);
		if (conversions[currency] === -1) {
			throw new Error(NO_ORACLE_PRICE_FOUND);
		}
	}

    
	const exchangeInfo = getKitConfig().info;

	if(!STAKE_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
		throw new Error(STAKE_UNSUPPORTED_EXCHANGE_PLAN);
	}

	const accountOwner = await getUserByKitId(account_id);

	if (!accountOwner) {
		throw new Error(ACCOUNT_ID_NOT_EXIST);
	}
    
	stake.slashing = (stake.slashing_principle_percentage || stake.slashing_earning_percentage) ? true : false;
     
	if (!reward_currency) {
		stake.reward_currency = currency;
	}

	return getModel('stake').create(stake, {
		fields: [
			'name',
			'user_id',
			'currency',
			'reward_currency',
			'account_id',
			'apy',
			'duration',
			'slashing',
			'slashing_earning_percentage',
			'slashing_principle_percentage',
			'early_unstake',
			'min_amount',
			'max_amount',
			'status',
			'onboarding',
			'disclaimer',
			'paused_date'
		]
	});
};

const updateExchangeStakePool = async (id, data, auditInfo) => {
   	const stakePool = await getModel('stake').findOne({ where: { id } });
	if (!stakePool) {
		throw new Error(STAKE_POOL_NOT_FOUND);
	}

	const {
		currency,
		reward_currency,
		name,
		account_id,
		duration,
		slashing,
		early_unstake,
		slashing_principle_percentage,
		slashing_earning_percentage,
		status,
		onboarding,
	} = data;
    
	if (stakePool.status === 'terminated') {
		throw new Error(TERMINATED_STAKE_POOL_INVALID_ACTION);
	}

	if(status !== 'uninitialized' && (
		(currency && currency !== stakePool.currency)
        || (name && name !== stakePool.name)
        || (reward_currency && reward_currency !== stakePool.reward_currency)
        || (account_id && account_id !== stakePool.account_id)
        || (duration && duration !== stakePool.duration)
        || (slashing && slashing !== stakePool.slashing)
        || (early_unstake && early_unstake !== stakePool.early_unstake)
        || (slashing_principle_percentage && slashing_principle_percentage !== stakePool.slashing_principle_percentage)
        || (slashing_earning_percentage && slashing_earning_percentage !== stakePool.slashing_earning_percentage)
	)) {
		throw new Error(INVALID_STAKE_POOL_ACTION);
	}

	if (onboarding && stakePool.status === 'uninitialized') {
		throw new Error(INVALID_ONBOARDING_ACTION);
	}
  
	if (status === 'terminated' && stakePool.status !== 'paused') {
		throw new Error(INVALID_TERMINATION_ACTION);
	}

	if (status === 'paused') {
		data.paused_date = new Date();
	}

	if (status === 'terminated') {
		const balance = await getSourceAccountBalance(stakePool.account_id, stakePool.currency);
  
		const stakers = await getModel('staker').findAll({ where: { stake_id: stakePool.id, status: { [Op.or]: ['staking', 'unstaking'] } } });
		const reward = calculateStakingRewards(stakers);
		let totalAmount = calculateStakingAmount(stakers);

		if (stakePool.reward_currency === stakePool.currency) { 
			totalAmount = new BigNumber(totalAmount).plus(new BigNumber(reward)).toNumber();
		}

		if(new BigNumber(balance).comparedTo(totalAmount) !== 1) {
			throw new Error(FUNDING_ACCOUNT_INSUFFICIENT_BALANCE);
		}
        
		if(stakePool.reward_currency !== stakePool.currency) {
			const reward_balance = await getSourceAccountBalance(stakePool.account_id, stakePool.reward_currency);

			if(new BigNumber(reward_balance).comparedTo(reward) !== 1) {
				throw new Error(FUNDING_ACCOUNT_INSUFFICIENT_BALANCE);
			}
		}

		await distributeStakingRewards(stakers, stakePool.account_id, stakePool.currency, stakePool.reward_currency, stakePool.user_id);
       
	}


	if (currency && !subscribedToCoin(currency)) {
		throw new Error('Invalid coin ' + currency);
	}

	if (reward_currency && !subscribedToCoin(reward_currency)) {
		throw new Error('Invalid coin ' + reward_currency);
	}

	if (reward_currency) {
		const conversions = await getAssetsPrices([currency], reward_currency, 1);
		if (conversions[currency] === -1) {
			throw new Error(NO_ORACLE_PRICE_FOUND);
		}
	}


	if (account_id) {
		const accountOwner = await getUserByKitId(account_id);

		if (!accountOwner) {
			throw new Error(ACCOUNT_ID_NOT_EXIST);
		}

	}

	const updatedStakePool = {
		...stakePool.get({ plain: true }),
		...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
	};

	updatedStakePool.slashing = (updatedStakePool.slashing_principle_percentage || updatedStakePool.slashing_earning_percentage) ? true : false;

	validateExchangeStake(updatedStakePool);

	createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, updatedStakePool, stakePool.dataValues);
    
	return stakePool.update(updatedStakePool, {
		fields: [
			'name',
			'currency',
			'reward_currency',
			'account_id',
			'apy',
			'duration',
			'slashing',
			'slashing_earning_percentage',
			'slashing_principle_percentage',
			'early_unstake',
			'min_amount',
			'max_amount',
			'status',
			'onboarding',
			'disclaimer',
			'paused_date'
		]
	});
};


const getExchangeStakers = async (
	opts = {
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
			...(opts.user_id && { user_id: opts.user_id })
		},
		order: [ordering],
		include: [
			{
				model: getModel('stake'),
				as: 'stake',
			}
		],
		...(!opts.format && pagination),
	};

         

	if (opts.format) {
		return dbQuery.fetchAllRecords('staker', query)
			.then((stakes) => {
				if (opts.format && opts.format === 'csv') {
					if (stakes.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(stakes.data, Object.keys(stakes.data[0]));
					return csv;
				} else {
					return stakes;
				}
			});
	} else {
		return dbQuery.findAndCountAllWithRows('staker', query);
	}
    
};

const createExchangeStaker = async (stake_id, amount, user_id) => {
	const stakePool = await getModel('stake').findOne({ where: { id: stake_id } });

	if (!stakePool) {
		throw new Error(STAKE_POOL_NOT_EXIST);
	}
	const user = await getUserByKitId(user_id);
   
	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	if (!stakePool.onboarding) {
		throw new Error(STAKE_POOL_ACCEPT_USER_ERROR);
	}

	if (stakePool.status !== 'active') {
		throw new Error(STAKE_POOL_NOT_ACTIVE);
	}

	const userBalance = await getSourceAccountBalance(user_id, stakePool.currency);

	if (new BigNumber(userBalance).comparedTo(new BigNumber(amount)) === -1) {
		throw new Error(AMOUNT_INSUFFICIENT_ERROR);
	}

	if (new BigNumber(amount).comparedTo(new BigNumber(stakePool.max_amount)) === 1) {
		throw new Error(STAKE_POOL_MAX_AMOUNT_ERROR);
	}

	if (new BigNumber(amount).comparedTo(new BigNumber(stakePool.min_amount)) === -1) {
		throw new Error(STAKE_POOL_MIN_AMOUNT_ERROR);
	}

	const stakers =  await getModel('staker').findAll({ where: { user_id, status: 'staking' } });

	if (stakers.length >= 12) {
		throw new Error(STAKE_MAX_ACTIVE);
	}

	const staker = {
		user_id,
		stake_id,
		amount,
		currency: stakePool.currency,
		reward_currency: stakePool.reward_currency || stakePool.currency,
		status: 'staking',
		...(stakePool.duration && { closing: moment().add(stakePool.duration, 'days') })
	};


	await transferAssetByKitIds(user_id, stakePool.account_id, stakePool.currency, amount, 'User transfer stake', false, { category: 'stake' });


	const stakerData = await getModel('staker').create(staker, {
		fields: [
			'user_id',
			'stake_id',
			'amount',
			'currency',
			'reward_currency',
			'status',
			'closing',
			'unstaked_date'
		]
	});

	return stakerData;
};

const deleteExchangeStaker = async (staker_id, user_id) => {

	const user = await getUserByKitId(user_id);
   
	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}
    
	const staker = await getModel('staker').findOne({ where: { id: staker_id, user_id, status: 'staking' } });

	if (!staker) {
		throw new Error(STAKER_NOT_EXIST);
	}

	const stakePool = await getModel('stake').findOne({ where: { id: staker.stake_id } });

	if (!stakePool) {
		throw new Error(STAKE_POOL_NOT_EXIST);
	}
   
	if (!stakePool.onboarding) {
		throw new Error(STAKE_POOL_NOT_ACTIVE_FOR_UNSTAKING_ONBOARDING);
	}

	if (stakePool.status !== 'active') {
		throw new Error(STAKE_POOL_NOT_ACTIVE_FOR_UNSTAKING_STATUS);
	}

	// check if matured for unstaking or not
	const now = moment();
	const startingDate = moment(staker.created_at);
	const stakinDays = now.diff(startingDate, 'days');
	const remaininDays = (stakePool?.duration || 0) - stakinDays;
        
	if (!stakePool.early_unstake && stakePool.duration && remaininDays > 0) {
		throw new Error(UNSTAKE_PERIOD_ERROR);
	}

	const slashedValues = await calculateSlashAmount(staker, stakePool);
	const updatedStaker = {
		...staker,
		status: 'unstaking',
		amount: new BigNumber(staker.amount).minus(new BigNumber(slashedValues.slashingPrinciple)).toNumber(),
		slashed: slashedValues.slashingEarning,
		unstaked_date: new Date()
	};
	return staker.update(updatedStaker, {
		fields: [
			'status',
			'amount',
			'reward',
			'slashed',
			'unstaked_date'
		]
	});
};

const unstakeEstimateSlash = async (staker_id) => {
	const staker = await getModel('staker').findOne({ where: { id: staker_id } });

	if (!staker) {
		throw new Error(STAKER_NOT_EXIST);
	}

	const stakePool = await getModel('stake').findOne({ where: { id: staker.stake_id } });

	if (!stakePool) {
		throw new Error(STAKE_POOL_NOT_EXIST);
	}
   
	const slashedAmount = await calculateSlashAmount(staker, stakePool);

	return slashedAmount;
};

const unstakeEstimateSlashAdmin = async (id) => {
	const stakePool = await getModel('stake').findOne({ where: { id } });

	if (!stakePool) {
		throw new Error(STAKE_POOL_NOT_EXIST);
	}

	const stakers = await getModel('staker').findAll({ where: { stake_id: stakePool.id, status: { [Op.or]: ['staking', 'unstaking'] } } });
	const reward = calculateStakingRewards(stakers);

	return { reward };
};


const fetchStakeAnalytics = async () => {
	const stakingAmount = await getModel('staker').findAll({ 
		attributes: [
			'currency',
			[fn('sum', col('amount')), 'total_amount'],
		],
		group: ['currency'],
	});
	const unstakingAmount = await getModel('staker').findAll({ 
		where: {  status: 'unstaking' }, 
		attributes: [
			'currency',
			[fn('sum', col('amount')), 'total_amount'],
		],
		group: ['currency'],
	});

	return {
		stakingAmount,
		unstakingAmount
	};
};

module.exports = {
	getExchangeStakePools,
	createExchangeStakePool,
	updateExchangeStakePool,
	getExchangeStakers,
	createExchangeStaker,
	deleteExchangeStaker,
	unstakeEstimateSlash,
	unstakeEstimateSlashAdmin,
	fetchStakeAnalytics
};