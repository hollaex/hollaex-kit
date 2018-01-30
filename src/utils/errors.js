import STRINGS from '../config/localizedStrings';

const ERROR_USER_ALREADY_VERIFIED = 'User already verified';
const ERROR_INVALID_CARD_USER = 'Card Number has no linked name';
const ERROR_INVALID_CARD_NUMBER = 'Invalid Card number';
const ERROR_LOGIN_USER_NOT_VERIFIED = 'User is not verified';
const ERROR_LOGIN_USER_NOT_ACTIVATED = 'User is not activated';
const ERROR_LOGIN_INVALID_CREDENTIALS = 'Credentials incorrect';
const ERROR_INVALID_CAPTCHA = 'Invalid captcha';

export const getErrorLocalized = (error = '') => {
	switch (error) {
		case ERROR_USER_ALREADY_VERIFIED:
			return STRINGS.ERROR_USER_ALREADY_VERIFIED;
		case ERROR_INVALID_CARD_USER:
			return STRINGS.ERROR_INVALID_CARD_USER;
		case ERROR_INVALID_CARD_NUMBER:
			return STRINGS.ERROR_INVALID_CARD_NUMBER;
		case ERROR_LOGIN_USER_NOT_VERIFIED:
			return STRINGS.ERROR_LOGIN_USER_NOT_VERIFIED;
		case ERROR_LOGIN_USER_NOT_ACTIVATED:
			return STRINGS.ERROR_LOGIN_USER_NOT_ACTIVATED;
		case ERROR_LOGIN_INVALID_CREDENTIALS:
			return STRINGS.ERROR_LOGIN_INVALID_CREDENTIALS;
		case ERROR_INVALID_CAPTCHA:
			return STRINGS.INVALID_CAPTCHA;
		default:
			return error;
	}
};
