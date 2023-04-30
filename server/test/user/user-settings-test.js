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
    
    
});