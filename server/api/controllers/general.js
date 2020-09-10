'use strict';

const packageJson = require('../../package.json');
const { API_HOST } = require('../../constants');
const toolsLib = require('hollaex-tools-lib');

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
		return res.status(400).json({ message: err.message });
	}
};

const getConstants = (req, res) => {
	try {
		return res.json({
			coins: toolsLib.getKitCoins(),
			pairs: toolsLib.getKitPairs()
		});
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};

const getKitConfigurations = (req, res) => {
	try {
		return res.json(toolsLib.getKitConfig());
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};

const sendSupportEmail = (req, res) => {
	const { email, category, subject, description }  = req.swagger.params;
	return toolsLib.sendEmailToSupport(email.value, category.value, subject.value, description.value)
		.then(() => {
			return res.json({ message: 'Email was sent to support' });
		})
		.catch((err) => {
			return res.status(400).json({ message: err.message });
		});
};

module.exports = {
	getHealth,
	getConstants,
	getKitConfigurations,
	sendSupportEmail
};
