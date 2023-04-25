const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/complete-setup', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    //Integration Testing
    it('Integration Test -should return 400 for already setup exchange', async () => {
        const response = await request()
            .get('/v2/admin/complete-setup')
            .set('Authorization', `Bearer ${bearerToken}`)

        response.should.have.status(400);
        response.should.be.json;
    });

});