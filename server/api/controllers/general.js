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
		res.json({
			coins: toolsLib.getKitCoins(),
			pairs: toolsLib.getKitPairs()
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

const getKitConfigurations = (req, res) => {
	try {
		res.json(toolsLib.getKitConfig());
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports = {
	getHealth,
	getConstants,
	getKitConfigurations
};
