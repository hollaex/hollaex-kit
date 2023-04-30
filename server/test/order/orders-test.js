const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');


describe('tests for /orders', function () {

    let user, bearerToken, order_id;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .post('/v2/order')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "side": "buy",
                "size": 1,
                "type": "limit",
                "symbol": "xht-usdt",
                "price": 0.1,
                "meta": { "post_only": true},
            });
           
        response.should.have.status(200);
        response.should.be.json;
        order_id = response.body.id;
    });
    

    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .get(`/v2/orders?symbol=xht-usdt`)
            .set('Authorization', `Bearer ${bearerToken}`)
           
        response.should.have.status(200);
        response.should.be.json;
        response.body.data.length.should.above(0);
    });


    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .delete(`/v2/order?order_id=${order_id}`)
            .set('Authorization', `Bearer ${bearerToken}`)
           
        response.should.have.status(200);
        response.should.be.json;

    });
   
});