const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/tier', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


      //Integration Testing
	it('Integration Test -should respond 200 for Success', async () => {
        const data = { "level": Math.floor(Math.random() * 10000), "name": generateFuzz(4), "icon":  generateFuzz(5), "description":  generateFuzz(6),"deposit_limit": 10, "withdrawal_limit": 106, "fees": { "maker": { "default": 10 }, "taker": { "default": 7894791.751768798 } }, "note": "elit" }
		const response = await request()
			.post(`/v2/admin/tier`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(data)


		response.should.have.status(200);
        response.should.be.json;
        
    });



    it('Integration Test -should respond 400 for trying to update limits', async () => {
        const data = { "level": 0, "name": generateFuzz(4), "icon":  generateFuzz(5), "description":  generateFuzz(6), "deposit_limit": 10, "withdrawal_limit": 106, "fees": { "maker": { "default": 10 }, "taker": { "default": 7894791.751768798 } }, "note": "elit" }
		const response = await request()
			.put(`/v2/admin/tier`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(data)

		response.should.have.status(400);
        response.should.be.json;
        response.body.message.should.equal('Cannot update limits through this endpoint');
    });


    //Fuz Testing
    it('Fuz Test -should return error', async () => {
        const data = { "level": generateFuzz(), "name": generateFuzz(), "icon": generateFuzz(), "description": generateFuzz(), "deposit_limit": 10, "withdrawal_limit": 106, "fees": { "maker": { "default": 10 }, "taker": { "default": generateFuzz() } }, "note": generateFuzz() }
		const response = await request()
			.post(`/v2/admin/tier`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(data)


		response.should.have.status(500);
        response.should.be.json;
        
    });
});