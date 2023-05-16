const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/operator/invite', function () {

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
        await request()
            .post(`/v2/signup/`)
            .send(testUser);

        const response = await request()
            .get(`/v2/admin/operator/invite?email=${testUser.email}&role=admin`)
            .set('Authorization', `Bearer ${bearerToken}`);

        response.should.have.status(200);
        response.should.be.json;


        const user = await request()
            .get(`/v2/admin/users?search=${testUser.email}`)
            .set('Authorization', `Bearer ${bearerToken}`);

        user.body.data[0].is_admin.should.equal(true);
    });

    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .get(`/v2/admin/operator/invite?email=${generateFuzz()}&role=admin`)
            .set('Authorization', `Bearer ${bearerToken}`)

        response.should.have.status(500);
        response.should.be.json;
    });
});