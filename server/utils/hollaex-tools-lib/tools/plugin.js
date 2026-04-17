'use strict';

const dbQuery = require('./database/query');
const { paginationQuery } = require('./database/helpers');
const { Op } = require('sequelize');

const getPaginatedPlugins = (limit, page, search) => {
	const options = {
		where: {},
		raw: true,
		attributes: [
			'name',
			'version',
			'enabled',
			'author',
			'description',
			'bio',
			'url',
			'type',
			'web_view',
			'logo',
			'icon',
			'documentation',
			'created_at',
			'updated_at',
			'public_meta',
			'admin_view'
		],
		...paginationQuery(limit, page)
	};

	if (search) {
		options.where = {
			name: { [Op.like]: `%${search}%` }
		};
	}

	return dbQuery.findAndCountAll('plugin', options)
		.then((data) => {
			return {
				count: data.count,
				data: data.rows.map((plugin) => {
					plugin.enabled_admin_view = !!plugin.admin_view;
					delete plugin.admin_view;
					return plugin;
				})
			};
		});
};

const getPlugin = (name, opts = {}) => {
	return dbQuery.findOne('plugin', {
		where: { name },
		...opts
	});
};

const SMS_PLUGIN_CACHE_TTL_MS = 60 * 1000;
let smsPluginCache = { value: null, expiresAt: 0 };

const isSmsPluginActive = async () => {
	const now = Date.now();
	if (smsPluginCache.value !== null && now < smsPluginCache.expiresAt) {
		return smsPluginCache.value;
	}

	const plugin = await dbQuery.findOne('plugin', {
		where: { type: 'phone', enabled: true },
		raw: true,
		attributes: ['id']
	});

	const active = !!plugin;
	smsPluginCache = { value: active, expiresAt: now + SMS_PLUGIN_CACHE_TTL_MS };
	return active;
};

module.exports = {
	getPaginatedPlugins,
	getPlugin,
	isSmsPluginActive
};
