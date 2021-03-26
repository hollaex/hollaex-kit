'use strict';

const TABLE = 'Plugins';
const COLUMN = 'web_view';

module.exports = {
	up: (queryInterface) => 
		queryInterface
			.changeColumn(TABLE, COLUMN, { type: `jsonb USING '[]'::jsonb;` }),
	down: () => {
		return new Promise(resolve => {
			resolve();
		});
	}
};