'use strict';

const winston = require('winston');

const LEVEL = Symbol.for('level');
const { format, transports } = winston;
const { combine, timestamp, colorize, printf, align, json } = format;
const { SPLAT } = require('triple-beam');
const uuid = require('uuid/v4');
const apm = require('elastic-apm-node');
const ElasticsearchApm = require('winston-elasticsearch-apm');
const { isObject } = require('lodash');
const { APM_ENABLED } = require('../constants');

const emitters = require('events');
emitters.EventEmitter.defaultMaxListeners = 50;

if (APM_ENABLED) {
	apm.start();
}

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
const filterOnly = (level) => {
	return format((info) => {
		if (info[LEVEL] === level) {
			return info;
		}
	})();
};


const generateLoggerConfiguration = (name) => {
	const transportsConfig = [
		new transports.Console({ level: LOG_LEVEL } )
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
					`${info.timestamp} ${info.level}: ${formatObject(info.message)}`
			)
		),
		transports: transportsConfig
	};
	if (isMainnet) {
		config.format = combine(
			all(),
			timestamp(),
			json()
		);
	}

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

winston.loggers.add('default', generateLoggerConfiguration('all', false));

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
	write: (message, encoding) => {
		logger.info(message);
	}
};

module.exports = {
	logEntryRequest,
	stream,
	logger,
	apm,
	loggerWebsocket: winston.loggers.get(LOGGER_NAMES.websocket),
	loggerDb: winston.loggers.get(LOGGER_NAMES.db),
	loggerRedis: winston.loggers.get(LOGGER_NAMES.redis),
	loggerAdmin: winston.loggers.get(LOGGER_NAMES.admin),
	loggerEmail: winston.loggers.get(LOGGER_NAMES.email),
	loggerOrders: winston.loggers.get(LOGGER_NAMES.orders),
	loggerOtp: winston.loggers.get(LOGGER_NAMES.otp),
	loggerTrades: winston.loggers.get(LOGGER_NAMES.trades),
	loggerDeposits: winston.loggers.get(LOGGER_NAMES.deposits),
	loggerWithdrawals: winston.loggers.get(LOGGER_NAMES.withdrawals),
	loggerUser: winston.loggers.get(LOGGER_NAMES.user),
	loggerNotification: winston.loggers.get(LOGGER_NAMES.notification),
	loggerChat: winston.loggers.get(LOGGER_NAMES.chat),
	loggerAuth: winston.loggers.get(LOGGER_NAMES.auth),
	loggerInit: winston.loggers.get(LOGGER_NAMES.init),
	loggerPlugin: winston.loggers.get(LOGGER_NAMES.plugin),
	loggerPublic: winston.loggers.get(LOGGER_NAMES.public),
	loggerTier: winston.loggers.get(LOGGER_NAMES.tier),
	loggerBroker: winston.loggers.get(LOGGER_NAMES.broker),
	loggerFiat: winston.loggers.get(LOGGER_NAMES.loggerFiat)
};
