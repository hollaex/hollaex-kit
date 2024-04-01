'use strict';

const { isEmail, isUUID } = require('validator');
const toolsLib = require('hollaex-tools-lib');
const crypto = require('crypto');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const { loggerUser } = require('../../config/logger');
const { errorMessageConverter } = require('../../utils/conversion');
const {
	USER_VERIFIED,
	PROVIDE_VALID_EMAIL_CODE,
	USER_REGISTERED,
	USER_NOT_FOUND,
	USER_EMAIL_NOT_VERIFIED,
	VERIFICATION_EMAIL_MESSAGE,
	TOKEN_REMOVED,
	INVALID_CREDENTIALS,
	USER_NOT_VERIFIED,
	USER_NOT_ACTIVATED,
	SIGNUP_NOT_AVAILABLE,
	PROVIDE_VALID_EMAIL,
	INVALID_PASSWORD,
	USER_EXISTS,
	VERIFICATION_CODE_EXPIRED,
	INVALID_VERIFICATION_CODE,
	LOGIN_NOT_ALLOW,
	NO_IP_FOUND,
	INVALID_OTP_CODE,
	OTP_CODE_NOT_FOUND,
	INVALID_CAPTCHA
} = require('../../messages');
const { DEFAULT_ORDER_RISK_PERCENTAGE, EVENTS_CHANNEL, API_HOST, DOMAIN, TOKEN_TIME_NORMAL, TOKEN_TIME_LONG, HOLLAEX_NETWORK_BASE_URL, NUMBER_OF_ALLOWED_ATTEMPTS } = require('../../constants');
const { all } = require('bluebird');
const { each, isInteger } = require('lodash');
const { publisher } = require('../../db/pubsub');
const { isDate } = require('moment');
const DeviceDetector = require('node-device-detector');
const uuid = require('uuid/v4');

const VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};

const detector = new DeviceDetector({
	clientIndexes: true,
	deviceIndexes: true,
	deviceAliasCode: false,
});


const INITIAL_SETTINGS = () => {
	return {
		notification: {
			popup_order_confirmation: true,
			popup_order_completed: true,
			popup_order_partially_filled: true
		},
		interface: {
			order_book_levels: 10,
			theme: toolsLib.getKitConfig().defaults.theme
		},
		language: toolsLib.getKitConfig().defaults.language,
		audio: {
			order_completed: true,
			order_partially_completed: true,
			public_trade: false
		},
		risk: {
			order_portfolio_percentage: DEFAULT_ORDER_RISK_PERCENTAGE
		},
		chat: {
			set_username: false
		}
	};
};


const signUpUser = (req, res) => {
	const {
		password,
		captcha,
		referral
	} = req.swagger.params.signup.value;

	let { email } = req.swagger.params.signup.value;
	const ip = req.headers['x-real-ip'];
	loggerUser.debug(
		req.uuid,
		'controllers/user/signUpUser',
		req.swagger.params.signup.value,
		ip
	);

	email = email.toLowerCase().trim();

	toolsLib.security.checkIp(ip)
		.then(() => {
			return toolsLib.security.checkCaptcha(captcha, ip);
		})
		.then(() => toolsLib.user.signUpUser(email, password, { referral }))
		.then(() => res.status(201).json({ message: USER_REGISTERED }))
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/signUpUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getVerifyUser = (req, res) => {
	let email = req.swagger.params.email.value;
	const resendEmail = req.swagger.params.resend.value;
	const domain = req.headers['x-real-origin'];
	let promiseQuery;

	if (email && typeof email === 'string' && isEmail(email)) {
		email = email.toLowerCase();
		promiseQuery = toolsLib.database.findOne('user', {
			where: { email },
			attributes: ['id', 'email', 'email_verified']
		}).then(async (user) => {
			if (user.email_verified) {
				throw new Error(USER_VERIFIED);
			}
			if (resendEmail) {
				const verificationCode = uuid();
				toolsLib.user.storeVerificationCode(user, verificationCode);

				sendEmail(
					MAILTYPE.SIGNUP,
					email,
					verificationCode,
					{},
					domain
				);
			}
			return res.json({
				email,
				message: VERIFICATION_EMAIL_MESSAGE
			});
		});
	} else {
		return res.status(400).json({
			message: PROVIDE_VALID_EMAIL_CODE
		});
	}

	promiseQuery
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/getVerifyUser', err.message);
			// obfuscate the error message
			let errorMessage = VERIFICATION_EMAIL_MESSAGE;
			return res.status(err.statusCode || 400).json({ message: errorMessage });
		});
};

