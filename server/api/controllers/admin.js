'use strict';

const { loggerAdmin } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { cloneDeep } = require('lodash');
const { ADMIN_ACCOUNT_ID, MIN_VERIFICATION_LEVEL } = require('../../constants');
const { parse } = require('json2csv');
const { SERVICE_NOT_AVAILABLE } = require('../../messages');
const tools = require('hollaex-tools-lib/tools');

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
		return res.status(400).json({ message: err.message });
	}
};

const putAdminKit = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/putAdminKit', req.auth.sub);
	const data = req.swagger.params.data.value;

	if ((data.kit && data.kit.plugins) || (data.secrets && data.secrets.plugins)) {
		loggerAdmin.error(req.uuid, 'controllers/admin/putAdminKit', 'Cannot update plugins values through this endpoint');
		return res.status(400).json({ message: 'Cannot update plugins values through this endpoint'});
	}

	toolsLib.updateKitConfigSecrets(data, req.auth.scopes)
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/putAdminKit', err);
			return res.status(400).json({ message: err.message });
		});
};

const getUsersAdmin = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getUsers/auth', req.auth);

	const { id, search, pending, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	toolsLib.users.getAllUsersAdmin(
		id.value,
		search.value,
		pending.value,
		limit.value,
		page.value,
		order_by.value,
		order.value,
		start_date.value,
		end_date.value,
		format.value
	)
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
			return res.status(err.status || 400).json({ message: err.message });
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

	if (user_id === ADMIN_ACCOUNT_ID) {
		throw new Error('Cannot change main admin account role');
	}

	toolsLib.users.updateUserRole(user_id, role)
		.then((user) => {
			return res.json(user);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/putUserRole',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
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


	toolsLib.users.updateUserNote(user_id, note)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/userNote',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAdminUserBalance = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserBalance/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;

	toolsLib.users.getUserBalanceByKitId(user_id)
		.then((balance) => {
			return res.json(balance);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getAdminUserBalance',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAdminUserOrders = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getAdminUserOrders/auth', req.auth);
	const user_id = req.swagger.params.user_id.value;
	const { limit, page, order_by, order, start_date, end_date } = req.swagger.params;
	const symbol = req.swagger.params.symbol.value;
	const side = req.swagger.params.side.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerAdmin.debug(req.uuid, 'controllers/admin/getAdminUserOrder', 'Invalid symbol');
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.order.getAllUserOrdersByKitId(user_id, symbol)
		.then((orders) => {
			return res.json(orders);
		})
		.catch((err) => {
			loggerAdmin.debug(req.uuid, 'controllers/admin/getAdminUserOrder', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const adminCancelOrder = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/adminCancelOrder auth', req.auth);

	const userId = req.swagger.params.user_id.value;
	const orderId = req.swagger.params.order_id.value;

	toolsLib.order.cancelUserOrderByKitId(userId, orderId)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/adminCancelOrder',
				err.message
			);
			return res.status(400).json({ message: err.message });
		});
};

const getAdminUserTrades = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/getAdminUserTrades auth', req.auth);

	const user_id = req.swagger.params.user_id.value;
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;
	const symbol = req.swagger.params.symbol.value;

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerAdmin.debug(req.uuid, 'controllers/admin/getAdminUserTrades', 'Invalid symbol');
		return res.status(400).json({ message: 'Invalid symbol=' });
	}

	toolsLib.order.getAllUserTradesNetworkByKidId(user_id.value, symbol.value, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value) {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users-trades.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.debug(req.uuid, 'controllers/admin/getAdminUserTrades', err.message);
			return res.status(err.status || 400).json({ message: err.message });
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
		promiseQuery = toolsLib.users.unfreezeUserById(user_id);
	} else if (activated === false) {
		promiseQuery = toolsLib.users.freezeUserById(user_id);
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
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAdminBalance = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserBalance/auth',
		req.auth
	);
	// TODO
	return res.status(400).json({ message: SERVICE_NOT_AVAILABLE });
};

const upgradeUser = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/upgradeUser auth',
		req.auth
	);

	const domain = req.headers['x-real-origin'];

	const { user_id, verification_level } = req.swagger.params.data.value;

	toolsLib.users.changeUserVerificationLevelById(user_id, verification_level, domain)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/upgradeUser',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const deactivateOtpAdmin = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/deactivateOtpAdmin/auth',
		req.auth
	);
	const { user_id } = req.swagger.params.data.value;

	toolsLib.users.deactivateUserOtpById(user_id)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/deactivateOtpAdmin',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const flagUser = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/admin/flagUser/auth', req.auth);
	const { user_id } = req.swagger.params.data.value;

	toolsLib.users.toggleFlaggedUserById(user_id)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/admin/flagUser', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAdminUserLogins = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getAdminUserLogins/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;
	const { limit, page, start_date, end_date, format } = req.swagger.params;

	toolsLib.users.getUserLogins(user_id.value, limit.value, page.value, start_date.value, end_date.value, format.value)
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
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/getAdminUserLogins/catch',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getUserAudits = (req, res) => {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/getUserAudits/auth',
		req.auth
	);
	const user_id = req.swagger.params.user_id.value;
	const { limit, page, start_date, end_date, format } = req.swagger.params;

	toolsLib.users.getUserAudits(user_id, limit.value, page.value, start_date.value, end_date.value, format.value)
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
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getAdminKit,
	putAdminKit,
	getUsersAdmin,
	putUserRole,
	putUserNote,
	getAdminUserBalance,
	getAdminUserOrders,
	adminCancelOrder,
	getAdminUserTrades,
	activateUser,
	getAdminBalance,
	upgradeUser,
	deactivateOtpAdmin,
	flagUser,
	getAdminUserLogins,
	getUserAudits
};
