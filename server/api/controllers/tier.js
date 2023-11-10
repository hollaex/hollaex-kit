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

	const { level, name, icon, description, fees, note } = req.swagger.params.data.value;

	loggerTier.info(req.uuid, 'controllers/tier/postTier new tier', level, name, description);

	toolsLib.tier.createTier(level, name, icon, description, fees, note)
		.then((tier) => {
			toolsLib.user.createAuditLog(req?.auth?.sub?.email, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
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

	const { level, name, icon, description, note, native_currency_limit } = req.swagger.params.data.value;

	const updateData = {
		name,
		icon,
		description,
		note,
		native_currency_limit
	};

	const auditInfo = { userEmail: req?.auth?.sub?.email, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.tier.updateTier(level, updateData, auditInfo)
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
	const auditInfo = { userEmail: req?.auth?.sub?.email, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.tier.updatePairFees(pair, fees, auditInfo)
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

module.exports = {
	getTiers,
	postTier,
	putTier,
	updatePairFees
};
