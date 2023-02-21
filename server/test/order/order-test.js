const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('Order Flow', async () => {

    let user, bearerToken, order_id, size, symbol, price, side;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    //Integration Testing
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
        size = response.body.size;
        symbol = response.body.symbol;
        side = response.body.side;
        price = response.body.price;

    });


    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .get(`/v2/order?order_id=${order_id}`)
            .set('Authorization', `Bearer ${bearerToken}`)
           
        response.should.have.status(200);
        response.should.be.json;
        response.body.size.should.equal(size);
        response.body.symbol.should.equal(symbol);
        response.body.side.should.equal(side);
        response.body.price.should.equal(price);

    });


    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .delete(`/v2/order?order_id=${order_id}`)
            .set('Authorization', `Bearer ${bearerToken}`)
           
        response.should.have.status(200);
        response.should.be.json;

    });


      //Fuz Testing
      it('Fuzz Test -should return error', async () => {
        const response = await request()
            .post('/v2/order')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "side": "buy",
                "size": 1,
                "type": "limit",
                "symbol": "xht-usdt",
                "price": generateFuzz(),
                "meta": { "post_only": true},
            });

        response.should.have.status(500);
    });


});

