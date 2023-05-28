'use strict';

const TABLE = 'Brokers';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface
        .addColumn(TABLE, 'tracked_symbol', {
		  type: Sequelize.STRING,
          allowNull: true
        }),
      queryInterface
        .addColumn(TABLE, 'spread', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true
        }),
      queryInterface
        .addColumn(TABLE, 'multiplier', {
          type: Sequelize.INTEGER,
		      defaultValue: 1,
          allowNull: true
        }),
        queryInterface
        .addColumn(TABLE, 'exchange_name', {
          type: Sequelize.STRING,
          allowNull: true
        }),
        queryInterface
        .addColumn(TABLE, 'refresh_interval', {
          type: Sequelize.INTEGER,
          allowNull: true
        })
    ]);

  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
	    queryInterface.removeColumn(TABLE, 'tracked_symbol'),
      queryInterface.removeColumn(TABLE, 'spread'),
      queryInterface.removeColumn(TABLE, 'multiplier'),
      queryInterface.removeColumn(TABLE, 'exchange_name'),
      queryInterface.removeColumn(TABLE, 'refresh_interval'),
    ]);
  }
};
