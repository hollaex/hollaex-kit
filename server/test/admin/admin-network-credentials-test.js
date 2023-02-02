const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/network-credentials', function () {

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
            .put(`/v2/admin/network-credentials`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ "api_key": "test", "api_secret": "test2" });

        response.should.have.status(200);
        response.should.be.json;

    });

    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .put(`/v2/admin/network-credentials`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ "api_key": generateFuzz(), "api_secret": "test2" });

        response.should.have.status(400);
        response.should.be.json;
    });

});