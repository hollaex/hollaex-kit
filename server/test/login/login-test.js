const {
    request,
    loginAs,
    generateFuzz
} = require('../helpers');

const tools = require('hollaex-tools-lib');

describe('Auth Flow', async () => {

    // Intergration Testing
    let user, bearerToken, createdUser;
    it('Integration -should signup successfuly', async () => {
        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        createdUser = testUser;
        response.should.have.status(201);
        response.should.be.json;
    });


    it('Integration -should login successfuly', async () => {
        user = await tools.user.getUserByEmail(createdUser.email);
        user.should.be.an('object');
        bearerToken = loginAs(user);
        bearerToken.should.be.a('string');

        const response = await request()
            .post(`/v2/login/`)
            .send(createdUser);

        response.should.have.status(201);
        response.should.be.json;
    });

    it('Integration -should return error for wrong email', async () => {
        const testUser = {
            email: `${generateFuzz(5)}`,
            password: "test112233.",
            password_repeat: "test112233.",
            terms: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(400);
        response.should.be.json;
    });


    //Fuzz testing
    it('Fuzz Test -should return error', async () => {
        const testUser = {
            email: generateFuzz(),
            password: generateFuzz(),
            terms: true
        }

        const response = await request()
            .post(`/v2/login/`)
            .send(testUser);

        response.should.have.status(500);
    });

});

