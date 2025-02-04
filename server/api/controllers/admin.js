'use strict';

const { loggerAdmin } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { cloneDeep, pick } = require('lodash');
const { all } = require('bluebird');
const { INIT_CHANNEL, ROLES } = require('../../constants');
const { USER_NOT_FOUND, API_KEY_NOT_PERMITTED, PROVIDE_VALID_EMAIL, INVALID_PASSWORD, USER_EXISTS, NO_DATA_FOR_CSV, INVALID_VERIFICATION_CODE, INVALID_OTP_CODE, REFERRAL_HISTORY_NOT_ACTIVE } = require('../../messages');
const { sendEmail, testSendSMTPEmail, sendRawEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const { errorMessageConverter } = require('../../utils/conversion');
const { isDate } = require('moment');
const { isEmail } = require('validator');
const { publisher } = require('../../db/pubsub');
const { parse } = require('json2csv');
const crypto = require('crypto');

const VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};

const getAdminKit = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getAdminKit', req.auth.sub);
	try {
		const data = cloneDeep({
			kit: toolsLib.getKitConfig(),
			secrets: toolsLib.getKitSecrets()
		});

		// Mask certain secrets
		data.secrets = toolsLib.maskSecrets(data.secrets);
		return res.json(data);
	} catch (err) {
		loggerAdmin.error(req.uuid, 'controllers/admin/getAdminKit', err.message);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
	}
};

