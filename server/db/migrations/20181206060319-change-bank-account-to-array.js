'use strict';

const TABLE = 'Users';
const COLUMN = 'bank_account';

module.exports = {
	up: (queryInterface) => queryInterface.sequelize.query (
		`UPDATE public."${TABLE}"SET
		${COLUMN} =
			CASE
			WHEN (${COLUMN}->>'status' = '1' or ${COLUMN}->>'status'='3') then jsonb_build_array(${COLUMN})
			ELSE jsonb_build_array()
			END`
	),
	down: () => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
};