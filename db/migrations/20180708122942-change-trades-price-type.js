'use strict';

const TABLE = 'Trades';
const COLUMN = 'price';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.sequelize.query(
			`ALTER TABLE public."${TABLE}" ALTER COLUMN price TYPE float8 USING price::float8;
    ALTER TABLE public."${TABLE}" ALTER COLUMN price SET NOT NULL;
    ALTER TABLE public."${TABLE}" ALTER COLUMN price DROP DEFAULT;`
		),
	down: (queryInterface, Sequelize) =>
		queryInterface.sequelize.query(
			`ALTER TABLE public."${TABLE}" ALTER COLUMN price TYPE int4 USING price::int4;
    ALTER TABLE public."${TABLE}" ALTER COLUMN price SET NOT NULL;
    ALTER TABLE public."${TABLE}" ALTER COLUMN price DROP DEFAULT;`
		)
};