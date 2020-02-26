'use strict';
const TABLE = 'Users';
const COLUMN = 'settings';

module.exports = {
	up: (queryInterface) => queryInterface.sequelize.query (
		`UPDATE public."${TABLE}"SET
		${COLUMN} = ${COLUMN} #- '{theme}' #- '{usernameIsSet}' #- '{orderConfirmationPopup}'`
	),
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};