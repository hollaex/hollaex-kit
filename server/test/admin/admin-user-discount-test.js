const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/user/discount', function () {
	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});

	//Integration Testing
	it('Integration Test -should respond 200 for "Success"', async () => {
		const paramNumber = 8.41;
		const response = await request()
			.put(`/v2/admin/user/discount?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				discount: paramNumber
			});

		response.should.have.status(200);
		response.body.discount.should.equal(paramNumber);
		response.should.be.json;
	});


	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.put(`/v2/admin/user/discount?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ 'discount': generateFuzz() });

		response.should.have.status(500);
		response.should.be.json;
	});

});