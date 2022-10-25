'use strict';
const url = require('url');
const { logger } = require('./logger');
const { APM_ENABLED, DOMAIN } = require('../constants');
const ALLOWED_DOMAINS = () => toolsLib.getKitSecrets().allowed_domains || (process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : []);
const helmet = require('helmet');
const redis = require('../db/redis').duplicate();
const { apm } = require('./logger');
const toolsLib = require('hollaex-tools-lib');

const domainMiddleware = (req, res, next) => {
	logger.verbose(req.uuid, 'origin', req.headers['x-real-origin']);
	if (ALLOWED_DOMAINS().length > 0 && req.headers['x-real-origin']) {
		const originUrl = url.parse(req.headers['x-real-origin']);
		logger.verbose(
			req.uuid,
			'origin',
			req.headers['x-real-origin'],
			'host',
			originUrl.protocol,
			originUrl.host
		);

		const requestDomain = ALLOWED_DOMAINS().find(
			(domain) => originUrl.host.indexOf(domain) === 0
		);
		if (!requestDomain) {
			req.headers['x-real-origin'] = DOMAIN;
		}
	} else {
		req.headers['x-real-origin'] = DOMAIN;
	}
	if (APM_ENABLED) {
		apm.setTransactionName(req.method + ' ' + req.url);
	}
	return next();
};

const helmetMiddleware = (app) => {
	app.use(helmet());

	// no cache
	app.use(helmet.noCache());
};

const rateLimitMiddleware = (app) => {
	var limiter = require('express-limiter')(app, redis);

	limiter({
		path: '/v2/user/request-withdrawal',
		method: 'post',
		total: 10,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			if (req.headers.hasOwnProperty('authorization') && req.headers.authorization.indexOf('Bearer ') > -1) {
				opts.lookup = 'headers.authorization';
			} else {
				opts.lookup = 'headers.x-forwarded-for';
			}
			return next();
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'request-withdrawal');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/signup',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'signup');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/login',
		method: 'post',
		total: 16,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'login');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/verify',
		method: 'get',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'get verify');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/verify',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'post verify');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	limiter({
		path: '/v2/reset-password',
		method: 'get',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'get eset-password');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	limiter({
		path: '/v2/reset-password',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'post reset-password');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	limiter({
		path: '/v2/user/change-password',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			if (req.headers.hasOwnProperty('authorization') && req.headers.authorization.indexOf('Bearer ') > -1) {
				opts.lookup = 'headers.authorization';
			} else {
				opts.lookup = 'headers.x-forwarded-for';
			}
			return next();
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'change-password');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
};

module.exports = {
	helmetMiddleware,
	domainMiddleware,
	rateLimitMiddleware,
	apm
};
