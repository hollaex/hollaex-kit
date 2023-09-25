const validTimezones = require('tz-offset/generated/offsets.json');
const toolsLib = require('hollaex-tools-lib');
const cron = require('node-cron');
const { MAILTYPE } = require('../mail/strings');
const { sendEmail } = require('../mail');
const { isNumber } = require('lodash');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const { loggerPlugin } = require('../config/logger');

const getTimezone = () => {
	const kitTimezone = toolsLib.getKitSecrets().emails.timezone;
	return isNumber(validTimezones[kitTimezone]) ? kitTimezone : 'Etc/UTC';
};

const unstakingCheckRunner = () => {
	cron.schedule('0 0 0 * * *', async () => {
		loggerPlugin.verbose(
			'/plugins unstaking status check start'
		);
		try {
			const stakerModel = toolsLib.database.getModel('staker');
			const stakePoolModel = toolsLib.database.getModel('stake');
			const stakerData = await stakerModel.findAll({ where: { status: 'unstaking' } });

			for (const staker of stakerData) {
				const user = await toolsLib.user.getUserByKitId(staker.user_id);
				const stakePool = await stakePoolModel.findOne({ where: { id: staker.stake_id } });

				const balance = await toolsLib.wallet.getUserBalanceByKitId(stakePool.account_id);
				let symbols = {};
				
				for (const key of Object.keys(balance)) {
					if (key.includes('available') && balance[key]) {
						let symbol = key?.split('_')?.[0];
						symbols[symbol] = balance[key];
					}
				}

				const amountAfterSlash =  new BigNumber(staker.reward).minus(new BigNumber(staker.slashed)).toNumber();
				let totalAmount = staker.amount;

				// If there is no reward_currency, Add them together since they are of same currency.
				if (!stakePool.reward_currency) {
					totalAmount = (new BigNumber(staker.amount).plus(amountAfterSlash)).toNumber();
				}

				if (new BigNumber(symbols[stakePool.currency]).comparedTo(totalAmount) !== 1) {
					sendEmail(
						MAILTYPE.ALERT,
						user.email,
						{
							type: 'Unstaking failed',
							data: `User id ${user.id} failed to unstake, not enough funds, currency ${stakePool.currency}, amount to transfer: ${totalAmount}`
						},
						user.settings
					);

					continue;
				}

                await staker.update({ status: 'closed' }, {
					fields: ['status']
				});
		

				try {
					if(totalAmount > 0) {
                    	await toolsLib.wallet.transferAssetByKitIds(stakePool.account_id, user.id, stakePool.currency, totalAmount, 'Admin transfer stake', user.email, { category: 'stake' });
					}
					
					if (stakePool.reward_currency && amountAfterSlash > 0) {
						 await toolsLib.wallet.transferAssetByKitIds(stakePool.account_id, user.id, stakePool.reward_currency, amountAfterSlash, 'Admin transfer stake', user.email, { category: 'stake' });
					}

				} catch (error) {
					const adminAccount = await toolsLib.user.getUserByKitId(stakePool.user_id);
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


		} catch (err) {
			loggerPlugin.error(
				'/plugins unstaking status check error:',
				err.message
			);
		}
	}, {
		scheduled: true,
		timezone: getTimezone()
	});
}

const updateRewardsCheckRunner = () => {
	cron.schedule('0 0 0 * * *', async () => {
		loggerPlugin.verbose(
			'/plugins update rewards check start'
		);
		try {
			const stakerModel = toolsLib.database.getModel('staker');
			const stakePoolModel = toolsLib.database.getModel('stake');
			const stakePools = await stakePoolModel.findAll({ where: { status: 'active' } });

			for (const stakePool of stakePools) {
				const stakers = await stakerModel.findAll({ where: { stake_id: stakePool.id, status: 'staking' } });

				 for (const staker of stakers) {
					const annualEarning = new BigNumber(staker.amount).multipliedBy(new BigNumber(stakePool.apy)).dividedBy(100);
					let dailyEarningAmount = annualEarning.dividedBy(12 * 30).toNumber();

					let stakingDate = moment();
					const closedDate = staker.closing && moment(staker.closing);

					// If the current date is after the closing date, we should stop calculating rewarding after closing date.
					// If there is no closing date, It means we are in a perpatual stake pool, we keep calculating rewarding until user unstakes.
					if (closedDate && closedDate < stakingDate) {
						continue;
					}

					if (stakePool.reward_currency) {
						const conversions = await toolsLib.getAssetsPrices([stakePool.currency], stakePool.reward_currency, 1);
						if (conversions[stakePool.currency] === -1) {
							const user = await toolsLib.user.getUserByKitId(staker.user_id);
							sendEmail(
								MAILTYPE.ALERT,
								user.email,
								{
									type: 'Could not reward user, Price not found on oracle',
									data: `Could not rewawrd User id ${staker.user_id}, ${stakePool.currency} not converted to ${stakePool.reward_currency} in Oracle`
								},
								user.settings
							);
							continue;
						}

						dailyEarningAmount =  new BigNumber(conversions[stakePool.currency]).multipliedBy(dailyEarningAmount).toNumber();
					}
					
					await stakerModel.increment('reward', { by: dailyEarningAmount, where: { id: staker.id }});
    			}
			}

		} catch (err) {
			loggerPlugin.error(
				'/plugins update rewards check error:',
				err.message
			);
		}
	}, {
		scheduled: true,
		timezone: getTimezone()
	});
}

module.exports = {
    unstakingCheckRunner,
    updateRewardsCheckRunner
}