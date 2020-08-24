'use strict';

const { all } = require('bluebird');
const { isEmail, isUUID } = require('validator');
const {
	isValidPassword,
	validatePassword,
	createResetPasswordCode,
	setUsedResetPasswordCode,
	findVerificationCodeByUserId,
	findVerificationCodeByUserEmail,
	findUserEmailByVerificationCode
} = require('../helpers/auth');
const { signFreshdesk, signZendesk } = require('../helpers/support');
const { checkCaptcha, issueToken } = require('../helpers/security');
const {
	findUser,
	getUserValuesByEmail,
	isValidUsername,
	updateUserSettings,
	findUserByEmail,
	checkUsernameIsTaken,
	INITIAL_SETTINGS,
	registerLogin,
	findUserLogins
} = require('../helpers/user');
const {
	checkAffiliation,
	getAffiliationCount
} = require('../helpers/affiliation');
const { getPagination, getTimeframe } = require('../helpers/general');
const { verifyOtpBeforeAction } = require('../helpers/otp');
const { getConfiguration } = require('../../init');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const { User } = require('../../db/models');
const { loggerUser } = require('../../config/logger');
const {
	USER_VERIFIED,
	INVALID_VERIFICATION_CODE,
	PROVIDE_VALID_EMAIL_CODE,
	USER_REGISTERED,
	PROVIDE_VALID_EMAIL,
	USER_EXISTS,
	INVALID_USERNAME,
	USER_NOT_FOUND,
	USERNAME_CANNOT_BE_CHANGED,
	SERVICE_NOT_SUPPORTED,
	SIGNUP_NOT_AVAILABLE,
	USER_NOT_VERIFIED,
	USER_NOT_ACTIVATED,
	INVALID_CREDENTIALS,
	INVALID_OTP_CODE,
	INVALID_PASSWORD,
	VERIFICATION_EMAIL_MESSAGE
} = require('../../messages');

const signUpUser = (req, res) => {
	const {
		email,
		password,
		captcha,
		referral
	} = req.swagger.params.signup.value;
	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	loggerUser.debug(
		req.uuid,
		'controllers/user/signUpUser',
		req.swagger.params.signup.value,
		ip
	);

	if (!getConfiguration().constants.new_user_is_activated) {
		return res.status(400).json({ message: SIGNUP_NOT_AVAILABLE });
	}

	if (!email || isEmail(email)) {
		return res.status(400).json({ message: PROVIDE_VALID_EMAIL });
	}

	checkCaptcha(captcha, ip)
		.then(() => {
			return User.findOne({
				where: { email: email.toLowerCase() },
				attributes: ['email']
			});
		})
		.then((user) => {
			if (user) {
				loggerUser.error(
					req.uuid,
					'controllers/user/signUpUser',
					USER_EXISTS,
					user.dataValues
				);
				const err = new Error(USER_EXISTS);
				err.status = 409;
				throw err;
			} else if (!isValidPassword(password)) {
				loggerUser.error(
					req.uuid,
					'controllers/user/signUpUser',
					INVALID_PASSWORD
				);
				throw new Error(INVALID_PASSWORD);
			}
			return User.create({
				email,
				password,
				settings: INITIAL_SETTINGS()
			});
		})
		.then((user) => {
			return all([ findVerificationCodeByUserId(user.id), user ]);
		})
		.then(([ verificationCode, user ]) => {
			sendEmail(
				MAILTYPE.SIGNUP,
				email,
				verificationCode.code,
				{},
				domain
			);
			checkAffiliation(referral, user.id);
			res.status(201).json({ message: USER_REGISTERED });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/signUpUser', err.message);
			let status = err.status || 400;
			let message = err.message;
			if (err.name === 'SequelizeValidationError') {
				message = err.errors[0].message;
			}
			res.status(status).json({ message });
		});
};

