'use strict';

exports.ACCESS_DENIED = (msg) => `Access denied: ${msg}`;
exports.NOT_AUTHORIZED = 'You are not authorized to access this endpoint';
exports.TOKEN_EXPIRED = 'Token is expired';
exports.INVALID_TOKEN = 'Token is invalid';
exports.MISSING_HEADER = 'Authorization header is missing';
exports.DEACTIVATED_USER = 'This account is deactivated';
exports.WRONG_LIMIT = 'Value \'limit\' must be an integer';
exports.WRONG_PAGE = 'Value \'page\' must be an integer';
exports.WRONG_ORDER_BY = 'Value \'order_by\' cannot include whitespaces';
exports.WRONG_ORDER = 'Value \'order\' must be one of: [\'asc\', \'desc\']';
