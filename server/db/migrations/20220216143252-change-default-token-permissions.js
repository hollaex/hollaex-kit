'use strict';

const TABLE = 'Tokens';

module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.changeColumn(TABLE, 'can_read', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true
		});
		await queryInterface.bulkUpdate(TABLE, { can_read: true, can_trade: true });
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.changeColumn(TABLE, 'can_read', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
	}
};
