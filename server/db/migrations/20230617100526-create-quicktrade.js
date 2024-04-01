'use strict';

const TABLE_NAME = 'QuickTrades';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(TABLE_NAME, {
			id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.STRING,
		unique: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
			active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			}
		},
		{
			timestamps: true,
			underscored: true
		});
	},
	down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
};