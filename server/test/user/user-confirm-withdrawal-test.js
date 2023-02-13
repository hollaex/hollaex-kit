const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');

describe('tests for /user/confirm-withdrawal', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    it('Integration Test -should respond 200 for "Success"', async () => {

        // try {
        //     await request()
        //     .post('/v2/admin/admin/deactivate-otp')
        //     .set('Authorization', `Bearer ${bearerToken}`)
        //     .send({ user_id: user.id });
        // } catch (error) {
        //     console.log(error);
        // }

        const getOtpCode = async () => {
            let secret;
        
            if (!(await tools.security.userHasOtpEnabled(user.id))) {
                secret = await tools.security.createOtp(user.id);
                await tools.security.setActiveUserOtp(user.id);
            } else {
                const otpCode = await tools.database.findOne('otp code', { where: { user_id: user.id }, attributes: ['id', 'secret'] });
                secret = otpCode.secret;
            }
        
            return await tools.security.generateOtp(secret);
        }

        await request()
            .post('/v2/user/request-withdrawal')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                otp_code: await getOtpCode(),
                network: "trx",
                address: "TFQ9gxeMEkmKoxgrbnHNdu4e3VdNL11vyy",
                amount: 1,
                captcha: "03AFY_a8VBX19xovoBfGH87c3GCBYOoX-Za8tBrZgKurdusD3vkXWqY2Dw9yy1OHq03WHj2K1erNiyC4eV4Q-ldKaUWWu3oJkIIiJzhfS6FNBXk3I_t1LvhbSPKoyqeBbXBKAUf6Eoa8QMrmnMJEn3qbjWkfYybWl0_SJ2ozng7B-YB4tI8fXhhCst0ougmCeWKKPRiUTHx63xdILNCci-mAfe4fE4J5xBcOrV2bKw1LMNsE2j1vGBe1G_KvpTlpiPa4wgset7mo7FlmJ0tUR6JcqBekX4l_dNm3lqS-p6kP1C2Q-BW2S-acBCYAEwsmm5d4SL9S6ADbZg1LRAR_annKSZy00rMghxKowLFLor7jfm6nV_Hdkud2_oJAytS9sToXOE0QMCGi13Kbxn8Cj6b7RzIQ2jKobe1PyaTpnO66iS-WGHbaxy2zEroxGisCUEtVgCGPSkPuaSmuoK8mmS8hR-bDBCS9en9LmoH_77aU-zfH5pNqmIP6XRcM0dx2M3VoIGqjlQ92Is",
                currency: "usdt"
            });

        async function hashget(tag) {
            return new Promise((resolve, reject) => {
                client.hgetall(tag, async (err, keys) => {
                    if (err) {
                        reject(err);
                        } else {
                        resolve(keys);
                        }
                })
            });
        }

        const keys = await hashget('withdrawals:request').then((result) => { return result; });

        const values = Object.values(keys);
        const token = values.sort((a, b) => JSON.parse(a).timestamp - JSON.parse(b).timestamp)[values.length - 1];
        
        const response = await request()
        .post('/v2/user/confirm-withdrawal')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
            token: JSON.parse(token).transaction_id,
        });

        response.should.have.status(200);
        response.body.message.should.equal("Withdrawal successful");
        response.body.should.have.property("transaction_id");
        response.should.be.json;
        
    });


    it('Integration Test -should respond 500 for invalid token', async () => {

     
        const response = await request()
        .post('/v2/user/confirm-withdrawal')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
            token: Math.floor(Math.random() * 10000),
        });

        response.should.have.status(500);
        response.should.be.json;
        
    });


 
    //Fuz Testing
	it('Fuzz Test -should return error', async () => {
        const response = await request()
        .post('/v2/user/confirm-withdrawal')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
            token: generateFuzz(),
        });
		response.should.have.status(400);

		response.should.be.json;
	});

});