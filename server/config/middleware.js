'use strict';
const url = require('url');
const { logger } = require('./logger');
const { APM_ENABLED, DOMAIN } = require('../constants');
const ALLOWED_DOMAINS = () => toolsLib.getKitSecrets().allowed_domains || (process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : []);
const helmet = require('helmet');
const expectCt = require('expect-ct');
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

const HPKP_MAX_AGE = 90 * 24 * 60 * 60; // seconds

const helmetMiddleware = (app) => {
	app.use(helmet());

	// contentSecurityPolicy
	// app.use(
	// 	helmet.contentSecurityPolicy({
	// 		directives: {
	// 			defaultSrc: ["'self'"],
	// 			styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
	// 		}
	// 	})
	// );

	// referrerPolicy
	// app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

	// hpkp
	// app.use(
	// 	helmet.hpkp({
	// 		maxAge: HPKP_MAX_AGE,
	// 		sha256s: ['AbCdEf123=', 'ZyXwVu456='],
	// 		includeSubdomains: true
	// 	})
	// );
	//
	// // expect-ct
	// app.use(
	// 	expectCt({
	// 		enforce: true,
	// 		maxAge: 123
	// 	})
	// );

	// no cache
	app.use(helmet.noCache());
};

module.exports = {
	helmetMiddleware,
	domainMiddleware,
	apm
};