const putNetworkCredentials = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/putNetworkCredentials auth', req.auth.sub);

	const { api_key, api_secret } = req.swagger.params.data.value;

	toolsLib.updateNetworkKeySecret(api_key, api_secret)
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/putNetworkCredentials', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const createInitialAdmin = (req, res) => {
	const { email, password } = req.swagger.params.data.value;

	loggerAdmin.info(req.uuid, 'controllers/admin/createInitialAdmin email', email);

	all([
		toolsLib.database.findOne('user', { raw: true }),
		toolsLib.database.findOne('status', { raw: true })
	])
		.then(([user, status]) => {
			if (status.initialized) {
				throw new Error('Exchange is already initialized');
			}
			if (user) {
				throw new Error('Admin already exists');
			}

			if (!email || !isEmail(email)) {
				throw new Error(PROVIDE_VALID_EMAIL);
			}
			if (!toolsLib.security.isValidPassword(password)) {
				throw new Error(INVALID_PASSWORD);
			}

			return toolsLib.user.createUser(email, password, {
				role: 'admin',
				id: 1,
				email_verified: true,
				additionalHeaders: {
					'x-forwarded-for': req.headers['x-forwarded-for']
				}
			});
		})
		.then(() => {
			return toolsLib.setExchangeInitialized();
		})
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.status(201).json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/createInitialAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putAdminKit = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/putAdminKit', req.auth.sub);
	const data = req.swagger.params.data.value;

	if (data.kit) {
		if (data.kit.setup_completed) {
			loggerAdmin.error(req.uuid, 'controllers/admin/putAdminKit', 'Cannot update setup_completed value through this endpoint');
			return res.status(400).json({ message: 'Cannot update setup_completed value through this endpoint' });
		}
	}

	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.updateKitConfigSecrets(data, req.auth.scopes, auditInfo)
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/putAdminKit', err);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getUsersAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getUsers/auth', req.auth);

	const { 
		id, 
		search,
		type,
		pending,
		pending_type,
		limit,
		page,
		order_by,
		order,
		start_date,
		end_date,
		format,
		email,
		username,
		full_name,
		dob_start_date,
		dob_end_date,
		gender,
		nationality,
		verification_level,
		email_verified,
		otp_enabled,
		phone_number,
		kyc,
		bank,
		id_number
	
	} = req.swagger.params;

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUsersAdmin invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}

	toolsLib.user.getAllUsersAdmin({
		id: id.value,
		search: search.value,
		pending: pending.value,
		pending_type: pending_type.value,
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: format.value,
		type: type.value,
		email: email.value,
		username: username.value,
		full_name: full_name.value,
		dob_start_date: dob_start_date.value,
		dob_end_date: dob_end_date.value,
		gender: gender.value,
		nationality: nationality.value,
		verification_level: verification_level.value,
		email_verified: email_verified.value,
		otp_enabled: otp_enabled.value,
		phone_number: phone_number.value,
		kyc: kyc.value,
		bank: bank.value,
		id_number: id_number.value,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			if (format.value === 'csv') {
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getUsers', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putUserRole = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/putUserRole/auth',
		req.auth
	);

	const user_id = req.swagger.params.user_id.value;
	const { role } = req.swagger.params.data.value;

	toolsLib.user.updateUserRole(user_id, role)
		.then((user) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json(user);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putUserRole',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putUserMeta = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/putUserMeta auth',
		req.auth
	);

	const user_id = req.swagger.params.user_id.value;
	const { meta, overwrite } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/putUserMeta',
		'user_id',
		user_id,
		'meta',
		meta,
		'overwrite',
		overwrite
	);
	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.user.updateUserMeta(user_id, meta, { overwrite }, auditInfo)
		.then((user) => {
			loggerAdmin.verbose(
				req.uuid,
				'controllers/admin/putUserMeta result',
				user
			);
			return res.json(user);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putUserMeta',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putUserNote = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/userNote/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;
	const { note } = req.swagger.params.data.value;

	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.user.updateUserNote(user_id, note, auditInfo)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/userNote',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putUserDiscount = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/putUserDiscount auth',
		req.auth
	);

	const user_id = req.swagger.params.user_id.value;
	const { discount } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/putUserDiscount',
		'user_id',
		user_id,
		'discount rate',
		discount
	);
	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.user.updateUserDiscount(user_id, discount, auditInfo)
		.then((data) => {
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/putUserDiscount successful'
			);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putUserDiscount err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getAdminUserBalance = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserBalance/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;

	toolsLib.wallet.getUserBalanceByKitId(user_id, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((balance) => {
			return res.json(balance);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getAdminUserBalance',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const activateUser = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/activateUser auth',
		req.auth
	);
	const { user_id, activated } = req.swagger.params.data.value;

	let promiseQuery;

	if (activated === true) {
		promiseQuery = toolsLib.user.unfreezeUserById(user_id);
	} else if (activated === false) {
		promiseQuery = toolsLib.user.freezeUserById(user_id);
	}

	promiseQuery
		.then((user) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			const message = `Account ${user.email} has been ${activated ? 'activated' : 'deactivated'
			}`;
			return res.json({ message });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/activateUser',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getAdminBalance = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserBalance/auth',
		req.auth
	);

	toolsLib.wallet.getKitBalance({
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((balance) => {
			return res.json(balance);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getAdminBalance',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const upgradeUser = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/upgradeUser auth',
		req.auth
	);

	const domain = req.headers['x-real-origin'];

	const { user_id, verification_level } = req.swagger.params.data.value;

	toolsLib.user.changeUserVerificationLevelById(user_id, verification_level, domain)
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/upgradeUser',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const verifyEmailUser = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/verifyEmailUser auth',
		req.auth
	);

	const { user_id } = req.swagger.params.data.value;

	toolsLib.user.verifyUserEmailByKitId(user_id)
		.then((user) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			sendEmail(
				MAILTYPE.WELCOME,
				user.email,
				{},
				user.settings
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/verifyEmailUser',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const flagUser = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/flagUser/auth', req.auth);
	const { user_id } = req.swagger.params.data.value;

	toolsLib.user.toggleFlaggedUserById(user_id)
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/flagUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getAdminUserLogins = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserLogins/auth',
		req.auth
	);
	const { user_id, status, country, ip, limit, page, start_date, order_by, order, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (start_date.value && !isDate(start_date.value)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getAdminUserLogins invalid start_date',
			start_date.value
		);
		return res.status(400).json({ message: 'Invalid start date' });
	}

	if (end_date.value && !isDate(end_date.value)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getAdminUserLogins invalid end_date',
			end_date.value
		);
		return res.status(400).json({ message: 'Invalid end date' });
	}

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getAdminUserLogins invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getUserLogins({
		userId: user_id.value,
		status: status.value,
		country: country.value,
		ip: ip.value,
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
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getAdminUserLogins/catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getUserAudits = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getUserAudits/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;
	const { limit, page, order_by, order, start_date, end_date, format, subject } = req.swagger.params;

	if (start_date.value && !isDate(start_date.value)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUserAudits invalid start_date',
			start_date.value
		);
		return res.status(400).json({ message: 'Invalid start date' });
	}

	if (end_date.value && !isDate(end_date.value)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUserAudits invalid end_date',
			end_date.value
		);
		return res.status(400).json({ message: 'Invalid end date' });
	}

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUserAudits invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getUserAudits({
		user_id,
		subject: subject.value,
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
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-audits.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getUserAudits',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getCoins = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/coin/getCoins/auth',
		req.auth
	);

	const currency = req.swagger.params.currency.value;

	if (currency && !toolsLib.subscribedToCoin(currency)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/coin/getCoins',
			`Invalid currency: "${currency}"`
		);
		return res.status(400).json({ message: `Invalid currency: "${currency}"` });
	}

	try {
		if (currency) {
			return res.json(toolsLib.getKitCoin(currency));
		} else {
			return res.json(toolsLib.getKitCoinsConfig());
		}
	} catch (err) {
		loggerAdmin.error(
			req.uuid,
			'controllers/coin/getCoins',
			err.message
		);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
	}
};

const getPairs = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/coin/getPairs/auth',
		req.auth
	);

	const pair = req.swagger.params.pair.value;

	if (pair && !toolsLib.subscribedToPair(pair)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/coin/getPairs',
			`Invalid pair: "${pair}"`
		);
		return res.status(400).json({ message: `Invalid pair: "${pair}"` });
	}

	try {
		if (pair) {
			return res.json(toolsLib.getKitPair(pair));
		} else {
			return res.json(toolsLib.getKitPairsConfig());
		}
	} catch (err) {
		loggerAdmin.error(
			req.uuid,
			'controllers/coin/getPairs',
			err.message
		);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
	}
};

const transferFund = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/transferFund auth',
		req.auth
	);

	const data = req.swagger.params.data.value;

	toolsLib.wallet.transferAssetByKitIds(data.sender_id, data.receiver_id, data.currency, data.amount, data.description, data.email, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/transferFund',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const completeExchangeSetup = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/completeExchangeSetup auth',
		req.auth
	);

	toolsLib.setExchangeSetupCompleted()
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/completeExchangeSetup catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const uploadImage = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/uploadImage auth',
		req.auth
	);

	const name = req.swagger.params.name.value;
	const file = req.swagger.params.file.value;

	toolsLib.storeImageOnNetwork(file.buffer, name, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/uploadImage catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getOperators = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getOperators auth',
		req.auth
	);

	const { limit, page, order_by, order } = req.swagger.params;

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getOperators invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getExchangeOperators({
		limit: limit.value,
		page: page.value,
		orderBy: order_by.value,
		order: order.value
	})
		.then((operators) => {
			return res.json(operators);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getOperators catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const inviteNewOperator = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/inviteNewOperator auth',
		req.auth
	);

	const invitingEmail = req.auth.sub.email;
	const { email, role } = req.swagger.params;

	if (!email.value || typeof email.value !== 'string' || !isEmail(email.value)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/inviteNewOperator invalid email',
			email.value
		);
		return res.status(400).json({ message: 'Invalid Email' });
	}

	if (!role.value || typeof role.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/inviteNewOperator invalid role',
			role.value
		);
		return res.status(400).json({ message: 'Invalid role' });
	}

	toolsLib.user.inviteExchangeOperator(invitingEmail, email.value, role.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/inviteNewOperator err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getExchangeGeneratedFees = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getExchangeGeneratedFees auth',
		req.auth
	);

	const { start_date, end_date, format } = req.swagger.params;

	toolsLib.order.getGeneratedFees(start_date.value, end_date.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			if (format.value === 'csv') {
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				const parsedData = data && Object.values(data)[0];
				if (!parsedData || parsedData?.length === 0) {
					throw new Error(NO_DATA_FOR_CSV);
				}
				const csv = parse(parsedData, Object.keys(parsedData[0]));

				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-fees.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(csv);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getExchangeGeneratedFees catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const settleFees = (req, res) => {
	const { user_id } = req.swagger.params;
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/settleFees auth',
		req.auth,
		user_id.value
	);

	toolsLib.order.settleFees({
		user_id: user_id.value,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, 'post', { user_id  });
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/settleFees catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const mintAsset = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/mintAsset auth',
		req.auth
	);

	const {
		user_id,
		currency,
		amount,
		description,
		transaction_id,
		status,
		email,
		fee,
		address
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/mintAsset user_id',
		user_id,
		'currency',
		currency,
		'amount',
		amount,
		'transaction_id',
		transaction_id,
		'status',
		status,
		'fee',
		fee,
		'address',
		address
	);

	toolsLib.user.getUserByKitId(user_id)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return toolsLib.wallet.mintAssetByNetworkId(
				user.network_id,
				currency,
				amount,
				{
					fee,
					description,
					transactionId: transaction_id,
					status,
					email,
					address,
					additionalHeaders: {
						'x-forwarded-for': req.headers['x-forwarded-for']
					}
				}
			);
		})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/mintAsset successful'
			);
			return res.status(201).json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/mintAsset err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putMint = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/putMint auth',
		req.auth
	);

	const {
		transaction_id,
		updated_transaction_id,
		updated_address,
		status,
		rejected,
		dismissed,
		processing,
		waiting,
		email,
		description
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/putMint transaction_id',
		transaction_id,
		'status',
		status,
		'rejected',
		rejected,
		'dismissed',
		dismissed,
		'processing',
		processing,
		'waiting',
		waiting,
		'updated_transaction_id',
		updated_transaction_id,
		'updated_address',
		updated_address,
		'description',
		description
	);

	toolsLib.wallet.updatePendingMint(transaction_id, {
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		updatedTransactionId: updated_transaction_id,
		updatedAddress: updated_address,
		email,
		updatedDescription: description,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/putMint successful'
			);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putMint err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const burnAsset = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/burnAsset auth',
		req.auth
	);

	const {
		user_id,
		currency,
		amount,
		description,
		transaction_id,
		status,
		email,
		fee,
		address
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/burnAsset user_id',
		user_id,
		'currency',
		currency,
		'amount',
		amount,
		'transaction_id',
		transaction_id,
		'status',
		status,
		'fee',
		fee,
		'address',
		address
	);

	toolsLib.user.getUserByKitId(user_id)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return toolsLib.wallet.burnAssetByNetworkId(
				user.network_id,
				currency,
				amount,
				{
					description,
					transactionId: transaction_id,
					status,
					email,
					fee,
					address,
					additionalHeaders: {
						'x-forwarded-for': req.headers['x-forwarded-for']
					}
				}
			);
		})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/burnAsset successful'
			);
			return res.status(201).json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/burnAsset err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putBurn = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/putBurn auth',
		req.auth
	);

	const {
		transaction_id,
		updated_transaction_id,
		updated_address,
		status,
		rejected,
		dismissed,
		processing,
		waiting,
		email,
		description
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/putBurn transaction_id',
		transaction_id,
		'status',
		status,
		'rejected',
		rejected,
		'dismissed',
		dismissed,
		'processing',
		processing,
		'waiting',
		waiting,
		'updated_transaction_id',
		updated_transaction_id,
		'updated_address',
		updated_address,
		'description',
		description
	);

	toolsLib.wallet.updatePendingBurn(transaction_id, {
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		updatedTransactionId: updated_transaction_id,
		updatedAddress: updated_address,
		email,
		updatedDescription: description,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/putBurn successful'
			);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putBurn err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const performDirectWithdrawalByAdmin = (req, res) => {
	const {
		user_id,
		address,
		currency,
		amount,
		network
	} = req.swagger.params.data.value;

	const userId = user_id;
	loggerAdmin.verbose(
		req.uuid,
		'controller/admin/performDirectWithdrawal auth',
		'address',
		address,
		'amount',
		amount,
		'currency',
		currency,
		'network',
		network
	);

	toolsLib.wallet.performDirectWithdrawal(
		userId,
		address,
		currency,
		amount,
		{
			network,
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.verbose(
				req.uuid,
				'controller/admin/performDirectWithdrawal done',
				'transaction_id',
				data.transaction_id,
				'fee',
				data.fee,
				data
			);
			return res.json({
				message: 'Withdrawal request is in the queue and will be processed.',
				id: data.id,
				transaction_id: data.transaction_id,
				amount: data.amount,
				currency: data.currency,
				fee: data.fee,
				fee_coin: data.fee_coin
			});
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controller/admin/performDirectWithdrawal',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const postKitUserMeta = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/postKitUserMeta', req.auth.sub);

	const { name, type, required, description } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/postKitUserMeta',
		'name',
		name,
		'type',
		type,
		'required',
		required,
		'description',
		description
	);

	toolsLib.addKitUserMeta(name, type, description, required)
		.then((result) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/postKitUserMeta', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getEmail = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getEmail', req.auth.sub);
	const { language, type } = req.swagger.params;
	try {
		const data = cloneDeep({
			email: toolsLib.getEmail()
		});

		return res.json(data['email'][language.value][type.value.toUpperCase()]);
	} catch (err) {
		loggerAdmin.error(req.uuid, 'controllers/admin/getEmail', err.message);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
	}
};


const putEmail = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/putEmail', req.auth.sub);

	const { language, type, html, title } = req.swagger.params.data.value;
	const data = cloneDeep({
		email: toolsLib.getEmail()
	});
	data['email'][language][type.toUpperCase()] = { html, title };
	toolsLib.updateEmail(data)
		.then(() => {
			return res.status(201).json({ message: 'Success' });

		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/putEmail', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});

};

const getEmailTypes = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getEmailTypes', req.auth.sub);
	const LANGUAGE_DEFAULT = 'en';
	try {
		const data = cloneDeep({
			email: toolsLib.getEmail()
		});

		let arrMailType = Object.keys(data['email'][LANGUAGE_DEFAULT]);
		arrMailType.sort((a, b) => {
			if (a < b) { return -1; }
			if (a > b) { return 1; }
			return 0;
		});

		return res.status(201).json(arrMailType);

	} catch (err) {
		loggerAdmin.error(req.uuid, 'controllers/admin/getEmailTypes', err.message);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
	}
};

const putKitUserMeta = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/putKitUserMeta', req.auth.sub);

	const { name, type, required, description } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/putKitUserMeta',
		'name',
		name,
		'type',
		type,
		'required',
		required,
		'description',
		description
	);
	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.updateKitUserMeta(name, { type, required, description }, auditInfo)
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/putKitUserMeta', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const deleteKitUserMeta = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/deleteKitUserMeta', req.auth.sub);

	const name = req.swagger.params.name.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/deleteKitUserMeta',
		'name',
		name
	);

	toolsLib.deleteKitUserMeta(name)
		.then((result) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/deleteKitUserMeta', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const adminCheckTransaction = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/adminCheckTransaction auth',
		req.auth
	);

	const {
		currency,
		transaction_id,
		address,
		network,
		is_testnet
	} = req.swagger.params;

	toolsLib.wallet.checkTransaction(currency.value, transaction_id.value, address.value, network.value, is_testnet.value, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((transaction) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
			return res.json({ message: 'Success', transaction });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/adminCheckTransaction catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const createPair = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/createPair auth',
		req.auth
	);

	const {
		name,
		pair_base,
		pair_2,
		code,
		active,
		min_size: minSize,
		max_size: maxSize,
		min_price: minPrice,
		max_price: maxPrice,
		increment_size: incrementSize,
		increment_price: incrementPrice,
		estimated_price: estimatedPrice,
		is_public: isPublic
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/createPair',
		'name:',
		name,
		'pair_base:',
		pair_base,
		'pair_2:',
		pair_2,
		'code:',
		code,
		'active:',
		active,
		'min_size:',
		minSize,
		'max_size:',
		maxSize,
		'min_price:',
		minPrice,
		'max_price:',
		maxPrice,
		'increment_size:',
		incrementSize,
		'increment_price:',
		incrementPrice,
		'estimated_price:',
		estimatedPrice,
		'is_public:',
		isPublic
	);

	toolsLib.pair.createPair(
		name,
		pair_base,
		pair_2,
		{
			code,
			active,
			minSize,
			maxSize,
			minPrice,
			maxPrice,
			incrementSize,
			incrementPrice,
			estimatedPrice,
			isPublic,
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/createPair catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const updatePair = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/updatePair auth',
		req.auth
	);

	const {
		code,
		min_size: minSize,
		max_size: maxSize,
		min_price: minPrice,
		max_price: maxPrice,
		increment_size: incrementSize,
		increment_price: incrementPrice,
		estimated_price: estimatedPrice,
		is_public: isPublic,
		circuit_breaker: circuitBreaker
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/updatePair',
		'code:',
		code,
		'min_size:',
		minSize,
		'max_size:',
		maxSize,
		'min_price:',
		minPrice,
		'max_price:',
		maxPrice,
		'increment_size:',
		incrementSize,
		'increment_price:',
		incrementPrice,
		'estimated_price:',
		estimatedPrice,
		'is_public:',
		isPublic,
		'circuit_breaker:',
		circuitBreaker,
		typeof estimatedPrice
	);

	toolsLib.pair.updatePair(
		code,
		{
			minSize,
			maxSize,
			minPrice,
			maxPrice,
			incrementSize,
			incrementPrice,
			estimatedPrice,
			isPublic,
			circuitBreaker
		},
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/updatePair catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const createCoin = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/createCoin auth',
		req.auth
	);

	const {
		symbol,
		fullname,
		code,
		withdrawal_fee: withdrawalFee,
		min,
		max,
		increment_unit: incrementUnit,
		logo,
		meta,
		estimated_price: estimatedPrice,
		type,
		network,
		standard,
		allow_deposit: allowDeposit,
		allow_withdrawal: allowWithdrawal
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/createCoin',
		'symbol:',
		symbol,
		'fullname:',
		fullname,
		'withdrawal_fee:',
		withdrawalFee,
		'min:',
		min,
		'max:',
		max,
		'increment_unit:',
		incrementUnit,
		'logo:',
		logo,
		'meta:',
		meta,
		'estimated_price:',
		estimatedPrice,
		'type:',
		type,
		'network:',
		network,
		'standard:',
		standard,
		'allow_deposit:',
		allowDeposit,
		'allow_withdrawal:',
		allowWithdrawal
	);

	toolsLib.coin.createCoin(
		symbol,
		fullname,
		{
			code,
			withdrawalFee,
			min,
			max,
			incrementUnit,
			logo,
			meta,
			estimatedPrice,
			type,
			network,
			standard,
			allowDeposit,
			allowWithdrawal,
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/createCoin catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const updateCoin = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/updateCoin auth',
		req.auth
	);

	const {
		code,
		fullname,
		withdrawal_fee: withdrawalFee,
		min,
		max,
		increment_unit: incrementUnit,
		logo,
		meta,
		estimated_price: estimatedPrice,
		type,
		network,
		standard,
		allow_deposit: allowDeposit,
		allow_withdrawal: allowWithdrawal,
		withdrawal_fees: withdrawalFees,
		deposit_fees: depositFees,
		is_public: isPublic,
		description
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/updateCoin',
		'code:',
		code,
		'fullname:',
		fullname,
		'withdrawal_fee:',
		withdrawalFee,
		'min:',
		min,
		'max:',
		max,
		'increment_unit:',
		incrementUnit,
		'logo:',
		logo,
		'meta:',
		meta,
		'estimated_price:',
		estimatedPrice,
		'type:',
		type,
		'network:',
		network,
		'standard:',
		standard,
		'allow_deposit:',
		allowDeposit,
		'allow_withdrawal:',
		allowWithdrawal,
		'withdrawal_fees:',
		withdrawalFees,
		'deposit_fees:',
		depositFees,
		'is_public:',
		isPublic,
		'description:',
		description
	);

	toolsLib.coin.updateCoin(
		code,
		{
			fullname,
			description,
			withdrawalFee,
			min,
			max,
			incrementUnit,
			logo,
			meta,
			estimatedPrice,
			type,
			network,
			standard,
			allowDeposit,
			allowWithdrawal,
			withdrawalFees,
			depositFees,
			isPublic
		},
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/updateCoin catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getExchange = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getExchange auth',
		req.auth
	);

	toolsLib.exchange.getExchangeConfig({
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getExchange err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const updateExchange = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/updateExchange auth',
		req.auth
	);

	const {
		info,
		is_public: isPublic,
		type,
		name,
		display_name: displayName,
		url,
		business_info: businessInfo,
		pairs,
		coins
	} = req.swagger.params.data.value;

	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/updateExchange body',
		'info:',
		info,
		'coins:',
		coins,
		'pairs:',
		pairs,
		'is_public:',
		isPublic,
		'type',
		type,
		'name:',
		name,
		'display_name:',
		displayName,
		'url:',
		url,
		'business_info',
		businessInfo
	);

	toolsLib.exchange.updateExchangeConfig(
		{
			info,
			isPublic,
			type,
			name,
			displayName,
			url,
			businessInfo,
			pairs,
			coins
		},
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/updateExchange err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getNetworkCoins = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getNetworkCoins auth',
		req.auth
	);

	const search = req.swagger.params.search.value;

	toolsLib.coin.getNetworkCoins({
		search,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getNetworkCoins err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getNetworkPairs = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getNetworkPairs auth',
		req.auth
	);

	const search = req.swagger.params.search.value;

	toolsLib.pair.getNetworkPairs({
		search,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getNetworkPairs err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const putUserInfo = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/putUserInfo auth',
		req.auth
	);

	const user_id = req.swagger.params.user_id.value;
	const updateData = pick(
		req.swagger.params.data.value,
		[
			'full_name',
			'gender',
			'nationality',
			'phone_number',
			'dob',
			'address',
			'id_data'
		]
	);

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/putUserInfo user_id:',
		user_id,
		'updateData:',
		updateData
	);

	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.user.updateUserInfo(user_id, updateData, auditInfo)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putUserInfo err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const emailConfigTest = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/emailConfigTest auth',
		req.auth
	);

	const { receiver, smtp } = req.swagger.params.data.value;

	testSendSMTPEmail(receiver, smtp)
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/emailConfigTest',
				'Email sent successfully'
			);

			return res.status(201).json({ message: 'Email sent successfully' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/emailConfigTest err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const setUserBank = (req, res) => {

	const { bank_account } = req.swagger.params.data.value;
	const id = req.swagger.params.id.value;

	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/setUserBank auth',
		req.auth,
		id,
		bank_account
	);

	toolsLib.user.getUserByKitId(id, false)
		.then(async (user) => {
			if (!user) {
				throw new Error('User not found');
			}

			const existingBankAccounts = user.bank_account;

			let sendEmail = false;

			const newBankInfoLog = [];
			const deletedBankInfoLog = [];
			existingBankAccounts?.forEach(existingBank => {
				const foundBank = bank_account?.find(bank => bank.id === existingBank.id);
				if (!foundBank) {
					deletedBankInfoLog.push(existingBank);
				}
			});
			
			const newBankAccounts = bank_account.map((bank) => {
				let existingBank = existingBankAccounts.filter((b) => b.id === bank.id);
				existingBank = existingBank[0];

				if (existingBank) {
					return bank;
				} else {
					sendEmail = true;
					bank.id = crypto.randomBytes(8).toString('hex');
					bank.status = VERIFY_STATUS.COMPLETED;
					newBankInfoLog.push(bank);
					return bank;
				}
			});

			const updatedUser = await user.update(
				{ bank_account: newBankAccounts },
				{ fields: ['bank_account'] }
			);

			if (sendEmail) {
				try {
					toolsLib.sendEmail('BANK_VERIFIED', updatedUser.email, { bankAccounts: updatedUser.bank_account.filter((account) => account.status === VERIFY_STATUS.COMPLETED) }, updatedUser.settings);
				} catch (err) {
					loggerAdmin.error(req.uuid, 'controllers/admin/setUserBank err', err.message);
				}
			}

			newBankInfoLog.map(bank => toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], bank));
			deletedBankInfoLog.map(bank => toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, 'delete', bank));
			return res.json(updatedUser.bank_account);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/setUserBank err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const verifyUserBank = (req, res) => {

	const { user_id, bank_id } = req.swagger.params.data.value;

	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/verifyUserBank auth',
		req.auth,
		user_id,
		bank_id
	);

	toolsLib.user.getUserByKitId(user_id, false)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}

			const bank = user.bank_account.filter((bank) => bank.id === bank_id);

			if (bank.length === 0) {
				throw new Error('Bank not found');
			} else if (bank[0].status === VERIFY_STATUS.COMPLETED) {
				throw new Error('Bank is already verified');
			}

			const banks = user.bank_account.map((bank) => {
				if (bank.id === bank_id) {
					bank.status = VERIFY_STATUS.COMPLETED;
				}
				return bank;
			});

			return user.update(
				{ bank_account: banks },
				{ fields: ['bank_account'] }
			);
		})
		.then((user) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			try {
				toolsLib.sendEmail('BANK_VERIFIED', user.email, { bankAccounts: user.bank_account.filter((account) => account.status === VERIFY_STATUS.COMPLETED) }, user.settings);
			} catch (err) {
				loggerAdmin.error(req.uuid, 'controllers/admin/verifyUserBank email catch', err.message);
			}
			return res.json(user.bank_account);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/verifyUserBank err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const revokeUserBank = (req, res) => {
	const { user_id, bank_id, message } = req.swagger.params.data.value;

	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/revokeUserBank auth',
		req.auth,
		user_id,
		bank_id,
		message
	);

	toolsLib.user.getUserByKitId(user_id, false)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}

			const bank = user.bank_account.filter((bank) => bank.id === bank_id);

			if (bank.length === 0) {
				throw new Error('Bank not found');
			}

			const newBanks = user.bank_account.filter((bank) => bank.id !== bank_id);

			return user.update(
				{ bank_account: newBanks },
				{ fields: ['bank_account'] }
			);
		})
		.then((user) => {
			toolsLib.sendEmail('USER_VERIFICATION_REJECT', user.email, { type: 'bank', message }, user.settings);
			return res.json(user.bank_account);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/revokeUserBank err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const generateDashToken = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/generateDashToken auth',
		req.auth
	);

	toolsLib.security.generateDashToken({
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then(({ token }) => {
			if (!token) {
				throw new Error('We could not generate the token. Please try again.');
			}
			return res.status(201).json({ token });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/generateDashToken err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getUserAffiliation = (req, res) => {
	loggerAdmin.debug(req.uuid, 'controllers/admin/getUserAffiliation auth', req.auth.sub);

	const user_id = req.swagger.params.user_id.value;
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
			loggerAdmin.verbose(req.uuid, 'controllers/admin/getUserAffiliation count', data.count);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getUserAffiliation', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getUserReferer = (req, res) => {
	loggerAdmin.debug(req.uuid, 'controllers/admin/getUserReferer auth', req.auth.sub);

	const user_id = req.swagger.params.user_id.value;

	toolsLib.user.getUserReferer(user_id)
		.then((email) => {
			loggerAdmin.verbose(req.uuid, 'controllers/admin/getUserReferer email', email);
			return res.json({ email });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getUserReferer', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const createUserByAdmin = (req, res) => {
	const { email, password, referral } = req.swagger.params.data.value;

	loggerAdmin.info(req.uuid, 'controllers/admin/createUserByAdmin email', email);

	if (!email || typeof email !== 'string' || !isEmail(email)) {
		throw new Error(PROVIDE_VALID_EMAIL);
	}

	if (!toolsLib.security.isValidPassword(password)) {
		throw new Error(INVALID_PASSWORD);
	}

	toolsLib.database.findOne('user', {
		where: { email },
		attributes: ['email']
	})
		.then((user) => {
			if (user) {
				throw new Error(USER_EXISTS);
			}

			return toolsLib.user.createUser(email, password, {
				role: 'user',
				id: null,
				email_verified: true,
				referral,
				additionalHeaders: {
					'x-forwarded-for': req.headers['x-forwarded-for']
				}
			});
		})
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.status(201).json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/createUserByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const createUserWalletByAdmin = (req, res) => {
	loggerAdmin.info(
		req.uuid,
		'controllers/admin/createUserWalletByAdmin',
		req.auth.sub
	);

	const { crypto, network, user_id } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/createUserWalletByAdmin',
		'crypto',
		crypto,
		'network',
		network,
		'user_id',
		user_id
	);

	toolsLib.user.getUserByKitId(user_id)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}

			if (!crypto || !toolsLib.subscribedToCoin(crypto)) {
				loggerAdmin.error(
					req.uuid,
					'controllers/admin/createUserWalletByAdmin',
					`Invalid crypto: "${crypto}"`
				);
				return res.status(404).json({ message: `Invalid crypto: "${crypto}"` });
			}
	
			return toolsLib.user.createUserCryptoAddressByKitId(user_id, crypto, {
				network,
				additionalHeaders: {
					'x-forwarded-for': req.headers['x-forwarded-for']
				}
			});
		})
		.then((data) => { 
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.status(201).json(data); 
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/createUserWalletByAdmin',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getWalletsByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getWalletsByAdmin/auth', req.auth);

	const { user_id, currency, network, address, is_valid, limit, page, order_by, order, format, start_date, end_date } = req.swagger.params;

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getWalletsByAdmin invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.wallet.getWallets(
		user_id.value,
		currency.value,
		network.value,
		address.value,
		is_valid.value,
		limit.value,
		page.value,
		order_by.value,
		order.value,
		format.value,
		start_date.value,
		end_date.value,
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
			if (format.value === 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getWalletsByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const sendEmailByAdmin = (req, res) => {
	loggerAdmin.info(
		req.uuid,
		'controllers/admin/sendEmailByAdmin',
		req.auth.sub
	);

	const { user_id, mail_type, data } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/sendEmailByAdmin',
		'mail_type',
		mail_type,
		'user_id',
		user_id,
		'data',
		data
	);

	toolsLib.user.getUserByKitId(user_id)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return sendEmail(
				mail_type,
				user.email,
				data,
				user.settings
			);
		})
		.then(() => { 
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/sendEmailByAdmin',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const sendRawEmailByAdmin = (req, res) => {
	loggerAdmin.info(
		req.uuid,
		'controllers/admin/sendRawEmailByAdmin',
		req.auth.sub
	);

	const { receivers, title, html, text } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/sendRawEmailByAdmin',
		'receivers',
		receivers,
		'title',
		title,
	);

	sendRawEmail(
		receivers,
		title,
		html,
		text
	)
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/sendRawEmailByAdmin',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getUserSessionsByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getUserSessionsByAdmin/auth', req.auth);

	const { user_id, last_seen, status, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUserSessionsByAdmin invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getExchangeUserSessions({
		user_id: user_id.value,
		last_seen: last_seen.value,
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
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getUserSessionsByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const revokeUserSessionByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/revokeUserSessionByAdmin/auth', req.auth);

	const { session_id } = req.swagger.params.data.value;

	toolsLib.user.revokeExchangeUserSession(session_id)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], { user_id: data.user_id, ...req?.swagger?.params?.data?.value });
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/revokeUserSessionByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const updateQuickTradeConfig = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/updateQuickTradeConfig/auth', req.auth);

	const { symbol, type, active } = req.swagger.params.data.value;
	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.order.updateQuickTradeConfig({ symbol, active, type }, auditInfo
	)
		.then((data) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/updateQuickTradeConfig', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getTransactionLimits = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getTransactionLimits/auth', req.auth);

	toolsLib.tier.getTransactionLimits()
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getTransactionLimits', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const updateTransactionLimit = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/updateTransactionLimit/auth', req.auth);

	const { 
		id,
		tier,
		amount,
		currency,
		limit_currency,
		type,
		monthly_amount,
	 } = req.swagger.params.data.value;

	toolsLib.tier.updateTransactionLimit(id, {
		tier,
		amount,
		currency,
		limit_currency,
		type,
		monthly_amount,
	 })
		.then((data) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/updateTransactionLimit', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const deleteTransactionLimit = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/deleteTransactionLimit', req.auth.sub);

	const { id } = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/deleteTransactionLimit',
		'id',
		id
	);

	toolsLib.tier.deleteTransactionLimit(id)
		.then((result) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/deleteTransactionLimit', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getBalancesAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getBalancesAdmin/auth', req.auth);

	const { 
		user_id, 
		currency,
		format
	} = req.swagger.params;


	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}

	toolsLib.user.getAllBalancesAdmin({
		user_id: user_id.value,
		currency: currency.value,
		format: format.value,
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
			if (format.value === 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getBalancesAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const restoreUserAccount = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/user/restoreUserAccount/auth', req.auth);

	const { user_id } = req.swagger.params.data.value;

	loggerAdmin.verbose(
		req.uuid,
		'controllers/user/restoreUserAccount',
		'user_id',
		user_id,
	);
	toolsLib.user.restoreKitUser(user_id)
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/user/restoreUserAccount', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const changeUserEmail = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/changeUserEmail/auth', req.auth);

	const { email_code, otp_code, email, user_id } = req.swagger.params.data.value;

	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/changeUserEmail',
		'user_id',
		user_id,
		'email_code',
		email_code
	);
	toolsLib.security.verifyOtpBeforeAction(req.auth.sub.id, otp_code)
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}

			return toolsLib.security.confirmByEmail(req.auth.sub.id, email_code);
		})
		.then((confirmed) => {
			if (confirmed) {
				const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
				return toolsLib.user.changeKitUserEmail(user_id, email, auditInfo);
			} else {
				throw new Error(INVALID_VERIFICATION_CODE);
			}
		})
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/changeUserEmail', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const getUserBalanceHistoryByAdmin = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getUserBalanceHistoryByAdmin/auth',
		req.auth
	);
	const { limit, page, order_by, order, start_date, end_date, format, user_id } = req.swagger.params;

	if (start_date.value && !isDate(start_date.value)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUserBalanceHistoryByAdmin invalid start_date',
			start_date.value
		);
		return res.status(400).json({ message: 'Invalid start date' });
	}

	if (end_date.value && !isDate(end_date.value)) {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUserBalanceHistoryByAdmin invalid end_date',
			end_date.value
		);
		return res.status(400).json({ message: 'Invalid end date' });
	}

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/getUserBalanceHistoryByAdmin invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getUserBalanceHistory({
		user_id: user_id.value,
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
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-balance_history.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getUserBalanceHistoryByAdmin',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const disableUserWithdrawal = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/disableUserWithdrawal auth',
		req.auth
	);

	const {
		user_id,
		expiry_date
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/disableUserWithdrawal',
		user_id,
		expiry_date
	);

	toolsLib.user.disableUserWithdrawal(user_id, { expiry_date })
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/disableUserWithdrawal successful'
			);
			return res.status(200).json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/disableUserWithdrawal err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createTradeByAdmin = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/createTradeByAdmin auth',
		req.auth
	);

	const {
		symbol,
		side,
		price,
		size,
		maker_id,
		taker_id,
		maker_fee,
		taker_fee 
	} = req.swagger.params.data.value;

	loggerAdmin.info(
		req.uuid,
		'controllers/admin/createTradeByAdmin',
		symbol,
		side,
		price,
		size,
		maker_id,
		taker_id,
		maker_fee,
		taker_fee 
	);

	toolsLib.order.createTrade({symbol, side, price, size, maker_id, taker_id, maker_fee, taker_fee },
		{
			'x-forwarded-for': req.headers['x-forwarded-for']
		})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/createTradeByAdmin successful'
			);
			return res.status(200).json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/mintAsset err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};
