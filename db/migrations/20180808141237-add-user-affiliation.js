'use strict';
const TABLE = 'Users';
const COLUMN = 'affiliation_code';

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
			}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};