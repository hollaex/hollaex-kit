const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/user/role', function () {

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
			.put(`/v2/admin/user/role?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ 'role': 'support' });

		response.should.have.status(200);
		response.body.role.should.equal('support');
		response.should.be.json;

		await request()
			.put(`/v2/admin/user/role?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ 'role': 'admin' });

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