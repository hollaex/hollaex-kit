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
			loggerDeposits.info('No withdrawals need processing');
			process.exit(0);
		}
		loggerDeposits.debug(`Processing ${withdrawals.length} withdrawals`);
		return all(withdrawals.map((withdrawal) => {
			return withdrawal.update({ processing: true }, { fields: ['processing'], returning: true })
				.then((result) => {
					return {
						success: true,
						data: result
					};
				})
				.catch((err) => {
					return {
						success: false,
						data: err.message
					};
				});
		}));
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	});