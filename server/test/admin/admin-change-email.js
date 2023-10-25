const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { getModel } = require('../../utils/hollaex-tools-lib/tools/database/model');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');

const clientUserId = 25;
const newEmail = `${generateFuzz(5)}@gmail.com`;

describe('tests for /admin/user/email', function () {
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
        return tools.security.generateOtp(secret);
    }

    const getEmailCode = async () => {
        await request()
        .get('/v2/user/request-email-confirmation')
        .set('Authorization', `Bearer ${bearerToken}`)

        const code = await client.getAsync(`ConfirmationEmail:${user.id}`);
        return code;
    }


    //Integration Testing
    it('Integration Test -should respond 400 for not providing otp and email', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ where: { user_id: user.id, active: true }})

        if(token){
            const response = await request()
			.put('/v2/admin/user/email')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				user_id: clientUserId,
                email: 'test1231532@mail.com',
			});
            response.should.have.status(500);
            response.should.be.json;
        }
    });

    it('Integration Test -should respond 400 for wrong email type', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ where: { user_id: user.id, active: true }})

        if(token){
            const response = await request()
			.put('/v2/admin/user/email')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				user_id: clientUserId,
                email: 'test1231532',
                otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            response.should.have.status(400);
            response.should.be.json;
        }
    });

    it('Integration Test -should respond 400 for tying to change admin email', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ where: { user_id: user.id, active: true }})

        if(token){
            const response = await request()
			.put('/v2/admin/user/email')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				user_id: 1,
                email: 'test123153@gmail.com',
                otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            response.should.have.status(400);
            response.should.be.json;
        }
    });


    it('Integration Test -should respond 200 for Success', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ where: { user_id: user.id, active: true }})

        if(token){
            const response = await request()
			.put('/v2/admin/user/email')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				user_id: clientUserId,
                email: newEmail,
                otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            response.should.have.status(200);
            response.should.be.json;
        }
    });


    it('Integration Test -should respond 400 for same email', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ where: { user_id: user.id, active: true }})

        if(token){
            const response = await request()
			.put('/v2/admin/user/email')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				user_id: clientUserId + 1,
                email: newEmail,
                otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});
            response.should.have.status(400);
            response.should.be.json;
        }
    });

});