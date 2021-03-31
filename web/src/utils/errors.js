import STRINGS from '../config/localizedStrings';

const ERROR_USER_ALREADY_VERIFIED = 'User already verified';
const ERROR_INVALID_CARD_USER = 'Card Number has no linked name';
const ERROR_INVALID_CARD_NUMBER = 'Invalid Card number';
const ERROR_LOGIN_USER_NOT_VERIFIED = 'User is not verified';
const ERROR_LOGIN_USER_NOT_ACTIVATED = 'User is not activated';
const ERROR_LOGIN_INVALID_CREDENTIALS = 'Credentials incorrect';
const ERROR_INVALID_CAPTCHA = 'Invalid captcha';
const INVALID_USERNAME =
	'Invalid username. Username must be 3-15 characters length and only contains lowercase charaters, numbers or underscore';
const USERNAME_CANNOT_BE_CHANGED = 'Username can not be changed';
const USENAME_IS_TAKEN =
	'Username is already taken. Select a different username';

export const getErrorLocalized = (error = '') => {
	switch (error) {
		case ERROR_USER_ALREADY_VERIFIED:
			return STRINGS['ERROR_USER_ALREADY_VERIFIED'];
		case ERROR_INVALID_CARD_USER:
			return STRINGS['ERROR_INVALID_CARD_USER'];
		case ERROR_INVALID_CARD_NUMBER:
			return STRINGS['ERROR_INVALID_CARD_NUMBER'];
		case ERROR_LOGIN_USER_NOT_VERIFIED:
			return STRINGS['ERROR_LOGIN_USER_NOT_VERIFIED'];
		case ERROR_LOGIN_USER_NOT_ACTIVATED:
			return STRINGS['ERROR_LOGIN_USER_NOT_ACTIVATED'];
		case ERROR_LOGIN_INVALID_CREDENTIALS:
			return STRINGS['ERROR_LOGIN_INVALID_CREDENTIALS'];
		case ERROR_INVALID_CAPTCHA:
			return STRINGS['INVALID_CAPTCHA'];
		case INVALID_USERNAME:
			return STRINGS['INVALID_USERNAME'];
		case USERNAME_CANNOT_BE_CHANGED:
			return STRINGS['INVALID_CAPTCHA'];
		case USENAME_IS_TAKEN:
			return STRINGS['USERNAME_TAKEN'];
		default:
			return error;
	}
};
