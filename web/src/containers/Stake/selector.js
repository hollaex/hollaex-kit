import { createSelector } from 'reselect';
import mathjs from 'mathjs';
import { web3 } from 'config/contracts';

const getUserStakes = (state) => state.stake.userStakes;

const getUserAccount = (state) => state.stake.account;

const getOraclePrices = (state) => state.asset.oraclePrices;

const getPublicInfo = (state) => state.stake.publicInfo;

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
	[getUserAccount, getPublicInfo, getOraclePrices, userActiveStakesSelector],
	(
		account,
		{ totalReward, totalStaked, totalStakeWeight },
		prices = {},
		{ totalUserStakes }
	) => {
		// public info calculation

		return {
			totalDistributedEarnings: 383001,
			totalDistributedEarningsValue: 9536,
			clearedUndistributedEarnings: 31000,
			unclearedPendingEarnings: 13000,
			totalStaked: 3213321,
			totalStakedValue: 9536,
			myStake: 133213,
			othersStake: 321332,
			myStakePercent: 25,
			othersStakePercent: 75,
		};
	}
);
