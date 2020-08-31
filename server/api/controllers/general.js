'use strict';

const packageJson = require('../../package.json');
const { getKit, getCoins, getPairs } = require('../../init');
const { API_HOST } = require('../../constants');

const getHealth = (req, res) => {
	res.json({
		name: getKit().api_name || packageJson.name,
		version: packageJson.version,
		host: API_HOST,
		basePath: req.swagger.swaggerObject.basePath,
		status: getKit().status
	});
};

const getConstants = (req, res) => {
	try {
		res.json({
			coins: getCoins(),
			pairs: getPairs()
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports = {
	getHealth,
	getConstants
};
