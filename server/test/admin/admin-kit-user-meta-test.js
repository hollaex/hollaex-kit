const {
    request,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /admin/kit/user-meta', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });

    //Integration Testing
    it('Integration Test -should respond 200 for "Success"', async () => {
        const metaName = generateFuzz(5);
        const response = await request()
            .post('/v2/admin/kit/user-meta')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "name": metaName, "type": "date-time", "required": false, "description": generateFuzz(5)
            })

        response.should.have.status(200);
        response.should.be.json;

        const existingMetaField = await request()
            .post('/v2/admin/kit/user-meta')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "name": metaName, "type": "date-time", "required": false, "description": generateFuzz(5)
            })

        existingMetaField.should.have.status(400);
        existingMetaField.should.be.json;


    });


    //Integration Testing
    // it('Integration Test -should respond 200 for "Success"', async () => {
    //     const metaName = generateFuzz(5);
    //     const response = await request()
    //         .put('/v2/admin/kit/user-meta')
    //         .set('Authorization', `Bearer ${bearerToken}`)
    //         .send({
    //             "name": metaName, "type": "date-time", "required": false, "description": generateFuzz(5)
    //         })

    //     response.should.have.status(200);
    //     response.body.required.should.equal(false);
    //     response.should.be.json;

    //     const existingMetaField = await request()
    //         .put('/v2/admin/kit/user-meta')
    //         .set('Authorization', `Bearer ${bearerToken}`)
    //         .send({
    //             "name": metaName, "type": "date-time", "required": true, "description": generateFuzz(5)
    //         })

    //     existingMetaField.should.have.status(200);
    //     response.body.required.should.equal(true);
    //     existingMetaField.should.be.json;

    // });



    //DELETE

    //Fuz Testing
    it('Fuzz Test -should return error', async () => {
        const response = await request()
            .put('/v2/admin/kit/user-meta')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "name": generateFuzz(), "type": "date-time", "required": false, "description": generateFuzz(5)
            })

        response.should.have.status(400);
        response.should.be.json;
    });

});