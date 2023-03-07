const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/user/role', function () {

	let user, bearerToken, newUser;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');


		const testUser = {
            email: `test_auth${Math.floor(Math.random() * 100000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        const createdUser = await request()
            .post(`/v2/signup/`)
            .send(testUser);

		newUser = await tools.user.getUserByEmail(testUser.email);
	});

	//Integration Testing
	it('Integration Test -should respond 200 for "Success"', async () => {

		const response = await request()
			.put(`/v2/admin/user/role?user_id=${newUser.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ 'role': 'support' });

		response.should.have.status(200);
		response.body.is_support.should.equal(true);
		response.should.be.json;
	
	});

	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.put(`/v2/admin/user/role?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ 'role': generateFuzz() });

		response.should.have.status(500);
		response.should.be.json;
	});

});