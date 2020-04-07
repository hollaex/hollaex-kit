'use strict';

const { Deposit } = require('../../db/models');
const { all } = require('bluebird');
const { loggerDeposits } = require('../../config/logger');

Deposit.findAll({
	where: {
		type: 'withdrawal',
		status: false,
		dismissed: false,
		rejected: false,
		processing: false,
		waiting: false
	}
})
	.then((withdrawals) => {
		if (withdrawals.length === 0) {
			loggerDeposits.info('No withdrawals need locking');
			process.exit(0);
		}
		loggerDeposits.debug(`Locking ${withdrawals.length} withdrawals`);
		return all(withdrawals.map((withdrawal) => {
			return withdrawal.update({ processing: true }, { fields: ['processing'], returning: true })
				.then((result) => {
					loggerDeposits.info(`Withdrawal with ID ${withdrawal.dataValues.id} locked`);
					return;
				})
				.catch((err) => {
					loggerDeposits.error(`Error occured while locking ${withdrawal.dataValues.id}: ${err.message}`);
					return;
				});
		}));
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	});