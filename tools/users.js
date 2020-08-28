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

const getAllUsers = () => {
	return dbQuery.findAndCountAllWithRows('user');
};

const getUserByCryptoAddress = (currency, address) => {
	if (!currency || !address) {
		throw new Error('Please provide the user\'s currency and crypto address');
	}
	return dbQuery.findOne('user', {
		where: { crypto_wallet: { [currency]: address } }
	});
};

const getUser = (opts = {}, sequelize = false) => {
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
			} else {
				return sequelize ? user : user.dataValues;
			}
		});
};

const getUserByEmail = (email, sequelize = false) => {
	if (!email || !isEmail(email)) {
		throw new Error('Please provide a valid email address');
	}
	return getUser({ email }, sequelize);
};

const getUserByKitId = (kit_id, sequelize = false) => {
	if (!kit_id) {
		throw new Error('Please provide a kit id');
	}
	return getUser({ kit_id }, sequelize);
};

const getUserByNetworkId = (network_id, sequelize = false) => {
	if (!network_id) {
		throw new Error('Please provide a network id');
	}
	return getUser({ network_id }, sequelize);
};

const freezeUser = (opts = {}, sequelize = false) => {
	return getUser(opts, true)
		.then((user) => {
			if (!user.activated) {
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
			return sequelize ? user : user.dataValues;
		});
};

const unfreezeUser = (opts = {}, sequelize = false) => {
	return getUser(opts, true)
		.then((user) => {
			if (user.activated) {
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
			return sequelize ? user : user.dataValues;
		});
};

const getUserRole = (opts = {}) => {
	return getUser(opts, true)
		.then((user) => {
			if (user.is_admin) {
				return 'admin';
			} else if (user.is_supervisor) {
				return 'supervisor';
			} else if (user.is_support) {
				return 'support';
			} else if (user.is_kyc) {
				return 'kyc';
			} else if (user.is_tech) {
				return 'tech';
			} else {
				return 'user';
			}
		});
};

module.exports = {
	getUserByEmail,
	getUserByKitId,
	getUserByNetworkId,
	getUserByCryptoAddress,
	getFrozenUsers,
	freezeUser,
	unfreezeUser,
	getAllUsers,
	getUserRole
};