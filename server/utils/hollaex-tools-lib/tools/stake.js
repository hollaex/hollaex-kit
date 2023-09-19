'use strict';

const { getModel } = require('./database/model');
const { SERVER_PATH } = require('../constants');
const { getUserByKitId } = require('./user');
const { subscribedToCoin } = require('./common');
const { transferAssetByKitIds, getUserBalanceByKitId } = require('./wallet');
const { Op } = require('sequelize');
const BigNumber = require('bignumber.js');
const { paginationQuery, timeframeQuery, orderingQuery } = require('./database/helpers');
const dbQuery = require('./database/query');
const moment = require('moment');

const {
	NO_DATA_FOR_CSV,
} = require(`${SERVER_PATH}/messages`);



const calculateSlashAmount = (staker, stakePool) => {
    let slashedAmount = new BigNumber(0);
    let isSlashed = false;


    const unstakedDate = moment();
    const closedDate = staker.closing && moment(staker.closing);


    // If we unstaked before the closing date, it means we unstaked early, set isSlashed to true in this case.
    // If there is no closing date, it means we are in a perpatual stake pool, so no slashing.
    if (closedDate && unstakedDate && closedDate > unstakedDate) {
        isSlashed = true;
    }

    if (isSlashed) {

        let slashingPrinciple = new BigNumber(0);
        let slashingEarning = new BigNumber(0);

        if (stakePool.slashing_principle_percentage) {
            const stakeAmount = new BigNumber(staker.amount);
            const slashingPrinciplePercentage = new BigNumber(stakePool.slashing_principle_percentage);
            const mountlySlashingPrinciple = stakeAmount.multipliedBy(slashingPrinciplePercentage).dividedBy(100 * 12);

            const stakerCreationDate = moment(staker.created_at);

            const totalStakingDays = unstakedDate.diff(stakerCreationDate, 'days');
            slashingPrinciple = mountlySlashingPrinciple.multipliedBy(totalStakingDays).dividedBy(30);
        }
   

        if (stakePool.slashing_earning_percentage) {
            const stakerReward = new BigNumber(staker.reward);
            const slashingEarningPercentage = new BigNumber(stakePool.slashing_earning_percentage);
            slashingEarning = stakerReward.multipliedBy(slashingEarningPercentage).dividedBy(100);

        }

        slashedAmount = slashingPrinciple.plus(slashingEarning);

    }

    return slashedAmount.toNumber();
}

const calculateStakingRewards = (stakers) => {
    const rewards = stakers.map(staker => staker.reward).reduce((a, b) => a + b, 0);
    const slashes = stakers.map(staker => staker.slashed).reduce((a, b) => a + b, 0);

    return (new BigNumber(rewards).plus(new BigNumber(slashes))).toNumber();
}


const distributeStakingRewards = async (stakers, reward, account_id, currency) => {
    for (const staker of stakers) {

        await staker.update({ status: 'unstaking' }, {
	        	fields: ['status']
	    });

        await transferAssetByKitIds(account_id, staker.id, currency, reward, 'Admin transfer stake', staker.email, undefined);

        await staker.update({ status: 'closed' }, {
	        	fields: ['status']
	    });

    }
}
// const calculateStakingRewards = async (stakers, stakePool) => {
//     const rewards = { total: 0 };

//     let isSlashed = false;
//     for (const staker of stakers) {

//         const annualEarning = (staker.amount * stakePool.apy) / 100;
//         const mountlyEarningAmount = annualEarning / 12;

//         const stakerCreationDate = moment(staker.created_at);

//         // if paused, stakepool is supposed to stop calculating rewarding, we set the date to paused_date in this case.
//         // if not paused, we set the date to current date(now) 
//         let stakingDate = (stakePool.status === 'paused') ? moment(stakePool.paused_date) : moment();

//         const unstakedDate= staker.unstaked_date && moment(staker.unstaked_date);
//         const closedDate = staker.closing && moment(staker.closing);


//         // If we unstaked before the closing date, it means we unstaked early, set isSlashed to true in this case.
//         // If there is no closing date, it means we are in a perpatual stake pool, so no slashing.
//         if (closedDate && unstakedDate && closedDate > unstakedDate) {
//             isSlashed = true;
//         }


//         // If the stakepool is paused or active and unstaked date is less than that date, we should stop calculating rewarding at this point.
//         if (unstakedDate && unstakedDate < stakingDate) {
//             stakingDate = unstakedDate;
//         }


//         // If the current date is after the closing date, we should stop calculating rewarding after closing date.
//         // If there is no closing date, It means we are in a perpatual stake pool, we keep calculating rewarding until user unstakes.
//         if (closedDate && closedDate < stakingDate) {
//             stakingDate = closedDate;
//         }
     

