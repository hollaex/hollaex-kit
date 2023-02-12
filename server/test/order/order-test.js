const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('Order Flow', async () => {

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
            .post('/v2/user/order')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "side": "buy",
                "size": 0.0001,
                "type": "limit",
                "symbol": "btc-usdt",
                "price": 30000,
                "meta": { "post_only": true},
            });
           
        response.should.have.status(200);
        response.should.be.json;

    });
});

