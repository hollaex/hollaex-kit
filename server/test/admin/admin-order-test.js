const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
describe('tests for /admin/order', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    //Integration Testing
    it('Integration Test -should return 200 ', async () => {
        const responseFirst = await request()
            .post('/v2/order')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ price: 10, side: "sell", size: 1, symbol: "xht-usdt", type: "limit" });


        const responseSecond = await request()
            .delete(`/v2/admin/order?user_id=${user.id}&order_id=${responseFirst.body.id}`)
            .set('Authorization', `Bearer ${bearerToken}`)

        responseSecond.should.have.status(200);
        responseSecond.should.be.json;

        const responseThird = await request()
            .get(`/v2/admin/orders?user_id=${user.id}`)
            .set('Authorization', `Bearer ${bearerToken}`);
        responseThird.body.data.length.should.equal(0);
    });

});