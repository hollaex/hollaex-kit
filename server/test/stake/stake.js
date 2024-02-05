const {
    request,
    getAdminUser,
    loginAs,
} = require('../helpers');
const assert = require('assert');
const tools = require('hollaex-tools-lib');
const {
    STAKE_INVALID_STATUS,
    STAKE_ONBOARDING_STATUS_ERROR,
    STAKE_PERPETUAL_CONDITION_ERROR,
    ACCOUNT_ID_NOT_EXIST,
    STAKE_POOL_ACCEPT_USER_ERROR,
    STAKE_POOL_NOT_ACTIVE,
} = require('../../messages');

describe('Stake Pool Flow', async () => {
    let user, bearerToken, createdStakePool, createdStaker

    const stakePool = {
        name: 'Test Stake Pool',
        currency: 'usdt',
        account_id: 266,
        apy: 10,
        duration: 30,
        slashing: true,
        slashing_principle_percentage: 15,
        slashing_earning_percentage: 10,
        early_unstake: true,
        min_amount: 1,
        max_amount: 100,
        status: 'uninitialized',
        disclaimer: 'test',
        onboarding: false,
    }

    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    it('should create a stake pool', async () => {
        const response = await request()
            .post(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(stakePool);
        createdStakePool = response.body;
        response.should.have.status(200);
        response.should.be.json;

        assert.equal(createdStakePool.name, 'Test Stake Pool', 'wrong name');
        assert.equal(createdStakePool.currency, 'usdt', 'wrong currency');
        assert.equal(createdStakePool.account_id, 1, 'wrong account_id');
        assert.equal(createdStakePool.apy, 10, 'wrong apy');
        assert.equal(createdStakePool.duration, 30, 'wrong duration');
        assert.equal(createdStakePool.slashing, true, 'wrong slashing type');
        assert.equal(createdStakePool.slashing_principle_percentage, 15, 'wrong type');
        assert.equal(createdStakePool.slashing_earning_percentage, 10, 'wrong type');
        assert.equal(createdStakePool.early_unstake, true, 'wrong type');
        assert.equal(createdStakePool.min_amount, 1, 'wrong type');
        assert.equal(createdStakePool.max_amount, 100, 'wrong type');
        assert.equal(createdStakePool.disclaimer, 'test', 'wrong type');
        assert.equal(createdStakePool.onboarding, false, 'wrong onboarding type');

    });


      it('should not create a stake pool because of wrong initial status', async () => {
        stakePool.status = 'active'
        const response = await request()
            .post(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(stakePool);
        response.should.have.status(400);
        response.should.be.json;
        assert.equal(response.body.message, STAKE_INVALID_STATUS, 'wrong message');
          
        stakePool.status = 'uninitialized'
       
    });

    it('should not create a stake pool because of wrong initial onboarding status', async () => {
        stakePool.onboarding = true;
        const response = await request()
            .post(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(stakePool);
        response.should.have.status(400);
        response.should.be.json;
        assert.equal(response.body.message, STAKE_ONBOARDING_STATUS_ERROR, 'wrong message');
        stakePool.onboarding = false;
       
    });

    it('should not create a stake pool because of invalid coin', async () => {
        stakePool.currency = 'abc'
        const response = await request()
            .post(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(stakePool);
        response.should.have.status(400);
        response.should.be.json;
        assert.equal(response.body.message, STAKE_ONBOARDING_STATUS_ERROR, 'wrong message');
        stakePool.currency = 'usdt'
       
    });


     it('should not create a stake pool because of non existant account id', async () => {
        stakePool.account_id = 23402394230432;
        const response = await request()
            .post(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(stakePool);
        response.should.have.status(400);
        response.should.be.json;
        assert.equal(response.body.message, ACCOUNT_ID_NOT_EXIST, 'wrong message');
        stakePool.account_id = 1;
       
    });

    it('should not create a perpetual stake pool with slashing or early unstake', async () => {
        stakePool.duration = 0;
        const response = await request()
            .post(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(stakePool);
        response.should.have.status(400);
        response.should.be.json;
        assert.equal(response.body.message, STAKE_PERPETUAL_CONDITION_ERROR, 'wrong message');
        stakePool.duration = 30;
       
    });


    it('should not stake in the created pool because of false onboarding', async () => {
        const response = await request()
            .post(`/v2/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ stake_id: createdStakePool.id, amount: 10 });
        response.should.have.status(400);
        response.should.be.json;
        assert.equal(response.body.message, STAKE_POOL_ACCEPT_USER_ERROR, 'wrong message');
       
    });

    it('should update the created stake pool onboarding to true', async () => {
        const response = await request()
            .put(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ id: createdStakePool.id, onboarding: true });
        response.should.have.status(200);
        response.should.be.json;
        assert.equal(response.body.status, 'active', 'wrong status');
    });

  
    it('should not stake in the created pool because of uninitialized status', async () => {
        const response = await request()
            .post(`/v2/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ stake_id: createdStakePool.id, amount: 10 });
        response.should.have.status(400);
        response.should.be.json;
        assert.equal(response.body.message, STAKE_POOL_NOT_ACTIVE, 'wrong message');
       
    });


     it('should update the created stake pool status to active', async () => {
        const response = await request()
            .put(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ id: createdStakePool.id, status: 'active' });
        response.should.have.status(200);
        response.should.be.json;
        assert.equal(response.body.status, 'active', 'wrong status');
    });


    it('should not be able to stake in the created pool with invalid min amount', async () => {

        const response = await request()
            .post(`/v2/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ stake_id: createdStakePool.id, amount: 0 });
        response.should.have.status(400);
        response.should.be.json;

    });

    it('should not be able to stake in the created pool with invalid max amount', async () => {

        const response = await request()
            .post(`/v2/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ stake_id: createdStakePool.id, amount: 150 });
        response.should.have.status(400);
        response.should.be.json;

    });

    it('should not be able to stake in the created pool because of insufficient funds', async () => {

        const response = await request()
            .post(`/v2/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ stake_id: createdStakePool.id, amount: 5221524545465 });
        response.should.have.status(400);
        response.should.be.json;

    });


    it('should be able to stake in the created pool', async () => {

        //Get Balance

        const response = await request()
            .post(`/v2/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ stake_id: createdStakePool.id, amount: 10 });
        response.should.have.status(200);
        response.should.be.json;
        createdStaker = response.body;
        assert.equal(response.body.status, 'staking', 'wrong status');
        assert.equal(response.body.amount, 10, 'wrong  amount');

        //Compare Balance

    });

     it('should be able to unstake in the created pool', async () => {
        const response = await request()
            .delete(`/v2/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ id: createdStaker.id });
        response.should.have.status(200);
        response.should.be.json;
        assert.equal(response.body.status, 'unstaking', 'wrong status');
     
    });

    it('should not be able to terminate the created stake because not paused', async () => {
        const response = await request()
            .put(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ id: createdStakePool.id, status: 'terminated' });
        response.should.have.status(400);
        response.should.be.json;
    });


     it('should pause the created stake because not paused', async () => {
        const response = await request()
            .put(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ id: createdStakePool.id, status: 'paused' });
        response.should.have.status(200);
        response.should.be.json;
    });

    it('should be able to terminate the created stake', async () => {
        const response = await request()
            .put(`/v2/admin/stake`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({ id: createdStakePool.id, status: 'terminated' });
        response.should.have.status(200);
    });


});