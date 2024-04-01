'use strict';
const TABLE = 'Statuses';
const COLUMN = 'email';

const urdu = JSON.stringify(require('../../mail/strings/ur.json'));

module.exports = {
	async up(queryInterface) {
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"
      SET ${COLUMN} = ${COLUMN} || '${urdu}'
      `);
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
