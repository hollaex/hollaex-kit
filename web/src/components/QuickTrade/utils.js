import STRINGS from '../../config/localizedStrings';

const QUICK_TRADE_OUT_OF_LIMITS = 'Order size is out of the limits';
const QUICK_TRADE_TOKEN_USED = 'Token has been used';
const QUICK_TRADE_QUOTE_EXPIRED = 'Quote has expired';
const QUICK_TRADE_QUOTE_INVALID = 'Invalid quote';
const QUICK_TRADE_QUOTE_CALCULATING_ERROR = 'Error calculating the quote';
const QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED =
	'The order with the current size can not be filled';
const QUICK_TRADE_ORDER_NOT_FILLED = 'Order is not filled';
const QUICK_TRADE_NO_BALANCE = 'Insufficient balance to perform the order';
export const QUICK_TRADE_INSUFFICIENT_BALANCE = 'Insufficent balance.';

export const translateError = (error) => {
	switch (error) {
		case QUICK_TRADE_OUT_OF_LIMITS:
			return STRINGS['QUICK_TRADE_OUT_OF_LIMITS'];
		case QUICK_TRADE_TOKEN_USED:
			return STRINGS['QUICK_TRADE_TOKEN_USED'];
		case QUICK_TRADE_QUOTE_EXPIRED:
			return STRINGS['QUICK_TRADE_QUOTE_EXPIRED'];
		case QUICK_TRADE_QUOTE_INVALID:
			return STRINGS['QUICK_TRADE_QUOTE_INVALID'];
		case QUICK_TRADE_QUOTE_CALCULATING_ERROR:
			return STRINGS['QUICK_TRADE_QUOTE_CALCULATING_ERROR'];
		case QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
			return STRINGS['QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED'];
		case QUICK_TRADE_ORDER_NOT_FILLED:
			return STRINGS['QUICK_TRADE_ORDER_NOT_FILLED'];
		case QUICK_TRADE_NO_BALANCE:
		case QUICK_TRADE_INSUFFICIENT_BALANCE:
			return STRINGS['QUICK_TRADE_NO_BALANCE'];
		default:
			return error;
	}
};
