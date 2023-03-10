const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { getModel } = require('../../utils/hollaex-tools-lib/tools/database/model');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');

describe('tests for /user/token', function () {
    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    const getOtpCode = async () => {
        let secret;
    
        if (!(await tools.security.userHasOtpEnabled(user.id))) {
            secret = await tools.security.createOtp(user.id);
            await tools.security.setActiveUserOtp(user.id);
        } else {
            const otpCode = await tools.database.findOne('otp code', { where: {
                used: true,
                user_id:user.id
            },
            attributes: ['id', 'secret'],
            order: [['updated_at', 'DESC']]
            });
            secret = otpCode.secret;

        }
        return await tools.security.generateOtp(secret);
    }

    const getEmailCode = async () => {
        await request()
        .get('/v2/user/request-email-confirmation')
        .set('Authorization', `Bearer ${bearerToken}`)

        const code = await client.getAsync(`ConfirmationEmail:${user.id}`);
        return code;
    }


    //Integration Testing
    it('Integration Test -should respond 200 for "Success"', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ user_id: user.id, active: true })

        if(!token){
            const response = await request()
			.post('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				name: 'tokenTest',
				otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            response.should.have.status(200);
            response.should.be.json;
        }
    });


    it('Integration Test -should respond 200 for "Success"', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ user_id: user.id, active: true })

        if(token){

            const responseFirst = await request()
			.put('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
                token_id: token.id,
				otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
				permissions: {
					can_withdraw: false
				},
				whitelisting_enabled: false
			});

            responseFirst.should.have.status(200);
            responseFirst.should.be.json;
            responseFirst.body.can_withdraw.should.equal(false)


            const responseSecond = await request()
			.put('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
                token_id: token.id,
				otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
				permissions: {
					can_withdraw: true
				},
				whitelisting_enabled: false
			});

            responseSecond.should.have.status(200);
            responseSecond.should.be.json;
            responseSecond.body.can_withdraw.should.equal(true)
        }

    });


    it('Integration Test -should respond 200 for "Success"', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ user_id: user.id, active: true })

        if(token){

            const response = await request()
			.delete('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
                token_id: token.id,
				otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            response.should.have.status(200);
            response.should.be.json;

            token = await tokenModel.findOne({ user_id: user.id, active: true })

            if(token) { throw new Error('Token cannot exist')}
        }

    });

});