'use strict';

// Redis client
const redis = require('../../db/redis');

// Winston logger
const logger = require('../../config/logger').loggerPlugin;

module.exports = {
	redis,
	logger
};