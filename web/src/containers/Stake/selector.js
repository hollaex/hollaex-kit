import { createSelector } from 'reselect';
import mathjs from 'mathjs';
import { web3 } from 'config/contracts';

const PERCENT_DECIMALS = 2;

const getUserStakes = (state) => state.stake.userStakes;

const getUserAccount = (state) => state.stake.account;

const getOraclePrices = (state) => state.asset.oraclePrices;

const getPublicInfo = (state) => state.stake.publicInfo;

const getPendingTransactions = (state) => state.stake.pendingTransactions;

const getDistributions = (state) => state.stake.distributions;

const getMetamaskNetwork = (state) => state.stake.network;

const getContractNetwork = (state) => state.app.contracts['xht'].network;

export const getPots = (state) => state.stake.pots;

export const userActiveStakesSelector = createSelector(
	[getUserStakes],
	(userStakes = {}) => {
		const activeStakes = {};
		Object.entries(userStakes).forEach(([symbol, stakes]) => {
			activeStakes[symbol] = stakes
				.map((stake, index) => [...stake, index])
				.filter((stake) => stake[4] === '0');
		});

		let activeStakesCount = 0;
		Object.entries(activeStakes).forEach(([_, stakes]) => {
			activeStakesCount += stakes.length;
		});

		const totalUserStakes = {};
		const totalUserEarnings = {};
		Object.entries(activeStakes).forEach(([symbol, stakes]) => {
			totalUserStakes[symbol] = stakes.reduce(
				(acc, curr) => mathjs.sum(acc, web3.utils.fromWei(curr[0])),
				0
			);
			totalUserEarnings[symbol] = stakes.reduce(
				(acc, curr) => mathjs.sum(acc, web3.utils.fromWei(curr[3])),
				0
			);
		});

		return {
			activeStakes,
			activeStakesCount,
			totalUserStakes,
			totalUserEarnings,
		};
	}
);

const getValue = (balances, prices) => {
	let value = 0;
	Object.entries(balances).forEach(([symbol, balance]) => {
		value = mathjs.sum(
			mathjs.multiply(
				balance,
				!prices[symbol] || prices[symbol] === -1 ? 0 : prices[symbol]
			),
			value
		);
	});

	return value;
};

export const userStakesValueSelector = createSelector(
	[getOraclePrices, userActiveStakesSelector],
	(prices = {}, { totalUserStakes, totalUserEarnings }) => {
		const totalStakesValue = getValue(totalUserStakes, prices);
		const totalEarningsValue = getValue(totalUserEarnings, prices);

		return { totalStakesValue, totalEarningsValue };
	}
);

export const publicInfoSelector = createSelector(
	[
		getUserAccount,
		getPublicInfo,
		getOraclePrices,
		userActiveStakesSelector,
		getPots,
		getDistributions,
	],
	(
		account,
		{ totalReward: unclaimedRewards, totalStaked, totalStakeWeight },
		prices = {},
		{ totalUserStakes: { xht: myStake = 0 } = { xht: 0 } },
		{ xht: { balance: potBalance = '' } = { balance: 0 } },
		distributions
	) => {
		// public info calculation

		// total distributed reward. This is sum of distribution amount events
		// totalStake (this refers to total amount of active stakes)
		// getTotalReward (this refers to the total amount of active and unclaimed rewards)

		const totalDistributedRewards = distributions.reduce(
			(totalDistributedRewards, { returnValues: { _amount } }) =>
				mathjs.add(totalDistributedRewards, web3.utils.fromWei(_amount)),
			0
		);

		const totalDistributedRewardsValue = getValue(
			{ xht: totalDistributedRewards },
			prices
		);

		const totalStakedValue = getValue({ xht: totalStaked }, prices);
		const othersStake = mathjs.subtract(totalStaked, myStake);
		const myStakePercent = mathjs.round(
			totalStaked
				? mathjs.multiply(mathjs.divide(myStake, totalStaked), 100)
				: 0,
			PERCENT_DECIMALS
		);
		const othersStakePercent = mathjs.round(
			totalStaked
				? mathjs.multiply(mathjs.divide(othersStake, totalStaked), 100)
				: 0,
			PERCENT_DECIMALS
		);

		return {
			totalDistributedRewards,
			totalDistributedRewardsValue,
			potBalance,
			unclaimedRewards,
			totalStaked,
			totalStakedValue,
			myStake,
			othersStake,
			myStakePercent,
			othersStakePercent,
		};
	}
);

export const pendingTransactionsSelector = createSelector(
	[getPendingTransactions],
	(pendingTransactions) => {
		// pending transactions calculations

		let xht = 0;
		pendingTransactions.forEach(({ value }) => {
			xht = mathjs.sum(xht, web3.utils.fromWei(value));
		});

		return {
			xht,
		};
	}
);

export const networksMismatchSelector = createSelector(
	[getMetamaskNetwork, getContractNetwork],
	(metamaskNetwork, network) => {
		return metamaskNetwork && metamaskNetwork !== network;
	}
);
