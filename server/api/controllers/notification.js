'use strict';

const { loggerNotification } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const { publisher } = require('../../db/pubsub');
const { INIT_CHANNEL, WS_PUBSUB_DEPOSIT_CHANNEL } = require('../../constants');
const moment = require('moment');

const applyKitChanges = (req, res) => {
	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
	const domain = req.headers['x-real-origin'];
	loggerNotification.verbose('controller/notification/applyKitChanges ip domain', ip, domain);

	toolsLib.security.verifyNetworkHmacToken(req)
		.then(() => {
			return publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
		})
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerNotification.verbose('controller/notification/applyKitChanges', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const handleCurrencyDeposit = (req, res) => {
	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
	const domain = req.headers['x-real-origin'];
	loggerNotification.verbose('controller/notification/handleCurrencyDeposit ip domain', ip, domain);

	const currency = req.swagger.params.currency.value;
	const { user_id, amount, txid, address, is_confirmed } = req.swagger.params.data.value;

	toolsLib.security.verifyNetworkHmacToken(req)
		.then(() => {
			if (!toolsLib.subscribedToCoin(currency)) {
				throw new Error('Invalid currency');
			}
			return toolsLib.user.getUserByNetworkId(user_id);
		})
		.then((user) => {
			const depositData = {
				amount,
				currency,
				status: is_confirmed ? 'COMPLETED' : 'PENDING',
				address,
				transaction_id: txid
			};

			publisher.publish(WS_PUBSUB_DEPOSIT_CHANNEL, JSON.stringify({
				topic: 'deposit',
				action: 'insert',
				user_id: user.network_id,
				data: depositData,
				time: moment().unix()
			}));

			sendEmail(
				MAILTYPE.DEPOSIT,
				user.email,
				{
					...depositData,
					phoneNumber: user.phone_number
				},
				user.settings,
				domain
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerNotification.error(
				req.uuid,
				'controller/notification/handleCurrencyDeposit',
				err.message
			);
			return res.status(400).json({ message: `Fail - ${err.message}` });
		});
};

const handleCurrencyWithdrawal = (req, res) => {
	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
	const domain = req.headers['x-real-origin'];
	loggerNotification.verbose('controller/notification/handleCurrencyWithdrawal ip domain', ip, domain);

	const currency = req.swagger.params.currency.value;
	const { user_id, amount, txid, address, is_confirmed, fee } = req.swagger.params.data.value;

	toolsLib.security.verifyNetworkHmacToken(req)
		.then(() => {
			if (!toolsLib.subscribedToCoin(currency)) {
				throw new Error('Invalid currency');
			}
			return toolsLib.user.getUserByNetworkId(user_id);
		})
		.then((user) => {
			sendEmail(
				MAILTYPE.WITHDRAWAL,
				user.email,
				{
					amount,
					currency,
					status: is_confirmed ? 'COMPLETED' : 'PENDING',
					address,
					fee,
					transaction_id: txid,
					phoneNumber: user.phone_number
				},
				user.settings,
				domain
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerNotification.error(
				req.uuid,
				'controller/notification/handleCurrencyWithdrawal',
				err.message
			);
			return res.status(400).json({ message: `Fail - ${err.message}` });
		});
};

module.exports = {
	applyKitChanges,
	handleCurrencyDeposit,
	handleCurrencyWithdrawal
};
