const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
describe('tests for /admin/kit', function () {

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
            .get('/v2/admin/kit')
            .set('Authorization', `Bearer ${bearerToken}`);

        response.should.have.status(200);
        response.should.be.json;
    });

    it('Integration Test -should respond 200 for "Success"', async () => {
        const responseOne = await request()
            .put('/v2/admin/kit')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                kit: { black_list_countries: ["AD"] }
            })
            
        responseOne.should.have.status(200);
        responseOne.should.be.json;

        if(!responseOne.body.kit.black_list_countries.includes('AD')){
            throw new Error('update operation not successfull')
        }
        
        const responseSecond = await request()
            .put('/v2/admin/kit')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                kit: { black_list_countries: ["AI"] }
            })   

        responseSecond.should.have.status(200);
        responseSecond.should.be.json;

        if(!responseSecond.body.kit.black_list_countries.includes('AI')){
            throw new Error('update operation not successfull')
        }
    });
});