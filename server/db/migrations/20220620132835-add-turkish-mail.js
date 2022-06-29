'use strict';
const TABLE = 'Statuses';
const COLUMN = 'email';

const turkish = JSON.stringify(require('../../mail/strings/tr.json'));

module.exports = {
	async up(queryInterface) {
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"
      SET ${COLUMN} = ${COLUMN} || '${turkish}'
      `);
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