const getUserReferralCodesByAdmin = (req, res) => {
	loggerAdmin.info(
		req.uuid,
		'controllers/user/getUserReferralCodesByAdmin',
	);

	const { limit, page, order_by, order, start_date, end_date } = req.swagger.params;

	if (
		!toolsLib.getKitConfig().referral_history_config ||
		!toolsLib.getKitConfig().referral_history_config.active
	) {
		throw new Error(REFERRAL_HISTORY_NOT_ACTIVE);
	}

	const user_id = req.swagger.params.user_id.value;

	toolsLib.user.getUserReferralCodes({ 
		user_id, 	
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/user/getUserReferralCodesByAdmin err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};
const createUserReferralCodeByAdmin = (req, res) => {
	loggerAdmin.info(
		req.uuid,
		'controllers/user/createUserReferralCodeByAdmin',
	);
	const { user_id, discount, earning_rate, code } = req.swagger.params.data.value;

	if (
		!toolsLib.getKitConfig().referral_history_config ||
		!toolsLib.getKitConfig().referral_history_config.active
	) {
		throw new Error(REFERRAL_HISTORY_NOT_ACTIVE);
	}

	toolsLib.user.createUserReferralCode({
		user_id,
		discount, 
		earning_rate, 
		code,
		is_admin: true
	})
		.then(() => {
			return res.json({ message: 'success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/user/createUserReferralCodeByAdmin err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const fetchUserTradingVolumeByAdmin = (req, res) => {
	const { user_id, to, from } = req.swagger.params;

	loggerAdmin.info(
		user_id.value,
		'controllers/user/fetchUserTradingVolumeByAdmin',
		to.value,
		from.value
	);

	toolsLib.user.fetchUserTradingVolume(
		user_id.value,
		{
			to: to.value,
			from: from.value
		}
	)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/user/fetchUserTradingVolumeByAdmin err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getPaymentDetailsByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getPaymentDetailsByAdmin/auth', req.auth);

	const { user_id, is_p2p, is_fiat_control, status, limit, page, order_by, order, start_date, end_date } = req.swagger.params;

	toolsLib.user.getPaymentDetails(user_id.value,
		{
			limit: limit.value,
			page: page.value,
			order_by: order_by.value,
			order: order.value,
			start_date: start_date.value,
			end_date: end_date.value,
			is_p2p: is_p2p.value,
			is_fiat_control: is_fiat_control.value,
			status: status.value,
		})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getPaymentDetailsByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createPaymentDetailByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/createPaymentDetailByAdmin/auth', req.auth);

	const { user_id, name, label, details, is_p2p, is_fiat_control, status } = req.swagger.params.data.value;

	toolsLib.user.createPaymentDetail({
		user_id,
		name,
		label,
		details,
		is_p2p,
		is_fiat_control,
		status
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/createPaymentDetailByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const updatePaymentDetailByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/updatePaymentDetailByAdmin/auth', req.auth);

	const { user_id, id, name, label, details, is_p2p, is_fiat_control, status } = req.swagger.params.data.value;

	toolsLib.user.updatePaymentDetail(id, {
		user_id,
		name,
		label,
		details,
		is_p2p,
		is_fiat_control,
		status
	}, true)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/updatePaymentDetailByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const deletePaymentDetailByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/deletePaymentDetailByAdmin/auth', req.auth);

	const { id, user_id } = req.swagger.params.data.value;

	toolsLib.user.deletePaymentDetail(id, user_id)
		.then(() => {
			return res.json({
				message: 'Success'
			});
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/deletePaymentDetailByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const deleteUserByAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/deleteUserByAdmin/auth', req.auth);

	const { user_id } = req.swagger.params.data.value;

	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/deleteUserByAdmin',
		'user_id',
		user_id,
	);
	toolsLib.user.deleteKitUser(user_id, false)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/deleteUserByAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const fetchAnnouncements = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/fetchAnnouncements/auth', req.auth.sub);

	const { limit, page, order_by, order, start_date, end_date, is_popup, is_navbar, is_dropdown } = req.swagger.params;

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
			req.uuid,
			'controllers/admin/fetchAnnouncements invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.user.getAnnouncements({
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		is_popup: is_popup.value,
		is_navbar: is_navbar.value,
		is_dropdown: is_dropdown.value,
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/fetchAnnouncements', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const createAnnouncement = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/createAnnouncement/auth', req.auth.sub);

	const { title, message, type, is_popup, end_date, start_date, is_navbar, is_dropdown } = req.swagger.params.data.value;

	toolsLib.user.createAnnouncement({
		title,
		message,
		type,
		user_id: req.auth.sub.id,
		end_date,
		start_date,
		is_popup,
		is_navbar,
		is_dropdown
	})
		.then((announcement) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id  }, '/plugins/announcement', 'post', announcement);
			return res.json(announcement);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/createAnnouncement', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const updateAnnouncement = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/updateAnnouncement/auth', req.auth.sub);

	const { id, title, message, type, is_popup, end_date, start_date, is_navbar, is_dropdown } = req.swagger.params.data.value;

	toolsLib.user.updateAnnouncement(id, {
		title,
		message,
		type,
		user_id: req.auth.sub.id,
		end_date,
		start_date,
		is_popup,
		is_navbar,
		is_dropdown
	})
		.then((announcement) => {
			return res.json(announcement);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/updateAnnouncement', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};


const deleteAnnouncement = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/deleteAnnouncement/auth', req.auth.sub);

	const { id } = req.swagger.params.data.value;

	toolsLib.user.deleteAnnouncement(id)
		.then((result) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id  }, '/plugins/announcement', 'delete', result);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/deleteAnnouncement', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};
module.exports = {
	createInitialAdmin,
	getAdminKit,
	putAdminKit,
	getUsersAdmin,
	putUserRole,
	putUserNote,
	getAdminUserBalance,
	activateUser,
	getAdminBalance,
	upgradeUser,
	flagUser,
	getAdminUserLogins,
	getUserAudits,
	getCoins,
	getPairs,
	transferFund,
	completeExchangeSetup,
	putNetworkCredentials,
	uploadImage,
	getOperators,
	inviteNewOperator,
	getExchangeGeneratedFees,
	mintAsset,
	burnAsset,
	verifyEmailUser,
	settleFees,
	putMint,
	putBurn,
	putUserDiscount,
	deleteKitUserMeta,
	postKitUserMeta,
	putKitUserMeta,
	putUserMeta,
	adminCheckTransaction,
	createPair,
	updatePair,
	createCoin,
	updateCoin,
	getExchange,
	getNetworkCoins,
	getNetworkPairs,
	updateExchange,
	putUserInfo,
	getEmail,
	putEmail,
	emailConfigTest,
	getEmailTypes,
	setUserBank,
	verifyUserBank,
	revokeUserBank,
	generateDashToken,
	getUserAffiliation,
	getUserReferer,
	createUserByAdmin,
	createUserWalletByAdmin,
	getWalletsByAdmin,
	getUserSessionsByAdmin,
	revokeUserSessionByAdmin,
	sendEmailByAdmin,
	sendRawEmailByAdmin,
	updateQuickTradeConfig,
	getBalancesAdmin,
	restoreUserAccount,
	changeUserEmail,
	getTransactionLimits,
	updateTransactionLimit,
	deleteTransactionLimit,
	getUserBalanceHistoryByAdmin,
	createTradeByAdmin,
	disableUserWithdrawal,
	performDirectWithdrawalByAdmin,
	getUserReferralCodesByAdmin,
	createUserReferralCodeByAdmin,
	fetchUserTradingVolumeByAdmin,
	getPaymentDetailsByAdmin,
	createPaymentDetailByAdmin,
	updatePaymentDetailByAdmin,
	deletePaymentDetailByAdmin,
	deleteUserByAdmin,
	fetchAnnouncements,
	createAnnouncement,
	deleteAnnouncement,
	updateAnnouncement
};
