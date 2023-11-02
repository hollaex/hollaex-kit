const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');
const { getModel } = require('../../utils/hollaex-tools-lib/tools/database/model');
const assert = require('assert');

const btcAddress = '37uKh5gdnTMULLEeJD8v5YuLd5xCz8A94r';
const xhtAddress = '0xb9b424250b1d5025f69d5c099b7a90f0a0a9c275';

//Transaction Limits
const tier1Xht =  {
    "tier": 1,
    "amount": 850,
    "currency": "xht",
    "limit_currency": "xht",
    "type": "withdrawal",
    "period": "24h",
}
const tier1Btc = {
    "tier": 1,
    "amount": 400,
    "currency": "btc",
    "limit_currency": "btc",
    "type": "withdrawal",
    "period": "24h",
}

const captcha = "03AFcWeA5YUZl7SytOfEcKdo3c12FO8S7wZApqMNTa5k69zRZjoBukGNrVlmmfwLZ77C-244Cbo8kdMKpr3lkpJbVhFC0e5w4SBzl-gPfEyXtrT-1euOP-MkkcQW3R8It8asDytFq67eRkUPAZuJHEMLOrQhiG5vgMMXJeV8ekafvuhQw6v3kDt1uHQj-2TgiE31kPuBIZbmM9SZVvdiMPKQf2e2_ja3N6rFClAfWheVcOvG2pgAEi-RrzqUlsF4mBCNhp8eBvYbFOLiQAf8vWw-j2Ac2bnB69ZSmEY0C-sN0o-I-OgzDnIQRd6KCZIU5-aWgGzts4tb7NoAyjpNan214YEdl3CSL6vvhSzmLO8kjCZzemmtUJOam_xi7T9J6dvJ5Fmf7E8aVj5ejiFEASuob5aap01VjiyiOjhqANONKK_8jbBH3CWiQMHqaMiCla7pMAlAgJt1VIRhPmEEMfXtFG-uCBdSFPguqZii0Ht7UNyxLPucD-zukFDdYnt6CvJE2w-G-QOvMZb91vKHZ_f8bbQ1f-dbMieQ";
const xhtMarkupfee = 5;
const xhtfee = 1;
const xhtWithdrawalAmount = 0;
const btcWithdrawalAmount  = 0;
const getTestKeys = (cb) => {
    return new Promise((resolve, reject) => {
        client.hgetall("withdrawals:request", function(err, values){
            for(const [key, value] of Object.entries(values)) {
                return resolve(key)
            }
         });
    })
   
}

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
 
    //Integration Testing
    it('Integration Test -should respond Success for Requesting and confirming a withdrawal -XHT ', async () => {

        const amount = 3;
        let userBalance = await request()
        .get('/v2/user/balance')
        .set('Authorization', `Bearer ${bearerToken}`)

        const oldBalance = userBalance.body['xht_available'];

        await request()
        .post('/v2/user/request-withdrawal')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
            "network": "eth",
            otp_code: await getOtpCode(),
            "address": xhtAddress,
            amount,
            "captcha": captcha,
            "currency": "xht"
        });

        const key = await getTestKeys()

        const response = await request()
        .post('/v2/user/confirm-withdrawal')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
            "token": key,
        });


         userBalance = await request()
            .get('/v2/user/balance')
            .set('Authorization', `Bearer ${bearerToken}`)


        const newBalance = userBalance.body['xht_available'];
        const xhtWithdrawalAmount = amount;
        assert.equal(oldBalance - newBalance, amount, 'wrong balance');
        response.should.have.status(200);
    
    });

    it('Integration Test -should respond Success for Requesting and confirming a withdrawal -BTC', async () => {

        const amount = 0.0001;
        let userBalance = await request()
        .get('/v2/user/balance')
        .set('Authorization', `Bearer ${bearerToken}`)

        const oldBalance = userBalance.body['btc_available'];

        await request()
        .post('/v2/user/request-withdrawal')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
            "network": "btc",
            otp_code: await getOtpCode(),
            "address": btcAddress,
            amount,
            "captcha": captcha,
            "currency": "btc"
        });

        const key = await getTestKeys()

        const response = await request()
        .post('/v2/user/confirm-withdrawal')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
            "token": key,
        });


         userBalance = await request()
            .get('/v2/user/balance')
            .set('Authorization', `Bearer ${bearerToken}`)


        const newBalance = userBalance.body['btc_available'];
        btcWithdrawalAmount = amount;
        assert.equal(oldBalance - newBalance, 0.00009999999999998899, 'wrong balance');
        response.should.have.status(200);
    
    });
    


    // {
    //     "tier": 1,
    //     "amount": 850,
    //     "currency": "xht",
    //     "limit_currency": "xht",
    //     "type": "withdrawal",
    //     "period": "24h",
    // }

    // {
    //     "tier": 1,
    //     "amount": 400,
    //     "currency": "btc",
    //     "limit_currency": "btc",
    //     "type": "withdrawal",
    //     "period": "24h",
    // }

    //Integration Testing
    it('Integration Test -should respond Check Max Amount -XHT ', async () => {

        let userBalance = await request()
        .get('/v2/user/balance')
        .set('Authorization', `Bearer ${bearerToken}`)

        const balance = userBalance.body['xht_available'];

        const response =  await request()
        .get('/v2/withdrawal/max?currency=xht&network=eth')
        .set('Authorization', `Bearer ${bearerToken}`)
       
        assert.equal(balance - xhtMarkupfee - xhtfee - xhtWithdrawalAmount, response.body.amount , 'wrong max value');
    
    });

    // {
    //     "tier": 1,
    //     "amount": 850,
    //     "currency": "usdt",
    //     "limit_currency": "default",
    //     "type": "withdrawal",
    //     "period": "24h",
    // }

    // {
    //     "tier": 1,
    //     "amount": 400,
    //     "currency": "btc",
    //     "limit_currency": "btc",
    //     "type": "withdrawal",
    //     "period": "24h",
    // }

    //Integration Testing
    it('Integration Test -should respond Check Max Amount -XHT ', async () => {

        let userBalance = await request()
        .get('/v2/user/balance')
        .set('Authorization', `Bearer ${bearerToken}`)

        const balance = userBalance.body['xht_available'];

        const response =  await request()
        .get('/v2/withdrawal/max?currency=xht&network=eth')
        .set('Authorization', `Bearer ${bearerToken}`)
       
        // BTC amount should be excluded from aggregation since it has its own individual limit
        assert.equal(balance - xhtMarkupfee - xhtfee - xhtWithdrawalAmount, response.body.amount , 'wrong max value');
    
    });

     // {
    //     "tier": 1,
    //     "amount": 850,
    //     "currency": "xht",
    //     "limit_currency": "default",
    //     "type": "withdrawal",
    //     "period": "24h",
    // }

    // {
    //     "tier": 1,
    //     "amount": 400,
    //     "currency": "btc",
    //     "limit_currency": "btc",
    //     "type": "withdrawal",
    //     "period": "24h",
    // }

    //Integration Testing
    it('Integration Test -should respond Check Max Amount -XHT ', async () => {

        let userBalance = await request()
        .get('/v2/user/balance')
        .set('Authorization', `Bearer ${bearerToken}`)

        const balance = userBalance.body['xht_available'];

        const response =  await request()
        .get('/v2/withdrawal/max?currency=xht&network=eth')
        .set('Authorization', `Bearer ${bearerToken}`)
       
        // BTC amount should be excluded from aggregation since it has its own individual limit
        assert.equal(balance - xhtMarkupfee - xhtfee - xhtWithdrawalAmount, response.body.amount , 'wrong max value');
    
    });


    // {
    //     "tier": 1,
    //     "amount": 850,
    //     "currency": "xht",
    //     "limit_currency": "default",
    //     "type": "withdrawal",
    //     "period": "24h",
    // }

    //Integration Testing
    it('Integration Test -should respond Check Max Amount -XHT ', async () => {

        let userBalance = await request()
        .get('/v2/user/balance')
        .set('Authorization', `Bearer ${bearerToken}`)

        const balance = userBalance.body['xht_available'];

        const response =  await request()
        .get('/v2/withdrawal/max?currency=xht&network=eth')
        .set('Authorization', `Bearer ${bearerToken}`)
       
        // BTC amount should not be excluded from aggregation since its limit data is removed.
        assert.equal(balance - xhtMarkupfee - xhtfee - xhtWithdrawalAmount - btcWithdrawalAmount, response.body.amount , 'wrong max value');
    
    });
   
   
});