const verifyUser = (req, res) => {
	const { verification_code, email } = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];

	toolsLib.user.verifyUser(email, verification_code, domain)
		.then(() => {
			return res.json({ message: USER_VERIFIED });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/verifyUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};



const createAttemptMessage = (loginData, user, domain) => {
	const currentNumberOfAttemps = NUMBER_OF_ALLOWED_ATTEMPTS - loginData.attempt;
	if (currentNumberOfAttemps === NUMBER_OF_ALLOWED_ATTEMPTS - 1)
	{ return ''; }
	else if(currentNumberOfAttemps === 0) { 
		sendEmail(
			MAILTYPE.LOCKED_ACCOUNT,
			user.email,
			{},
			user.settings,
			domain);

		return ' ' + LOGIN_NOT_ALLOW; 
	}
	return ` You have ${currentNumberOfAttemps} more ${currentNumberOfAttemps === 1 ? 'attempt' : 'attempts'} left`;
};

const loginPost = (req, res) => {
	const {
		password,
		otp_code,
		captcha,
		service,
		long_term
	} = req.swagger.params.authentication.value;
	let {
		email
	} = req.swagger.params.authentication.value;

	const ip = req.headers['x-real-ip'];
	const userAgent = req.headers['user-agent'];
	const result = detector.detect(userAgent);

	let device = [
		result.device.brand,
		result.device.model,
		result.device.type,
		result.client.name,
		result.client.type,
		result.os.name];

	device = device.filter(Boolean).join(' ').trim();

	const domain = req.headers['x-real-origin'];
	const origin = req.headers.origin;
	const referer = req.headers.referer;
	const time = new Date();

	loggerUser.verbose(
		req.uuid,
		'controllers/user/loginPost',
		'email',
		email,
		'otp_code',
		otp_code,
		'captcha',
		captcha,
		'service',
		service,
		'long_term',
		long_term,
		'ip',
		ip,
		'device',
		device,
		'domain',
		domain,
		'origin',
		origin,
		'referer',
		referer
	);


	if (!email || typeof email !== 'string' || !isEmail(email)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/loginPost invalid email',
			email
		);
		return res.status(400).json({ message: 'Invalid Email' });
	}

	email = email.toLowerCase().trim();

	toolsLib.security.checkIp(ip)
		.then(() => {
			return toolsLib.user.getUserByEmail(email);
		})
		.then(async (user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.verification_level === 0) {
				throw new Error(USER_NOT_VERIFIED);
			} else if (toolsLib.getKitConfig().email_verification_required && !user.email_verified) {
				throw new Error(USER_EMAIL_NOT_VERIFIED);
			} else if (!user.activated) {
				throw new Error(USER_NOT_ACTIVATED);
			}

			const loginData = await toolsLib.user.findUserLatestLogin(user, false);
			if (loginData && loginData.attempt === NUMBER_OF_ALLOWED_ATTEMPTS && loginData.status == false) {
				throw new Error(LOGIN_NOT_ALLOW);
			}

			return all([
				user,
				toolsLib.security.validatePassword(user.password, password)
			]);
		})
		.then(async ([user, passwordIsValid]) => {
			if (!passwordIsValid) {
				await toolsLib.user.createUserLogin(user, ip, device, domain, origin, referer, null, long_term, false);
				const loginData = await toolsLib.user.findUserLatestLogin(user, false);
				const message = createAttemptMessage(loginData, user, domain);
				throw new Error(INVALID_CREDENTIALS + message);
			}

			if (!user.otp_enabled) {
				return all([user, toolsLib.security.checkCaptcha(captcha, ip)]);
			} else {
				return all([
					user,
					toolsLib.security.verifyOtpBeforeAction(user.id, otp_code)
						.then(async () => {
							return toolsLib.security.checkCaptcha(captcha, ip);
						})
						.catch(async (err) => {
							if (!otp_code) {
								throw new Error(INVALID_OTP_CODE);
							}
							await toolsLib.user.createUserLogin(user, ip, device, domain, origin, referer, null, long_term, false);
							const loginData = await toolsLib.user.findUserLatestLogin(user, false);
							const message = createAttemptMessage(loginData, user, domain);

							if (err.message === INVALID_CAPTCHA) {
								throw new Error(err.message);
							} else {
								throw new Error(err.message + message);
							}
						})
				]);
			}
		})
		.then(([user]) => {
			const data = {
				ip,
				time,
				device
			};

			publisher.publish(EVENTS_CHANNEL, JSON.stringify({
				type: 'user',
				data: {
					action: 'login',
					user_id: user.id
				}
			}));

			if (!service) {
				sendEmail(MAILTYPE.LOGIN, email, data, user.settings, domain);
			}

			return all([
				user,
				toolsLib.security.issueToken(
					user.id,
					user.network_id,
					email,
					ip,
					user.is_admin,
					user.is_support,
					user.is_supervisor,
					user.is_kyc,
					user.is_communicator,
					long_term ? TOKEN_TIME_LONG : TOKEN_TIME_NORMAL
				)
			]);
		})
		.then(async ([user, token]) => {
			if (!ip) {
				throw new Error(NO_IP_FOUND);
			}
			await toolsLib.user.createUserLogin(user, ip, device, domain, origin, referer, token, long_term, true);
			return res.status(201).json({ token });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/loginPost catch', err.message);
			return res.status(err.statusCode || 401).json({ message: errorMessageConverter(err) });
		});
};

