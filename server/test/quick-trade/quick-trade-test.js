const {
    request,
    loginAs,
    generateFuzz,
    getNewUserCredentials
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { should } = require('chai');

describe('Quick Trade', async () => {
    let user, bearerToken;
    before(async () => {
        const testUser = {
            email: getNewUserCredentials().email,
            password:  getNewUserCredentials().password,
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(201);
        response.should.be.json;

        user = await tools.user.getUserByEmail(testUser.email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');

    });

    //Integration Testing
    it('Integration -should get receiving_amount', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('receiving_amount');
        response.body.receiving_amount.should.be.a('number');
    });

    it('Integration -should get spending_amount', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&receiving_amount=215`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('spending_amount');
        response.body.spending_amount.should.be.a('number');
    });

    it('Integration -should get receiving_amount with reverse pair', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=usdt&receiving_currency=xht&spending_amount=215`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('receiving_amount');
        response.body.receiving_amount.should.be.a('number');
    });

    it('Integration -should get spending_amount with reverse pair', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=usdt&receiving_currency=xht&receiving_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('spending_amount');
        response.body.spending_amount.should.be.a('number');
    });

    it('Integration -should get slippage', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=btc&receiving_currency=usdt&spending_amount=100`)

        response.should.have.status(200);
        response.should.be.json;

    });

    it('Integration -should get a token with auth', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)
            .set('Authorization', `Bearer ${bearerToken}`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('token');
        response.body.token.should.be.a('string');
    });

    it('Integration -should not get a token without auth', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.not.have.property('token');

    });

    it('Integration -should return wrong symbol error', async () => {

        const response = await request()
            .get(`/v2/quick-trade?spending_currency=abc&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(400);
    });

    it('Integration -should return an error without spending_currency', async () => {
        const response = await request()
            .get(`/v2/quick-trade?receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(500);
    });

    it('Integration -should return an error without receiving_amount', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&spending_amount=1000`)

        response.should.have.status(500);
    });

    it('Integration -should return type', async () => {
        const response = await request()
            .get(`/v2/quick-trade?spending_currency=xht&receiving_currency=usdt&spending_amount=1000`)

        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('type');
        response.body.type.should.be.a('string');
    });


});