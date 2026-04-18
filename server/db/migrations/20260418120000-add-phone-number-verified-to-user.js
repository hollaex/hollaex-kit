'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('Users', 'phone_number_verified', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});

		await queryInterface.sequelize.query(
			`UPDATE "Users"
				SET phone_number_verified = true
				WHERE phone_number IS NOT NULL
				AND phone_number <> ''`
		);
	},

	down: async (queryInterface) => {
		await queryInterface.removeColumn('Users', 'phone_number_verified');
	}
};
