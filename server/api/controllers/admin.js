'use strict';

const { loggerAdmin } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { cloneDeep } = require('lodash');
const { parse } = require('json2csv');
const flatten = require('flat');


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

module.exports = {
	getAdminKit,
	putAdminKit,
	getUsersAdmin
};
