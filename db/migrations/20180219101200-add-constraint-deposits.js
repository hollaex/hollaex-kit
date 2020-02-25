'use strict';

const TABLE = 'Deposits';
const CONSTRAINT_NAME = 'unique_deposit';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.sequelize.query(
			`ALTER TABLE  "${TABLE}" ADD CONSTRAINT ${CONSTRAINT_NAME} UNIQUE (address, transaction_id, type);`
		),
	down: (queryInterface, Sequelize) =>
		queryInterface.sequelize.query(
			`ALTER TABLE  "${TABLE}" DROP CONSTRAINT ${CONSTRAINT_NAME};`
		)
};
