'use strict';

const TABLE = 'Brokers';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface
        .addColumn(TABLE, 'spread', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
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
      queryInterface.removeColumn(TABLE, 'spread'),
      queryInterface.removeColumn(TABLE, 'refresh_interval'),
    ]);
  }
};
