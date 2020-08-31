'use strict';

exports.ACCESS_DENIED = (msg) => `Access denied: ${msg}`;
exports.NOT_AUTHORIZED = 'You are not authorized to access this endpoint';
exports.TOKEN_EXPIRED = 'Token is expired';
exports.INVALID_TOKEN = 'Token is invalid';
exports.MISSING_HEADER = 'Authorization header is missing';
exports.DEACTIVATED_USER = 'This account is deactivated';
exports.WRONG_LIMIT = 'Value "limit" must be an integer';
exports.WRONG_PAGE = 'Value "page" must be an integer';
exports.WRONG_ORDER_BY = 'Value "order_by" cannot include whitespaces';
exports.WRONG_ORDER = 'Value "order" must be one of: ["asc", "desc"]';
exports.USER_NOT_FOUND = 'User not found';
exports.SIGNUP_NOT_AVAILABLE = 'Sign up not available';
exports.INVALID_PASSWORD = 'Invalid password. It has to contain at least 8 characters, at least one digit and one character.';
exports.PROVIDE_VALID_EMAIL = 'Please provide a valid email';
exports.USER_EXISTS = 'User already exists';
exports.INVALID_VERIFICATION_CODE = 'Invalid verification code';
exports.INVALID_CAPTCHA = 'Invalid captcha';