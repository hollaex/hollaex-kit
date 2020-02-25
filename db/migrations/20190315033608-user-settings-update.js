'use strict';
const TABLE = 'Users';
const COLUMN = 'settings';

module.exports = {
	up: (queryInterface) => queryInterface.sequelize.query (
		`UPDATE public."${TABLE}"SET
		${COLUMN} =
			CASE
			WHEN (${COLUMN} ? 'usernameIsSet') then jsonb_set(${COLUMN}, '{chat}', '{"set_username": true}')
			ELSE jsonb_set(${COLUMN}, '{chat}', '{"set_username": false}')
			END`
	),
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};