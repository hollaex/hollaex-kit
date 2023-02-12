const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /user/create-address', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .get('/v2/user/create-address?crypto=usdt&network=trx')
            .set('Authorization', `Bearer ${bearerToken}`)
           

        if(response.body.message !== 'Error 1001 - User already has a crypto address for usdt'){
            response.should.have.status(200);
            response.should.be.json;
        }
   
    });


    //Fuz Testing
	it('Fuzz Test -should return error', async () => {
        const response = await request()
		    .get(`/v2/user/create-address?crypto=${generateFuzz()}&network=trx`)
            .set('Authorization', `Bearer ${bearerToken}`)
		
            response.should.have.status(500);
            response.should.be.json;
	});

});