const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');


describe('tests for /user/username', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

      //Integration Testing
      it('Integration Test -should respond 200 for "Success"', async () => {
        const user = await request()
        .get('/v2/user')
        .set('Authorization', `Bearer ${bearerToken}`)

        if(!user?.settings?.chat?.set_username){
            const response = await request()
            .post('/v2/user/username')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                username: "Test1234"
            });

            response.should.have.status(400);
            response.should.be.json;
        }
        
    });

    //Fuz Testing
	it('Fuzz Test -should return error', async () => {
		const response = await request()
			.post('/v2/user/username')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                username: generateFuzz()
            });
		response.should.have.status(400);
		response.should.be.json;
	});



  
});