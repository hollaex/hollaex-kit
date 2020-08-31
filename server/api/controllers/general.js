'use strict';

const packageJson = require('../../package.json');
const { API_HOST } = require('../../constants');
const hollaexToolsLib = require('hollaex-tools-lib')();

const getHealth = (req, res) => {
	try {
		return res.json({
			name: hollaexToolsLib.getKitConfig().api_name || packageJson.name,
			version: packageJson.version,
			host: API_HOST,
			basePath: req.swagger.swaggerObject.basePath,
			status: hollaexToolsLib.getKitConfig().status
		});
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};

const getConstants = (req, res) => {
	console.log(hollaexToolsLib)
	try {
		res.json({
			coins: hollaexToolsLib.getKitCoins(),
			pairs: hollaexToolsLib.getKitPairs()
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

const getKitConfigurations = (req, res) => {
	try {
		res.json(hollaexToolsLib.getKitConfig());
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports = {
	getHealth,
	getConstants,
	getKitConfigurations
};
