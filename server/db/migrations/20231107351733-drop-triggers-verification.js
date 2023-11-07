'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const drops = 
		`
		DROP TRIGGER IF EXISTS create_verificationcode_after_user ON "Users";
		DROP TRIGGER IF EXISTS update_userlevel_after_verify ON "VerificationCodes";
		`;
		await queryInterface.sequelize.query(drops);

		queryInterface.dropTable('VerificationCodes');
	},
	down: (queryInterface, Sequelize) =>
	new Promise((resolve) => {
		resolve();
	})
};