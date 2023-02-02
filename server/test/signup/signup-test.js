const {
    request,
    generateFuzz
} = require('../helpers');

describe('Auth Flow', async () => {

    // Intergration Testing
    it('Integration Test -should signup successfuly', async () => {
        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(201);
        response.should.be.json;
    });

    it('Integration Test -should return error for wrong email', async () => {
        const testUser = {
            email: `${generateFuzz(5)}`,
            password: "test112233.",
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(400);
        response.should.be.json;
    });

    it('Integration Test -should return error for invalid password', async () => {
        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: generateFuzz(5),
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(400);
        response.should.be.json;
    });

    it('Integration Test -should return error for long password', async () => {
        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: generateFuzz(150),
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(500);
        response.should.be.json;
    });


    //Fuzz testing
    it('Fuzz Test -should return error', async () => {
        const testUser = {
            email: generateFuzz(),
            password: generateFuzz(),
            long_term: true
        }
        const response = await request()
            .post(`/v2/signup/`)
            .send(testUser);

        response.should.have.status(500);
        response.should.be.json;
    });

});

