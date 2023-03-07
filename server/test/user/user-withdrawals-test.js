const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /user/withdrawals', function () {

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
            .get('/v2/user/withdrawals')
            .set('Authorization', `Bearer ${bearerToken}`)
           

        response.should.have.status(200);
        response.should.be.json;

    });

    it('Integration Test -should respond 202 CSV for "Success"', async () => {
        const response = await request()
            .get('/v2/user/withdrawals?format=csv')
            .set('Authorization', `Bearer ${bearerToken}`)
           
        response.should.have.status(202);
    });
   
});