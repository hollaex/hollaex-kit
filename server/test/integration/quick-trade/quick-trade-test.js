const {
    request,
    getTestUser,
    loginAs,
} = require('../helpers');

describe('Quick Trade', async () => {
    let user, bearerToken;
    before(async () => {
        user = await getTestUser();
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    it('should get receiving_amount', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('receiving_amount');
    });

    it('should get spending_amount', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&receiving_amount=215`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('spending_amount');
    });

    it('should get receiving_amount with reverse pair', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=usdt&receiving_currency=xht&spending_amount=215`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('receiving_amount');
    });

    it('should get spending_amount with reverse pair', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=usdt&receiving_currency=xht&receiving_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('spending_amount');
    });

    it('should get slippage', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=btc&receiving_currency=usdt&spending_amount=100`)

        response.should.have.status(200);
        response.should.be.json;
        if (response.body.receiving_amount != null) response.should.fail();

    });

    it('should get a token with auth', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)
            .set('Authorization', `Bearer ${bearerToken}`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('token');
    });

    it('should not get a token without auth', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.not.have.property('token');

    });

    it('should return wrong symbol error', async () => {

        const response = await request()
            .get(`/v2/quick-trade?spending_currency=abc&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(400);
    });

    it('should return an error without spending_currency', async () => {
        const response = await request()
            .get(`/v2/quick-trade?receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(400);
    });

    it('should return an error without receiving_amount', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&spending_amount=1000`)

        response.should.have.status(400);
    });

    it('should return type', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('type');
    });

});