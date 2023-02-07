const path = require('path');

process.env.NODE_ENV = 'test';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const chai = require('chai'),
	chaiHTTP = require('chai-http'),
	tools = require('hollaex-tools-lib');

chai.use(chaiHTTP);
chai.should();

const testURL = process.env.TEST_URL || 'http://localhost:10010';

function generateFuzz(length = 10000) {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+|{}:>?:"~';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function getAdminUser() {
	return {
		email: process.env.ADMIN_USER_EMAIL,
		password: process.env.ADMIN_USER_PASSWORD
	};
}

function loginAs(user) {
	return tools.security.issueToken(
		user.id,
		user.network_id,
		user.email,
		null,
		user.is_admin,
		user.is_support,
		user.is_supervisor,
		user.is_kyc,
		user.is_communicator);
}

function request() {
	const req = chai.request(testURL);

	return req;
}

module.exports = {
	loginAs,
	request,
	generateFuzz,
	getAdminUser
};
