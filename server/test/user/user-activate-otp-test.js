const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /user/activate-otp', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    //Integration Testing
    it('Integration Test -should respond 400 for "invalid Otp code"', async () => {
        const response = await request()
            .post('/v2/user/activate-otp')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                code: "Test123"
            });

        response.should.have.status(400);
        response.should.be.json;


    });

});