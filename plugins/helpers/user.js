'use strict';

const { User, Pair, VerificationImage, Balance } = require('../../db/models');
const { all } = require('bluebird');

/**
	* Checks database for user with params.
	* @param {object} params - sequelize param object.
	* @return {promise} - Promise with found user.
*/
const findUser = (params = {}) => {
	return User.findOne(params);
};

/**
	* Gives trading fees for user.
	* @param {number} verification_level - Verification level of the user.
	* @return {promise} - Promise with user trading fees.
*/
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
};

/**
	* Function to find a user by the email, it will exclude the password.
	* @param {string} email - User email.
	* @param {array} include - Keys of fields for the query.
	* @return {promise} - Promise with the user. If the dob of the user is not set, function will not return it.
*/
const getUserValuesByEmail = (email, include) => {
	return findUser({
		where: { email: email.toLowerCase() },
		attributes: include || {
			exclude: ['password', 'is_admin', 'is_support', 'is_supervisor', 'is_kyc']
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
};

/**
	* Function to find a user by the id, it will exclude the password.
	* @param {string} id - User id.
	* @param {array} include - Keys of fields for the query.
	* @return {promise} - Promise with the user. If the dob of the user is not set, function will not return it.
*/
const getUserValuesById = (id, include) => {
	return findUser({
		where: { id },
		attributes: include || {
			exclude: ['password', 'is_admin', 'is_support', 'is_supervisor', 'is_kyc']
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
};

/**
	* Function that remove values before send the user to the response.
	* @param {object} user - User data from DB.
	* @return {object} - User data values.
*/
const cleanUserFromDb = (user) => {
	const userData = {
		...user
	};

	if (user.balance) {
		userData.balance = user.balance.dataValues;
	}

	if (userData.id_data) {
		if (!userData.id_data.issued_date) {
			delete userData.id_data.issued_date;
		}
		if (!userData.id_data.expiration_date) {
			delete userData.id_data.expiration_date;
		}
	}
	if (!userData.dob) {
		delete userData.dob;
	}
	return userData;
};

module.exports = {
	findUser,
	getUserValuesByEmail,
	getUserValuesById
};