const verifyToken = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/verifyToken', req.auth.sub);
	return res.json({ message: 'Valid Token' });
};

function requestEmailConfirmation(req, res) {
	loggerUser.verbose(req.uuid, 'controllers/user/requestEmailConfirmation auth', req.auth.sub);
	let email = req.auth.sub.email;
	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	loggerUser.verbose(req.uuid, 'controllers/user/requestEmailConfirmation ip', ip, domain);

	if (!email || typeof email !== 'string' || !isEmail(email)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/requestEmailConfirmation invalid email',
			email
		);
		return res.status(400).json({ message: `Invalid email: ${email}` });
	}

	email = email.toLowerCase();

	toolsLib.security.sendConfirmationEmail(req.auth.sub.id, domain)
		.then(() => {
			return res.json({ message: `Confirmation email sent to: ${email}` });
		})
		.catch((err) => {
			let errorMessage = errorMessageConverter(err);

			if (errorMessage === USER_NOT_FOUND) {
				errorMessage = 'User not found';
			}

			loggerUser.error(
				req.uuid,
				'controllers/user/requestEmailConfirmation',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessage });
		});
}

const requestResetPassword = (req, res) => {
	let email = req.swagger.params.email.value;
	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	const captcha = req.swagger.params.captcha.value;

	loggerUser.info(
		req.uuid,
		'controllers/user/requestResetPassword',
		email,
		'email',
		'ip',
		ip,
		'domain',
		domain
	);

	if (!email || typeof email !== 'string' || !isEmail(email)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/requestResetPassword invalid email',
			email
		);
		return res.status(400).json({ message: `Password request sent to: ${email}` });
	}

	email = email.toLowerCase();

	toolsLib.security.sendResetPasswordCode(email, captcha, ip, domain)
		.then(() => {
			return res.json({ message: `Password request sent to: ${email}` });
		})
		.catch((err) => {
			let errorMessage = errorMessageConverter(err);

			if (errorMessage === USER_NOT_FOUND) {
				errorMessage = `Password request sent to: ${email}`;
			}
			loggerUser.error(req.uuid, 'controllers/user/requestResetPassword', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessage });
		});
};

