const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('Order Flow', async () => {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    // Intergration Testing
    describe('tests for post', function () {
        it('should respond 200 for "Success"', function () {
            var response = request()
                .post('/v2/order')
                .set('Authorization', `Bearer ${bearerToken}`)
                .send({
                    "side": "buy",
                    "size": 95335484.99543399,
                    "type": "limit",
                    "symbol": "enim aliquip nulla dolore Duis",
                    "price": -64542990.882246085,
                    "meta": { "post_only": true, "exercitation263": false, "eu4_": -90908711 },
                    "stop": -73526972.81546177
                });

            expect(response).to.not.have.status(404);
            return chakram.wait();
        });
    });


    describe('tests for get', function () {
        it('should respond 200 for "Success"', function () {
            var response = request()
                .set('Authorization', `Bearer ${bearerToken}`)
                .get('/v2/order?order_id=')

            expect(response).to.not.have.status(404);
            return chakram.wait();
        });
    });

    describe('tests for delete', function () {
        it('should respond 200 for "Success"', function () {
            var response = request()
                .delete('/v2/order?order_id=')
                .set('Authorization', `Bearer ${bearerToken}`)
            expect(response).to.not.have.status(404);
            return chakram.wait();
        });
    });


    //Fuzz testing
    it('Fuzz Test -should return error', async () => {
        const testUser = {
            email: generateFuzz(),
            password: generateFuzz(),
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);

        response.should.have.status(500);
    });

});

