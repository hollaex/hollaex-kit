export const calcPercentage = (partialValue, totalValue, precision = 2) => {
	let percentage = (totalValue ? partialValue / totalValue : 0) * 100;
	percentage = Math.min(percentage, 100);
	percentage = Math.max(percentage, 0);
	return percentage.toFixed(precision);
};
