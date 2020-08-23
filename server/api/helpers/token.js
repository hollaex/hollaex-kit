'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Token, User } = require('../../db/models');
const { loggerToken } = require('../../config/logger');
const { verifyUserLevel } = require('./user');
const { convertSequelizeCountAndRows } = require('./general');
const redis = require('../../db/redis').duplicate();
const {
	SECRET,
	ISSUER,
	ROLES,
	BASE_SCOPES,
	TOKEN_TYPES,
	DEFAULT_TOKEN_EXPIRY,
	TOKEN_USER_LEVEL,
	ADMIN_WHITELIST_IP,
	TOKEN_TIME
} = require('../../constants');
const { TOKEN_NOT_FOUND, TOKEN_REVOKED } = require('../../messages');
const { checkAdminIp } = require('./security');

const TOKEN_KEY = 'token:key';

const issueToken = (
	id,
	email,
	ip,
	isAdmin = false,
	isSupport = false,
	isSupervisor = false,
	isKYC = false
) => {
	// Default scope is ['user']
	let scopes = [].concat(BASE_SCOPES);

	if (checkAdminIp(ADMIN_WHITELIST_IP, ip)) {
		if (isAdmin) {
			scopes = scopes.concat(ROLES.ADMIN);
		}
		if (isSupport) {
			scopes = scopes.concat(ROLES.SUPPORT);
		}
		if (isSupervisor) {
			scopes = scopes.concat(ROLES.SUPERVISOR);
		}
		if (isKYC) {
			scopes = scopes.concat(ROLES.KYC);
		}
	}

	const token = jwt.sign(
		{
			sub: {
				id,
				email
			},
			scopes,
			ip,
			iss: ISSUER
		},
		SECRET,
		{
			expiresIn: TOKEN_TIME
		}
	);
	return token;
};

const issueNoExpiryToken = (sub, scopes = BASE_SCOPES) => {
	const token = jwt.sign(
		{
			sub,
			scopes,
			iss: ISSUER
		},
		SECRET
	);

	return token;
};

const MASK_CHARS = 3;
const maskToken = (token = '') => {
	return token.substr(0, MASK_CHARS) + '********';
};
/*
  Function that transform the token object from the db to a formated object
  Takes one parameter:

  Parameter 1(object): token object from the db

  Retuns a json objecet
*/
const formatTokenObject = (tokenData) => ({
	id: tokenData.id,
	name: tokenData.name,
	apiKey: tokenData.key,
	secret: maskToken(tokenData.secret),
	active: tokenData.active,
	revoked: tokenData.revoked,
	expiry: tokenData.expiry,
	created: tokenData.created_at
});

/*
  Function that gets all the developer's tokens from the db of a user
  Takes one parameter:

  Parameter 1(integer): user id

  Retuns a promise with an object with count and data
*/
const getUserTokens = (user_id, role) => {
	loggerToken.verbose('helpers/token/getUserTokens', user_id);
	return Token.findAndCountAll({
		where: {
			user_id,
			role
		},
		attributes: {
			exclude: ['user_id', 'updated_at']
		},
		order: [['created_at', 'DESC'], ['id', 'ASC']],
		// raw: true
	})
		.then(convertSequelizeCountAndRows)
		.then(({ count, data }) => {
			const result = {
				count: count,
				data: data.map(formatTokenObject)
			};
			loggerToken.verbose('helpers/token/getUserTokens', result);
			return result;
		});
};

const createUserToken = (user_id, ip, role = ROLES.USER , type = TOKEN_TYPES.HMAC, expiry = Date.now() + DEFAULT_TOKEN_EXPIRY, name = '') => {
	const key = crypto.randomBytes(20).toString('hex');
	const secret = crypto.randomBytes(25).toString('hex');
	
	loggerToken.info(
		'helpers/token/createUserToken',
		user_id,
		ip,
		role,
		type,
		expiry,
		name
	);

	return Token.create({
		user_id,
		ip,
		key,
		secret,
		expiry,
		role,
		type,
		name,
		active: true,
	})
		.then(() => {
			loggerToken.verbose('helpers/token/createUserToken Token Created');
			return {
				id: user_id,
				key: {
					apiKey: key,
					secret
				}
			};
		})
		.catch((err) => {
			loggerToken.error('helpers/token/createUserToken', err);
		});
};

/*
  Function that revokes a token
  Takes two parameter:

  Parameter 1(integer): token id
  Parameter 2(integer): user id

  Retuns a promise with the updated token object
*/
const revokeUserToken = (token_id, user_id) => {
	loggerToken.verbose('helpers/token/revokeUserToken', token_id, user_id);
	return Token.findOne({
		where: {
			id: token_id,
			user_id
		}
	})
		.then((token) => {
			loggerToken.debug(
				'helpers/token/revokeUserToken',
				token ? token.dataValues : 'not_found'
			);
			if (!token) {
				throw new Error(TOKEN_NOT_FOUND);
			} else if (token.revoked) {
				throw new Error(TOKEN_REVOKED);
			}

			return token.update(
				{
					active: false,
					revoked: true
				},
				{ fields: ['active', 'revoked'], returning: true }
			);
		})
		.then(formatTokenObject);
};

const findToken = (query) => {
	return Token.findOne(query);
};

const findTokenByApiKey = (apiKey) => {
	return Token.findOne({
		where: {
			key: apiKey,
			active: true
		},
		include: [
			{
				model: User,
				as: 'user',
				attributes: ['id', 'email']
			}
		]
	});
};

const checkToken = (token) => {
	loggerToken.debug(
		'helpers/token/checkToken'
	);
	return findTokenByApiKey(token);
};

module.exports = {
	issueToken,
	issueNoExpiryToken,
	createUserToken,
	getUserTokens,
	revokeUserToken,
	findToken,
	checkToken
};
