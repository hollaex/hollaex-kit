const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /user/request-otp', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });



    //Integration Testing
    it('Integration Test -should respond 400 for "already enabled otp"', async () => {
    const response = await request()
        .get('/v2/user/request-otp')
        .set('Authorization', `Bearer ${bearerToken}`)
        
        response.should.have.status(400);
        response.should.be.json;

    });

  
});