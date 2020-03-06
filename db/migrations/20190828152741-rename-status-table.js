'use strict';

module.exports = {
	up: (queryInterface) => {
		return queryInterface.renameTable('Status', 'Statuses');
	},
	down: (queryInterface) => queryInterface.renameTable('Statuses', 'Status')
};