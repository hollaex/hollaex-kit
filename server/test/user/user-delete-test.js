const {
    request,
    getNewUserCredentials
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');

describe('tests for /user', function () {


     //Integration Testing
     it('Integration Test -should respond 401 after removing user', async () => {
          const testUser = {
            email: getNewUserCredentials().email,
            password:  getNewUserCredentials().password,
            long_term: true
        }
        await request()
            .post(`/v2/signup/`)
            .send(testUser);

            
        const loginResponse = await request()
            .post(`/v2/login/`)
            .set('x-real-ip', '1.1.1.1')
            .send({ email: testUser.email, password: testUser.password });


        await request()
        .get('/v2/user/request-email-confirmation')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)

        const user = await tools.user.getUserByEmail(testUser.email);

        const code = await client.getAsync(`ConfirmationEmail:${user.id}`);

        const response = await request()
            .delete('/v2/user')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({ email_code: code });

        response.should.have.status(200);
        response.should.be.json;

        const loginAttempt = await request()
            .post(`/v2/login/`)
            .set('x-real-ip', '1.1.1.1')
            .send({ email: testUser.email, password: testUser.password });

        loginAttempt.body.message.should.equal('User not found');
        loginAttempt.should.have.status(401);
        loginAttempt.should.be.json;

    });

      //Integration Testing
     it('Integration Test -should respond 400 for wrong email code', async () => {
          const testUser = {
            email: getNewUserCredentials().email,
            password:  getNewUserCredentials().password,
            long_term: true
        }
        await request()
            .post(`/v2/signup/`)
            .send(testUser);

            
        const loginResponse = await request()
            .post(`/v2/login/`)
            .set('x-real-ip', '1.1.1.1')
            .send({ email: testUser.email, password: testUser.password });

        const response = await request()
            .delete('/v2/user')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({ email_code: 'abc' });

        response.should.have.status(400);
        response.should.be.json;

    });
});