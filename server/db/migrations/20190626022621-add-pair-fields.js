'use strict';

const TABLE = 'Pairs';
const COLUMN1 = 'min_size';
const COLUMN2 = 'max_size';
const COLUMN3 = 'min_price';
const COLUMN4 = 'max_price';
const COLUMN5 = 'increment_size';
const COLUMN6 = 'increment_price';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn(TABLE, COLUMN1, {
				type: Sequelize.DOUBLE,
				allowNull: true
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN2, {
					type: Sequelize.DOUBLE,
					allowNull: true
				});
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN3, {
					type: Sequelize.DOUBLE,
					allowNull: true
				});
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN4, {
					type: Sequelize.DOUBLE,
					allowNull: true
				});
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN5, {
					type: Sequelize.DOUBLE,
					allowNull: true
				});
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN6, {
					type: Sequelize.DOUBLE,
					allowNull: true
				});
			});
	},
	down: (queryInterface) => {
		return queryInterface.removeColumn(TABLE, COLUMN1)
			.then(() => queryInterface.removeColumn(TABLE, COLUMN2))
			.then(() => queryInterface.removeColumn(TABLE, COLUMN3))
			.then(() => queryInterface.removeColumn(TABLE, COLUMN4))
			.then(() => queryInterface.removeColumn(TABLE, COLUMN5))
			.then(() => queryInterface.removeColumn(TABLE, COLUMN6));
	}
};