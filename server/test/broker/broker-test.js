const {
    request,
    getAdminUser,
    loginAs,
} = require('../helpers');
const assert = require('assert');
const tools = require('hollaex-tools-lib');

describe('Dynamic Pricing', async () => {
    let user, bearerToken, quoteData, createdBroker;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    it('should create a dynamic broker', async () => {
        const response = await request()
            .post(`/v2/broker/`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                symbol: 'usdt-try',
                buy_price: 0.25,
                sell_price: 0.25,
                paused: false,
                user_id: 1,
                min_size: 1,
                max_size: 10,
                increment_size: 0.0001,
                type: 'dynamic',
                quote_expiry_time: 30,
                formula: 'binance_btc-usdt',
                rebalancing_symbol: 'xht-usdt',
                spread: 1,
                account: {
                    binance: {
                        apiKey: '1a3321381e9f2e8342449936bb0e5e0590435',
                        apiSecret: '93284092345543534435305905694646745645'
                    },
                },
            });
        createdBroker = response.body;
        response.should.have.status(200);
        response.should.be.json;

        assert.equal(createdBroker.symbol, 'usdt-try', 'wrong symbol');
        assert.equal(createdBroker.type, 'dynamic', 'wrong type');

    });

    it('should not validate wrong formula format -1', async () => {
        // server should check the keys in an object that client sends 
        //if one key is missing it should be replaced with the old record's key
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: '3^binance_btc_usdt',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(400);
        assert.ok(response.body.message.startsWith('Error: Market pair(s) in the formula is in wrong format'), 'wrong message');
    });

    it('should not validate wrong formula format -2', async () => {
        // server should check the keys in an object that client sends 
        //if one key is missing it should be replaced with the old record's key
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: '2*binance-btc_usdt',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(400);
        assert.ok(response.body.message.startsWith('Error: Market pair(s) in the formula is in wrong format'), 'wrong message');
    });

    it('should not validate wrong formula format -3', async () => {
        // server should check the keys in an object that client sends 
        //if one key is missing it should be replaced with the old record's key
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: '5/binance_btc-',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(400);
        assert.ok(response.body.message.startsWith('Error: Market pair(s) in the formula is in wrong format'), 'wrong message');
    });
    

    it('should not validate wrong formula format -4', async () => {
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: '3*binance',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(400);
        assert.ok(response.body.message.startsWith('Error: Market pair(s) in the formula is in wrong format'), 'wrong message');
    });

    it('should not validate wrong formula format -5', async () => {
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: 'binance_btc-usdt*kraken_eth_usdt',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(400);
    });

    it('should not validate formula with unsupported exchange', async () => {
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: 'bitstamp_btc-usdt',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(400);
    });

    it('should not validate formula with unsupported pair', async () => {
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: 'binance_btc-abc',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(400);
    });


    it('should validate correct formula with single market', async () => {
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula:  '3^binance_btc-usdt*12/5*9+9.4*2',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(200);
        assert.ok(Number(response.body.buy_price), 'buy_price should be number');
        assert.ok(Number(response.body.sell_price), 'buy_price should be number');
    });

    it('should validate correct formula with multiple market', async () => {
        const response = await request()
            .post(`/v2/broker/test`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                formula: '3^binance_btc-usdt*kraken_eth-usdt*12/5*9+9.4*2',
                spread: 1,
                increment_size: 0.0001,
            });

        response.should.have.status(200);
        assert.ok(Number(response.body.buy_price), 'buy_price should be number');
        assert.ok(Number(response.body.sell_price), 'buy_price should be number');
    });

    it('should get a quote without auth', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=2`)
        
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.not.have.property('token');
    });

    it('should get a quote with auth', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=2`)
            .set('Authorization', `Bearer ${bearerToken}`)
        quoteData = response.body;

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('token');
    });

    it('should validate jsonb object', async () => {
        // server should check the keys in an object that client sends 
        //if one key is missing it should be replaced with the old record's key
        const response = await request()
            .put(`/v2/broker`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                id: createdBroker.id,
                rebalancing_symbol: 'xht-usdt',
                account: {
                    binance: {
                        apiKey: '1a3321381e9f2e8342449936bb0e5e0590435',
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
    });

    // it('should execute broker order', async () => {
    //     const response = await request()
    //         .post(`/v2/order/execute`)
    //         .set('Authorization', `Bearer ${bearerToken}`)
    //         .send({
    //             token: quoteData.token
    //         });

    //     response.should.have.status(200);
    //     response.should.be.json;
    // });


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