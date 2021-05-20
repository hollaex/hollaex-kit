import validator from 'validator';

const exchangeNameRegex = /[^a-zA-Z0-9_-]/;
const urlRegex = /^(https|http)/;

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

export const email = (value = '') =>
	!validator.isEmail(value) ? 'Invalid email address' : undefined;

export const exchangeName = (value = '') =>
	exchangeNameRegex.test(value)
		? 'Only alphanumeric, dash (-), underscore only (_) Allowed. No space or special character allowed.'
		: undefined;

export const urlCheck = (value = '') =>
	!urlRegex.test(value)
		? 'Url should be a full url including http or https'
		: undefined;

export const checkS3bucketUrl = (value = '') =>
	value.split(':').length !== 2 || !value.split(':')[1].trim()
		? 'Bucket should be a form like <S3_BUCKET_NAME>:<AWS_REGION_NAME>'
		: undefined;

export const validateDiscount = (rule, value) => {
	if (value && (value < 0 || value > 100)) {
		return Promise.reject('Value must be between 0 to 100');
	} else {
		return Promise.resolve();
	}
};
export const validateBoolean = (value) =>
	value || value === false ? undefined : 'Required';
export const validateNumber = (value) =>
	value || value === 0 ? undefined : 'Required';
