'use strict';

exports.INSUFFICIENT_BALANCE_ORDER =
	'Insufficient balance to perform the order';
exports.MISSING_ORDER = 'Missing order';
exports.INVALID_USER_ID = 'Invalid user.';
exports.USER_NOT_FOUND = 'User not found';
exports.USER_NOT_REGISTERED_ON_NETWORK = 'User is not registered on the network';
exports.USER_EMAIL_NOT_VERIFIED = 'User email is not verified';
exports.SIGNUP_NOT_AVAILABLE = 'Sign up not available';
exports.USER_NOT_VERIFIED = 'User is not verified';
exports.USER_NOT_ACTIVATED = 'User is not activated';
exports.USER_EXISTS = 'User already exists';
exports.USER_REGISTERED = 'User successfully registered';
exports.INVALID_CREDENTIALS = 'Credentials incorrect';
exports.USER_VERIFIED = 'User is now verified';
exports.INVALID_PASSWORD =
	'Invalid password. It has to contain at least 8 characters, at least one digit and one character.';
exports.VERIFICATION_EMAIL_MESSAGE = 'A verification code has been sent to your email with the code';
exports.PROVIDE_VALID_EMAIL = 'Please provide a valid email';
exports.PROVIDE_VALID_EMAIL_CODE = 'Provide a valid email or a valid verification code';
exports.INVALID_VERIFICATION_CODE = 'Invalid verification code';

exports.BANK_SUCCESS_MESSAGE = 'Deposit confirmed';
exports.BANK_ERROR_MESSAGE_DEPOSIT_CONFIRMED = 'Deposit already confirmed';
exports.BANK_ERROR_MESSAGE = 'Error requesting the deposit information';
exports.BANK_ERROR_MESSAGE_OUT_LIMITS = 'Amount is out of the limits';
exports.BANK_ERROR_MESSAGE_INVALID_STATUS = 'Invalid status';
exports.BANK_ERROR_MESSAGE_VERIFY_DEPOSIT = 'Error confirming the deposit';
exports.BANK_ERROR_MESSAGE_VERIFY_PAYMENT = 'Error confirming the payment';
exports.BANK_ERROR_MESSAGE_FAILED_WITHDRAWAL = 'Error confirming the payment';
exports.BANK_NOT_APPROVED_USER_DATA =
	'User can not perform this operation. Required user data has not been verified';
exports.BANK_WITHDRAW_PENDING = 'Deposit request confirmed';
exports.BANK_WITHDRAW_COMPLETE = 'Deposit completed';
exports.INSUFFICIENT_BALANCE = 'Insufficent balance.';
exports.INVALID_WITHDRAWAL_TOKEN = 'Withdrawal token is incorrect';
exports.UNAUTHORIZED_WITHDRAWAL_TOKEN = 'Unauthorized withdrawal token';
exports.EXPIRED_WITHDRAWAL_TOKEN = 'Expired withdrawal token';

exports.TOKEN_NOT_FOUND = 'Token not found';
exports.TOKEN_REVOKED = 'Token is already revoked';
exports.TOKEN_REMOVED = 'Token is successfully revoked';
exports.TOKEN_OTP_ENABLED = 'OTP must be enabled to create a token';
exports.INVALID_OTP_CODE = 'Invalid OTP Code';

exports.WALLET_ERROR_500 =
	'Internal error. Withdrawal failed. Please try again in few minutes.';
exports.WALLET_ERROR_FEE = 'The fee is set really off. Please change your fee.';
exports.WALLET_ERROR_ABSURD_FEE = 'Transaction has absurd fees';
exports.TRANSACTION_SUSPICIOUS = 'Transaction is suspicious';

exports.ERROR_INVALID_SYMBOL = 'Invalid symbols';

exports.QUICK_TRADE_OUT_OF_LIMITS = 'Order size is out of the limits';
exports.QUICK_TRADE_TOKEN_USED = 'Token has been used';
exports.QUICK_TRADE_QUOTE_EXPIRED = 'Quote has expired';
exports.QUICK_TRADE_QUOTE_INVALID = 'Invalid quote';
exports.QUICK_TRADE_QUOTE_CALCULATING_ERROR = 'Error calculating the quote';
exports.QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED =
	'The order with the current size can not be filled';
exports.QUICK_TRADE_INSUFFICIENT_BALANCE =
	'Insufficient balance to perform the order';
exports.QUICK_TRADE_DISABLED = 'Broker service is currently disabled';

exports.TRADE_MARKET_ORDER_CAN_NOT_BE_PROCESSED =
	'The market order can not be processed';

