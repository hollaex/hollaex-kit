const {
    request,
    getTestUser,
    loginAs,
} = require('../helpers');


describe('Broker Management', async () => {
    let user, bearerToken, createdBroker, quoteData;
    before(async () => {
        user = await getTestUser();
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    it('should create a broker', async () => {
        const response = await request()
            .post(`/v2/broker/`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                symbol: 'btc-usdt',
                buy_price: 0,
                sell_price: 0,
                paused: false,
                user_id: 1,
                min_size: 0.0001,
                max_size: 10,
                increment_size: 0.0001,
                type: 'dynamic',
                quote_expiry_time: 30,
                rebalancing_symbol: 'btc-usdt',
                account: {
                    binance: {
                        apiKey: '1a3321381e9f2e87cdc1a2e9489936bb0e5e059043617ff723508a2b0d6cd575',
                        apiSecret: '0aa570260b8082e9130030eae9fefefee70e55bde31865494224b124983b3aed',
                    }
                },
                formula: null,
                exchange_name: 'binance',
                spread: 5,
                multiplier: 1
            });
        createdBroker = response.body;
        response.should.have.status(200);
        response.should.be.json;
    });



    it('should get a quote', async () => {
        const response = await request()
            .get(`/v2/broker/quote?symbol=btc-usdt&side=sell&size=1`)
            .set('Authorization', `Bearer ${bearerToken}`)
        quoteData = response.body;

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('token');
        response.body.should.have.property('price');
    });

    it('should execute the broker deal', async () => {
        const response = await request()
            .post(`/v2/broker/execute`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                size: 1,
                token: quoteData.token
            });

        response.should.have.status(200);
        response.should.be.json;
    });


    it('should update the broker', async () => {
        const response = await request()
            .put(`/v2/broker`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                id: createdBroker.id,
                paused: true
            });

        response.should.have.status(200);
        response.should.be.json;
    });

    it('should delete the broker', async () => {
        const response = await request()
            .delete(`/v2/broker/`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                id: createdBroker.id
            });

        response.should.have.status(200);
        response.should.be.json;
    });

});

