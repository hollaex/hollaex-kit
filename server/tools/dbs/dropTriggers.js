'use strict';

const { sequelize } = require('../../db/models');

const drops = 
`
DROP TRIGGER IF EXISTS create_verificationcode_after_user ON "Users";
DROP TRIGGER IF EXISTS update_userlevel_after_verify ON "VerificationCodes";
`;
sequelize
	.query(drops, { raw: true })
    .then(() => {
        console.log('Triggers and functions are successfully dropped');
		process.exit(0);
    })
    .catch((err) => {
		console.error('Error', err.message);
		process.exit(1);
	});