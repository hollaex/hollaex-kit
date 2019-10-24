export const validateRequired = (value) => (value ? undefined : 'Required');
export const validatePositiveNumber = (minValue) => (value) =>
	value >= minValue ? undefined : `Value must be bigger than ${minValue - 1}`;
export const validateRange = (list) => (value) =>
	list.indexOf(value) > -1 ? undefined : `Valid values are ${list.join(', ')}`;
export const validateOTP = (value = '') => {
	if (value.length === 0) {
		return;
	}

	if (value.length !== 6) {
		return 'Invalid length';
	}

	const find = value.split('').findIndex((digit) => {
		let number;
		try {
			number = parseInt(digit, 10);
		} catch (e) {
			number = -1;
		}
		return !(number >= 0);
	});
	if (find > -1) {
		return 'Invalid value. Only Numbers are allowed';
	}

	return;
};
