const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');
const { getModel } = require('../../utils/hollaex-tools-lib/tools/database/model');

describe('tests for /user/withdrawal', function () {

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

        let apiKey = token?.key;
        let apiSecret = token?.secret;

        if(!token){

            let hmac;
            hmac = await request()
			.post('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				name: 'tokenTest',
				otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            apiKey = hmac.body.key;
            apiSecret = hmac.body.secret;

            token = hmac.body;
        }

        await request()
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

        const body = {
            network: "trx",
            address: "TFQ9gxeMEkmKoxgrbnHNdu4e3VdNL11vyy",
            amount: 1,
            currency: "usdt"
        }

        const expires = token.expiry / 1000;
		const signature = tools.security.calculateSignature(token.secret, 'POST', '/v2/user/withdrawal', expires, body);
        const response = await request()
			.post('/v2/user/withdrawal')
			.set('Api-key', apiKey)
			.set('Api-expires', expires)
			.set('Api-signature', signature)
			.send(body);

            response.should.have.status(200);
            response.should.be.json;
            response.body.should.have.property("transaction_id");
    
        const cancelWithdrawal = await request()
			.delete(`/v2/user/withdrawal?id=${response.body.id}`)
			.set('Authorization', `Bearer ${bearerToken}`)

            if(cancelWithdrawal.body.message){
                cancelWithdrawal.should.have.status(400);
            }else cancelWithdrawal.should.have.status(200);
            
            cancelWithdrawal.should.be.json;
    
    });

    it('Integration Test -should respond 403 for lack of authority for withdraw', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ user_id: user.id, active: true })

        let apiKey = token?.key;
        let apiSecret = token?.secret;

        if(!token){

            let hmac;
            hmac = await request()
			.post('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				name: 'tokenTest',
				otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            apiKey = hmac.body.key;
            apiSecret = hmac.body.secret;

            token = hmac.body;
        }

        await request()
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

        const body = {
            network: "trx",
            address: "TFQ9gxeMEkmKoxgrbnHNdu4e3VdNL11vyy",
            amount: 1,
            currency: "usdt"
        }

        const expires = token.expiry / 1000;
		const signature = tools.security.calculateSignature(token.secret, 'POST', '/v2/user/withdrawal', expires, body);
        const response = await request()
			.post('/v2/user/withdrawal')
			.set('Api-key', apiKey)
			.set('Api-expires', expires)
			.set('Api-signature', signature)
			.send(body);

            response.should.have.status(403);
            response.should.be.json;
    
    });


    //Fuzz Testing
    it('Fuzz Test -should return error', async () => {

        const tokenModel = getModel('token');
        let token = await tokenModel.findOne({ user_id: user.id, active: true })

        let apiKey = token?.key;
        let apiSecret = token?.secret;

        if(!token){

            let hmac;
            hmac = await request()
			.post('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				name: 'tokenTest',
				otp_code: await getOtpCode(),
				email_code: await getEmailCode(),
			});

            apiKey = hmac.body.key;
            apiSecret = hmac.body.secret;

            token = hmac.body;
        }

        await request()
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

        const body = {
            network: "trx",
            address: generateFuzz(),
            amount: generateFuzz(),
            currency: "usdt"
        }

        const expires = token.expiry / 1000;
		const signature = tools.security.calculateSignature(token.secret, 'POST', '/v2/user/withdrawal', expires, body);
        const response = await request()
			.post('/v2/user/withdrawal')
			.set('Api-key', apiKey)
			.set('Api-expires', expires)
			.set('Api-signature', signature)
			.send(body);

            response.should.have.status(500);
            response.should.be.json;
    
    });
    
});