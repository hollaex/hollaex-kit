const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/user/meta', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});


	//Integration Testing
	it('Integration Test -should respond 200 for "Success"', async () => {
		const text = generateFuzz(10);
		const response = await request()
			.put(`/v2/admin/user/meta?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ 'meta': { 'test': text }, 'overwrite': false });

		response.should.have.status(200);
		response.body.meta.test.should.equal(text);
		response.should.be.json;
	});

	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.put(`/v2/admin/user/meta?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ 'meta': generateFuzz() });

		response.should.have.status(500);
		response.should.be.json;
	});

});