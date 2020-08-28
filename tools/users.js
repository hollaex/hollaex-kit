'use strict';

// const model = require('./database').model;
const dbQuery = require('./database').query;
const { isEmail } = require('validator');
const { SERVER_PATH } = require('../constant');
const { getFrozenUsers } = require(`${SERVER_PATH}/init`);
const { publisher } = require('./database/redis');
const { INIT_CHANNEL } = require(`${SERVER_PATH}/constant`);
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);

const getUserByEmail = (email, sequelize = false) => {
	if (!email || !isEmail(email)) {
		throw new Error('Please provide a valid email address');
	}
	return dbQuery.findOne('user', {
		where: { email }
	})
		.then((user) => {
			if (!user) {
				throw new Error(`User with email ${email} does not exist`);
			} else {
				if (sequelize) {
					return user;
				} else {
					return user.dataValues;
				}
			}
		});
};

const getUserByKitId = (id, sequelize = false) => {
	if (!id) {
		throw new Error('Please provide an id');
	}
	return dbQuery.findOne('user', {
		where: { id }
	})
		.then((user) => {
			if (!user) {
				throw new Error(`User with kit id ${id} does not exist`);
			} else {
				if (sequelize) {
					return user;
				} else {
					return user.dataValues;
				}
			}
		});
};

const getUserByNetworkId = (network_id, sequelize = false) => {
	if (!network_id) {
		throw new Error('Please provide an id');
	}
	return dbQuery.findOne('user', {
		where: { network_id }
	})
		.then((user) => {
			if (!user) {
				throw new Error(`User with network id ${network_id} does not exist`);
			} else {
				if (sequelize) {
					return user;
				} else {
					return user.dataValues;
				}
			}
		});
};

const freezeUser = (opts = {}, sequelize = false) => {
	if (!opts.email && !opts.kit_id && !opts.network_id) {
		throw new Error('Please provide the user\'s kit id, network id, or email');
	}
	const where = {};
	if (opts.email) {
		where.email = opts.email;
	} else if (opts.kit_id) {
		where.id = opts.kit_id;
	} else {
		where.network_id = opts.network_id;
	}
	return dbQuery.findOne('user', {
		where
	})
		.then((user) => {
			if (!user) {
				throw new Error('User does not exist');
			} else if (!user.activated) {
				throw new Error('User account is already frozen');
			}
			return user.update({ activated: false }, { fields: ['activated'], returning: true });
		})
		.then((user) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({type: 'freezeUser', data: user.id }));
			sendEmail(
				MAILTYPE.USER_DEACTIVATED,
				user.email,
				{
					type: 'deactivated'
				},
				user.settings
			);
			if (sequelize) {
				return user;
			} else {
				return user.dataValues;
			}
		});
};

const unfreezeUser = (opts = {}, sequelize = false) => {
	if (!opts.email && !opts.kit_id && !opts.network_id) {
		throw new Error('Please provide the user\'s kit id, network id, or email');
	}
	const where = {};
	if (opts.email) {
		where.email = opts.email;
	} else if (opts.kit_id) {
		where.id = opts.kit_id;
	} else {
		where.network_id = opts.network_id;
	}
	return dbQuery.findOne('user', {
		where
	})
		.then((user) => {
			if (!user) {
				throw new Error('User does not exist');
			} else if (user.activated) {
				throw new Error('User account is not frozen');
			}
			return user.update({ activated: true }, { fields: ['activated'], returning: true });
		})
		.then((user) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({type: 'unfreezeUser', data: user.id }));
			sendEmail(
				MAILTYPE.USER_DEACTIVATED,
				user.email,
				{
					type: 'activated'
				},
				user.settings
			);
			if (sequelize) {
				return user;
			} else {
				return user.dataValues;
			}
		});
};

module.exports = {
	getUserByEmail,
	getUserByKitId,
	getUserByNetworkId,
	getFrozenUsers,
	freezeUser,
	unfreezeUser
};