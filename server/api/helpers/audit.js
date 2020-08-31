'use strict';

const { sequelize, Audit } = require('../../db/models');
const { convertSequelizeCountAndRows } = require('./general');

const findUserAudits = (user_id, pagination = {}, timeframe, format) => {
	let options = {
		where: {},
		order:[['timestamp', 'desc']]
	};

	if (!format) {
		options = { ...options, ...pagination };
	}

	if (user_id) options.where.description = sequelize.literal(`description ->> 'user_id' = '${user_id}'`);

	if (timeframe) options.where.timestamp = timeframe;

	return Audit.findAndCountAll(options).then(convertSequelizeCountAndRows);
};

const createAudit = (admin_id, event, description, ip, domain) => {
	return Audit.create({
		admin_id,
		event,
		description,
		ip,
		domain
	});
};

module.exports = {
	findUserAudits,
	createAudit
};
