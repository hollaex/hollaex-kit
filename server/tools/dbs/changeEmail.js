'use strict';

const { User } = require('../../db/models');
const toolsLib = require('hollaex-tools-lib');
const { checkStatus } = require('../../init');
const {
	PROVIDE_VALID_EMAIL,
	USER_NOT_FOUND,
	EMAIL_IS_SAME,
	EMAIL_EXISTS
} = require('../../messages');
const { isEmail } = require('validator');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');

let userId = process.env.USER_ID;
let newEmail = process.env.EMAIL;

if (!userId) {
	throw new Error('USER_ID is not set');
}
if (!newEmail) {
	throw new Error('EMAIL is not set');
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const changeEmail = async () => {
	try {
		console.log(`tools/dbs/changeEmail started for ${userId} to ${newEmail}`);

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

		await user.update(
			{ email: newEmail },
			{ fields: ['email'], returning: true }
		);

		sendEmail(
			MAILTYPE.ALERT,
			null,
			{
				type: 'Email changed',
				data: `User email ${userEmail} changed to ${newEmail} by admin`
			},
			{}
		);

		await sleep(1000 * 5);
		console.log('tools/dbs/changeEmail successfully');
		process.exit(0);
	} catch(err) {
		console.log('tools/dbs/changeEmail err', err);
		process.exit(1);
	}
};

checkStatus()
	.then(() => {
		changeEmail();
	})