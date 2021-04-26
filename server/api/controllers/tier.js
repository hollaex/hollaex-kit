'use strict';

const toolsLib = require('hollaex-tools-lib');
const { loggerTier } = require('../../config/logger');
const { errorMessageConverter } = require('../../utils/conversion');

const getTiers = (req, res) => {
	try {
		return res.json(toolsLib.getKitTiers());
	} catch (err) {
		loggerTier.error(req.uuid, 'controllers/tier/getTiers err', err.message);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
	}
};

const postTier = (req, res) => {
	loggerTier.verbose(req.uuid, 'controllers/tier/postTier auth', req.auth);

	const { level, name, icon, description, deposit_limit, withdrawal_limit, fees, note } = req.swagger.params.data.value;

	loggerTier.info(req.uuid, 'controllers/tier/postTier new tier', level, name, description);

	toolsLib.tier.createTier(level, name, icon, description, deposit_limit, withdrawal_limit, fees, note)
		.then((tier) => {
			loggerTier.info(req.uuid, 'controllers/tier/postTier new tier created', level);
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const putTier = (req, res) => {
	loggerTier.verbose(req.uuid, 'controllers/tier/putTier auth', req.auth);

	const { level, name, icon, description, deposit_limit, withdrawal_limit, note } = req.swagger.params.data.value;

	const updateData = {
		name,
		icon,
		description,
		deposit_limit,
		withdrawal_limit,
		note
	};

	toolsLib.tier.updateTier(level, updateData)
		.then((tier) => {
			loggerTier.info(req.uuid, 'controllers/tier/putTier tier updated', level);
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const updatePairFees = (req, res) => {
	loggerTier.verbose(
		req.uuid,
		'controllers/tier/updatePairFees auth',
		req.auth
	);

	const { pair, fees } = req.swagger.params.data.value;

	loggerTier.info(
		req.uuid,
		'controllers/tier/updatePairFees pair',
		pair
	);

	toolsLib.tier.updatePairFees(pair, fees)
		.then(() => {
			loggerTier.info(
				req.uuid,
				'controllers/tier/updatePairFees updated fees pair',
				pair
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerTier.error(
				req.uuid,
				'controllers/tier/updatePairFees err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const updateTiersLimits = (req, res) => {
	loggerTier.verbose(
		req.uuid,
		'controllers/tier/updateTierLimits auth',
		req.auth
	);

	const { limits } = req.swagger.params.data.value;

	loggerTier.info(
		req.uuid,
		'controllers/tier/updateTierLimits tiers',
		Object.keys(limits)
	);

	toolsLib.tier.updateTiersLimits(limits)
		.then(() => {
			loggerTier.info(
				req.uuid,
				'controllers/tier/updateTierLimits updated limits',
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerTier.error(
				req.uuid,
				'controllers/tier/updatePairLimits err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

module.exports = {
	getTiers,
	postTier,
	putTier,
	updatePairFees,
	updateTiersLimits
};