//         const totalStakingDays = stakingDate.diff(stakerCreationDate, 'days');
//         const amountEarned =  (mountlyEarningAmount * totalStakingDays) / 30

//         rewards[staker.user_id] = amountEarned;

//         if (isSlashed) {
//             const mountlySlashingPrinciple = ((staker.amount * stakePool.slashing_principle_percentage) / 100) / 12;

//             const slashingPrinciple = (mountlySlashingPrinciple * totalStakingDays) / 30;

//             const slashingEarning = (amountEarned * stakePool.slashing_earning_percentage) / 100;

//             rewards[staker.user_id] -= slashingPrinciple;
//             rewards[staker.user_id] -= slashingEarning;

//         }

//         rewards.total += rewards[staker.user_id]
//     }


//     return rewards;
// }
const getSourceAccountBalance = async (account_id, coin) => {
        
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

const fetchStakers = async (stakePoolId) => {
    return getModel('staker').findAll({ where: { stake_id: stakePoolId } });
}

const validateExchangeStake = (stake) => {
    if (new BigNumber(stake.min_amount).comparedTo(0) !== 1) {
		throw new Error('Stake minimum amount must be bigger than zero.');
	} 
    if (new BigNumber(stake.max_amount).comparedTo(0) !== 1) {
		throw new Error('Stake maximum amount must be bigger than zero.');
	} 
       if (new BigNumber(stake.max_amount).comparedTo(new BigNumber(stake.min_amount)) !== 1) {
		throw new Error('Stake maximum amount cannot be bigger than maximum amount');
	} 
    if (new BigNumber(stake.apy).comparedTo(0) !== 1) {
		throw new Error('Stake apy must be bigger than zero.');
	} 
    if (stake.duration && new BigNumber(stake.duration).comparedTo(0) !== 1) {
		throw new Error('Stake duration must be bigger than zero.');
	} 
}

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
	}

     	
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
                if (!stakePool.onboarding || stakePool.status === 'terminated') continue;
                const stakers = await fetchStakers(stakePool.id);
                stakePool.reward = calculateStakingRewards(stakers);
            }

            return stakePools;
        })
	}
};

