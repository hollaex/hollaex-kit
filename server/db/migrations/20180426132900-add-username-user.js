'use strict';

const TABLE = 'Users';
const COLUMN = 'username';
const EMAIL_COLUMN = 'email';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.STRING,
				defaultValue: ''
			})
			.then(() => {
				return queryInterface.sequelize.query(
					`UPDATE "${TABLE}" SET ${COLUMN} =  SUBSTRING(${EMAIL_COLUMN}, 0, POSITION('@' in ${EMAIL_COLUMN}))`
				);
			}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};