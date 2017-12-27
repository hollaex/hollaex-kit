import STRINGS from '../config/localizedStrings';

const ERROR_USER_ALREADY_VERIFIED = 'User already verified';
const ERROR_INVALID_CARD_USER = 'Card Number has no linked name';
const ERROR_INVALID_CARD_NUMBER = 'Invalid Card number';

export const getErrorLocalized = (error = '') => {
  switch (error) {
    case ERROR_USER_ALREADY_VERIFIED:
      return STRINGS.ERROR_USER_ALREADY_VERIFIED;
    case ERROR_INVALID_CARD_USER:
      return STRINGS.ERROR_INVALID_CARD_USER;
    case ERROR_INVALID_CARD_NUMBER:
      return STRINGS.ERROR_INVALID_CARD_NUMBER;
    default:
      return error;
  }
}
