const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');


describe('tests for /chart', function () {

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
            .get('/v2/chart?symbol=xht-usdt&resolution=1D&from=163486&to=1651104000')
            .set('Authorization', `Bearer ${bearerToken}`)
           
        
        response.should.have.status(200);
        response.should.be.json;
     
    });


      //Fuzz Testing
      it('Fuzz Test -should throw error', async () => {
        const response = await request()
        .get(`/v2/chart?symbol=xht-usdt&resolution=1D&from=163486&to=${generateFuzz()}`)
            .set('Authorization', `Bearer ${bearerToken}`)
           
        
        response.should.have.status(403);
        response.should.be.json;
     
    });

  
});