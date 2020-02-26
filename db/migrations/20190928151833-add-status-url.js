'use strict';

const TABLE = 'Statuses';
const COLUMN = 'url';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: 'https://hollaex.com'
			});
	},
	down: (queryInterface) => {
		return queryInterface
			.removeColumn(TABLE, COLUMN);
	}
};