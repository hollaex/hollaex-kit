const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
describe('tests for /admin/logins', function () {

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
            .get('/v2/admin/logins')
            .set('Authorization', `Bearer ${bearerToken}`);

        response.should.have.status(200);
        response.should.be.json;
    });


    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await request()
            .get(`/v2/admin/logins?user_id=${user.id}`)
            .set('Authorization', `Bearer ${bearerToken}`);

        response.should.have.status(200);
        response.body.data[0].user_id.should.equal(user.id);
        response.should.be.json;
    });


    it('Integration Test -should respond 202 csv for "Success"', async () => {
        const response = await request()
            .get('/v2/admin/logins?format=csv')
            .set('Authorization', `Bearer ${bearerToken}`);

        response.should.have.status(202);
    });


    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .get(`/v2/admin/logins?user_id=${generateFuzz()}`)
            .set('Authorization', `Bearer ${bearerToken}`);

        response.should.have.status(500);
        response.should.be.json;
    });

});