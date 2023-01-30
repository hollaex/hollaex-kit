const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/verify-email', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});

	//Integration Testing
	it('Integration Test -should return 400 for already verified email', async () => {
		const response = await request()
			.post('/v2/admin/verify-email')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				user_id: user.id
			});

		response.should.have.status(400);
		response.should.be.json;
	});


	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.post('/v2/admin/verify-email')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				user_id: generateFuzz()
			});

		response.should.have.status(500);
		response.should.be.json;
	});

});