'use strict';

const TABLE = 'Statuses';
const COLUMN = 'constants';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.JSONB,
				defaultValue: {},
			});
	},
	down: (queryInterface) => {
		return queryInterface
			.removeColumn(TABLE, COLUMN);
	}
};