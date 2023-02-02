const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/upgrade-user', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    //Integration Testing
    it('Integration Test -should return 200 for success', async () => {
        const testVerificationValue = 1;
        const response = await request()
            .post('/v2/admin/upgrade-user')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                user_id: user.id,
                verification_level: testVerificationValue
            });

        response.should.have.status(200);
        response.should.be.json;

        const userData = await request()
            .get(`/v2/admin/users?id=${user.id}`)
            .set('Authorization', `Bearer ${bearerToken}`)

        userData.data.body[1].verification_level.should.equal(testVerificationValue);

    });

    //Integration Testing
    it('Integration Test -should return 400 for wrong verification level', async () => {
        const response = await request()
            .post('/v2/admin/upgrade-user')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                user_id: user.id,
                verification_level: 10
            });

        response.should.have.status(400);
        response.should.be.json;
    });

    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .post('/v2/admin/upgrade-user')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                user_id: user.id,
                verification_level: generateFuzz()
            });

        response.should.have.status(500);
        response.should.be.json;
    });


});