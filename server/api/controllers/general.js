'use strict';

const packageJson = require('../../package.json');
const { getConfiguration } = require('../../init');
const { API_HOST } = require('../../constants');

const getHealth = (req, res) => {
	res.json({
		name: getConfiguration().constants.api_name || packageJson.name,
		version: packageJson.version,
		host: API_HOST,
		basePath: req.swagger.swaggerObject.basePath,
		status: getConfiguration().status
	});
};

const getConstants = (req, res) => {
	try {
		res.json(getConfiguration());
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports = {
	getHealth,
	getConstants
};
