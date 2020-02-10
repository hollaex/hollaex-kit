'use strict';

// Redis client
const redis = require('../../db/redis');

// Winston logger
const logger = require('../../config/logger').plugin;

module.exports = {
	redis,
	logger
};