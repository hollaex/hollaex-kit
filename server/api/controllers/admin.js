'use strict';

const { loggerAdmin } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { cloneDeep } = require('lodash');

const getAdminKit = (req, res) => {
	// loggerAdmin.verbose(req.uuid, 'controllers/admin/getAdminKit', req.auth.sub);
	try {
		const data = cloneDeep({
			kit: toolsLib.getKitConfig(),
			secrets: toolsLib.getKitSecrets()
		});

		// Mask certain secrets
		data.secrets = toolsLib.maskSecrets(data.secrets);
		res.json(data);
	} catch (err) {
		loggerAdmin.error(req.uuid, 'controllers/admin/getAdminKit', err.message);
		res.status(400).json({ message: err.message });
	}
};

module.exports = {
	getAdminKit
};
