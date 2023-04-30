const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
describe('tests for /admin/flag-user', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    //Integration Testing
    it('Integration Test -should respond 200 for "Success"', async () => {
        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        const createdUser = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        const userObject = await tools.user.getUserByEmail(testUser.email);
        createdUser.body.id = userObject.id;

        const response = await request()
            .post(`/v2/admin/flag-user`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ "user_id": createdUser.body.id });

        response.should.have.status(200);
        response.should.be.json;

    });

    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .post(`/v2/admin/flag-user`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ "user_id": generateFuzz(5) });

        response.should.have.status(500);
        response.should.be.json;
    });


});