exports.ERROR_USER_DONT_MATCH_DEPOSIT = 'Deposit user do not match.';
exports.ERROR_CARD_DONT_MATCH_DEPOSIT =
	'Card used for payment does not match the user card';
exports.ERROR_USER_PENDING_VERIFICATION = 'User data is pending verification';
exports.ERROR_USER_ALREADY_VERIFIED = 'User already verified';
exports.ERROR_INVALID_CARD_USER = 'Card Number has no linked name';
exports.ERROR_INVALID_CARD_NUMBER = 'Invalid Card number';
exports.ERROR_INVALID_TIMEFRAME = '\'start_date\' cannot occur after \'end_date\'';
exports.ERROR_INVALID_TIMEFRAME_ENTRY = 'Invalid date format';
exports.ERROR_NAMES_DONT_MATCH = 'Card Owner and Sheba Name do not match';
exports.ERROR_MISSING_CARD_OWNER = 'Missing Card Owner';
exports.ERROR_CHANGE_USER_INFO =
	'You are not allowed to change your information';
exports.ERROR_MAX_BANKS = 'Not allowed to create new banks';
exports.LEVEL_UPGRADE_NOT_ALLOWED = 'You are now allowed to upgrade your level. Please contact support.';
exports.LEVEL_UPGRADE_NOT_ELIGIBLE = 'You are not eligible for level upgrade.';

exports.SERVICE_NOT_AVAILABLE = 'Service not available';

exports.INVALID_CAPTCHA = 'Invalid captcha';
exports.INVALID_USERNAME =
	'Invalid username. Username must be 3-15 characters length and only contains lowercase charaters, numbers or underscore';
exports.USERNAME_CANNOT_BE_CHANGED = 'Username can not be changed';
exports.USENAME_IS_TAKEN =
	'Username is already taken. Select a different username';
exports.NOT_USER_FOUND_IN_TRANSACTION = 'No user is related to the transaction';
exports.USER_DONT_MATCH_TRANSACTION =
	'Address does not match transaction address';
exports.SAME_ADDRESS_REUSED = 'More than one user is using this address';
exports.SERVICE_NOT_SUPPORTED = 'This service is not supported';
exports.DEFAULT_REJECTION_NOTE = 'Unspecified';

exports.MULTIPLE_API_KEY = 'Multiple API Key methods are provided';
exports.API_KEY_NULL = 'Access Denied: API Key is not provided';
exports.API_REQUEST_EXPIRED = 'Access Denied: API request is expired';
exports.API_SIGNATURE_NULL = 'Access Denied: API Signature is not provided';
exports.API_KEY_INVALID = 'Access Denied: Invalid API Key';
exports.API_KEY_OUT_OF_SCOPE = 'Unauthorized Access. You are not allowed to access this service with this key';
exports.API_KEY_EXPIRED = 'Access Denied: API Key is expired';
exports.API_KEY_INACTIVE = 'Access Denied: API Key is frozen';
exports.API_SIGNATURE_INVALID = 'Access Denied: Invalid API Signature';

// PLUGINS
exports.PLUGIN_NOT_ENABLED = (plugin) => `Plugin ${plugin} not enabled`;
exports.MAX_BANKS_EXCEEDED = 'User can have a maximum of three banks';
exports.BANK_NOT_FOUND = 'Bank account not found';
exports.BANK_ALREADY_VERIFIED = 'Bank account is already verified';

exports.SMS_INVALID_PHONE = 'Invalid mobile phone number';
exports.ID_EMAIL_REQUIRED = 'Missing parameters. ID and email required';
exports.PENDING_APPROVAL_DENY = 'You are not allowed to upload a document while its pending or approved';
exports.IMAGE_NOT_FOUND = 'ID image not found';

exports.SMS_ERROR = 'Error sending SMS';
exports.SMS_PHONE_DONT_MATCH = 'The phone number provided is incorrect';
exports.SMS_CODE_INVALID = 'The code provided is invalid';
exports.SMS_CODE_EXPIRED = 'The code provided has expired or has been used';
exports.INVALID_PHONE_NUMBER = 'Invalid phone number';
exports.SMS_SUCCESS = 'SMS has been sent';
exports.PHONE_VERIFIED = 'Phone number has been verified';

