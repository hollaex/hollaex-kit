import math from 'mathjs';

export const subtract = (a = 0, b = 0) => {
	const remaining = math
		.chain(a)
		.subtract(b)
		.done();
	return remaining;
};
