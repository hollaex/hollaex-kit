const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /user/request-withdrawal', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    it('Integration Test -should respond 200 for "Success"', async () => {
        
        await request()
        .post('/v2/admin/admin/deactivate-otp')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ user_id: user.id });

        const response = await request()
            .post('/v2/user/request-withdrawal')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "network": "trx",
                "address": "TFQ9gxeMEkmKoxgrbnHNdu4e3VdNL11vyy",
                "amount": 10,
                "captcha": "03AFY_a8VBX19xovoBfGH87c3GCBYOoX-Za8tBrZgKurdusD3vkXWqY2Dw9yy1OHq03WHj2K1erNiyC4eV4Q-ldKaUWWu3oJkIIiJzhfS6FNBXk3I_t1LvhbSPKoyqeBbXBKAUf6Eoa8QMrmnMJEn3qbjWkfYybWl0_SJ2ozng7B-YB4tI8fXhhCst0ougmCeWKKPRiUTHx63xdILNCci-mAfe4fE4J5xBcOrV2bKw1LMNsE2j1vGBe1G_KvpTlpiPa4wgset7mo7FlmJ0tUR6JcqBekX4l_dNm3lqS-p6kP1C2Q-BW2S-acBCYAEwsmm5d4SL9S6ADbZg1LRAR_annKSZy00rMghxKowLFLor7jfm6nV_Hdkud2_oJAytS9sToXOE0QMCGi13Kbxn8Cj6b7RzIQ2jKobe1PyaTpnO66iS-WGHbaxy2zEroxGisCUEtVgCGPSkPuaSmuoK8mmS8hR-bDBCS9en9LmoH_77aU-zfH5pNqmIP6XRcM0dx2M3VoIGqjlQ92Is",
                "currency": "usdt"
            });

        response.should.have.status(200);
        response.body.message.should.equal('Success');
        response.should.be.json;
    });
   
});