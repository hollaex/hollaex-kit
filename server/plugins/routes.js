'use strict';

const express = require('express');
const router = express.Router();
const { getPlugins } = require('./controllers');
const { checkSchema } = require('express-validator');

router.get(
	'/',
	checkSchema({
		name: {
			in: ['query'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		},
		search: {
			in: ['query'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		}
	}),
	getPlugins
);

module.exports = router;