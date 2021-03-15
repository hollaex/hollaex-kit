'use strict';

const TABLE = 'Users';
const OLD_COLUMN = 'first_name';
const NEW_COLUMN = 'full_name';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.renameColumn(TABLE, OLD_COLUMN, NEW_COLUMN).then(() => {
			return queryInterface.sequelize.query(
				`UPDATE "${TABLE}" SET ${NEW_COLUMN} = ${NEW_COLUMN} || ' ' || last_name;`
			);
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.renameColumn(TABLE, NEW_COLUMN, OLD_COLUMN)
};