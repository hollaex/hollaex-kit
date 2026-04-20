'use strict';
const url = require('url');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { logger } = require('./logger');
const { APM_ENABLED, DOMAIN, SECRET } = require('../constants');
const ALLOWED_DOMAINS = () => toolsLib.getKitSecrets().allowed_domains || (process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : []);
const helmet = require('helmet');
const redis = require('../db/redis').duplicate();
const { apm } = require('./logger');
const toolsLib = require('hollaex-tools-lib');

// Rate-limit helpers
//
// We set a stable `req.rateLimitKey` from each lookup function and then tell
// express-limiter to read the key from a single, constant path
// (`opts.lookup = 'rateLimitKey'`). This avoids mutating the shared `opts`
// object across concurrent requests, which was a latent race with the
// previous `opts.lookup = 'headers.authorization'` style.

const getClientIp = (req) => {
	const xff = req.headers && req.headers['x-forwarded-for'];
	if (xff) {
		return xff.toString().split(',')[0].trim();
	}
	return (
		req.ip
		|| (req.socket && req.socket.remoteAddress)
		|| (req.connection && req.connection.remoteAddress)
		|| 'unknown'
	);
};

// Synchronously verifies a Bearer JWT and returns the user id on success.
// Used purely for rate-limit keying; swagger-security still does the real
// authorization later. Returns null on any failure so callers can fall back
// to an IP-scoped bucket.
const verifyBearerSync = (authorization) => {
	try {
		if (!authorization || authorization.indexOf('Bearer ') !== 0) return null;
		const tokenString = authorization.slice('Bearer '.length);
		const decoded = jwt.verify(tokenString, SECRET);
		return decoded && decoded.sub && decoded.sub.id ? decoded.sub.id : null;
	} catch (_) {
		return null;
	}
};

// Canonical Bearer-or-IP lookup. Keys on the decoded user id when a valid
// Bearer token is present (so rotating sessions/devices don't reset the
// bucket) and on the client IP otherwise.
const authOrIpLookup = (req, res, opts, next) => {
	const userId = verifyBearerSync(req.headers && req.headers.authorization);
	req.rateLimitKey = userId ? `u:${userId}` : `ip:${getClientIp(req)}`;
	opts.lookup = 'rateLimitKey';
	return next();
};

// Like `authOrIpLookup` but appends a second dimension (e.g. the endpoint
// path) so per-user caps are scoped per resource.
const authOrIpLookupWithScope = (getScope) => (req, res, opts, next) => {
	const userId = verifyBearerSync(req.headers && req.headers.authorization);
	const scope = getScope(req) || '';
	const principal = userId ? `u:${userId}` : `ip:${getClientIp(req)}`;
	req.rateLimitKey = `${principal}|${scope}`;
	opts.lookup = 'rateLimitKey';
	return next();
};

// Builds a per-account lookup from a request -> identifier function. When
// no identifier is extractable the bucket is scoped by IP instead of a
// single global 'unknown' key, so one abuser can't poison the bucket for
// every other malformed request.
const accountOrIpUnknownLookup = (getAccount) => (req, res, opts, next) => {
	const account = getAccount(req);
	req.rateLimitKey = account
		? `acct:${account}`
		: `acct:unknown:${getClientIp(req)}`;
	opts.lookup = 'rateLimitKey';
	return next();
};

const pickSignupAccount = (req) => {
	const swaggerVal = req.swagger && req.swagger.params && req.swagger.params.signup
		&& req.swagger.params.signup.value;
	const email = ((swaggerVal && swaggerVal.email) || (req.body && req.body.email) || '')
		.toString().trim().toLowerCase();
	const phone = ((swaggerVal && swaggerVal.phone_number) || (req.body && req.body.phone_number) || '')
		.toString().trim();
	if (email) return `email:${email}`;
	if (phone) return `phone:${phone}`;
	return null;
};

const pickLoginAccount = (req) => {
	const swaggerVal = req.swagger && req.swagger.params && req.swagger.params.authentication
		&& req.swagger.params.authentication.value;
	const email = ((swaggerVal && swaggerVal.email) || (req.body && req.body.email) || '')
		.toString().trim().toLowerCase();
	const phone = ((swaggerVal && swaggerVal.phone_number) || (req.body && req.body.phone_number) || '')
		.toString().trim();
	if (email) return `email:${email}`;
	if (phone) return `phone:${phone}`;
	return null;
};

