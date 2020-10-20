'use strict';

const toolsLib = require('hollaex-tools-lib');
const { loggerTier } = require('../../config/logger');

const getTiers = (req, res) => {
	try {
		return res.json({
			tiers: toolsLib.getKitTiers()
		});
	} catch (err) {
		loggerTier.error(req.uuid, 'controllers/tier/getTiers err', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

module.exports = {
	getTiers
};
