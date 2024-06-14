'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`
		    ALTER TYPE "enum_P2pTransactions_transaction_status"
		    ADD VALUE 'closed';
		  `);
    } catch (error) {
       return error;
    }
	},
	down: () =>
		new Promise((resolve) => {
			resolve();
	})
};