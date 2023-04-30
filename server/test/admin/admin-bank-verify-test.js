const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/bank/verify', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});

	//Integration Testing
	it('should respond 400 for already verified bank', async () => {
		const bankArray = [
			{
				'test': 56503565
			}

		];
		let responseFirst = await request()
			.post(`/v2/admin/user/bank?id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'bank_account': bankArray
			});

		const responseSecond = await request()
			.post('/v2/admin/bank/verify')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'user_id': user.id, 'bank_id': responseFirst.body[0].id
			});


		responseSecond.should.have.status(400);
		responseSecond.body.message.should.equal('Bank is already verified');
		responseSecond.should.be.json;

	});

	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.post('/v2/admin/bank/verify')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'user_id': user.id, 'bank_id': generateFuzz()
			});

		response.should.have.status(400);
		response.should.be.json;
	});
});