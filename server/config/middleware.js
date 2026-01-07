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

		let transactionName = req.method + ' ' + req.path;

		if (req.path.indexOf('/v2/') > -1) {
			apm.setLabel('endpointType', 'v2');
		}

		if (req.path.indexOf('/order/') > -1) {
			apm.setLabel('endpointType', 'order');
			let orderId = req.path.split('?order_id=')[3];
			if (!isNaN(orderId)) {
				transactionName = req.method + ' ' + req.path.replace(`?order_id=${orderId}`, '');
			}
		}
		apm.setTransactionName(transactionName);
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
		path: '/plugins/*',
		method: 'all',
		total: 8,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			// scope limit per plugin endpoint (without query string)
			req.rateLimitEndpoint = `${req.baseUrl || ''}${req.path || ''}`;
			const hasBearer = req.headers && req.headers.authorization && req.headers.authorization.indexOf('Bearer ') === 0;
			if (hasBearer) {
				toolsLib.security
					.verifyBearerTokenPromise(req.headers.authorization, req.headers['x-forwarded-for'])
					.then((decoded) => {
						if (decoded && decoded.sub && decoded.sub.id) {
							req.rateLimitUserId = decoded.sub.id;
							// per-user per-endpoint key
							opts.lookup = ['rateLimitUserId', 'rateLimitEndpoint'];
						} else {
							// per-IP per-endpoint key
							opts.lookup = [req.headers['x-forwarded-for'] ? 'headers.x-forwarded-for' : 'connection.remoteAddress', 'rateLimitEndpoint'];
						}
						return next();
					})
					.catch(() => {
						opts.lookup = [req.headers['x-forwarded-for'] ? 'headers.x-forwarded-for' : 'connection.remoteAddress', 'rateLimitEndpoint'];
						return next();
					});
			} else {
				opts.lookup = [req.headers['x-forwarded-for'] ? 'headers.x-forwarded-for' : 'connection.remoteAddress', 'rateLimitEndpoint'];
				return next();
			}
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', req.method, req.originalUrl || req.path);
			return res.status(429).json({ message: 'Too many requests. Please try again later.' });
		}
	});

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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'request-withdrawal');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'signup');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'login');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'get verify');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'post verify');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'get eset-password');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'post reset-password');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'change-password');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	limiter({
		path: '/v2/user/request-email-confirmation',
		method: 'get',
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'request-email-confirmation');
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
