const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/deactivate-otp', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});


	//Integration Testing
	it('Integration Test -should respond 200 for Success', async () => {
		await request()
			.put(`/v2/admin/user?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'otp_enabled': true
			});


		const response = await request()
			.post('/v2/admin/admin/deactivate-otp')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ user_id: user.id });


		response.should.have.status(200);
		response.should.be.json;

		const userData = await request()
			.get(`/v2/admin/users?id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`);
    
		userData.data.body[1].otp_enabled.should.equal(false);

		await request()
			.put(`/v2/admin/user?user_id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'otp_enabled': true
			});
	});

	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.post('/v2/admin/admin/deactivate-otp')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({ user_id: generateFuzz() });


		response.should.have.status(500);
		response.should.be.json;
	});

    
});