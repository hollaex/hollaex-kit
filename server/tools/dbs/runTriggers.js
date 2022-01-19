'use strict';

const { sequelize } = require('../../db/models');

const functions = [
	// functions
	'../../db/functions/create-uuid.js',
	// triggers
	'../../db/triggers/create_verification-code_after_user.js',
	'../../db/triggers/update_userlevel_after_verify.js'
];

let sql = '';
functions.forEach((f) => {
	sql += require(f);
});

sequelize
	.query(sql, { raw: true })
	.then(() => {
		console.log('Triggers and functions are successfully set');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Error', err);
		process.exit(1);
	});
