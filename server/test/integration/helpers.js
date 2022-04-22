const path = require('path');

process.env.NODE_ENV = 'test';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const chai = require('chai'),
	chaiHTTP = require('chai-http'),
	tools = require('hollaex-tools-lib');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});


chai.use(chaiHTTP);
chai.should();

const testURL = process.env.TEST_URL || 'http://localhost:10010';

const userCredentials = {
	email: 'tester@holla.tech',
	password: 'hunter2'
};

const adminCredentials = {
	email: 'admintester@holla.tech',
	password: '2retnuh'
};

async function ensureAccountExists(credentials, isAdmin = false) {
	await tools.checkExchangeStatus();
	const user = await tools.user.getUserByEmail(credentials.email);

	if (!user) {
		await tools.user.createUser(
			credentials.email,
			credentials.password,
			{ role: isAdmin ? 'admin' : 'user' });
	}
}

async function ensureTestAccountsExist() {
	await ensureAccountExists(userCredentials);
	await ensureAccountExists(adminCredentials, true);
}

async function getTestUser() {
	return await tools.user.getUserByEmail(userCredentials.email);
}

async function getTestAdmin() {
	return await tools.user.getUserByEmail(adminCredentials.email);
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

async function otpCodeFor(user, forceEnable = false) {
	var secret;

	if (!(await tools.security.userHasOtpEnabled(user.id))) {
		if (!forceEnabled) {
			throw new Error('Cannot get OTP code for user, OTP not enabled');
		}
		secret = await tools.security.createOtp(user.id);
		await tools.security.setActiveUserOtp(user.id);
	} else {
		const otpCode = await tools.database.findOne('otp code', { where: { user_id: user.id }, attributes: ['id', 'secret'] });
		secret = otpCode.secret;
	}

	return await tools.security.generateOtp(secret);
}

async function emailCodeFor(user, bearerToken = undefined) {
	let emailCode = await tools.database.client.getAsync(`ConfirmationEmail:${user.id}`);

	if (!emailCode && bearerToken) {
		const response = await request()
			.get('/v2/user/request-email-confirmation')
			.set('Authorization', `Bearer ${bearerToken}`);

		emailCode = await tools.database.client.getAsync(`ConfirmationEmail:${user.id}`);
	}

	return emailCode;
}

function sleep(msDelay) {
	return new Promise((resolve) => setTimeout(resolve, msDelay));
}

before(async function() {
	this.timeout(10000);
	await ensureTestAccountsExist();
});

module.exports = {
	credentials: {
		user: userCredentials,
		admin: adminCredentials
	},
	getTestUser,
	getTestAdmin,
	loginAs,
	request,
	tools,
	testURL,
	otpCodeFor,
	emailCodeFor,
	sleep
};
