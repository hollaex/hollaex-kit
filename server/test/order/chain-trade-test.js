const {
    request,
    getNewUserCredentials,
    getAdminUser,
    loginAs
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { client } = require('../../utils/hollaex-tools-lib/tools/database/redis');
const uuid = require('uuid').v4;
const sinon = require('sinon');

describe('Chain Trade Tests', function () {
    let adminUser, bearerToken;

    before(async () => {
        adminUser = await tools.user.getUserByEmail(getAdminUser().email);
        bearerToken = await loginAs(adminUser);
    });

    describe('getUserChainTradeQuote', function () {
        it('should return a valid token and quote amount', async () => {
            const symbol = 'btc-usdt';
            const size = 1;
            const quote = await getUserChainTradeQuote(bearerToken, symbol, size, '1.1.1.1');

            quote.should.have.property('token');
            quote.should.have.property('quote_amount');
            quote.quote_amount.should.be.a('number');
        });

        it('should throw an error if feature is not active', async () => {
            const configStub = sinon.stub(tools.config, 'getKitConfig').returns({ chain_trade_config: { active: false } });
            try {
                await getUserChainTradeQuote(bearerToken, 'btc-usdt', 1, '1.1.1.1');
            } catch (error) {
                error.message.should.equal('Feature not active');
            } finally {
                configStub.restore();
            }
        });

        it('should return null if no conversion path is found', async () => {
            const symbol = 'btc-nonexistent';
            const size = 1;
            const quote = await getUserChainTradeQuote(bearerToken, symbol, size, '1.1.1.1');

            (quote.token === null).should.be.true;
            (quote.quote_amount === undefined).should.be.true;
        });
    });

    describe('executeUserChainTrade', function () {
        it('should execute trades successfully and return result', async () => {
            const symbol = 'btc-usdt';
            const size = 1;

            // Create a chain trade quote
            const quote = await getUserChainTradeQuote(bearerToken, symbol, size, '1.1.1.1');

            // Execute the chain trade
            const result = await executeUserChainTrade(adminUser.id, quote.token);

            result.should.have.property('status', 'success');
        });

        it('should throw an error if token is expired', async () => {
            const token = uuid(); // Generate a random token

            try {
                await executeUserChainTrade(adminUser.id, token);
            } catch (error) {
                error.message.should.equal('Token expired');
            }
        });

        it('should throw an error if user is not found', async () => {
            const symbol = 'btc-usdt';
            const size = 1;

            const quote = await getUserChainTradeQuote(bearerToken, symbol, size, '1.1.1.1');

            // Use a non-existent user ID
            try {
                await executeUserChainTrade('nonexistent_user_id', quote.token);
            } catch (error) {
                error.message.should.equal('User not found');
            }
        });

    });

    describe('executeTrades', function () {
        it('should execute all trades successfully', async () => {
            const tradeInfo = {
                trades: [
                    { symbol: 'btc-usdt', price: 30000, side: 'buy', size: 1, type: 'pro' },
                ]
            };

            const result = await executeTrades(tradeInfo, adminUser);
            result.should.be.an('array').that.has.lengthOf(2);
        });

        it('should throw an error if a trade fails', async () => {
            const tradeInfo = {
                trades: [
                    { symbol: 'btc-usdt', price: 30000, side: 'buy', size: 1, type: 'pro' },
                    { symbol: 'invalid-trade', price: 0, side: 'buy', size: 0, type: 'broker' }
                ]
            };

            try {
                await executeTrades(tradeInfo, adminUser);
            } catch (error) {
                error.message.should.include('Error occurred during trade executions.');
            }
        });
    });
});