exports.WS_WELCOME = 'Welcome!';
exports.WS_EMPTY_MESSAGE = 'message can not be empty';
exports.WS_WRONG_CHANNEL_FROMAT = 'channel format is incorrect. The format is <event>:<exchange>:<symbol>';
exports.WS_EXCHANGE_NOT_SUPPORTED = 'exchange is not supported';
exports.WS_EVENT_NOT_SUPPORTED = 'event is not supported';
exports.WS_SYMBOL_NOT_SUPPORTED = 'symbol is not supported';
exports.WS_WRONG_INPUT = 'Error: wrong input';
exports.WS_AUTHENTICATION_REQUIRED = 'Bearer or HMAC authentication required';
exports.WS_ALREADY_AUTHENTICATED = 'Already authenticated';
exports.WS_USER_AUTHENTICATED = (email) => `User ${email} authenticated`;
exports.WS_MISSING_HEADER = 'Bearer or api-key authentication required';
exports.WS_INVALID_TOPIC = (topic) => `Topic ${topic} is not supported`;

exports.ACCESS_DENIED = (msg) => `Access denied: ${msg}`;
exports.NOT_AUTHORIZED = 'User is not authorized to access this endpoint';
exports.TOKEN_EXPIRED = 'Token is expired';
exports.INVALID_TOKEN = 'Token is invalid';
exports.MISSING_HEADER = 'Bearer or api-key authentication required';
exports.DEACTIVATED_USER = 'This account is deactivated';
exports.WRONG_LIMIT = 'Value "limit" must be an integer';
exports.WRONG_PAGE = 'Value "page" must be an integer';
exports.WRONG_ORDER_BY = 'Value "order_by" cannot include whitespaces';
exports.WRONG_ORDER = 'Value "order" must be one of: ["asc", "desc"]';
exports.SAME_PASSWORD = 'New password must be different from previous password';
exports.VERIFICATION_CODE_USED = 'Verification code already used';
exports.USERNAME_IS_TAKEN = 'Username is already taken. Select a different username';
exports.TOKEN_OTP_MUST_BE_ENABLED = 'OTP must be enabled to create a token';
exports.CODE_NOT_FOUND = 'Code not found';
exports.CODE_USED = 'Code is already used';
exports.ACCOUNT_NOT_VERIFIED = 'Account is not verified';
exports.INVALID_SYMBOL = (symbol) => `Invalid symbol: ${symbol}`;
exports.INVALID_COIN = (coin) => `Invalid coin: ${coin}`;
exports.INVALID_AMOUNT = (amount) => `Invalid amount: ${amount}`;
exports.WITHDRAWAL_DISABLED_FOR_COIN = (coin) => `Withdrawals are disabled for coin: ${coin}`;
exports.UPGRADE_VERIFICATION_LEVEL = (level) => `Verification level must be at or above ${level}`;
exports.INVALID_VERIFICATION_LEVEL = (level) => `Invalid verification level: ${level}`;
exports.NO_NEW_DATA = 'No new data given';
exports.SUPPORT_DISABLED = 'Cannot send email to support at this time';
exports.COMMUNICATOR_CANNOT_UPDATE = (value) => `Communicator operators cannot update value: ${value}`;
exports.MASK_VALUE_GIVEN = 'Masked value given';
exports.NO_DATA_FOR_CSV = 'No data to convert to CSV';
exports.USER_EMAIL_IS_VERIFIED = 'User email is already verified';
exports.PROVIDE_USER_CREDENTIALS = 'Please provide a a user\'s kit id, network id, or email';
exports.PROVIDE_KIT_ID = 'Please provide a user\'s kit id';
exports.PROVIDE_NETWORK_ID = 'Please provide a user\'s network id';
exports.CANNOT_DEACTIVATE_ADMIN = 'Main admin account cannot be deactivated';
exports.USER_ALREADY_DEACTIVATED = 'User account is already deactivated';
exports.USER_NOT_DEACTIVATED = 'User account is not deactivated';
exports.CANNOT_CHANGE_ADMIN_ROLE = 'Main admin account role cannot be changed';
exports.PROVIDE_TABLE_NAME = 'Please provide a table name';
exports.INVALID_PLUGIN = (plugin) => `Invalid plugin: ${plugin}`;
exports.PLUGIN_ALREADY_ENABELD = (plugin) => `Plugin ${plugin} already enabled`;
exports.PLUGIN_ALREADY_DISABLED = (plugin) => `Plugin ${plugin} already disabled`;
exports.INVALID_NETWORK = (network, validNetworks) => `Invalid network: ${network}${validNetworks ? `. Valid networks: ${validNetworks}` : ''}`;
exports.NETWORK_REQUIRED = (coin, validNetworks) => `Must specify network for coin: ${coin}${validNetworks ? `. Valid networks: ${validNetworks}` : ''}`;
