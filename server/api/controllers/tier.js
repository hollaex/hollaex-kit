'use strict';

const toolsLib = require('hollaex-tools-lib');
const { loggerTier } = require('../../config/logger');
const { errorMessageConverter } = require('../../utils/conversion');

const getTiers = (req, res) => {
	try {
		return res.json(toolsLib.getKitTiers());
	} catch (err) {
		loggerTier.error(req.uuid, 'controllers/tier/getTiers err', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const postTier = (req, res) => {
	loggerTier.verbose(req.uuid, 'controllers/tier/postTier auth', req.auth);

	const { level, name, icon, description, fees, note } = req.swagger.params.data.value;

	loggerTier.info(req.uuid, 'controllers/tier/postTier new tier', level, name, description);

	toolsLib.tier.createTier(level, name, icon, description, fees, note)
		.then((tier) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			loggerTier.info(req.uuid, 'controllers/tier/postTier new tier created', level);
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
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

	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.tier.updateTier(level, updateData, auditInfo)
		.then((tier) => {
			loggerTier.info(req.uuid, 'controllers/tier/putTier tier updated', level);
			return res.json(tier);
		})
		.catch((err) => {
			loggerTier.error(req.uuid, 'controllers/tier/postTier err', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const updatePairFees = (req, res) => {
	loggerTier.verbose(
		req.uuid,
		'controllers/tier/updatePairFees auth',
		req.auth
	);

	const { fees } = req.swagger.params.data.value;

	loggerTier.info(
		req.uuid,
		'controllers/tier/updatePairFees pair',
	);
	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.tier.updatePairFees(fees, auditInfo)
		.then(() => {
			loggerTier.info(
				req.uuid,
				'controllers/tier/updatePairFees updated fees pair',
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerTier.error(
				req.uuid,
				'controllers/tier/updatePairFees err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

module.exports = {
	getTiers,
	postTier,
	putTier,
	updatePairFees
};
