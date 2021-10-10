import { createSelector } from 'reselect';
import mathjs from 'mathjs';
import { web3 } from 'config/contracts';

const getUserStakes = (state) => state.stake.userStakes;

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
