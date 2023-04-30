const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/deposits', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    it('Integration Test -should return 200 for success', async () => {
        const testUser = {
            email: `test_auth${Math.floor(Math.random() * 10000)}@mail.com`,
            password: "test112233.",
            long_term: true
        }
        const createdUser = await request()
            .post(`/v2/signup/`)
            .send(testUser);

		const userObject = await tools.user.getUserByEmail(testUser.email);
        createdUser.body.id = userObject.id;
        const transaction = {
            sender_id: user.id,
            receiver_id: createdUser.body.id,
            currency: "xht",
            amount: 1,
            email: false,
            description: "test"
        }
        const response = await request()
            .post('/v2/admin/transfer')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(transaction);

        response.should.have.status(200);
        response.should.be.json;

        const depositHistory = await request()
            .get(`/v2/admin/deposits?user_id=${createdUser.body.id}`)
            .set('Authorization', `Bearer ${bearerToken}`)

        depositHistory.body.data[0].amount.should.equal(transaction.amount);
        depositHistory.body.data[0].currency.should.equal(transaction.currency);
    });

    it('Integration Test -should return 202 csv for success', async () => {
        const response = await request()
            .get(`/v2/admin/deposits?format=csv`)
            .set('Authorization', `Bearer ${bearerToken}`)
        response.should.have.status(202);
    });

    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .get(`/v2/admin/deposits?format=${generateFuzz()}`)
            .set('Authorization', `Bearer ${bearerToken}`)


        response.should.have.status(500);
        response.should.be.json;
    });
});