const resetPassword = (req, res) => {
	const { code, new_password } = req.swagger.params.data.value;

	toolsLib.security.resetUserPassword(code, new_password)
		.then(() => {
			return res.json({ message: 'Password updated.' });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/resetPassword', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUser = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/getUser', req.auth.sub);
	const id = req.auth.sub.id;

	toolsLib.user.getUserByKitId(id, true, true, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return res.json(toolsLib.user.omitUserFields(user));
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/getUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const updateSettings = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/updateSettings', req.auth.sub);
	const email = req.auth.sub.email;
	loggerUser.debug(
		req.uuid,
		'controllers/user/updateSettings',
		req.swagger.params.data.value
	);
	const data = req.swagger.params.data.value;

	toolsLib.user.updateUserSettings({ email }, data)
		.then((user) => res.json(user))
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/updateSettings', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const changePassword = (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/user/changePassword', req.auth.sub);
	const email = req.auth.sub.email;
	const { old_password, new_password, otp_code } = req.swagger.params.data.value;
	const ip = req.headers['x-real-ip'];
	const domain = API_HOST + HOLLAEX_NETWORK_BASE_URL;

	loggerUser.verbose(
		req.uuid,
		'controllers/user/changePassword',
		ip,
		otp_code
	);

	toolsLib.security.changeUserPassword(email, old_password, new_password, ip, domain, otp_code)
		.then(() => res.json({ message: `Verification email to change password is sent to: ${email}` }))
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/changePassword', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const confirmChangePassword = (req, res) => {
	const code = req.swagger.params.code.value;
	const ip = req.headers['x-real-ip'];

	loggerUser.verbose(
		req.uuid,
		'controllers/user/changePassword',
		code,
		ip
	);

	toolsLib.security.confirmChangeUserPassword(code)
		.then(() => res.redirect(301, `${DOMAIN}/change-password-confirm/${code}?isSuccess=true`))
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/confirmChangeUserPassword', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const setUsername = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/setUsername auth', req.auth.sub);

	const { id } = req.auth.sub;
	const { username } = req.swagger.params.data.value;

	toolsLib.user.setUsernameById(id, username)
		.then(() => res.json({ message: 'Username successfully changed' }))
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/setUsername', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUserLogins = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/getUserLogins auth', req.auth.sub);

	const user_id = req.auth.sub.id;
	const { limit, status, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (start_date.value && !isDate(start_date.value)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserLogins invalid start_date',
			start_date.value
		);
		return res.status(400).json({ message: 'Invalid start date' });
	}

	if (end_date.value && !isDate(end_date.value)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserLogins invalid end_date',
			end_date.value
		);
		return res.status(400).json({ message: 'Invalid end date' });
	}

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserLogins invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getUserLogins({
		userId: user_id,
		status: status.value,
		limit: limit.value,
		page: page.value,
		orderBy: order_by.value,
		order: order.value,
		startDate: start_date.value,
		endDate: end_date.value,
		format: format.value
	})
		.then((data) => {
			if (format.value === 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/getUserLogins', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const affiliationCount = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/affiliationCount auth', req.auth.sub);

	const user_id = req.auth.sub.id;

	const { limit, page, order_by, order, start_date, end_date } = req.swagger.params;


	toolsLib.user.getAffiliationCount(user_id, {
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value
	})
		.then((data) => {
			loggerUser.verbose(req.uuid, 'controllers/user/affiliationCount count', data.count);
			return res.json(data);
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/affiliationCount', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUserBalance = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/getUserBalance auth', req.auth.sub);
	const user_id = req.auth.sub.id;

	toolsLib.wallet.getUserBalanceByKitId(user_id, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((balance) => {
			return res.json(balance);
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/getUserBalance', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const deactivateUser = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/deactivateUser/auth',
		req.auth
	);
	const { id, email } = req.auth.sub;

	toolsLib.user.freezeUserById(id)
		.then(() => {
			return res.json({ message: `Account ${email} deactivated` });
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/deactivateUser',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createCryptoAddress = (req, res) => {
	loggerUser.debug(
		req.uuid,
		'controllers/user/createCryptoAddress',
		req.auth.sub
	);

	const { id } = req.auth.sub;
	const { crypto, network } = req.swagger.params;

	loggerUser.info(
		req.uuid,
		'controllers/user/createCryptoAddress',
		'crypto',
		crypto.value,
		'network',
		network.value
	);

	if (!crypto.value || !toolsLib.subscribedToCoin(crypto.value)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/createCryptoAddress',
			`Invalid crypto: "${crypto.value}"`
		);
		return res.status(404).json({ message: `Invalid crypto: "${crypto.value}"` });
	}

	toolsLib.user.createUserCryptoAddressByKitId(id, crypto.value, {
		network: network.value,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.status(201).json(data);
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/createCryptoAddress',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getHmacToken = (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/user/getHmacToken auth', req.auth.sub);

	const { id } = req.auth.sub;

	toolsLib.security.getUserKitHmacTokens(id)
		.then((tokens) => {
			return res.json(tokens);
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/getHmacToken err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createHmacToken = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/createHmacToken auth',
		req.auth.sub
	);

	const { id: userId } = req.auth.sub;
	const ip = req.headers['x-real-ip'];
	const { name, otp_code, email_code, role, whitelisted_ips } = req.swagger.params.data.value;

	loggerUser.verbose(
		req.uuid,
		'controllers/user/createHmacToken data',
		name,
		otp_code,
		email_code,
		ip,
		role,
		whitelisted_ips
	);

	whitelisted_ips?.forEach((ip) => {
		if (!toolsLib.validateIp(ip)) {
			return res.status(400).json({ message: 'IP address is not valid.' });
		}
	});

	toolsLib.security.confirmByEmail(userId, email_code)
		.then((confirmed) => {
			if (confirmed) {
				// TODO check for the name duplication
				return toolsLib.security.createUserKitHmacToken(userId, otp_code, ip, name, role, whitelisted_ips);
			} else {
				throw new Error(INVALID_VERIFICATION_CODE);
			}
		})
		.then((token) => {
			return res.json(token);
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/createHmacToken',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

function updateHmacToken(req, res) {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/updateHmacToken auth',
		req.auth.sub
	);

	const { id: userId } = req.auth.sub;
	const ip = req.headers['x-real-ip'];
	const { token_id, name, otp_code, email_code, permissions, whitelisted_ips, whitelisting_enabled } = req.swagger.params.data.value;

	loggerUser.verbose(
		req.uuid,
		'controllers/user/updateHmacToken data',
		token_id,
		name,
		otp_code,
		email_code,
		permissions,
		whitelisted_ips,
		whitelisting_enabled,
		ip,
	);

	whitelisted_ips?.forEach((ip) => {
		if (!toolsLib.validateIp(ip)) {
			return res.status(400).json({ message: 'IP address is not valid.' });
		}
	});

	toolsLib.security.confirmByEmail(userId, email_code)
		.then((confirmed) => {
			if (confirmed) {
				return toolsLib.security.updateUserKitHmacToken(userId, otp_code, ip, token_id, name, permissions, whitelisted_ips, whitelisting_enabled);
			} else {
				throw new Error(INVALID_VERIFICATION_CODE);
			}
		})
		.then((token) => {
			return res.json(token);
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/updateHmacToken',
				err.message,
				err.stack
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

const deleteHmacToken = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/deleteHmacToken auth',
		req.auth.sub
	);

	const { id: userId } = req.auth.sub;
	const { token_id, otp_code, email_code } = req.swagger.params.data.value;
	const ip = req.headers['x-real-ip'];

	loggerUser.verbose(
		req.uuid,
		'controllers/user/deleteHmacToken data',
		token_id,
		otp_code,
		email_code,
		ip
	);

	toolsLib.security.confirmByEmail(userId, email_code)
		.then((confirmed) => {
			if (confirmed) {
				return toolsLib.security.deleteUserKitHmacToken(userId, otp_code, token_id);
			} else {
				throw new Error(INVALID_VERIFICATION_CODE);
			}
		})
		.then(() => {
			return res.json({ message: TOKEN_REMOVED });
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/deleteHmacToken',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUserStats = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/getUserStats',
		req.auth.sub
	);
	const user_id = req.auth.sub.id;

	toolsLib.user.getUserStatsByKitId(user_id, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((stats) => {
			return res.json(stats);
		})
		.catch((err) => {
			loggerUser.error('controllers/user/getUserStats', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const userCheckTransaction = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/userCheckTransaction auth',
		req.auth
	);

	const {
		currency,
		transaction_id,
		address,
		network,
		is_testnet
	} = req.swagger.params;

	if (!currency.value || typeof currency.value !== 'string') {
		loggerUser.error(
			req.uuid,
			'controllers/user/userCheckTransaction invalid currency',
			currency.value
		);
		return res.status(400).json({ message: 'Invalid currency' });
	}

	if (!transaction_id.value || typeof transaction_id.value !== 'string') {
		loggerUser.error(
			req.uuid,
			'controllers/user/userCheckTransaction invalid transaction_id',
			transaction_id.value
		);
		return res.status(400).json({ message: 'Invalid Transaction Id' });
	}

	if (!address.value || typeof address.value !== 'string') {
		loggerUser.error(
			req.uuid,
			'controllers/user/userCheckTransaction invalid address',
			address.value
		);
		return res.status(400).json({ message: 'Invalid address' });
	}

	if (!network.value || typeof network.value !== 'string') {
		loggerUser.error(
			req.uuid,
			'controllers/user/userCheckTransaction invalid network',
			network.value
		);
		return res.status(400).json({ message: 'Invalid network' });
	}

	toolsLib.wallet.checkTransaction(currency.value, transaction_id.value, address.value, network.value, is_testnet.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((transaction) => {
			return res.json({ message: 'Success', transaction });
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/userCheckTransaction catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const addUserBank = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/addUserBank auth',
		req.auth
	);
	let email = req.auth.sub.email;
	let data = req.swagger.params.data.value;

	if (!data.type) {
		return res.status(400).json({ message: 'No type is selected' });
	}

	let bank_account = {};

	toolsLib.user.getUserByEmail(email, false)
		.then(async (user) => {
			if (!user) {
				throw new Error('User not found');
			}

			if (!toolsLib.getKitConfig().user_payments) {
				throw new Error('Payment system fields are not defined yet');
			}

			if (!toolsLib.getKitConfig().user_payments[data.type]) {
				throw new Error('Payment system fields are not defined yet');
			}

			each(toolsLib.getKitConfig().user_payments[data.type].data, ({ required, key }) => {
				if (required && !Object.prototype.hasOwnProperty.call(data, key)) {
					throw new Error(`Missing field: ${key}`);
				}
				if (Object.prototype.hasOwnProperty.call(data, key)) {
					bank_account[key] = data[key];
				}
			});

			if (Object.keys(bank_account).length === 0) {
				throw new Error('No payment system fields to add');
			}

			bank_account.id = crypto.randomBytes(8).toString('hex');
			bank_account.status = VERIFY_STATUS.PENDING;

			let newBank = user.bank_account;
			newBank.push(bank_account);

			const updatedUser = await user.update(
				{ bank_account: newBank },
				{ fields: ['bank_account'] }
			);

			return res.json(updatedUser.bank_account);
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/addUserBank catch', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getUserSessions = (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/user/getUserSessions/auth', req.auth);

	const { limit, status, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	const user_id = req.auth.sub.id;

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserSessions invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getExchangeUserSessions({
		user_id: user_id,
		status: status.value,
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: format.value
	}
	)
		.then((data) => {
			if (format.value === 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/getUserSessions', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const revokeUserSession = (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/user/revokeUserSession/auth', req.auth);

	const { session_id } = req.swagger.params.data.value;

	const user_id = req.auth.sub.id;

	toolsLib.user.revokeExchangeUserSession(session_id, user_id)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/revokeUserSession', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const userLogout = (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/user/userLogout/auth', req.auth);

	const user_id = req.auth.sub.id;

	const bearer = req.headers['authorization'];
	const tokenString = bearer.split(' ')[1];

	toolsLib.security.findSession(tokenString)
		.then((session) => {
			return toolsLib.user.revokeExchangeUserSession(session.id, user_id);
		})
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/userLogout', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const userDelete = (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/user/userDelete/auth', req.auth);

	const { email_code, otp_code } = req.swagger.params.data.value;
	const user_id = req.auth.sub.id;

	loggerUser.verbose(
		req.uuid,
		'controllers/user/userDelete',
		'user_id',
		user_id,
		'email_code',
		email_code
	);
	toolsLib.security.verifyOtpBeforeAction(user_id, otp_code)
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}

			return toolsLib.security.confirmByEmail(user_id, email_code);
		})
		.then((confirmed) => {
			if (confirmed) {
				return toolsLib.user.deleteKitUser(user_id);
			} else {
				throw new Error(INVALID_VERIFICATION_CODE);
			}
		})
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/userDelete', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUserBalanceHistory = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/getUserBalanceHistory/auth',
		req.auth
	);
	const user_id = req.auth.sub.id;
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (start_date.value && !isDate(start_date.value)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserBalanceHistory invalid start_date',
			start_date.value
		);
		return res.status(400).json({ message: 'Invalid start date' });
	}

	if (end_date.value && !isDate(end_date.value)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserBalanceHistory invalid end_date',
			end_date.value
		);
		return res.status(400).json({ message: 'Invalid end date' });
	}

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserBalanceHistory invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	if (!user_id || !isInteger(user_id)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/getUserBalanceHistory invalid user_id',
			user_id
		);
		return res.status(400).json({ message: 'Invalid user id' });
	}

	toolsLib.user.getUserBalanceHistory({
		user_id,
		limit: limit.value,
		page: page.value,
		orderBy: order_by.value,
		order: order.value,
		startDate: start_date.value,
		endDate: end_date.value,
		format: format.value
	})
		.then((data) => {
			if (format.value === 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-balance_history.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerUser.error(
				req.uuid,
				'controllers/user/getUserBalanceHistory',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const fetchUserProfitLossInfo = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/fetchUserProfitLossInfo/auth',
		req.auth
	);

	const user_id = req.auth.sub.id;

	toolsLib.user.fetchUserProfitLossInfo(user_id)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/fetchUserProfitLossInfo', err.message);
			return res.status(err.statusCode || 400).json({ message: 'Something went wrong' });
		});
};


module.exports = {
	signUpUser,
	getVerifyUser,
	verifyUser,
	loginPost,
	verifyToken,
	requestResetPassword,
	resetPassword,
	getUser,
	updateSettings,
	changePassword,
	confirmChangePassword,
	setUsername,
	getUserLogins,
	affiliationCount,
	getUserBalance,
	deactivateUser,
	createCryptoAddress,
	getHmacToken,
	createHmacToken,
	updateHmacToken,
	deleteHmacToken,
	getUserStats,
	userCheckTransaction,
	requestEmailConfirmation,
	addUserBank,
	revokeUserSession,
	getUserSessions,
	userLogout,
	userDelete,
	getUserBalanceHistory,
	fetchUserProfitLossInfo
};
