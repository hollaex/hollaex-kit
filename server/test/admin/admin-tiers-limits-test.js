const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/tiers/limits', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    //Integration Testing
	it('Integration Test -should respond 400 for invalid tier level', async () => {
		const response = await request()
			.put(`/v2/admin/tiers/limits`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ "limits": { "cupidatat_b2": { "withdrawal_limit": 19468566.820609286, "irure_9a0": "ex laborum" }, "et0c3": { "withdrawal_limit": 97356120.77642646, "eu72": 6923753, "aliqua6": true, "magna1f_": -84722640.49079436 }, "cillum__6": { "withdrawal_limit": 30286795.163310215, "ipsum_b": false, "aute57": 96712035, "incididunt_6": "ad" }, "commodod5": { "deposit_limit": -99821028.12361288, "aliquip_7bc": 2290190, "ad_4": "proident consectetur qui", "amet_7b": -71289539, "etc30": -84903371.43684195 } } })


		response.should.have.status(400);
        response.should.be.json;
        response.body.message.should.equal('Invalid tier level given');
        
    });
    

    //Fuz Testing
	it('Fuzz Test -should return error', async () => {
        const response = await request()
		.put(`/v2/admin/tiers/limits`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ 
                
                "limits": { "cupidatat_b2": { "withdrawal_limit": generateFuzz(), 
                "irure_9a0": generateFuzz()}, 
                "et0c3": { "withdrawal_limit": generateFuzz(), 
                "eu72": generateFuzz(), "aliqua6": true,
                "magna1f_": generateFuzz() }, 
                "cillum__6": { "withdrawal_limit": generateFuzz(),
                "ipsum_b": false, "aute57": generateFuzz(), "incididunt_6": "ad" }, 
                "commodod5": { "deposit_limit": generateFuzz(), "aliquip_7bc": generateFuzz(), 
                "ad_4": "proident consectetur qui", "amet_7b": generateFuzz(), 
                "etc30": generateFuzz() } } })

		response.should.have.status(500);
		response.should.be.json;
    });
    
});