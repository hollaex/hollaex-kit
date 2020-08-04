'use strict';

const { findUser } = require('./user');
const { Affiliation, User } = require('../../db/models');
const { loggerAffiliation } = require('../../config/logger');
const { getSecrets } = require('../../init');

const findUserByAffiliationCode = (affiliationCode) => {
	const code = affiliationCode.toUpperCase().trim();
	return findUser({
		where: { affiliation_code: code },
		attributes: ['id', 'email', 'affiliation_code']
	});
};

const checkAffiliation = (affiliationCode, user_id) => {
	let discount = 0; // default discount rate in percentage

	if (!affiliationCode) {
		loggerAffiliation.verbose(
			'helpers/checkAffiliation',
			'no affiliation',
			user_id
		);
		return new Promise((resolve) => resolve());
	}
	return findUserByAffiliationCode(affiliationCode)
		.then((referrer) => {
			if (getSecrets().plugins.affiliation && getSecrets().plugins.affiliation.discount) {
				discount = getSecrets().plugins.affiliation.discount;
			}

			return Affiliation.create({
				user_id,
				referer_id: referrer.id
			});
		})
		.then((affiliation) => {
			return User.update(
				{
					discount
				},
				{
					where: {
						id: affiliation.user_id
					},
					fields: ['discount']
				}
			);
		})
		.catch((err) => {
			loggerAffiliation.error('helpers/checkAffiliation', 'catch', err);
		});
};

const getAffiliationCount = (user_id) => {
	return Affiliation.count({
		where: {
			referer_id: user_id
		}
	});
};

module.exports = {
	checkAffiliation,
	getAffiliationCount
};
