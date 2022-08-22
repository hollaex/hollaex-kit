'use strict';

const TABLE = 'Brokers';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface
        .addColumn(TABLE, 'type', {
          type: Sequelize.ENUM('manual', 'dynamic'),
          defaultValue: 'manual',
          allowNull: false
        }),
      queryInterface
        .addColumn(TABLE, 'quote_expiry_time', {
          type: Sequelize.INTEGER,
          defaultValue: 30,
          allowNull: true
        }),
      queryInterface
        .addColumn(TABLE, 'rebalancing_symbol', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      queryInterface
        .addColumn(TABLE, 'account', {
          type: Sequelize.JSONB,
          allowNull: true,
        }),
      queryInterface
        .addColumn(TABLE, 'formula', {
          type: Sequelize.TEXT,
          allowNull: true
        }),
      queryInterface
        .changeColumn(TABLE, 'buy_price', {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        }),
      queryInterface
        .changeColumn(TABLE, 'sell_price', {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        })
    ]);

  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(TABLE, 'type'),
      queryInterface.removeColumn(TABLE, 'quote_expiry_time'),
      queryInterface.removeColumn(TABLE, 'rebalancing_symbol'),
      queryInterface.removeColumn(TABLE, 'account'),
      queryInterface.removeColumn(TABLE, 'formula'),
      queryInterface
        .changeColumn(TABLE, 'buy_price', {
          type: Sequelize.DOUBLE,
          allowNull: false,
        }),
      queryInterface
        .changeColumn(TABLE, 'sell_price', {
          type: Sequelize.DOUBLE,
          allowNull: false,
        })
    ]);
  }
};
