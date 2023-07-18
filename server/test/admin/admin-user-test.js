const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/user', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});


	//Integration Testing
	it('Integration Test -should respond 200 for "Success"', async () => {
		const testNationality = generateFuzz(5);
		const response = await request()
			.put(`/v2/admin/user?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'nationality': testNationality
			});


		response.should.have.status(200);
		response.body.nationality.should.equal(testNationality);
		response.should.be.json;
	});


	it('Integration Test -should respond 200 for "Success"', async () => {
		const testFullName = generateFuzz(5);
		const response = await request()
			.put(`/v2/admin/user?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'full_name': testFullName
			});


		response.should.have.status(200);
		response.body.full_name.should.equal(testFullName);
		response.should.be.json;
	});


	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const testNationality = generateFuzz();
		const response = await request()
			.put(`/v2/admin/user?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'nationality': testNationality
			});

		response.should.have.status(500);
		response.should.be.json;
	});

});