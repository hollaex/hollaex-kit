export const NORMAL_CLOSURE_CODE = 1000;

const INTENTIONAL_CLOSURE_CODES = [1000];

export const isIntentionalClosure = ({ code } = {}) => {
	return INTENTIONAL_CLOSURE_CODES.includes(code);
};
