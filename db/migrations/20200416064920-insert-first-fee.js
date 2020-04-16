'use strict';

const TABLE = 'Fees';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(
      `INSERT INTO "${TABLE}" (transaction_id, amount, currency)
      VALUES ('init', 0, 'init');`
    );
  },
  down: () => {
    return new Promise((resolve) => {
      resolve();
    });
  }
};