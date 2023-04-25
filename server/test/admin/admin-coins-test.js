const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/coins', function () {
    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    //Integration Testing
    it('Integration Test -should respond 200 for "Success"', async () => {
        const coin = 'btc';
        const response = await request()
            .get(`/v2/admin/coins?currency=${coin}`)
            .set('Authorization', `Bearer ${bearerToken}`);

        response.should.have.status(200);
        response.should.be.json;
        response.body.symbol.should.equal(coin);
    });



});