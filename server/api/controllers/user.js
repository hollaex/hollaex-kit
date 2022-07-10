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
	SERVICE_NOT_SUPPORTED,
	USER_EMAIL_NOT_VERIFIED,
	VERIFICATION_EMAIL_MESSAGE,
	TOKEN_REMOVED,
	INVALID_CREDENTIALS,
	USER_NOT_VERIFIED,
	USER_NOT_ACTIVATED,
	INVALID_OTP_CODE,
	SIGNUP_NOT_AVAILABLE,
	PROVIDE_VALID_EMAIL,
	INVALID_PASSWORD,
	USER_EXISTS,
	USER_EMAIL_IS_VERIFIED,
	INVALID_VERIFICATION_CODE
} = require('../../messages');
const { DEFAULT_ORDER_RISK_PERCENTAGE, EVENTS_CHANNEL, API_HOST, DOMAIN } = require('../../constants');
const { all } = require('bluebird');
const { each } = require('lodash');
const { publisher } = require('../../db/pubsub');
const { isDate } = require('moment');

const VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};

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
		.then(() => {
			if (!toolsLib.getKitConfig().new_user_is_activated) {
				throw new Error(SIGNUP_NOT_AVAILABLE);
			}

			if (!email || typeof email !== 'string' || !isEmail(email)) {
				throw new Error(PROVIDE_VALID_EMAIL);
			}

			if (!toolsLib.security.isValidPassword(password)) {
				throw new Error(INVALID_PASSWORD);
			}

			return toolsLib.database.findOne('user', {
				where: { email },
				attributes: ['email']
			});
		})
		.then((user) => {
			if (user) {
				throw new Error(USER_EXISTS);
			}
			return toolsLib.database.getModel('sequelize').transaction((transaction) => {
				return toolsLib.database.getModel('user').create({
					email,
					password,
					verification_level: 1,
					settings: INITIAL_SETTINGS()
				}, { transaction })
					.then((user) => {
						return all([
							toolsLib.user.createUserOnNetwork(email, {
								additionalHeaders: {
									'x-forwarded-for': req.headers['x-forwarded-for']
								}
							}),
							user
						]);
					})
					.then(([networkUser, user]) => {
						return user.update(
							{ network_id: networkUser.id },
							{ fields: ['network_id'], returning: true, transaction }
						);
					});
			});
		})
		.then((user) => {
			return all([
				toolsLib.user.getVerificationCodeByUserId(user.id),
				user
			]);
		})
		.then(([verificationCode, user]) => {
			publisher.publish(EVENTS_CHANNEL, JSON.stringify({
				type: 'user',
				data: {
					action: 'signup',
					user_id: user.id
				}
			}));
			sendEmail(
				MAILTYPE.SIGNUP,
				email,
				verificationCode.code,
				{}
			);

			if (referral) {
				toolsLib.user.checkAffiliation(referral, user.id);
			}

			return res.status(201).json({ message: USER_REGISTERED });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/signUpUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getVerifyUser = (req, res) => {
	let email = req.swagger.params.email.value;
	const verification_code = req.swagger.params.verification_code.value;
	const resendEmail = req.swagger.params.resend.value;
	const domain = req.headers['x-real-origin'];
	let promiseQuery;

	if (email && typeof email === 'string' && isEmail(email)) {
		email = email.toLowerCase();
		promiseQuery = toolsLib.user.getVerificationCodeByUserEmail(email)
			.then((verificationCode) => {
				if (verificationCode.verified) {
					throw new Error(USER_EMAIL_IS_VERIFIED);
				}
				if (resendEmail) {
					sendEmail(
						MAILTYPE.SIGNUP,
						email,
						verificationCode.code,
						{},
						domain
					);
				}
				return res.json({
					email,
					verification_code: verificationCode.code,
					message: VERIFICATION_EMAIL_MESSAGE
				});
			});
	} else if (verification_code && typeof verification_code === 'string' && isUUID(verification_code)) {
		promiseQuery = toolsLib.user.getUserEmailByVerificationCode(verification_code)
			.then((userEmail) => {
				return res.json({
					email: userEmail,
					verification_code,
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
			let errorMessage = errorMessageConverter(err);

			if (errorMessage === USER_NOT_FOUND) {
				errorMessage = VERIFICATION_EMAIL_MESSAGE;
			}

			return res.status(err.statusCode || 400).json({ message: errorMessage });
		});
};

const verifyUser = (req, res) => {
	const { verification_code } = req.swagger.params.data.value;
	let { email } = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];

	if (!email || typeof email !== 'string' || !isEmail(email)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/verifyUser invalid email',
			email
		);
		return res.status(400).json({ message: 'Invalid Email' });
	}

	email = email.toLowerCase();

	toolsLib.database.findOne('user', {
		where: { email },
		attributes: ['id', 'email', 'settings', 'network_id']
	})
		.then((user) => {
			return all([
				toolsLib.user.getVerificationCodeByUserId(user.id),
				user
			]);
		})
		.then(([verificationCode, user]) => {
			if (verificationCode.verified) {
				throw new Error(USER_EMAIL_IS_VERIFIED);
			}

			if (verification_code !== verificationCode.code) {
				throw new Error(INVALID_VERIFICATION_CODE);
			}

			return all([
				user,
				verificationCode.update(
					{ verified: true },
					{ fields: ['verified'] }
				)
			]);
		})
		.then(([user]) => {
			publisher.publish(EVENTS_CHANNEL, JSON.stringify({
				type: 'user',
				data: {
					action: 'verify',
					user_id: user.id
				}
			}));
			sendEmail(
				MAILTYPE.WELCOME,
				user.email,
				{},
				user.settings,
				domain
			);
			return res.json({ message: USER_VERIFIED });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/verifyUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const loginPost = (req, res) => {
	const {
		password,
		otp_code,
		captcha,
		service
	} = req.swagger.params.authentication.value;
	let { email } = req.swagger.params.authentication.value;
	const ip = req.headers['x-real-ip'];
	const device = req.headers['user-agent'];
	const domain = req.headers['x-real-origin'];
	const origin = req.headers.origin;
	const referer = req.headers.referer;
	const time = new Date();

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
		.then((user) => {
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

			return all([
				user,
				toolsLib.security.validatePassword(user.password, password)
			]);
		})
		.then(([user, passwordIsValid]) => {
			if (!passwordIsValid) {
				throw new Error(INVALID_CREDENTIALS);
			}

			if (!user.otp_enabled) {
				return all([user, toolsLib.security.checkCaptcha(captcha, ip)]);
			} else {
				return all([
					user,
					toolsLib.security.verifyOtpBeforeAction(user.id, otp_code).then((validOtp) => {
						if (!validOtp) {
							throw new Error(INVALID_OTP_CODE);
						} else {
							return toolsLib.security.checkCaptcha(captcha, ip);
						}
					})
				]);
			}
		})
		.then(([user]) => {
			if (ip) {
				toolsLib.user.registerUserLogin(user.id, ip, {
					device,
					domain,
					origin,
					referer
				});
			}
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
			return res.status(201).json({
				token: toolsLib.security.issueToken(
					user.id,
					user.network_id,
					email,
					ip,
					user.is_admin,
					user.is_support,
					user.is_supervisor,
					user.is_kyc,
					user.is_communicator
				)
			});
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/loginPost catch', err.message);
			return res.status(err.statusCode || 403).json({ message: errorMessageConverter(err) });
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
	const email = req.auth.sub.email;

	toolsLib.user.getUserByEmail(email, true, true, {
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
	const domain = `${API_HOST}${req.swagger.swaggerObject.basePath}`;

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
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

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
		limit: limit.value,
		page: page.value,
		orderBy: order_by.value,
		order: order.value,
		startDate: start_date.value,
		endDate: end_date.value,
		format: format.value
	})
		.then((data) => {
			if (format.value) {
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
	toolsLib.user.getAffiliationCount(user_id)
		.then((num) => {
			loggerUser.verbose(req.uuid, 'controllers/user/affiliationCount', num);
			return res.json({ count: num });
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
	const { name, otp_code, email_code } = req.swagger.params.data.value;

	loggerUser.verbose(
		req.uuid,
		'controllers/user/createHmacToken data',
		name,
		otp_code,
		email_code,
		ip
	);

	toolsLib.security.confirmByEmail(userId, email_code)
		.then((confirmed) => {
			if (confirmed) {
				// TODO check for the name duplication
				return toolsLib.security.createUserKitHmacToken(userId, otp_code, ip, name);
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
		ip
	);

	whitelisted_ips.forEach((ip) => {
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

const addUserBank = (req, res) =>  {
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
				throw new Error ('Payment system fields are not defined yet');
			}

			if (!toolsLib.getKitConfig().user_payments[data.type]) {
				throw new Error ('Payment system fields are not defined yet');
			}

			each(toolsLib.getKitConfig().user_payments[data.type].data, ({ required, key }) => {
				if (required && !Object.prototype.hasOwnProperty.call(data, key)) {
					throw new Error (`Missing field: ${key}`);
				}
				if (Object.prototype.hasOwnProperty.call(data, key)) {
					bank_account[key] = data[key];
				}
			});
		
			if (Object.keys(bank_account).length === 0) {
				throw new Error ('No payment system fields to add');
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
	addUserBank
};
