const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/signup', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    //Integration Testing
    it('should respond 400 for "trying to sign up admin user while exchange is already initialized', async () => {
        const response = await request()
            .post(`/v2/admin/signup`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "email": "testsadas@gmail.com",
                "password": "112233"
            })

        response.should.have.status(400);
        response.should.be.json;
        response.body.message.should.equal('Exchange is already initialized');
    });


    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .post(`/v2/admin/signup`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "email": generateFuzz(),
                "password": generateFuzz()
            })


        response.should.have.status(500);
        response.should.be.json;
    });


});