const {
    request,
    getNewUserCredentials,
    getAdminUser,
    loginAs
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');

describe('tests for /user', function () {
    let adminUser, bearerToken;
    before(async () => {
        adminUser = await tools.user.getUserByEmail(getAdminUser().email);
        adminUser.should.be.an('object');
        bearerToken = await loginAs(adminUser);
        bearerToken.should.be.a('string');
    });



     //Integration Testing
    it('Integration Test -should respond 401 after trying to login with removed user', async () => {
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

        let secret;
    
        if (!(await tools.security.userHasOtpEnabled(user.id))) {
            secret = await tools.security.createOtp(user.id);
            await tools.security.setActiveUserOtp(user.id);
        } else {
            const otpCode = await tools.database.findOne('otp code', { where: {
                used: true,
                user_id: user.id
            },
            attributes: ['id', 'secret'],
            order: [['updated_at', 'DESC']]
            });
            secret = otpCode.secret;

        }
        const otp_code = tools.security.generateOtp(secret);

        const response = await request()
            .delete('/v2/user')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({ email_code: code, otp_code });

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

    it('Integration Test -should restore removed user', async () => {
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

        let code = await client.getAsync(`ConfirmationEmail:${user.id}`);

        let secret;
    
        if (!(await tools.security.userHasOtpEnabled(user.id))) {
            secret = await tools.security.createOtp(user.id);
            await tools.security.setActiveUserOtp(user.id);
        } else {
            const otpCode = await tools.database.findOne('otp code', { where: {
                used: true,
                user_id: user.id
            },
            attributes: ['id', 'secret'],
            order: [['updated_at', 'DESC']]
            });
            secret = otpCode.secret;

        }
        let otp_code = tools.security.generateOtp(secret);

        const response = await request()
            .delete('/v2/user')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({ email_code: code, otp_code });

        response.should.have.status(200);
        response.should.be.json;

        code = await client.getAsync(`ConfirmationEmail:${user.id}`);

    
        if (!(await tools.security.userHasOtpEnabled(user.id))) {
            secret = await tools.security.createOtp(user.id);
            await tools.security.setActiveUserOtp(user.id);
        } else {
            const otpCode = await tools.database.findOne('otp code', { where: {
                used: true,
                user_id: user.id
            },
            attributes: ['id', 'secret'],
            order: [['updated_at', 'DESC']]
            });
            secret = otpCode.secret;

        }
        otp_code = tools.security.generateOtp(secret);

        const restored_user = await request()
            .post('/v2/admin/user/restore')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ user_id: user.id});

        restored_user.should.have.status(200);
        restored_user.should.be.json;


        const loginAttempt = await request()
            .post(`/v2/login/`)
            .set('x-real-ip', '1.1.1.1')
            .send({ email: testUser.email, password: testUser.password });

        loginAttempt.should.have.status(201);
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
            .send({ email_code: 'abc', otp_code: 'abc' });

        response.should.have.status(400);
        response.should.be.json;

    });
});