'use strict';
const TABLE = 'Users';
const COLUMN = 'email_verified';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			})
			.then(() => {
				return queryInterface.sequelize.query(
					`UPDATE "${TABLE}"
						SET ${COLUMN} = true
						WHERE verification_level > 0
					`
				);
			})
			.then(() => {
				return queryInterface.sequelize.query(
					`UPDATE "${TABLE}"
						SET verification_level = 1
						WHERE verification_level = 0
					`
				);
			}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};