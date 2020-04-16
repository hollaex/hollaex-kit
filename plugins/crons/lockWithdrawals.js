'use strict';

const { Deposit } = require('../../db/models');
const { all } = require('bluebird');
const { checkAddress } = require('../vault/helpers');
const { loggerDeposits } = require('../../config/logger');
const { each } = require('lodash');
const { GET_SECRETS } = require('../../constants');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');

const vaultCoins = [];
each(GET_SECRETS().vault.connected_coins, (coin) => {
	vaultCoins.push({
		currency: coin
	});
});
Deposit.findAll({
	where: {
		type: 'withdrawal',
		status: false,
		dismissed: false,
		rejected: false,
		processing: false,
		waiting: false,
		$or: vaultCoins
	}
})
	.then((withdrawals) => {
		if (withdrawals.length === 0) {
			loggerDeposits.info('No withdrawals need locking');
			process.exit(0);
		}
		loggerDeposits.debug(`Locking ${withdrawals.length} withdrawals`);
		return all(withdrawals.map((withdrawal) => {
			if (checkAddress(withdrawal.dataValues.currency)) {
				return withdrawal.update({ processing: true }, { fields: ['processing'], returning: true })
					.then((result) => {
						loggerDeposits.info(`Withdrawal with ID ${withdrawal.dataValues.id} locked`);
						return;
					})
					.catch((err) => {
						loggerDeposits.error(`Error occured while locking ${withdrawal.dataValues.id}: ${err.message}`);
						return;
					});
			} else {
				return withdrawal.update({ rejected: true }, { fields: ['rejected'], returning: true })
					.then((result) => {
						loggerDeposits.info(`Withdrawal with ID ${withdrawal.dataValues.id} rejected because of invalid address`);
						return sendEmail()
					})
					.catch((err) => {
						loggerDeposits.error(`Error occured while locking ${withdrawal.dataValues.id}: ${err.message}`);
						return;
					});
			}
		}));
	})
	.then(() => {
		loggerDeposits.info(`Locked withdrawals`);
		process.exit(0);
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	});