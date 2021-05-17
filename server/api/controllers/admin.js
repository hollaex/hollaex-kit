'use strict';

const { loggerAdmin } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { cloneDeep } = require('lodash');
const { all } = require('bluebird');
const { USER_NOT_FOUND } = require('../../messages');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const { errorMessageConverter } = require('../../utils/conversion');

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
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
	}
};

const putNetworkCredentials = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/putNetworkCredentials auth', req.auth.sub);

	const { api_key, api_secret } = req.swagger.params.data.value;

	toolsLib.updateNetworkKeySecret(api_key, api_secret)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/putNetworkCredentials', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createInitialAdmin = (req, res) => {
	const { email, password } = req.swagger.params.data.value;

	loggerAdmin.info(req.uuid, 'controllers/admin/createInitialAdmin email', email);

	all([
		toolsLib.database.findOne('user', { raw: true }),
		toolsLib.database.findOne('status', { raw: true })
	])
		.then(([ user, status ]) => {
			if (status.initialized) {
				throw new Error('Exchange is already initialized');
			}
			if (user) {
				throw new Error('Admin already exists');
			}
			return toolsLib.user.createUser(email, password, {
				role: 'admin',
				id: 1
			});
		})
		.then(() => {
			return toolsLib.setExchangeInitialized();
		})
		.then(() => {
			return res.status(201).json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/createInitialAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const putAdminKit = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/putAdminKit', req.auth.sub);
	const data = req.swagger.params.data.value;

	if (data.kit) {
		if (data.kit.setup_completed) {
			loggerAdmin.error(req.uuid, 'controllers/admin/putAdminKit', 'Cannot update setup_completed value through this endpoint');
			return res.status(400).json({ message: 'Cannot update setup_completed value through this endpoint'});
		}
	}

	toolsLib.updateKitConfigSecrets(data, req.auth.scopes)
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/putAdminKit', err);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUsersAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getUsers/auth', req.auth);

	const { id, search, pending, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	toolsLib.user.getAllUsersAdmin({
		id: id.value,
		search: search.value,
		pending: pending.value,
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: format.value
	})
		.then((data) => {
			if (format.value) {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/getUsers', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
			return res.json(user);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putUserRole',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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


	toolsLib.user.updateUserNote(user_id, note)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/userNote',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.user.updateUserDiscount(user_id, discount)
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
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAdminUserBalance = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserBalance/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;

	toolsLib.wallet.getUserBalanceByKitId(user_id)
		.then((balance) => {
			return res.json(balance);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getAdminUserBalance',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
			const message = `Account ${user.email} has been ${
				activated ? 'activated' : 'deactivated'
			}`;
			return res.json({ message });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/activateUser',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAdminBalance = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserBalance/auth',
		req.auth
	);

	toolsLib.wallet.getKitBalance()
		.then((balance) => {
			return res.json(balance);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getAdminBalance',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/upgradeUser',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const flagUser = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/flagUser/auth', req.auth);
	const { user_id } = req.swagger.params.data.value;

	toolsLib.user.toggleFlaggedUserById(user_id)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/flagUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAdminUserLogins = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserLogins/auth',
		req.auth
	);
	const { user_id, limit, page, start_date, order_by, order, end_date, format } = req.swagger.params;

	toolsLib.user.getUserLogins({
		userId: user_id.value,
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
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUserAudits = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getUserAudits/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	toolsLib.user.getUserAudits({
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
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
	}
};

const transferFund = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/transferFund auth',
		req.auth
	);

	const data = req.swagger.params.data.value;

	toolsLib.wallet.transferAssetByKitIds(data.sender_id, data.receiver_id, data.currency, data.amount, data.description, data.email)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/transferFund',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/completeExchangeSetup catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.storeImageOnNetwork(file, name)
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/uploadImage catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getOperators = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getOperators auth',
		req.auth
	);

	const { limit, page, order_by, order } = req.swagger.params;

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
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.user.inviteExchangeOperator(invitingEmail, email.value, role.value)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/inviteNewOperator err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getExchangeGeneratedFees = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getExchangeGeneratedFees auth',
		req.auth
	);

	const { start_date, end_date } = req.swagger.params;

	toolsLib.order.getGeneratedFees(start_date.value, end_date.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getExchangeGeneratedFees catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const settleFees = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/settleFees auth',
		req.auth
	);

	toolsLib.order.settleFees()
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/settleFees catch',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
		email
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
		status
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
					description,
					transactionId: transaction_id,
					status,
					email
				}
			);
		})
		.then((data) => {
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/mintAsset successful',
			);
			return res.status(201).json(data);
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

const putMint = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/putMint auth',
		req.auth
	);

	const {
		transaction_id,
		updated_transaction_id,
		status,
		rejected,
		dismissed,
		processing,
		waiting,
		email,
		updated_description
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
		'updated_description',
		updated_description
	);

	toolsLib.wallet.updatePendingMint(transaction_id, {
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		updatedTransactionId: updated_transaction_id,
		email,
		updatedDescription: updated_description
	})
		.then((data) => {
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/putMint successful',
			);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putMint err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
		email
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
		status
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
					email
				}
			);
		})
		.then((data) => {
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/burnAsset successful',
			);
			return res.status(201).json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/burnAsset err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
		status,
		rejected,
		dismissed,
		processing,
		waiting,
		email,
		updated_description
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
		'updated_description',
		updated_description
	);

	toolsLib.wallet.updatePendingBurn(transaction_id, {
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		updatedTransactionId: updated_transaction_id,
		email,
		updatedDescription: updated_description
	})
		.then((data) => {
			loggerAdmin.info(
				req.uuid,
				'controllers/admin/putBurn successful',
			);
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putBurn err',
				err
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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
	putUserDiscount
};
