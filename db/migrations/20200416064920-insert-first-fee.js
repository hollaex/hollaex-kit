'use strict';

const TABLE = 'Fees';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(
      `INSERT INTO "${TABLE}" (user_id, transaction_id, amount, currency)
      VALUES (1, 'init', 0, 'init');`
    );
  },
  down: () => {
    return new Promise((resolve) => {
      resolve();
    });
  }
};