const getVerifyUser = (req, res) => {
	const email = req.swagger.params.email.value;
	const verification_code = req.swagger.params.verification_code.value;
	const resendEmail = req.swagger.params.resend.value;
	const domain = req.headers['x-real-origin'];
	let promiseQuery;

	if (email && isEmail(email)) {
		promiseQuery = findVerificationCodeByUserEmail(email)
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
				res.json({
					email,
					verification_code: verificationCode.code,
					message: VERIFICATION_EMAIL_MESSAGE
				});
			});
	} else if (verification_code && isUUID(verification_code)) {
		promiseQuery = findUserEmailByVerificationCode(verification_code)
			.then((userEmail) => {
				res.json({
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
			if (err.message === USER_NOT_FOUND) {
				return res.json({ message: VERIFICATION_EMAIL_MESSAGE });
			}
			res.status(err.status || 400).json({ message: err.message });
		});
};

const verifyUser = (req, res) => {
	const { email, verification_code } = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];

	findVerificationCodeByUserEmail(email)
		.then((verificationCode) => {
			if (verification_code !== verificationCode) {
				throw new Error(INVALID_VERIFICATION_CODE);
			}
			return verificationCode.update({ verified: true }, { returning: true });
		})
		.then((verificationCode) => {
			return findUser({
				where: { id: verificationCode.user_id },
				attributes: ['email', 'settings']
			});
		})
		.then((user) => {
			sendEmail(
				MAILTYPE.WELCOME,
				user.email,
				user.settings,
				domain
			);
			res.json({ message: USER_VERIFIED });
		})
		.catch((err) => {
			res.status(err.status || 400).json({ message: err.message });
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

	loggerUser.verbose(
		req.uuid,
		'controllers/user/loginPost',
		email,
		otp_code,
		captcha,
		service,
		ip
	);

	findUser({
		where: { email: email.toLowerCase() },
		attributes: [
			'id',
			'email',
			'password',
			'verification_level',
			'otp_enabled',
			'activated',
			'is_admin',
			'is_support',
			'is_supervisor',
			'is_kyc',
			'is_tech',
			'settings'
		]
	})
		.then((user) => {
			loggerUser.verbose(
				req.uuid,
				'controllers/user/loginPost',
				'successful credentials',
				user.dataValues
			);
			if (user.verification_level === 0) {
				throw new Error(USER_NOT_VERIFIED);
			} else if (!user.activated) {
				throw new Error(USER_NOT_ACTIVATED);
			}
			return all([
				user.dataValues,
				validatePassword(user.password, password)
			]);
		})
		.then(([user, isPasswordValid]) => {
			if (!isPasswordValid) {
				throw new Error(INVALID_CREDENTIALS);
			}

			if (!user.otp_enabled) {
				return all([user, checkCaptcha(captcha, ip)]);
			} else {
				return all([
					user,
					verifyOtpBeforeAction(user.id, otp_code).then((validOtp) => {
						if (!validOtp) {
							throw new Error(INVALID_OTP_CODE);
						} else {
							return all([checkCaptcha(captcha, ip)]);
						}
					})
				]);
			}
		})
		.then(([user]) => {
			loggerUser.debug(req.uuid, 'controllers/user/loginPost', ip);
			const data = {
				ip,
				time,
				device
			};

			registerLogin(user.id, ip, device, domain, origin, referer);
			if (!service) {
				sendEmail(MAILTYPE.LOGIN, email, data, user.settings, domain);
			} else {
				// This login is for a third party service e.g. FreshDesk
				if (service === 'freshdesk') {
					const url = signFreshdesk(user);
					// in case login is through freshdesk
					return res.status(201).json({ service, callbackUrl: url });
				} else if (service === 'zendesk') {
					const url = signZendesk(user);
					// in case login is through zendesk
					return res.status(201).json({ service, callbackUrl: url });
				} else {
					throw new Error(SERVICE_NOT_SUPPORTED);
				}
			}
			return res.status(201).json({
				token: issueToken(
					user.id,
					email,
					ip,
					user.is_admin,
					user.is_support,
					user.is_supervisor,
					user.is_kyc,
					user.is_tech
				)
			});
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controllers/user/loginPost catch', err);
			res.status(403).json({ message: err.message });
		});
};

const verifyToken = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/verifyToken', req.auth.sub);
	res.json({ message: 'Valid Token' });
};

const requestResetPassword = (req, res) => {
	const email = req.swagger.params.email.value;
	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	const captcha = req.swagger.params.captcha.value;

	findUserByEmail(email)
		.then((user) => {
			return Promise.all([createResetPasswordCode(user.id), user, checkCaptcha(captcha, ip)]);
		})
		.then(([code, user]) => {
			sendEmail(
				MAILTYPE.RESET_PASSWORD,
				email,
				{ code, ip },
				user.settings,
				domain
			);
			res.json({ message: `Password request sent to: ${email}` });
		})
		.catch((error) => {
			if (error.message === USER_NOT_FOUND) {
				return res.json({ message: `Password request sent to: ${email}` });
			}
			res.status(error.status || 400).json({ message: error.message });
		});
};

const resetPassword = (req, res) => {
	const { code, new_password } = req.swagger.params.data.value;
	if (!isValidPassword(new_password)) {
		return res.status(400).json({ message: INVALID_PASSWORD });
	}

	setUsedResetPasswordCode(code, new_password)
		.then(() => {
			res.json({ message: 'Password updated.' });
		})
		.catch((error) => {
			res.status(error.status || 400).json({ message: 'Invalid code' });
		});
};

const getUser = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/getUser', req.auth.sub);
	const email = req.auth.sub.email;

	getUserValuesByEmail(email)
		.then((user) => res.json(user))
		.catch((error) => {
			loggerUser.error(req.uuid, 'controllers/user/getUser', error);
			res.status(error.status || 400).json({ message: error.message });
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

	findUser({
		where: { email },
		attributes: ['id', 'settings']
	})
		.then(updateUserSettings(data))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user))
		.catch((error) => {
			loggerUser.error(req.uuid, 'controllers/user/updateSettings', error);
			res.status(error.status || 400).json({ message: error.message });
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

	if (old_password === new_password) {
		loggerUser.error(
			req.uuid,
			'controllers/user/changePassword',
			'Passwords must be different'
		);
		return res.status(400).json({ message: 'Passwords must be different' });
	} else if (!isValidPassword(new_password)) {
		loggerUser.error(
			req.uuid,
			'controllers/user/changePassword',
			INVALID_PASSWORD
		);
		return res.status(400).json({ message: INVALID_PASSWORD });
	}

	findUser({
		where: { email },
		attributes: ['id', 'password']
	})
		.then((user) => {
			return validatePassword(user.password, old_password).then(
				(isPasswordValid) => {
					if (!isPasswordValid) {
						throw new Error('Invalid password');
					}
					return user;
				}
			);
		})
		.then((user) => {
			return user.update({ password: new_password });
		})
		.then(() => res.json({ message: 'Success' }))
		.catch((error) => {
			loggerUser.error(req.uuid, 'controllers/user/changePassword', error);
			res.status(error.status || 400).json({ message: error.message });
		});
};

const setUsername = (req, res) => {
	loggerUser.debug(req.uuid, 'controllers/user/setUsername', req.auth.sub);
	loggerUser.debug(
		req.uuid,
		'controllers/user/setUsername',
		req.swagger.params.data.value
	);
	const { id } = req.auth.sub;
	const { username } = req.swagger.params.data.value;

	if (!isValidUsername(username)) {
		return res.status(400).json({ message: INVALID_USERNAME });
	}

	findUser({
		where: { id },
		attributes: ['id', 'username', 'settings']
	})
		.then((user) => {
			loggerUser.debug(
				req.uuid,
				'controllers/user/setUsername',
				user.dataValues
			);
			if (user.settings.usernameIsSet) {
				throw new Error(USERNAME_CANNOT_BE_CHANGED);
			}
			return all([user, checkUsernameIsTaken(username)]);
		})
		.then(([ user ]) => {
			return user.update(
				{
					username,
					settings: {
						...user.settings,
						usernameIsSet: true
					}
				},
				{ fields: ['username', 'settings'] }
			);
		})
		.then(() => res.json({ message: 'Username successfully changed' }))
		.catch((error) => {
			loggerUser.error(req.uuid, 'controllers/user/setUsername', error);
			res.status(error.status || 400).json({ message: error.message });
		});
};

const getUserLogins = (req, res) => {
	const user_id = req.auth.sub.id;
	const { limit, page, start_date, end_date } = req.swagger.params;

	findUserLogins(user_id, getPagination(limit, page), getTimeframe(start_date, end_date))
		.then((logins) => {
			return res.json(logins);
		})
		.catch((error) => {
			loggerUser.error(req.uuid, 'controllers/user/getUserLogins', error);
			return res
				.status(error.status || 400)
				.json({ message: error.message });
		});
};

const affiliationCount = (req, res) => {
	const user_id = req.auth.sub.id;
	getAffiliationCount(user_id)
		.then((num) => {
			loggerUser.verbose(req.uuid, 'controllers/user/affiliationCount', num);
			return res.json({ count: num });
		})
		.catch((error) => {
			loggerUser.error(req.uuid, 'controllers/user/affiliationCount', error);
			return res
				.status(error.status || 400)
				.json({ message: error.message });
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
	affiliationCount
};
