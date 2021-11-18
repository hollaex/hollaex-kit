'use strict';

const express = require('express');
const router = express.Router();
const {
	getPlugins,
	deletePlugin,
	postPlugin,
	putPlugin,
	getPluginConfig,
	putPluginConfig,
	getPluginScript,
	disablePlugin,
	enablePlugin
} = require('./controllers');
const { checkSchema, query, body } = require('express-validator');
const toolsLib = require('../utils/toolsLib');
const lodash = require('lodash');

router.get(
	'/',
	[
		query('name').isString().notEmpty().trim().toLowerCase().optional(),
		query('search').isString().notEmpty().optional()
	],
	getPlugins
);

router.delete(
	'/',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		query('name').isString().notEmpty().trim().toLowerCase()
	],
	deletePlugin
);

router.post(
	'/',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		body('name').isString().notEmpty().trim().toLowerCase(),
		body('version').isInt({ min: 1 }),
		body('author').isString(),
		body('enabled').isBoolean(),
		body('type').isString().notEmpty().trim().toLowerCase().optional(),
		body('script').isString().notEmpty().optional(),
		body('description').isString().optional(),
		body('bio').isString().optional(),
		body('documentation').isString().optional(),
		body('icon').isString().optional(),
		body('url').isString().optional(),
		body('logo').isString().optional(),
		body('admin_view').isString().optional(),
		body('web_view').isArray().optional(),
		checkSchema({
			prescript: {
				in: ['body'],
				custom: {
					options: (value) => {
						if (!lodash.isPlainObject(value)) {
							return false;
						}
						if (value.install && lodash.isArray(value.install)) {
							for (let lib of value.install) {
								if (!lodash.isString(lib)) {
									return false;
								}
							}
						}
						if (value.run && !lodash.isString(value.run)) {
							return false;
						}
						return true;
					},
					errorMessage: 'must be an object. install value must be an array of strings. run value must be a string'
				},
				optional: { options: { nullable: true } }
			},
			postscript: {
				in: ['body'],
				custom: {
					options: (value) => {
						if (!lodash.isPlainObject(value)) {
							return false;
						}
						if (value.run && !lodash.isString(value.run)) {
							return false;
						}
						return true;
					},
					errorMessage: 'must be an object. run value must be a string'
				},
				optional: { options: { nullable: true } }
			},
			meta: {
				in: ['body'],
				custom: {
					options: (value) => {
						return lodash.isPlainObject(value);
					},
					errorMessage: 'must be an object'
				},
				optional: { options: { nullable: true } }
			},
			public_meta: {
				in: ['body'],
				custom: {
					options: (value) => {
						return lodash.isPlainObject(value);
					},
					errorMessage: 'must be an object'
				},
				optional: { options: { nullable: true } }
			}
		})
	],
	postPlugin
);

router.put(
	'/',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		body('name').isString().notEmpty().trim().toLowerCase(),
		body('version').isInt({ min: 1 }),
		body('type').isString().notEmpty().trim().toLowerCase().optional(),
		body('author').isString().optional(),
		body('script').isString().notEmpty().optional(),
		body('description').isString().optional(),
		body('bio').isString().optional(),
		body('documentation').isString().optional(),
		body('icon').isString().optional(),
		body('url').isString().optional(),
		body('logo').isString().optional(),
		body('admin_view').isString().optional(),
		body('web_view').isArray().optional(),
		checkSchema({
			prescript: {
				in: ['body'],
				custom: {
					options: (value) => {
						if (!lodash.isPlainObject(value)) {
							return false;
						}
						if (value.install && lodash.isArray(value.install)) {
							for (let lib of value.install) {
								if (!lodash.isString(lib)) {
									return false;
								}
							}
						}
						if (value.run && !lodash.isString(value.run)) {
							return false;
						}
						return true;
					},
					errorMessage: 'must be an object. install value must be an array of strings. run value must be a string'
				},
				optional: { options: { nullable: true } }
			},
			postscript: {
				in: ['body'],
				custom: {
					options: (value) => {
						if (!lodash.isPlainObject(value)) {
							return false;
						}
						if (value.run && !lodash.isString(value.run)) {
							return false;
						}
						return true;
					},
					errorMessage: 'must be an object. run value must be a string'
				},
				optional: { options: { nullable: true } }
			},
			meta: {
				in: ['body'],
				custom: {
					options: (value) => {
						return lodash.isPlainObject(value);
					},
					errorMessage: 'must be an object'
				},
				optional: { options: { nullable: true } }
			},
			public_meta: {
				in: ['body'],
				custom: {
					options: (value) => {
						return lodash.isPlainObject(value);
					},
					errorMessage: 'must be an object'
				},
				optional: { options: { nullable: true } }
			}
		})
	],
	putPlugin
);

router.get(
	'/meta',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		query('name').isString().notEmpty().trim().toLowerCase()
	],
	getPluginConfig
);

router.put(
	'/meta',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		query('name').isString().notEmpty().trim().toLowerCase(),
		checkSchema({
			meta: {
				in: ['body'],
				custom: {
					options: (value) => {
						return lodash.isPlainObject(value);
					},
					errorMessage: 'must be an object'
				},
				optional: true
			},
			public_meta: {
				in: ['body'],
				custom: {
					options: (value) => {
						return lodash.isPlainObject(value);
					},
					errorMessage: 'must be an object'
				},
				optional: true
			}
		})
	],
	putPluginConfig
);

router.get(
	'/script',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		query('name').isString().notEmpty().trim().toLowerCase()
	],
	getPluginScript
);

router.get(
	'/disable',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		query('name').isString().notEmpty().trim().toLowerCase()
	],
	disablePlugin
);

router.get(
	'/enable',
	[
		toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
		query('name').isString().notEmpty().trim().toLowerCase()
	],
	enablePlugin
);

module.exports = router;