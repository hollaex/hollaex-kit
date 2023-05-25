const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /user/deposits', function () {

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
            .get('/v2/user/deposits')
            .set('Authorization', `Bearer ${bearerToken}`)
            
    
            response.should.have.status(200);
            response.should.be.json;
    
    });

    it('Integration Test -should respond 202 for "Success"', async () => {
        const response = await request()
            .get('/v2/user/deposits?format=csv')
            .set('Authorization', `Bearer ${bearerToken}`)
            
            //"currency": "reprehenderit deserunt tempor", "limit": -6079707.128986195, "page": 14036004.401351973, "order_by": "voluptate magna", "order": "asc", "start_date": "1989-11-03T07:59:10.0Z", "end_date": "2005-07-05T10:17:58.0Z", "format": "csv", "transaction_id": "nostrud deserunt sed reprehenderit", "address": "sint Excepteur id eu voluptate", "status": false, "dismissed": true, "rejected": false, "processing": true, "waiting": false 
            response.should.have.status(202);
    
    });

});