'use strict';

const TABLE = 'Plugins';
const COLUMN = 'web_view';

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.sequelize.query(`
		ALTER TABLE "${TABLE}"
		ALTER COLUMN "${COLUMN}"
		SET DATA TYPE jsonb
		USING '[]'::jsonb;
	`),
	down: (queryInterface, Sequelize) => queryInterface.sequelize.query(`
		ALTER TABLE "${TABLE}"
		ALTER COLUMN "${COLUMN}"
		SET DATA TYPE jsonb
		USING '[]'::jsonb;
	`),
};