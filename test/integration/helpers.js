const chai = require('chai'),
	chaiHTTP = require('chai-http'),
	tools = require('hollaex-tools-lib');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

chai.use(chaiHTTP);
chai.should();

const testURL = process.env.TEST_URL || 'http://localhost';

const userCredentials = {
	email: process.env.TEST_EMAIL || 'tester',
	password: process.env.TEST_PASSWORD || 'hunter2'
};

const adminCredentials = {
	email: process.env.ADMIN_EMAIL || 'admin',
	password: process.env.ADMIN_PASSWORD || '2retnuh'
};

async function ensureTestAccountsExist() {
	const user = await tools.user.getUserByEmail(userCredentials.email);
	const admin = await tools.user.getUserByEmail(adminCredentials.email);

	if (!user) {
		await tools.user.createUser(userCredentials.email, userCredentials.password);
	}

	if (!admin) {
		await tools.user.createUser(adminCredentials.email, adminCredentials.password, { role: 'admin' });
	}
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

async function loginAsTestUser() {
	await ensureTestAccountsExist();
	const user = await tools.user.getUserByEmail(userCredentials.email);
	return loginAs(user);
}

async function loginAsAdmin() {
	await ensureTestAccountsExist();
	const admin = await tools.user.getUserByEmail(adminCredentials.email);
	return loginAs(admin);
}

async function request(token) {
	const req = chai.request(testURL);

	if (!token) {
		req = req.set('Authorization', `Bearer ${token}`);
	}

	return req;
}

module.exports = {
	request,
	tools,
	testURL,
	credentials: {
		user: userCredentials,
		admin: adminCredentials
	},
	loginAs,
	loginAsTestUser,
	loginAsAdmin
};
