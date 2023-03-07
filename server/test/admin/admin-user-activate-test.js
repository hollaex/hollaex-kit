const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/user/activate', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});


	//Integration Testing
	it('Integration Test -should respond 200 for "Success"', async () => {

		const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        const createdUser = await request()
            .post(`/v2/signup/`)
            .send(testUser);

        const userObject = await tools.user.getUserByEmail(testUser.email);
        createdUser.body.id = userObject.id;

		const response = await request()
			.post('/v2/admin/user/activate')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'user_id': createdUser.body.id,
				'activated': false
			});

		response.should.have.status(200);
		response.should.be.json;


		const userResponse = await request()
			.get(`/v2/admin/users?search=${testUser.email}`)
			.set('Authorization', `Bearer ${bearerToken}`);


		userResponse.body.data[0].activated.should.equal(false);
	
	});


	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.post('/v2/admin/user/activate')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'user_id': generateFuzz(),
				'activated': generateFuzz()
			});

		response.should.have.status(500);
		response.should.be.json;
	});


});