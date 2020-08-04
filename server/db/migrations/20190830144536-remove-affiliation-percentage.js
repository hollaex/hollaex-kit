'use strict';

const TABLE = 'Affiliations';
const COLUMN = 'percentage';

module.exports = {
	up: (queryInterface) => {
		return queryInterface
			.removeColumn(TABLE, COLUMN);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 10
			});
	}
};