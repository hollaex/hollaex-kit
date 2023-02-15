import { unique } from 'utils/data';

export const flipPair = (pair) => pair.split('-').reverse().join('-');

export const getSourceOptions = (pairs = {}, broker = []) => {
	const coins = [];
	Object.entries(pairs).forEach(([, { pair_base, pair_2 }]) => {
		coins.push(pair_base);
		coins.push(pair_2);
	});
	broker.forEach((data) => {
		const brokerCoin = data.symbol.split('-');
		if (!coins.includes(brokerCoin[0])) {
			coins.push(brokerCoin[0]);
		}
		if (!coins.includes(brokerCoin[1])) {
			coins.push(brokerCoin[1]);
		}
	});

	return unique(coins);
};
