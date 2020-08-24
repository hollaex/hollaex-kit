'use strict';

const { Status } = require('../../db/models');
const { INIT_CHANNEL, CONSTANTS_KEYS, SECRETS_KEYS, SECRET_MASK} = require('../../constants');
const { publisher } = require('../../db/pubsub');
const { omit, each } = require('lodash');

const getStatus = (query = {}) => {
	return Status.findOne(query);
};

const joinConstants = (statusConstants = {}, newConstants = {}, role) => {
	const joinedConstants = {
		secrets: {}
	};
	CONSTANTS_KEYS.forEach((key) => {
		if (key === 'secrets' && newConstants[key]) {
			SECRETS_KEYS.forEach((secretKey) => {
				if (newConstants[key][secretKey]) {
					if (!Array.isArray(statusConstants[key][secretKey]) && typeof statusConstants[key][secretKey] === 'object') {
						if (Object.values(newConstants[key][secretKey]).includes(SECRET_MASK)) {
							throw new Error('Masked value given');
						}
						joinedConstants[key][secretKey] = { ...statusConstants[key][secretKey], ...newConstants[key][secretKey] };
					} else {
						joinedConstants[key][secretKey] = newConstants[key][secretKey];
					}
				} else {
					joinedConstants[key][secretKey] = statusConstants[key][secretKey];
				}
			});
		}
		else if (newConstants[key]) {
			if (role === 'tech' && key === 'emails' && newConstants[key] && newConstants[key].send_email_to_support !== statusConstants[key].send_email_to_support) {
				throw new Error('Tech users cannot update the value of send_email_copy');
			}
			if (!Array.isArray(statusConstants[key]) && typeof statusConstants[key] === 'object') {
				joinedConstants[key] = { ...statusConstants[key], ...newConstants[key] };
			} else {
				joinedConstants[key] = newConstants[key];
			}
		} else {
			joinedConstants[key] = statusConstants[key];
		}
	});
	return joinedConstants;
};

const updateConstants = (constants, role) => {
	return getStatus({
		attributes: ['id', 'constants']
	})
		.then((status) => {
			if (Object.keys(constants).length > 0) {
				constants = joinConstants(status.dataValues.constants, constants, role);
			}
			return status.update({ constants }, {
				fields: [
					'constants'
				],
				returning: true
			});
		})
		.then((data) => {
			const secrets = data.constants.secrets;
			data.constants = omit(data.constants, 'secrets');
			publisher.publish(
				INIT_CHANNEL,
				JSON.stringify({
					type: 'constants', data: { constants: data.constants, secrets }
				})
			);
			return { ...data.constants, secrets: maskSecrets(secrets) };
		});
};

const maskSecrets = (secrets) => {
	each(secrets, (secret, secretKey) => {
		if (secretKey === 'captcha') {
			secret.secret_key = SECRET_MASK;
		} else if (secretKey === 'smtp') {
			secret.password = SECRET_MASK;
		} else if (secretKey === 'vault') {
			secret.secret = SECRET_MASK;
		} else if (secretKey === 'plugins') {
			each(secret, (plugin, pluginKey) => {
				if (pluginKey === 's3') {
					plugin.secret = {
						write: SECRET_MASK,
						read: SECRET_MASK
					};
				} else if (pluginKey === 'sns') {
					plugin.secret = SECRET_MASK;
				} else if (pluginKey === 'freshdesk') {
					plugin.key = SECRET_MASK;
					plugin.auth = SECRET_MASK;
				} else if (pluginKey === 'zendesk') {
					plugin.key = SECRET_MASK;
				}
			});
		}
	});
	return secrets;
};

module.exports = {
	getStatus,
	updateConstants,
	maskSecrets
};