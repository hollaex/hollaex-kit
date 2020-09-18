'use strict';

const packageJson = require('../../package.json');
const { API_HOST } = require('../../constants');
const toolsLib = require('hollaex-tools-lib');
const { loggerGeneral } = require('../../config/logger');

const getHealth = (req, res) => {
	try {
		return res.json({
			name: toolsLib.getKitConfig().api_name || packageJson.name,
			version: packageJson.version,
			host: API_HOST,
			basePath: req.swagger.swaggerObject.basePath,
			status: toolsLib.getKitConfig().status
		});
	} catch (err) {
		loggerGeneral.verbose('controller/general/getHealth', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const getConstants = (req, res) => {
	try {
		return res.json({
			coins: toolsLib.getKitCoinsConfig(),
			pairs: toolsLib.getKitPairsConfig()
		});
	} catch (err) {
		loggerGeneral.verbose('controller/general/getConstants', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const getKitConfigurations = (req, res) => {
	try {
		return res.json(toolsLib.getKitConfig());
	} catch (err) {
		loggerGeneral.verbose('controller/general/getKitConfigurations', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const sendSupportEmail = (req, res) => {
	const { email, category, subject, description }  = req.swagger.params;
	return toolsLib.sendEmailToSupport(email.value, category.value, subject.value, description.value)
		.then(() => {
			return res.json({ message: 'Email was sent to support' });
		})
		.catch((err) => {
			loggerGeneral.verbose('controller/general/sendSupportEmail', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const applyKitChanges = (req, res) => {
	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
	const domain = req.headers['x-real-origin'];
	loggerGeneral.verbose('controller/transaction/handleCurrencyDeposit ip domain', ip, domain);

	toolsLib.auth.verifyHmacToken(req)
		.then(() => {
			// TODO
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerGeneral.verbose('controller/general/applyKitChanges', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getHealth,
	getConstants,
	getKitConfigurations,
	sendSupportEmail,
	applyKitChanges
};
