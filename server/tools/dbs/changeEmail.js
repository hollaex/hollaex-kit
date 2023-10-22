'use strict';

const { User } = require('../../db/models');
const toolsLib = require('hollaex-tools-lib');

const {
	PROVIDE_VALID_EMAIL,
	USER_NOT_FOUND,
	EMAIL_IS_SAME,
	EMAIL_EXISTS
} = require('../../messages');
const { isEmail } = require('validator');

let userId = process.env.USER_ID;
let newEmail = process.env.EMAIL;

if (!userId) {
	throw new Error('USER_ID is not set');
}
if (!newEmail) {
	throw new Error('EMAIL is not set');
}

const changeEmail = async () => {
	const user = await User.findOne({
		where: {
			id: userId
		},
		attributes: [
			'id',
			'email',
		]
	});

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	if (!isEmail(newEmail)) {
		throw new Error(PROVIDE_VALID_EMAIL);
	}
	
	const userEmail = user.email;
	if (userEmail === newEmail) {
		throw new Error(EMAIL_IS_SAME);
	}

	const isExists = await User.findOne({
		where: {
			email: newEmail
		},
		attributes: [
			'id',
			'email',
		]
	});

	if (isExists) {
		throw new Error(EMAIL_EXISTS);
	}

	await toolsLib.user.revokeAllUserSessions(userId);

	const updatedUser = await user.update(
		{ email: newEmail },
		{ fields: ['email'], returning: true }
	);

	return updatedUser;
};

changeEmail();