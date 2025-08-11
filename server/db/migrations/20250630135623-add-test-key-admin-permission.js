'use strict';

const models = require('../models');

module.exports = {
	async up(queryInterface) {
		const roleModel = models['Role'];

		const role = await roleModel.findOne({
			where: { role_name: 'admin' }
		});

		if (role && Array.isArray(role.configs) && !role.configs.includes('test_key')) {
			role.set('configs', [...role.configs, 'test_key']);
			await role.save();
		}
	},

	down: () => {
		return Promise.resolve();
	}
};