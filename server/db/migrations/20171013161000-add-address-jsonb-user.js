'use strict';

const TABLE = 'Users';
const COLUMN = 'address';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.JSONB,
			defaultValue: {
				country: '',
				address: '',
				city: '',
				postal_code: ''
			}
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};