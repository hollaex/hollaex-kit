const {
	request,
	generateFuzz,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/user/bank', function () {

	let user, bearerToken;
	before(async () => {
		user = await tools.user.getUserByEmail(getAdminUser().email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});


	//Integration Testing
	it('Integration Test -should respond 200 for "Success"', async () => {
		const bankArray = [
			{
				'test': 56503565.59538615
			},
			{
				'test2': 16999729
			},
			{
				'test3': true,
				'test4': -99338867.04538773
			},
			{
				'test5': false,
				'test6': true,
				'test7': -90456236
			}
		];
		const response = await request()
			.post(`/v2/admin/user/bank?id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'bank_account': bankArray
			});

		response.should.have.status(200);
		response.body[0].test.should.equal(bankArray[0].test);
		response.should.be.json;
	});


	it('Integration Test -should respond 500 for "invalid schema"', async () => {
		
		const response = await request()
			.post(`/v2/admin/user/bank?id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'bank_account':{}
			});

		response.should.have.status(500);
		response.should.be.json;
	});


	//Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.post(`/v2/admin/user/bank?id=${user.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				'bank_account': generateFuzz()
			});

		response.should.have.status(500);
		response.should.be.json;
	});
});