const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');


describe('tests for /user/settings', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    it('Integration Test -should respond 200 for "Success"', async () => {

        const responseFirst = await request()
        .put('/v2/user/settings')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ 
            "risk": {
            "order_portfolio_percentage": 80
        }});

        responseFirst.should.have.status(200);
        responseFirst.should.be.json;

        responseFirst.body.settings.risk.order_portfolio_percentage.should.equal(80);

        const responseSecond = await request()
        .put('/v2/user/settings')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ 
            "risk": {
            "order_portfolio_percentage": 90
        }});

        responseSecond.should.have.status(200);
        responseSecond.should.be.json;

        responseSecond.body.settings.risk.order_portfolio_percentage.should.equal(90)
    });

    it('Integration Test - should accept verification_method = email', async () => {
        const response = await request()
            .put('/v2/user/settings')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ verification_method: 'email' });

        response.should.have.status(200);
        response.should.be.json;
        response.body.settings.verification_method.should.equal('email');
    });

    it('Integration Test - should reject invalid verification_method', async () => {
        const response = await request()
            .put('/v2/user/settings')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ verification_method: 'pigeon' });

        response.should.have.status(400);
    });

    it('Integration Test - should reject verification_method = sms when prerequisites are not met', async () => {
        // Without a verified phone_number + sms_verification feature + an active
        // SMS plugin, this request must fail regardless of exchange configuration.
        const response = await request()
            .put('/v2/user/settings')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ verification_method: 'sms' });

        response.should.have.status(400);
    });
});