const {
    request,
    loginAs,
    generateFuzz
} = require('../helpers');

const tools = require('hollaex-tools-lib');
const { expect } = require('chai');
describe('Auth Flow', async () => {

    //Unit Testing
    it('Unit Test -should throw error for same password', async () => {

        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        let response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(201);
        response.should.be.json;


        try {
            expect(await tools.security.changeUserPassword(
                testUser.email, testUser.password, testUser.password,
                testUser.email, testUser.password, `Test1${generateFuzz(10)}.`,
            )).to.throw();
        } catch (err) {
            err.should.have.property('message');
        }

    });

    it('Unit Test -should throw error for invalid password', async () => {

        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        let response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(201);
        response.should.be.json;


        try {
            expect(await tools.security.changeUserPassword(
                testUser.email, testUser.password, '1234',
            )).to.throw();
        } catch (err) {
            err.should.have.property('message');
        }
    });

    it('Unit Test -should throw error for invalid crendetials ', async () => {

        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        let response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(201);
        response.should.be.json;


        try {
            expect(await tools.security.changeUserPassword(
                testUser.email, generateFuzz(10), testUser.password
            )).to.throw();
        } catch (err) {
            err.should.have.property('message');
        }
    });

    it('Integration Test -should send password change email successfuly', async () => {

        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        let response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(201);
        response.should.be.json;

        let user, bearerToken;
        user = await tools.user.getUserByEmail(testUser.email);
        user.should.be.an('object');
        bearerToken = loginAs(user);
        bearerToken.should.be.a('string');

        response = await request()
            .post(`/v2/user/change-password/`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                email: testUser.email,
                old_password: testUser.password,
                new_password: `Test1${generateFuzz(10)}.`
            });
        response.should.have.status(200);
        response.should.be.json;

    });


    //Fuzz testing
    it('Fuzz Test -should return error', async () => {

        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        let response = await request()
            .post(`/v2/signup/`)
            .send(testUser);
        response.should.have.status(201);
        response.should.be.json;

        let user, bearerToken;
        user = await tools.user.getUserByEmail(testUser.email);
        user.should.be.an('object');
        bearerToken = loginAs(user);
        bearerToken.should.be.a('string');

        response = await request()
            .post(`/v2/user/change-password/`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                email: testUser.email,
                old_password: generateFuzz(),
                new_password: generateFuzz()
            });
        response.should.have.status(500);
        response.should.be.json;
    });

});

