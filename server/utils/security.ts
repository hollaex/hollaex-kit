'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

function generateRandomInteger(min, max) {
	const length = max - min;
	const byteLength = Math.max(1, Math.ceil(Math.ceil(Math.log2(length)) / 8));
	const offset = parseInt(crypto.randomBytes(byteLength).toString('hex'), 16) % (length + 1);

	return min + offset;
}

function generateRandomString(length = 20, pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
	return Array(length)
		.fill("")
		.map(() => pool[generateRandomInteger(0, pool.length - 1)])
		.join("");
}

module.exports = {
	generateHash,
	generateHashSync,
	generateAffiliationCode,
	generateRandomInteger,
	generateRandomString
};