const pickPasswordEmail = (req) => {
	const swaggerEmail = req.swagger && req.swagger.params && req.swagger.params.data
		&& req.swagger.params.data.value && req.swagger.params.data.value.email;
	const email = (swaggerEmail || (req.body && req.body.email) || '')
		.toString().trim().toLowerCase();
	return email ? `email:${email}` : null;
};

// Hashes the raw Google OAuth id_token into a short bucket key. We can't
// cheaply key by the underlying Google account (that would require a full
// OAuth verification round-trip in the lookup), but capping per-token use
// is useful defense-in-depth against replay attempts and complements the
// per-IP limiter on the same routes.
const pickGoogleTokenHash = (req) => {
	const swaggerSignup = req.swagger && req.swagger.params && req.swagger.params.signup
		&& req.swagger.params.signup.value;
	const swaggerAuth = req.swagger && req.swagger.params && req.swagger.params.authentication
		&& req.swagger.params.authentication.value;
	const token = (
		(swaggerSignup && swaggerSignup.google_token)
		|| (swaggerAuth && swaggerAuth.google_token)
		|| (req.body && req.body.google_token)
		|| ''
	).toString();
	if (!token) return null;
	return `gtok:${crypto.createHash('sha256').update(token).digest('hex').slice(0, 32)}`;
};

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

	// Per-user (or per-IP) per-plugin-endpoint limiter. Uses a synchronous
	// JWT verify so we don't pay an async round-trip on every plugin request
	// and don't mutate the limiter's shared opts across concurrent calls.
	limiter({
		path: '/plugins/*',
		method: 'all',
		total: 8,
		expire: 1000 * 60 * 2,
		lookup: authOrIpLookupWithScope((req) => `${req.baseUrl || ''}${req.path || ''}`),
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
		lookup: authOrIpLookup,
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'signup ip');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	// Per-account signup limiter: keyed by email or phone_number so a single
	// target (regardless of source IP) cannot be hit more than `total` times
	// in the window. Requests with neither identifier fall through to a
	// per-IP 'unknown' bucket so one abuser spamming empty bodies can't lock
	// the bucket out for everyone else.
	limiter({
		path: '/v2/signup',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: accountOrIpUnknownLookup(pickSignupAccount),
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'signup account');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/login',
		method: 'post',
		total: 10,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'login ip');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	// Google OAuth signup/login share the same /v2/signup and /v2/login risk
	// surface (account creation, login attempts), so mirror the per-IP caps.
	// We also add a per-google_token-hash limiter below as defense in depth
	// against replaying a captured id_token. Keying by the underlying Google
	// account would require a full OAuth verification round-trip in the
	// lookup, which we avoid here for the same reason we don't do that for
	// our own Bearer tokens.
	limiter({
		path: '/v2/signup/google',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			req.rateLimitKey = `ip:${getClientIp(req)}`;
			opts.lookup = 'rateLimitKey';
			return next();
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'signup google ip');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/signup/google',
		method: 'post',
		total: 6,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			const h = pickGoogleTokenHash(req);
			req.rateLimitKey = h ? h : `gtok:unknown:${getClientIp(req)}`;
			opts.lookup = 'rateLimitKey';
			return next();
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'signup google token');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/login/google',
		method: 'post',
		total: 10,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			req.rateLimitKey = `ip:${getClientIp(req)}`;
			opts.lookup = 'rateLimitKey';
			return next();
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'login google ip');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	limiter({
		path: '/v2/login/google',
		method: 'post',
		total: 10,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			const h = pickGoogleTokenHash(req);
			req.rateLimitKey = h ? h : `gtok:unknown:${getClientIp(req)}`;
			opts.lookup = 'rateLimitKey';
			return next();
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'login google token');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
	// Per-account login limiter: keyed by email or phone_number so brute-force
	// attempts against a single account from rotating IPs are throttled.
	// Requests with no identifier fall into an IP-scoped 'unknown' bucket.
	limiter({
		path: '/v2/login',
		method: 'post',
		total: 8,
		expire: 1000 * 60 * 2,
		lookup: accountOrIpUnknownLookup(pickLoginAccount),
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'login account');
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
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'get reset-password');
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

	// Per-email limiter for /v2/password (password-reset request). Requests
	// with no email fall into an IP-scoped 'unknown' bucket rather than a
	// single global one.
	limiter({
		path: '/v2/password',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: accountOrIpUnknownLookup(pickPasswordEmail),
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'post password email');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// Per-IP limiter for /v2/password as a coarse cap independent of body.
	limiter({
		path: '/v2/password',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: (req, res, opts, next) => {
			req.rateLimitKey = `ip:${getClientIp(req)}`;
			opts.lookup = 'rateLimitKey';
			return next();
		},
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'post password ip');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	limiter({
		path: '/v2/user/change-password',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: authOrIpLookup,
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
		lookup: authOrIpLookup,
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'request-email-confirmation');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// Two-step "set new real email" flow for phone-signup synthetic users.
	// Step 1 sends a verification code to the requested email and is throttled
	// tightly because each call costs a real outbound email.
	limiter({
		path: '/v2/user/set-email',
		method: 'post',
		total: 4,
		expire: 1000 * 60 * 2,
		lookup: authOrIpLookup,
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'set-email');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// Step 2 confirms the code. The tools-layer already enforces a 5-attempt
	// lockout per pending request via Redis; this transport-level limit is
	// defense in depth against attackers cycling sessions/IPs.
	limiter({
		path: '/v2/user/set-email/confirm',
		method: 'post',
		total: 10,
		expire: 1000 * 60 * 2,
		lookup: authOrIpLookup,
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'set-email-confirm');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// /user/activate-otp accepts a 6-digit TOTP code; without throttling, a
	// stolen session could brute-force the second factor in seconds. Keyed by
	// user id (via sync JWT verify) with IP fallback for unauthenticated
	// callers, so session rotation does not reset the bucket.
	limiter({
		path: '/v2/user/activate-otp',
		method: 'post',
		total: 5,
		expire: 1000 * 60 * 2,
		lookup: authOrIpLookup,
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'activate-otp');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// /user/deactivate-otp also accepts a 6-digit TOTP code and is just as
	// brute-forceable as activate-otp; same keying/caps.
	limiter({
		path: '/v2/user/deactivate-otp',
		method: 'post',
		total: 5,
		expire: 1000 * 60 * 2,
		lookup: authOrIpLookup,
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'deactivate-otp');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// /user/request-otp generates a TOTP secret; no brute force risk but
	// worth a coarse per-user cap so a bot can't spam it.
	limiter({
		path: '/v2/user/request-otp',
		method: 'get',
		total: 10,
		expire: 1000 * 60 * 2,
		lookup: authOrIpLookup,
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'request-otp');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// /user/token {POST, PUT, DELETE} all accept otp_code + email_code.
	// The email_code alone is short enough to be brute-forceable if a bot
	// can pair it with any otp_code guess, so cap per-user aggressively.
	['post', 'put', 'delete'].forEach((method) => {
		limiter({
			path: '/v2/user/token',
			method,
			total: 5,
			expire: 1000 * 60 * 2,
			lookup: authOrIpLookup,
			onRateLimited: function (req, res, next) {
				logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', `user-token ${method}`);
				return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
			}
		});
	});

	// /user/confirm-withdrawal submits the one-time withdrawal token and is
	// unauthenticated, so brute-forcing the token from many sessions/IPs is
	// the main risk. Keyed per-IP as a transport-level cap.
	limiter({
		path: '/v2/user/confirm-withdrawal',
		method: 'post',
		total: 5,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'confirm-withdrawal');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});

	// /user/confirm-login submits the suspicious-login confirmation token
	// (max 12 chars). Unauthenticated, so cap per-IP to prevent brute-forcing
	// the short token across requests.
	limiter({
		path: '/v2/user/confirm-login',
		method: 'post',
		total: 5,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'abuse', 'confirm-login');
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
