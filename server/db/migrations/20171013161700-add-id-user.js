'use strict';

const TABLE = 'Users';
const COLUMN = 'id_data';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.JSONB,
			defaultValue: {
				verified: false,
				provided: false,
				type: '',
				number: '',
				issued_date: '',
				expiration_date: ''
			}
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};