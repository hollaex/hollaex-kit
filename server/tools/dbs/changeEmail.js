const dbQuery = require('./tools/database/query');
const { revokeAllUserSessions } = require('./tools/user');
const { SERVER_PATH } = require('./constants');
const {
	PROVIDE_VALID_EMAIL,
	USER_NOT_FOUND,
	EMAIL_IS_SAME,
	EMAIL_EXISTS
} = require(`${SERVER_PATH}/messages`);
const { isEmail } = require('validator');

let userId = process.env.USER_ID;
let newEmail = process.env.EMAIL;

const changeEmail = async () => {
	const user = await dbQuery.findOne('user', {
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

	const isExists = await dbQuery.findOne('user', {
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

	await revokeAllUserSessions(userId);

	const updatedUser = await user.update(
		{ email: newEmail },
		{ fields: ['email'], returning: true }
	);

	return updatedUser;
};

changeEmail();