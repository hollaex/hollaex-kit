const {
    request,
    loginAs,
    generateFuzz,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const assert = require('assert');
const moment = require('moment');


describe('User Session', async () => {
    let IP = `1.1.1.1`;

    const createSessionAndLogin = async () => {
        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        const createdUser = testUser;
        response.should.have.status(201);
        response.should.be.json;

        const loginData  = await request()
            .post(`/v2/login/`)
            .set('x-real-ip', IP)
            .send(createdUser);

        const userSessions = await request()
            .get(`/v2/user/session`)
            .set('Authorization', `Bearer ${loginData.body.token}`)
        
        return { userSessions, createdUser, loginData };
    }
    //Integration Testing
    it('Integration -should get user sessions', async () => {

        const { userSessions, createdUser } = await createSessionAndLogin();

        userSessions.should.have.status(200);
        userSessions.should.be.json;
        let user = await tools.user.getUserByEmail(createdUser.email);
        assert.equal(userSessions.body.data.length, 1, 'body length is wrong');
        assert.equal(userSessions.body.data[0].user_id, user.id, 'wrong user id');
        assert.equal(userSessions.body.data[0].ip, IP, 'wrong ip');
        assert.equal(moment(userSessions.body.data[0].Session.expiry_date).startOf('day').diff(moment().startOf('day'), 'days'), 30, 'wrong expiration date');
        
    });

    it('Integration -should return session not found when token provided from non session creation flow ', async () => {

        let user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        let bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');

        const userSessions = await request()
            .get(`/v2/user/session`)
            .set('Authorization', `Bearer ${bearerToken}`)
        
        assert.equal(userSessions.body.message, 'Access denied: Session not found', 'wrong message');
        userSessions.should.have.status(403);
    });


    it('Integration -should revoke user session', async () => {

        const { userSessions, loginData } = await createSessionAndLogin();

        await request()
            .post(`/v2/user/revoke-session`)
            .set('Authorization', `Bearer ${loginData.body.token}`)
            .send({
				'session_id': userSessions.body.data[0].Session.id
			});
    
        const userBalance = await request()
            .get(`/v2/user/balance`)
            .set('Authorization', `Bearer ${loginData.body.token}`)
            
        assert.equal(userBalance.body.message, 'Access denied: Token is already revoked', 'wrong message');
    });
  
    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const userSessions = await request()
            .get(`/v2/user/session`)
            .set('Authorization', `Bearer ${generateFuzz()}`)

        userSessions.should.have.status(403);
    });
});