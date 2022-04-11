const {
    request,
    getTestUser,
    loginAs,
} = require('../helpers');

describe('Dynamic Pricing', async () => {
    let user, bearerToken, quoteData, createdBroker;
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
                symbol: 'xht-usdt',
                buy_price: 0.25,
                sell_price: 0.25,
                paused: false,
                user_id: 1,
                min_size: 0.0001,
                max_size: 10,
                increment_size: 0.0001,
                type: 'manual',
                quote_expiry_time: 30,
                rebalancing_symbol: 'xht-usdt',
                account: {
                    binance: {
                        apiKey: '1a3321381e9f2e87cdc1a2e9489936bb0e5e059043617ff723508a2b0d6cd575',
                        apiSecret: '0aa570260b8082e9130030eae9fefefee70e55bde31865494224b124983b3aed',
                    }
                },
                formula: null,
                // exchange_name: 'binance',
                // spread: 5,
                // multiplier: 1
            });
        createdBroker = response.body;
        response.should.have.status(200);
        response.should.be.json;
    });

    it('should get a quote without auth', async () => {
        const response = await request()
            .get(`/v2/broker/quote?symbol=xht-usdt&side=buy`)
        
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.not.have.property('token');
        response.body.should.have.property('price');
    });

    it('should get a quote with auth', async () => {
        const response = await request()
            .get(`/v2/broker/quote?symbol=xht-usdt&side=buy`)
            .set('Authorization', `Bearer ${bearerToken}`)
        quoteData = response.body;

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('token');
        response.body.should.have.property('price');
    });

    it('should return wrong symbol error', async () => {
        const response = await request()
            .get(`/v2/broker/quote?symbol=xht-&side=sell`)
            .set('Authorization', `Bearer ${bearerToken}`)
            
        response.should.have.status(400);
    });

    it('should return an error without side param', async () => {
        const response = await request()
            .get(`/v2/broker/quote?symbol=xht-usdt`)
            .set('Authorization', `Bearer ${bearerToken}`)

        response.should.have.status(400);
    });

    it('should return an error without params', async () => {
        const response = await request()
            .get(`/v2/broker/quote`)
            .set('Authorization', `Bearer ${bearerToken}`)

        response.should.have.status(400);
    });

    it('should validate jsonb object', async () => {
        // server should check the keys in an object that client sends 
        //if one key is missing it should be replaced with the old record's key
        const response = await request()
            .put(`/v2/broker`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                id: createdBroker.id,
                account: {
                    binance: {
                        apiKey: '1a3321381e9f2e87cdc1a2e9489936bb0e5e0590435',
                    },
                },
            });

        response.should.have.status(200);
        response.body.account.binance.should.have.property('apiKey');
        response.body.account.binance.should.have.property('apiSecret');
    });

    it('should only update that fields that client sends', async () => {
        // server should not overwrite the whole record if clients send only a few columns to update
        const response = await request()
            .put(`/v2/broker`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                id: createdBroker.id,
                increment_size: 0.001,
            });
        response.should.have.status(200);
        response.body.should.have.property('symbol');
        response.body.symbol.should.be.a('string');
        response.body.symbol.should.equal(createdBroker.symbol);
        response.body.should.have.property('increment_size');
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
    });
    it('should delete the broker', async () => {
        const response = await request()
            .delete(`/v2/broker/`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                id: createdBroker.id
            });
        response.should.have.status(200);
    });

});
