import math from 'mathjs';

export const calcPercentage = (partialValue, totalValue, precision = 2) => {
	let percentage = 0;
	if (totalValue) {
		percentage = math.multiply(math.divide(partialValue, totalValue), 100);
	}
	percentage = math.min(percentage, 100);
	percentage = math.max(percentage, 0);
	return percentage.toFixed(precision);
};
