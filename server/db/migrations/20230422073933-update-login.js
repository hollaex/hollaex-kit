'use strict';

const TABLE = 'Logins';

module.exports = {
	up: (queryInterface, Sequelize) => 
		Promise.all([
			queryInterface.addColumn(TABLE, 'attempt', {
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: 1
			}),
			queryInterface.addColumn(TABLE, 'status', {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			}),
			queryInterface.addColumn(TABLE, 'country', {
				type: Sequelize.STRING,
				allowNull: true
			}),
			queryInterface.addColumn(TABLE, 'updated_at', {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()')
			}),
			queryInterface.addColumn(TABLE, 'created_at', {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()')
			}),
		]),
	down: (queryInterface) =>
		Promise.all([
			queryInterface.removeColumn(TABLE, 'attempt'),
			queryInterface.removeColumn(TABLE, 'status'),
			queryInterface.removeColumn(TABLE, 'country'),
			queryInterface.removeColumn(TABLE, 'updated_at'),
			queryInterface.removeColumn(TABLE, 'created_at'),
		])
};
