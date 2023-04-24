const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /user/balance', function () {
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
            .get('/v2/user/balance')
            .set('Authorization', `Bearer ${bearerToken}`)
           

        response.should.have.status(200);
        response.body.user_id.should.equal(user.id);
        response.should.be.json;

    });

  
});