'use strict';

const toolsLib = require('hollaex-tools-lib');
const { loggerTier } = require('../../config/logger');
const { each } = require('lodash');

const getTiers = (req, res) => {
	try {
		const tiers = toolsLib.getKitTiers();
		const pairs = toolsLib.getKitPairs();
		each(tiers, (tier) => {
			each(pairs, (pair) => {
				tier.fees.maker[pair] = tier.fees.maker[pair] !== undefined ? tier.fees.maker[pair] : tier.fees.maker.default;
				tier.fees.taker[pair] = tier.fees.taker[pair] !== undefined ? tier.fees.taker[pair] : tier.fees.taker.default;
			});
			delete tier.fees.maker.default;
			delete tier.fees.taker.default;
		});
		return res.json(tiers);
	} catch (err) {
		loggerTier.error(req.uuid, 'controllers/tier/getTiers err', err.message);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const postTier = (req, res) => {
	loggerTier.verbose(req.uuid, 'controllers/tier/postTier auth', req.auth);

	const { level, name, icon, description, deposit_limit, withdrawal_limit, fees } = req.swagger.params.data.value;

	loggerTier.info(req.uuid, 'controllers/tier/postTier new tier', level, name, description);

	toolsLib.tier.createTier(level, name, icon, description, deposit_limit, withdrawal_limit, fees)
		.then((tier) => {
			loggerTier.verbose(req.uuid, 'controllers/tier/postTier new tier created', level);
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const putTier = (req, res) => {
	loggerTier.verbose(req.uuid, 'controllers/tier/putTier auth', req.auth);

	const { level, name, icon, description, deposit_limit, withdrawal_limit } = req.swagger.params.data.value;

	const updateData = {
		name,
		icon,
		description,
		deposit_limit,
		withdrawal_limit
	};

	toolsLib.tier.updateTier(level, updateData)
		.then((tier) => {
			loggerTier.verbose(req.uuid, 'controllers/tier/putTier tier updated', level);
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getTiers,
	postTier,
	putTier
};
