const expect = require("chai").expect;
const HollaEx = require('../index');

require('dotenv').load();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const client = new HollaEx({accessToken: ACCESS_TOKEN});

describe('Public functions', function () {
    const symbolPare = 'btc-eur';

    describe('#getTicker(symbolPare)', function () {
        it('Get the ticker output', function (done) {
            client.getTicker(symbolPare).then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                expect(data).to.have.property('high');
                expect(data).to.have.property('low');
                expect(data).to.have.property('open');
                expect(data).to.have.property('close');
                expect(data).to.have.property('volume');
                expect(data).to.have.property('last');
                done();
            });
        });
        it('Should trigger an error when no symbol is given', function (done) {
            client.getTicker().catch(() => {
                done();
            });
        });
    });

    describe('#getOrderbook(symbolPare)', function () {
        it('Get the orderbook output', function (done) {
            client.getOrderbook(symbolPare).then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                done();
            });
        });
    });

    describe('#getTrade(symbolPare)', function () {
        it('Get the trade output', function (done) {
            client.getTrade(symbolPare).then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                expect(data[symbolPare]).not.be.empty;
                expect(data[symbolPare][0]).not.be.empty;
                expect(data[symbolPare][0]).to.have.property('size');
                expect(data[symbolPare][0]).to.have.property('price');
                expect(data[symbolPare][0]).to.have.property('timestamp');
                expect(data[symbolPare][0]).to.have.property('side');
                done();
            });
        });
    });

    describe('#getConstant()', function () {
        it('Get the constant output', function (done) {
            client.getConstant().then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                expect(data.pairs).not.be.empty;
                done();
            });
        });
    });
});

describe('Private functions', function () {
    const symbolPare = 'btc-eur';

    describe('#getUser()', function () {
        it('Get the user output', function (done) {
            client.getUser().then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                done();
            });
        });
    });

    describe('#getBalance()', function () {
        it('Get the balance output', function (done) {
            client.getBalance().then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                done();
            });
        });
    });

    describe('#getDeposit()', function () {
        it('Get the deposit output', function (done) {
            client.getDeposit().then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                done();
            });
        });
    });

    describe('#getWithdrawal()', function () {
        it('Get the withdrawal output', function (done) {
            client.getWithdrawal().then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                done();
            });
        });
    });

    describe('#getUserTrade()', function () {
        it('Get the user trade output', function (done) {
            client.getUserTrade().then(result => {
                const data = JSON.parse(result);
                expect(data).to.be.an('object');
                expect(data).not.be.empty;
                done();
            });
        });
    });
});