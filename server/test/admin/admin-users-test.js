const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/users', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});

	//Integration Testing
	it('Integration Test -should respond 200 for "Success"', async () => {
		const response = await request()
			.get('/v2/admin/users')
			.set('Authorization', `Bearer ${bearerToken}`);

		response.should.have.status(200);
		response.should.be.json;
	});

	it('Integration Test -should respond 200 for "Success"', async () => {
		const response = await request()
			.get('/v2/admin/users?limit=1')
			.set('Authorization', `Bearer ${bearerToken}`);

		response.should.have.status(200);
		response.body.data.length.should.equal(1);
		response.should.be.json;
	});


	it('Integration Test -should respond 200 for "Success"', async () => {
		const response = await request()
			.get(`/v2/admin/users?search=${user.email}`)
			.set('Authorization', `Bearer ${bearerToken}`);

		response.should.have.status(200);
		response.body.data[0].email.should.equal(user.email);
		response.should.be.json;
	});


	it('Integration Test -should respond 202 for "CSV"', async () => {
		const response = await request()
			.get('/v2/admin/users?format=csv')
			.set('Authorization', `Bearer ${bearerToken}`);


		response.should.have.status(202);
	});


	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.get(`/v2/admin/users?format=${generateFuzz()}`)
			.set('Authorization', `Bearer ${bearerToken}`);


		response.should.have.status(500);
		response.should.be.json;
	});

});