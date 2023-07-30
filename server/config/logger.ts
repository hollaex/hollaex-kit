'use strict';

import winston, { format, transports } from 'winston';
import { SPLAT } from 'triple-beam';
import { v4 as uuid } from 'uuid';
import apm from 'elastic-apm-node';
const ElasticsearchApm = require('winston-elasticsearch-apm');
import { isObject } from 'lodash';
import { APM_ENABLED } from '../constants';
const { combine, timestamp, colorize, printf, align } = format;
const emitters = require('events');
emitters.EventEmitter.defaultMaxListeners = 50;
const LEVEL = Symbol.for('level');

if (APM_ENABLED) {
	apm.start();
}

// eslint-disable-next-line no-unused-vars
const isMainnet = process.env.NODE_ENV === 'production';
const LOG_LEVEL = process.env.LOG_LEVEL || 'verbose';

const formatObject = (param) => {
	if (isObject(param)) {
		return JSON.stringify(param);
	}
	return param;
};

const all = format((info) => {
	const splat = info[SPLAT] || [];
	const message = formatObject(info.message);
	const rest = splat.map(formatObject).join(' ');
	info.message = `${message} ${rest}`;
	return info;
});

// used for filtering specific logs. currently not used.
// eslint-disable-next-line no-unused-vars
const filterOnly = (level) => {
	return format((info) => {
		if (info[LEVEL] === level) {
			return info;
		}
	})();
};

// eslint-disable-next-line no-unused-vars
const generateLoggerConfiguration = (name) => {
	const transportsConfig = [
		new transports.Console({ level: LOG_LEVEL })
	];

	if (APM_ENABLED) {
		transportsConfig.push(new ElasticsearchApm({ apm }));
	}

	const config = {
		format: combine(
			all(),
			timestamp(),
			colorize(),
			align(),
			printf(
				(info) =>
					`${info.level}: ${formatObject(info.message)}`
			)
		),
		transports: transportsConfig
	};
	// if (isMainnet) {
	// 	config.format = combine(
	// 		all(),
	// 		timestamp(),
	// 		json()
	// 	);
	// }

	return config;
};

const LOGGER_NAMES = {
	websocket: 'websocket',
	db: 'db',
	redis: 'redis',
	email: 'email',
	admin: 'admin',
	orders: 'orders',
	trades: 'trades',
	otp: 'otp',
	user: 'user',
	deposits: 'deposits',
	withdrawals: 'withdrawals',
	notification: 'notification',
	public: 'public',
	chat: 'chat',
	auth: 'auth',
	plugin: 'plugin',
	tier: 'tier',
	init: 'init',
	broker: 'broker',
	fiat: 'fiat'
};

winston.loggers.add('default', generateLoggerConfiguration('all'));

// eslint-disable-next-line no-unused-vars
Object.entries(LOGGER_NAMES).forEach(([key, value], index) => {
	winston.loggers.add(value, generateLoggerConfiguration(value));
});

const logger = winston.loggers.get('default');
/*
  function to use in express middleware to log the request when it hits the server, it will add a uuid to the request for tracking purpose
 */
const logEntryRequest = (req, res, next) => {
	req.uuid = uuid();
	logger.info(
		req.uuid,
		'middleware/hostname',
		req.hostname,
		req.headers['x-real-ip'],
		req.headers['x-real-origin'],
		req.method,
		req.path
	);
	next();
};

const stream = {
	// eslint-disable-next-line no-unused-vars
	write: (message, encoding) => {
		logger.info(message);
	}
};

export const loggerWebsocket = winston.loggers.get(LOGGER_NAMES.websocket);
export const loggerDb = winston.loggers.get(LOGGER_NAMES.db);
export const loggerRedis = winston.loggers.get(LOGGER_NAMES.redis);
export const loggerAdmin = winston.loggers.get(LOGGER_NAMES.admin);
export const loggerEmail = winston.loggers.get(LOGGER_NAMES.email);
export const loggerOrders = winston.loggers.get(LOGGER_NAMES.orders);
export const loggerOtp = winston.loggers.get(LOGGER_NAMES.otp);
export const loggerTrades = winston.loggers.get(LOGGER_NAMES.trades);
export const loggerDeposits = winston.loggers.get(LOGGER_NAMES.deposits);
export const loggerWithdrawals = winston.loggers.get(LOGGER_NAMES.withdrawals);
export const loggerUser = winston.loggers.get(LOGGER_NAMES.user);
export const loggerNotification = winston.loggers.get(LOGGER_NAMES.notification);
export const loggerChat = winston.loggers.get(LOGGER_NAMES.chat);
export const loggerAuth = winston.loggers.get(LOGGER_NAMES.auth);
export const loggerInit = winston.loggers.get(LOGGER_NAMES.init);
export const loggerPlugin = winston.loggers.get(LOGGER_NAMES.plugin);
export const loggerPublic = winston.loggers.get(LOGGER_NAMES.public);
export const loggerTier = winston.loggers.get(LOGGER_NAMES.tier);
export const loggerBroker = winston.loggers.get(LOGGER_NAMES.broker);
export const loggerFiat = winston.loggers.get(LOGGER_NAMES.fiat);

export {
	logEntryRequest,
	stream,
	logger,
	apm,
};
