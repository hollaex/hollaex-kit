'use strict';
const TABLE = 'Users';
const COLUMN = 'affiliation_code';
const COLUMN2 = 'affiliation_rate';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.STRING,
				defaultValue: ''
			})
			.then(() => {
				return queryInterface.sequelize.query(
					`UPDATE "${TABLE}" SET ${COLUMN} = upper(substring(MD5(random()::text), 1, 6))`
				);
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN2, {
					type: Sequelize.DOUBLE,
					defaultValue: 0
				});	
			}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};