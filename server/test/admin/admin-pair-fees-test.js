const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/pair/fees', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    //Integration Testing
    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .put(`/v2/admin/pair/fees`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "pair": "xht-usdt",
                "fees": {
                    "1": {
                        "maker": 0.2,
                        "taker": 0.2
                    }
                }
            });

        response.should.have.status(200);
        response.should.be.json;

    });

    it('Integration Test -should respond 400 for invalid pair', async () => {
        const response = await request()
            .put(`/v2/admin/pair/fees`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "pair": "abc",
                "fees": {
                    "1": {
                        "maker": 0.2,
                        "taker": 0.2
                    }
                }
            });

        response.should.have.status(400);
        response.should.be.json;

    });

    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .put(`/v2/admin/pair/fees`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "pair": "xht-usdt",
                "fees": {
                    "1": {
                        "maker": generateFuzz(),
                        "taker": generateFuzz()
                    }
                }
            });

        response.should.have.status(500);
        response.should.be.json;
    });


});