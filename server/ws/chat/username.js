'use strict';

const { User } = require('../../db/models');
const DAY = 1000 * 60 * 60 * 24;

let usernames = {};

setInterval(() => {
	usernames = {};
}, DAY);

const findUsername = (id) => {
	return User.findOne({
		where: { id },
		attributes: ['id', 'username', 'verification_level', 'settings']
	}).then((user) => {
		return [
			user.username,
			user.settings.chat.set_username,
			user.verification_level
		];
	});
};

const getUsername = (id) => {
	if (usernames[id]) {
		return Promise.resolve(usernames[id]);
	} else {
		return changeUsername(id);
	}
};

const changeUsername = async (id) => {
	return findUsername(id).then(
		([username, set_username = false, verification_level = 1]) => {
			if (set_username) {
				usernames[id] = { username, verification_level };
			}
			return { username, verification_level };
		}
	);
};
const getUserIdByUsername = (username) => {
	return User.findOne({
		where: { username },
		attributes: ['id', 'username']
	}).then((user) => {
		return user.id;
	});
};

module.exports = {
	getUsername,
	getUserIdByUsername,
	changeUsername
};
