'use strict';

const { Plugin } = require('../db/models');
const { validationResult } = require('express-validator');
const lodash = require('lodash');
const sequelize = require('sequelize');
const { loggerPlugin } = require('../config/logger');

const getPlugins = async (req, res) => {
	try {
		validationResult(req).throw();

		const { name, search } = req.query;

		loggerPlugin.verbose(
			req.uuid,
			'plugins/controllers/getPlugins',
			'name:',
			name,
			'search:',
			search
		);

		const options = {
			raw: true,
			attributes: {
				exclude: [
					'id',
					'script',
					'meta',
					'prescript',
					'postscript'
				]
			},
			order: [[ 'id', 'asc' ]]
		};

		if (name) {
			options.where = { name };
		} else if (search) {
			options.where = {
				name: { [sequelize.Op.like]: `%${search}%` }
			};
		}

		const data = await Plugin.findAndCountAll(options);

		if (name && data.count === 0) {
			throw new Error('Plugin not found');
		}

		const formattedData = {
			count: data.count,
			data: data.rows.map((plugin) => {
				plugin.enabled_admin_view = !!plugin.admin_view;
				return lodash.omit(plugin, [ 'admin_view' ]);
			})
		};

		return name ? res.json(formattedData.data[0]) : res.json(formattedData);
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/getPlugins err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

module.exports = {
	getPlugins
};
