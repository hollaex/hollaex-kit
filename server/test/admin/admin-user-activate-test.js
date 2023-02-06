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
		const response = await request()
			.post('/v2/admin/user/activate')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'user_id': user.id,
				'activated': false
			});

		response.should.have.status(200);
		response.body.activated.should.equal(false);
		response.should.be.json;

		await request()
			.post('/v2/admin/user/activate')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'user_id': user.id,
				'activated': true
			});
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