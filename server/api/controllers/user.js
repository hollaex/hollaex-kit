'use strict';

const { isEmail, isUUID } = require('validator');
const toolsLib = require('hollaex-tools-lib');
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
const { DEFAULT_ORDER_RISK_PERCENTAGE } = require('../../constants');
const { all } = require('bluebird');
const { isString } = require('lodash');
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
		email,
		password,
		captcha,
		referral
	} = req.swagger.params.signup.value;
	const ip = req.headers['x-real-ip'];
	loggerUser.debug(
		req.uuid,
		'controllers/user/signUpUser',
		req.swagger.params.signup.value,
		ip
	);

	toolsLib.security.checkCaptcha(captcha, ip)
		.then(() => {
			if (!toolsLib.getKitConfig().new_user_is_activated) {
				throw new Error(SIGNUP_NOT_AVAILABLE);
			}

			if (!email || !isEmail(email)) {
				throw new Error(PROVIDE_VALID_EMAIL);
			}

			if (!toolsLib.security.isValidPassword(password)) {
				throw new Error(INVALID_PASSWORD);
			}

			return toolsLib.database.findOne('user', {
				where: { email: email.toLowerCase() },
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
							toolsLib.user.createUserOnNetwork(email),
							user
						]);
					})
					.then(([ networkUser, user ]) => {
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
		.then(([ verificationCode, user ]) => {
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
	const email = req.swagger.params.email.value;
	const verification_code = req.swagger.params.verification_code.value;
	const resendEmail = req.swagger.params.resend.value;
	const domain = req.headers['x-real-origin'];
	let promiseQuery;

	if (email && isEmail(email)) {
		promiseQuery = toolsLib.user.getVerificationCodeByUserEmail(email)
			.then((verificationCode) => {
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
	} else if (verification_code && isUUID(verification_code)) {
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
	const { email, verification_code } = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];

	return toolsLib.database.findOne('user', {
		where: { email },
		attributes: ['id', 'email', 'settings', 'network_id']
	})
		.then((user) => {
			return all([
				toolsLib.user.getVerificationCodeByUserId(user.id),
				user
			]);
		})
		.then(([ verificationCode, user ]) => {
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
		.then(([ user ]) => {
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
		email,
		password,
		otp_code,
		captcha,
		service
	} = req.swagger.params.authentication.value;
	const ip = req.headers['x-real-ip'];
	const device = req.headers['user-agent'];
	const domain = req.headers['x-real-origin'];
	const origin = req.headers.origin;
	const referer = req.headers.referer;
	const time = new Date();

	toolsLib.user.getUserByEmail(email.toLowerCase())
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
		.then(([ user, passwordIsValid ]) => {
			if (!passwordIsValid) {
				throw new Error(INVALID_CREDENTIALS);
			}

			if (!user.otp_enabled) {
				return all([ user, toolsLib.security.checkCaptcha(captcha, ip) ]);
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
		.then(([ user ]) => {
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
			if (!service) {
				sendEmail(MAILTYPE.LOGIN, email, data, {}, domain);
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

const requestResetPassword = (req, res) => {
	const email = req.swagger.params.email.value;
	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	const captcha = req.swagger.params.captcha.value;

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

	toolsLib.user.getUserByEmail(email, true, true)
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
	loggerUser.debug(req.uuid, 'controllers/user/changePassword', req.auth.sub);
	const email = req.auth.sub.email;
	const { old_password, new_password } = req.swagger.params.data.value;
	loggerUser.debug(
		req.uuid,
		'controllers/user/changePassword',
		req.swagger.params.data.value
	);

	toolsLib.security.changeUserPassword(email, old_password, new_password)
		.then(() => res.json({ message: 'Success' }))
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/changePassword', err.message);
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

	toolsLib.wallet.getUserBalanceByKitId(user_id)
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
		network: network.value
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

	const { id } = req.auth.sub;
	const ip = req.headers['x-real-ip'];
	const { name, otp_code } = req.swagger.params.data.value;

	toolsLib.security.createUserKitHmacToken(id, otp_code, ip, name)
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

const deleteHmacToken = (req, res) => {
	loggerUser.verbose(
		req.uuid,
		'controllers/user/deleteHmacToken auth',
		req.auth.sub
	);

	const { id } = req.auth.sub;
	const { token_id, otp_code } = req.swagger.params.data.value;

	toolsLib.security.deleteUserKitHmacToken(id, otp_code, token_id)
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

	toolsLib.user.getUserStatsByKitId(user_id)
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
	const transactionId = req.swagger.params.transaction_id.value;
	const address = req.swagger.params.address.value;
	const currency = req.swagger.params.currency.value;
	const isTestnet = req.swagger.params.is_testnet.value;

	toolsLib.wallet.checkTransaction(currency, transactionId, address, isTestnet)
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
	setUsername,
	getUserLogins,
	affiliationCount,
	getUserBalance,
	deactivateUser,
	createCryptoAddress,
	getHmacToken,
	createHmacToken,
	deleteHmacToken,
	getUserStats,
	userCheckTransaction
};
