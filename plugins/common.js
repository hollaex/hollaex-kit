'use strict';

const jwt = require('jsonwebtoken');
const SECRET = 'aec18e8ad23994b1d14599bfd1d9c394';
const ISSUER = 'bitholla.com';
const TOKEN_TIME = 1000 * 60 * 60 * 24;
const { intersection } = require('lodash');
const { User, Pair, Balance, VerificationImage } = require('../../db/models');

const verifyToken = (req, res, next) => {
	const sendError = (msg) => {
		res.json({ message: `Access Denied: ${msg}`});
	};

	const token = req.headers['authorization'];

	if (token && token.indexOf('Bearer ') === 0) {
		let tokenString = token.split(' ')[1];

		jwt.verify(tokenString, SECRET, (verificationError, decodedToken) => {
			if (!verificationError && decodedToken) {

				const issuerMatch = decodedToken.iss == ISSUER;
				const dateMatch = Date.now() - decodedToken.expiry < TOKEN_TIME;

				if (dateMatch && issuerMatch) {
					req.auth = decodedToken;
					next();
				} else {
					sendError('Token is expired');
				}
			} else {
				sendError('Invalid Token')
			}
		})
	} else {
		sendError('Missing Header');
	}
}

const checkScopes = (endpointScopes, userScope) => {
	if (intersection(endpointScopes, userScopes).length === 0) {
		throw new Error('Not Authorized');
	}
}

const findUser = (params = {}) => {
	return User.findOne(params);
}

/*
  Function to find a user by the email, it will exclude the password,
  should take one parameter:

  Param 1(String): User email
  Param 2(array[string], optional): Keys of fields for the query

  Return a promise with the user, if the dob of the user is not set, it will not return it.
  If the user is not found, it will throw an error.
 */
const getUserValuesByEmail = (email, include) => {
	findUser({
		where: { email: email.toLowerCase() },
		attributes: include || {
			exclude: ['password', 'is_admin', 'is_support', 'is_supervisor']
		},
		include: [
			{
				model: Balance,
				as: 'balance',
				attributes: {
					exclude: ['id', 'user_id', 'created_at']
				}
			},
			{
				model: VerificationImage,
				as: 'images',
				attributes: ['id']
			}
		]
	})
		.then((data) => {
			return all([
				data.dataValues,
				findUserPairFees(data.verification_level)
			]);
		})
		.then(([userData, fees]) => {
			return {
				...userData,
				fees
			};
		})
		.then(cleanUserFromDb);
}

const getUserValuesById = (id, include) => {
	findUser({
		where: { id },
		attributes: include || {
			exclude: ['password', 'is_admin', 'is_support', 'is_supervisor']
		},
		include: [
			{
				model: Balance,
				as: 'balance',
				attributes: {
					exclude: ['id', 'user_id', 'created_at']
				}
			},
			{
				model: VerificationImage,
				as: 'images',
				attributes: ['id']
			}
		]
	})
		.then((data) => {
			return all([
				data.dataValues,
				findUserPairFees(data.verification_level)
			]);
		})
		.then(([userData, fees]) => {
			return {
				...userData,
				fees
			};
		})
		.then(cleanUserFromDb);
}

const findUserPairFees = (verification_level = 0) => {
	return Pair.findAll({
		attributes: ['name', 'maker_fees', 'taker_fees']
	}).then((data) => {
		const userData = {};
		data.forEach(({ name, maker_fees, taker_fees }) => {
			userData[name] = {
				maker_fee: maker_fees[verification_level] || 0,
				taker_fee: taker_fees[verification_level] || 0
			};
		});
		return userData;
	});
}

/*
  Function that remove values before send the user to the response,
  should take one parameter:

  Param 1(Object): User data from DB

  Return the user data values.
 */
const cleanUserFromDb = (user) => {
	const userData = {
		...user
	};

	userData.balance = user.balance.dataValues;

	// if (userData.bank_account) {
	//   delete userData.bank_account.provided;
	// }
	if (userData.id_data) {
		// delete userData.id_data.provided;

		if (!userData.id_data.issued_date) {
			delete userData.id_data.issued_date;
		}
		if (!userData.id_data.expiration_date) {
			delete userData.id_data.expiration_date;
		}
		// if (userData.images && userData.images.length > 0) {
		//   userData.id_data.provided = true;
		// } else {
		//   userData.id_data.provided = false;
		// }
	}
	if (!userData.dob) {
		delete userData.dob;
	}

	return userData;
};

module.exports = {
	verifyToken,
	checkScopes,
	findUser,
	getUserValuesByEmail
};