'use strict';

const models = require('../models');

module.exports = {
	async up(queryInterface) {
		const roleModel = models['Role'];

		const role = await roleModel.findOne({
			where: { role_name: 'admin' }
		});

		if (role && Array.isArray(role.configs) && !role.configs.includes('auto_deposit')) {
			role.set('configs', [...role.configs, 'auto_deposit']);
			await role.save();
		}
	},

	down: () => {
		return Promise.resolve();
	}
};