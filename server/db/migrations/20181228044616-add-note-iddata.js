'use strict';

const TABLE = 'Users';
const COLUMN = 'id_data';

module.exports = {
	up: (queryInterface) => queryInterface.sequelize.query (
		`UPDATE public."${TABLE}"SET
		${COLUMN} = jsonb_set(${COLUMN}, '{note}', '""')`
	),
	down: () => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
};