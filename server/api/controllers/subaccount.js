'use strict';

const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');
const { loggerUser } = require('../../config/logger');
const { USER_NOT_FOUND, NOT_AUTHORIZED } = require('../../messages');

const getUserSubaccounts = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/subaccount/getUserSubaccounts auth', req.auth);

	try {
		const masterId = req?.auth?.sub?.id;
		const limit = req?.swagger?.params?.limit?.value;
		const page = req?.swagger?.params?.page?.value;

		const result = await toolsLib.user.getUserSubaccounts(masterId, { limit, page });
		return res.json(result);
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/subaccount/getUserSubaccounts', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const createSubaccount = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/subaccount/createSubaccount auth', req.auth);

	try {
		const masterId = req?.auth?.sub?.id;
		const { email, password, virtual, label, color } = req.swagger.params.data.value;

		const master = await toolsLib.user.getUserByKitId(masterId, false);
		if (!master) throw new Error(USER_NOT_FOUND);
		if (master.is_subaccount) throw new Error(NOT_AUTHORIZED);

		const sub = await toolsLib.user.createSubaccount(masterId, { email, password, virtual, label, color });
		return res.status(201).json(sub);
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/subaccount/createSubaccount', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const transferBetweenAccounts = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/subaccount/transferBetweenAccounts auth', req.auth);

	try {
		const masterId = req?.auth?.sub?.id;
		const { subaccount_id, currency, amount, direction, description } = req.swagger.params.data.value;

		const result = await toolsLib.user.transferBetweenMasterAndSub({
			masterKitId: masterId,
			subKitId: subaccount_id,
			currency,
			amount,
			direction,
			description: description || 'Subaccount Transfer'
		});

		return res.json({ message: 'Success' });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/subaccount/transferBetweenAccounts', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const getSubaccountAuthToken = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/subaccount/getSubaccountAuthToken auth', req.auth);

	try {
		const masterId = req?.auth?.sub?.id;
		const ip = req.headers['x-real-ip'];
		const { subaccount_id } = req.swagger.params.data.value;

		const token = await toolsLib.user.issueSubaccountToken({ masterKitId: masterId, subKitId: subaccount_id, ip, headers: req.headers });
		return res.json({ token });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/subaccount/getSubaccountAuthToken', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

const deleteSubaccount = async (req, res) => {
	loggerUser.verbose(req.uuid, 'controllers/subaccount/deleteSubaccount auth', req.auth);

	try {
		const masterId = req?.auth?.sub?.id;
		const { subaccount_id } = req.swagger.params.data.value;

		await toolsLib.user.deactivateSubaccount(masterId, Number(subaccount_id));

		return res.json({ message: 'Subaccount removed' });
	} catch (err) {
		loggerUser.error(req.uuid, 'controllers/subaccount/deleteSubaccount', err.message);
		const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
		return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
	}
};

module.exports = {
	getUserSubaccounts,
	createSubaccount,
	transferBetweenAccounts,
	getSubaccountAuthToken,
	deleteSubaccount
};