const createExchangeStakePool = async (stake) => {
	validateExchangeStake(stake);

    const {
        currency,
        account_id,
        duration,
        slashing,
        early_unstake,
        max_amount,
        status,
        onboarding,
    } = stake;
    
    if (status !== 'uninitialized') {
        throw new Error('Status cannot be other than uninitialized when creating stake pool for the first time');
    }

    if (onboarding) {
          throw new Error('Onboarding cannot be true when creating stake pool for the first time');
    }

    if (!duration && (early_unstake || slashing)) {
        throw new Error('Cannot creation stake pool with perpetual duration and early stake set to true');
    }

    if (!subscribedToCoin(currency)) {
           throw new Error('Invalid coin ' + currency);
    }

    const accountOwner = await getUserByKitId(account_id);

    if (!accountOwner) {
        throw new Error('account id does not exist in the server');
    }
    
    const balance = await getSourceAccountBalance(account_id, currency);

    if (new BigNumber(balance).comparedTo(new BigNumber(max_amount)) !== 1) {
        throw new Error('funding account does not have enough coins for the max amount set for the stake pool');
    }

    stake.slashing = (stake.slashing_principle_percentage || stake.slashing_earning_percentage) ? true : false;
     
	return getModel('stake').create(stake, {
		fields: [
			'name',
            'user_id',
            'currency',
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

const updateExchangeStakePool = async (id, data) => {
   	const stakePool = await getModel('stake').findOne({ where: { id } });
	if (!stakePool) {
		throw new Error('Stake pool not found');
	}

    const {
        currency,
        name,
        account_id,
        duration,
        slashing,
        early_unstake,
        slashing_principle_percentage,
        slashing_earning_percentage,
        min_amount,
        max_amount,
        status,
        onboarding,
    } = data;
    
    if (stakePool.status === 'terminated') {
        throw new Error('Cannot modify terminated stake pool');
    }

    if(status !== 'uninitialized' && (
        (currency && currency !== stakePool.currency)
        || (name && name !== stakePool.name)
        || (account_id && account_id !== stakePool.account_id)
        || (duration && duration !== stakePool.duration)
        || (slashing && slashing !== stakePool.slashing)
        || (early_unstake && early_unstake !== stakePool.early_unstake)
        || (min_amount && min_amount !== stakePool.min_amount)
        || (max_amount && max_amount !== stakePool.max_amount)
        || (slashing_principle_percentage && slashing_principle_percentage !== stakePool.slashing_principle_percentage)
        || (slashing_earning_percentage && slashing_earning_percentage !== stakePool.slashing_earning_percentage)
    )) {
         throw new Error('Cannot modify the fields when the stake pool is not uninitialized');
    }

    if (onboarding && stakePool.status === 'uninitialized') {
          throw new Error('Onboarding cannot be active while the status is uninitialized');
    }
  
    if (status === 'terminated' && stakePool.status !== 'paused') {
          throw new Error('Cannot terminated stake pool while it is not paused');
    }

    if (status === 'paused') {
        data.paused_date = new Date();
    }

    if (status === 'terminated') {
        const balance = await getSourceAccountBalance(stakePool.account_id, stakePool.currency);
  
        const stakers = await getModel('staker').findAll({ where: { stake_id: stakePool.id, status: { [Op.or]: ['staking', 'unstaking'] } } });
        const reward = await calculateStakingRewards(stakers);


        if(new BigNumber(balance).comparedTo(new BigNumber(reward)) !== 1) {
            throw new Error('There is not enough balance in the funding account, You cannot settle this stake pool');
        }
        await distributeStakingRewards(stakers, reward, stakePool.account_id, stakePool.currency);
       
    }

    const updatedStakePool = {
		...stakePool.get({ plain: true }),
		...Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null))
	};

    updatedStakePool.slashing = (updatedStakePool.slashing_principle_percentage || updatedStakePool.slashing_earning_percentage) ? true : false;

	validateExchangeStake(updatedStakePool);

	return stakePool.update(updatedStakePool, {
		fields: [
			'name',
            'user_id',
            'currency',
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
}


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
	}

         

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
    
}

const createExchangeStaker = async (stake_id, amount, user_id) => {
    const stakePool = await getModel('stake').findOne({ where: { id: stake_id } });

    if (!stakePool) {
        throw new Error('Stake pool does not exist');
    }
   
    if (!stakePool.onboarding) {
          throw new Error('Stake pool is not active for accepting users');
    }

    if (stakePool.status !== 'active') {
          throw new Error('Cannot stake in a pool that is not active');
    }

    const balance = await getSourceAccountBalance(stakePool.account_id, stakePool.currency);

    if (new BigNumber(balance).comparedTo(new BigNumber(amount)) !== 1) {
        throw new Error('You do not have enough funds for the amount set');
    }

    if (new BigNumber(amount).comparedTo(new BigNumber(stakePool.max_amount)) === 1) {
        throw new Error('the amount is higher than the max amount set for the stake pool');
    }

    if (new BigNumber(amount).comparedTo(new BigNumber(stakePool.min_amount)) !== 1) {
        throw new Error('the amount is lower than the min amount set for the stake pool');
    }

    const staker = {
        user_id,
        stake_id,
        amount,
        currency: stakePool.currency,
        status: 'staking',
        ...(stakePool.duration && { closing: moment().add(stakePool.duration, 'days') })
    }

    const stakerData = await getModel('staker').create(staker, {
		fields: [
			'user_id',
            'stake_id',
            'amount',
            'currency',
            'status',
            'closing',
            'unstaked_date'
		]
    });

    await transferAssetByKitIds(staker.id, stakePool.account_id, stakePool.currency, amount, 'User transfer stake', staker.email);

    return stakerData;
}

const deleteExchangeStaker = async (staker_id, user_id) => {
    const staker = await getModel('staker').findOne({ where: { id: staker_id, user_id, status: 'staking' } });

    if (!staker) {
        throw new Error('Staker does not exist');
    }

    const stakePool = await getModel('stake').findOne({ where: { id: staker.stake_id } });

    if (!stakePool) {
        throw new Error('Stake pool does not exist');
    }
   
    if (!stakePool.onboarding) {
        throw new Error('Stake pool is not active for unstaking');
    }

    if (stakePool.status !== 'active') {
          throw new Error('Cannot unstake in a pool that is not active');
    }

    // check if matured for unstaking or not
    const now = moment();
    const startingDate = moment(staker.created_at);
	const stakinDays = now.diff(startingDate, 'days');
    const remaininDays = (stakePool?.duration || 0) - stakinDays;
        
    if (stakePool.duration && remaininDays > 0) {
        throw new Error('Cannot unstake, period is not over');
    }

    const slashedAmount = calculateSlashAmount(staker, stakePool);
    const updatedStaker = {
        ...staker,
        status: 'unstaking',
        slashed: slashedAmount,
        unstaked_date: new Date()
    }
    return staker.update(updatedStaker, {
		fields: [
            'status',
            'reward',
            'slashed',
            'unstaked_date'
		]
	});
}

module.exports = {
	getExchangeStakePools,
    createExchangeStakePool,
    updateExchangeStakePool,
    getExchangeStakers,
    createExchangeStaker,
    deleteExchangeStaker,
};