'use strict';
const TABLE = 'Statuses';
const COLUMN = 'email';

const mongolian = JSON.stringify(require('../../mail/strings/mn.json'));

module.exports = {
	async up(queryInterface) {
		await queryInterface.sequelize.query(
			`UPDATE public."${TABLE}"
      SET ${COLUMN} = ${COLUMN} || '${mongolian}'
      `);
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
