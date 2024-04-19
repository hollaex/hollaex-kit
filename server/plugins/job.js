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

				// Add them together since they are of same currency.
				if (stakePool.reward_currency === stakePool.currency) {
					totalAmount = (new BigNumber(staker.amount).plus(amountAfterSlash)).toNumber();
				}

				if (new BigNumber(symbols[stakePool.currency]).comparedTo(totalAmount) !== 1
					|| ((stakePool.reward_currency !== stakePool.currency) && new BigNumber(symbols[stakePool.reward_currency]).comparedTo(amountAfterSlash) !== 1)
				) {
					const adminAccount = await toolsLib.user.getUserByKitId(stakePool.user_id);
					sendEmail(
						MAILTYPE.ALERT,
						adminAccount.email,
						{
							type: 'Unstaking failed',
							data: `User id ${user.id} failed to unstake, not enough funds, currency ${stakePool.currency}${stakePool.reward_currency ? ` reward currency ${stakePool.reward_currency}` : ''}, amount to transfer: ${totalAmount}${stakePool.reward_currency ? ` reward amount ${amountAfterSlash}` : ''}`
						},
						adminAccount.settings
					);

					continue;
				}

                await staker.update({ status: 'closed' }, {
					fields: ['status']
				});
		

				try {
					if(totalAmount > 0) {
                    	await toolsLib.wallet.transferAssetByKitIds(stakePool.account_id, user.id, stakePool.currency, totalAmount, 'Admin transfer stake', false, { category: 'stake' });
					}
					
					if (stakePool.reward_currency !== stakePool.currency && amountAfterSlash > 0) {
						 await toolsLib.wallet.transferAssetByKitIds(stakePool.account_id, user.id, stakePool.reward_currency, amountAfterSlash, 'Admin transfer stake', false, { category: 'stake' });
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
			const adminAccount = await toolsLib.user.getUserByKitId(1);
			sendEmail(
				MAILTYPE.ALERT,
				adminAccount.email,
				{
					type: 'Error during unstaking process!',
					data: err.message
				},
				adminAccount.settings
			);
			loggerPlugin.error(
				'/plugins unstaking status check error:',
				err.message
			);
		}


		loggerPlugin.verbose(
			'/plugins balance history job start'
		);

		try {
			const balanceHistoryModel = toolsLib.database.getModel('balanceHistory');
			const statusModel = toolsLib.database.getModel('status');
			const status = await statusModel.findOne({});

			const exchangeCoins = toolsLib.getKitCoins();
			if (exchangeCoins.length === 0) return;
			if (!status?.kit?.balance_history_config?.active) return;
			const native_currency = status?.kit?.balance_history_config?.currency;
			const conversions = await toolsLib.getAssetsPrices(exchangeCoins, native_currency || 'usdt', 1);
			const balances = await toolsLib.user.getAllBalancesAdmin({ format: 'all' });

			const userBalances = balances?.data?.reduce((groups, item) => {
				const group = (groups[item.user_id] || []);
				group.push(item);
				groups[item.user_id] = group;
				return groups;
			  }, {});

			for (const userId of Object.keys(userBalances)) {
				if (userId === 'undefined') continue;

				let symbols = {};

				(userBalances[userId] || []).forEach(balance => { symbols[balance.symbol] = balance.available });

				const coins = Object.keys(symbols);

				let total = 0;
				let history = {};
				for (const coin of coins) {
					if (!conversions[coin]) continue;
					if (conversions[coin] === -1) continue;
		
					const nativeCurrencyValue = new BigNumber(symbols[coin]).multipliedBy(conversions[coin]).toNumber();
				
					history[coin] = { original_value: new BigNumber(symbols[coin]).toNumber(), native_currency_value: nativeCurrencyValue };
					total = new BigNumber(total).plus(nativeCurrencyValue).toNumber();
				}
				if (Object.keys(history).length === 0) continue;
				await balanceHistoryModel.create({
					user_id: Number(userId),
					balance: history,
					total,
				})

			}
		} catch (err) {
			loggerPlugin.error(
				'/plugin balance history job error:',
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
						await staker.update({ status: 'unstaking', unstaked_date: new Date() }, {
							fields: ['status', 'unstaked_date']
						});
				
						continue;
					}

					if (stakePool.reward_currency !== stakePool.currency) {
						const conversions = await toolsLib.getAssetsPrices([stakePool.currency], stakePool.reward_currency, 1);
						if (conversions[stakePool.currency] === -1) {
							const adminAccount = await toolsLib.user.getUserByKitId(stakePool.user_id);
							sendEmail(
								MAILTYPE.ALERT,
								adminAccount.email,
								{
									type: 'Could not reward user, Price not found on oracle',
									data: `Could not reward User id ${staker.user_id}, ${stakePool.currency} could not converted to ${stakePool.reward_currency} in Oracle`
								},
								adminAccount.settings
							);
							continue;
						}

						dailyEarningAmount =  new BigNumber(conversions[stakePool.currency]).multipliedBy(dailyEarningAmount).toNumber();
					}
					
					await stakerModel.increment('reward', { by: dailyEarningAmount, where: { id: staker.id }});
    			}
			}

		} catch (err) {
			const adminAccount = await toolsLib.user.getUserByKitId(1);
			sendEmail(
				MAILTYPE.ALERT,
				adminAccount.email,
				{
					type: 'Error during stake rewarding process!',
					data: err.message
				},
				adminAccount.settings
			);
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

const referralTradesRunner = () =>{
	cron.schedule('0 0 0 * * *', async () => {
		loggerPlugin.verbose(
			'/plugins referralTradesRunner start'
		);
		try {
			const statusModel = toolsLib.database.getModel('status');
			const status = await statusModel.findOne({});
			if (!status?.kit?.referral_history_config?.active) return;

			const currentTime = moment().seconds(0).milliseconds(0).toISOString();
			const startingTradeDate = moment().subtract(24, 'hours'); 
			await toolsLib.user.createUnrealizedReferralFees(currentTime, startingTradeDate);

		} catch (err) {
			const adminAccount = await toolsLib.user.getUserByKitId(1);
			sendEmail(
				MAILTYPE.ALERT,
				adminAccount.email,
				{
					type: 'Error during referralTradesRunner process!',
					data: err.message
				},
				adminAccount.settings
			);
			loggerPlugin.error(
				'/plugins referralTradesRunner error:',
				err.message
			);
		}
	}, {
		scheduled: true,
		timezone: getTimezone()
	});
}


unstakingCheckRunner();
updateRewardsCheckRunner();

module.exports = {
    unstakingCheckRunner,
    updateRewardsCheckRunner,
	referralTradesRunner
}