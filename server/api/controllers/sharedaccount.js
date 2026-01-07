'use strict';

const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');
const { loggerUser } = require('../../config/logger');
const { NOT_AUTHORIZED } = require('../../messages');

const createSharedaccount = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/sharedaccount/createSharedaccount auth', req.auth);

	try {
		const mainId = req?.auth?.sub?.id;
		const { email, label } = req.swagger.params.data.value;

		await toolsLib.user.createSharedaccount(mainId, { email, label });
		return res.status(201).json({ message: 'Created' });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/sharedaccount/createSharedaccount', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const getUserSharedaccounts = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/sharedaccount/getUserSharedaccounts auth', req.auth);

	try {
		const mainId = req?.auth?.sub?.id;
		const limit = req?.swagger?.params?.limit?.value;
		const page = req?.swagger?.params?.page?.value;

		const result = await toolsLib.user.getUserSharedaccounts(mainId, { limit, page });
		return res.json(result);
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/sharedaccount/getUserSharedaccounts', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const getUserAccessibleSharedaccounts = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/sharedaccount/getUserAccessibleSharedaccounts auth', req.auth);

	try {
        if (req?.auth?.is_sharedaccount) {
            throw new Error(NOT_AUTHORIZED);
        }
		const sharedId = req?.auth?.sub?.id;
		const limit = req?.swagger?.params?.limit?.value;
		const page = req?.swagger?.params?.page?.value;

		const result = await toolsLib.user.getUserAccessibleSharedaccounts(sharedId, { limit, page });
		return res.json(result);
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/sharedaccount/getUserAccessibleSharedaccounts', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const getSharedaccountAuthToken = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/sharedaccount/getSharedaccountAuthToken auth', req.auth);

	try {
        if (req?.auth?.is_sharedaccount) {
            throw new Error(NOT_AUTHORIZED);
        }
		const sharedId = req?.auth?.sub?.id;
		const ip = req.headers['x-real-ip'];
		const { sharedaccount_id } = req.swagger.params.data.value;

		const token = await toolsLib.user.issueSharedaccountToken({ sharedKitId: sharedId, sharedaccountId: sharedaccount_id, ip, headers: req.headers });
		return res.json({ token });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/sharedaccount/getSharedaccountAuthToken', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const pauseSharedaccount = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/sharedaccount/pauseSharedaccount auth', req.auth);

	try {
		const mainId = req?.auth?.sub?.id;
		const { sharedaccount_id } = req.swagger.params.data.value;

		await toolsLib.user.pauseSharedaccount(mainId, Number(sharedaccount_id));
		return res.json({ message: 'Paused' });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/sharedaccount/pauseSharedaccount', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const deleteSharedaccount = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/sharedaccount/deleteSharedaccount auth', req.auth);

	try {
		const mainId = req?.auth?.sub?.id;
		const { sharedaccount_id } = req.swagger.params.data.value;

		await toolsLib.user.deleteSharedaccount(mainId, Number(sharedaccount_id));
		return res.json({ message: 'Deleted' });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/sharedaccount/deleteSharedaccount', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const resumeSharedaccount = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/sharedaccount/resumeSharedaccount auth', req.auth);

	try {
		const mainId = req?.auth?.sub?.id;
		const { sharedaccount_id } = req.swagger.params.data.value;

		await toolsLib.user.resumeSharedaccount(mainId, Number(sharedaccount_id));
		return res.json({ message: 'Resumed' });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/sharedaccount/resumeSharedaccount', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};


module.exports = {
	createSharedaccount,
	getUserSharedaccounts,
	getUserAccessibleSharedaccounts,
	getSharedaccountAuthToken,
	pauseSharedaccount,
	deleteSharedaccount,
	resumeSharedaccount
};
