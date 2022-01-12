'use strict';

const TABLE = 'Tokens';
const PERMISSION_COLUMNS = [
	'can_read',
	'can_trade',
	'can_withdraw'
]

module.exports = {
	async up(queryInterface, Sequelize) {
		await Promise.all(PERMISSION_COLUMNS.map(async (COLUMN) => {
			await queryInterface.addColumn(TABLE, COLUMN, {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			});
		}));

		await queryInterface.addColumn(TABLE, 'whitelisted_ips', {
			type: Sequelize.JSONB,
			allowNull: false,
			defaultValue: []
		});

		await queryInterface.addColumn(TABLE, 'whitelisting_enabled', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
	},
	async down(queryInterface, Sequelize) {
		await Promise.all(COLUMNS.map(async (COLUMN) => {
			await queryInterface.removeColumn(TABLE, COLUMN);
		}));

		await queryInterface.removeColumn(TABLE, 'whitelisted_ips');
		await queryInterface.removeColumn(TABLE, 'whitelisting_enabled');
	}
};
