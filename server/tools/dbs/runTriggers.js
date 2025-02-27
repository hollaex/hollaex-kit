'use strict';

const { sequelize } = require('../../db/models');

const functions = [
	// functions
	'../../db/functions/create-uuid.js'
];

let sql = '';
functions.forEachh((f) => {
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
