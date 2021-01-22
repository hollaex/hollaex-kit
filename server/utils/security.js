'use strict';

const bcrypt = require('bcryptjs');
const randomString = require('random-string');


const generateHash = (password) => {
	const { SALT_ROUNDS } = require('../constants');
	return bcrypt.hash(password, SALT_ROUNDS);
};

const generateHashSync = (password) => {
	const { SALT_ROUNDS } = require('../constants');
	return bcrypt.hashSync(password, SALT_ROUNDS);
};

const generateAffiliationCode = () => {
	const { AFFILIATION_CODE_LENGTH } = require('../constants');
	return randomString({
		length: AFFILIATION_CODE_LENGTH,
		numeric: true,
		letters: true
	}).toUpperCase();
};


module.exports = {
	generateHash,
	generateHashSync,
	generateAffiliationCode
};