const {
	request,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const crypto = require('crypto');
const { getModel } = require('../../utils/hollaex-tools-lib/tools/database/model');

describe('subaccount withdrawal restrictions', function () {
	let masterUser;
	let subaccount;
	let subBearerToken;

	before(async () => {
		masterUser = await tools.user.getUserByEmail(getAdminUser().email);
		masterUser.should.be.an('object');

		subaccount = await tools.user.createSubaccount(masterUser.id, {
			email: `${Date.now()}-${masterUser.email}`,
			password: 'test112233.',
			virtual: true,
			label: 'Test Subaccount'
		});
		subaccount.should.be.an('object');

		subBearerToken = await tools.user.issueSubaccountToken({
			masterKitId: masterUser.id,
			subKitId: subaccount.id,
			ip: '1.1.1.1',
			headers: {}
		});
		subBearerToken.should.be.a('string');
	});

	it('blocks subaccount request-withdrawal', async () => {
		const response = await request()
			.post('/v2/user/request-withdrawal')
			.set('Authorization', `Bearer ${subBearerToken}`)
			.send({
				network: 'trx',
				address: 'TFQ9gxeMEkmKoxgrbnHNdu4e3VdNL11vyy',
				amount: 1,
				currency: 'usdt'
			});

		response.should.have.status(400);
		response.body.message.should.equal('Withdrawal disabled for this user');
		response.should.be.json;
	});

	it('blocks subaccount confirm-withdrawal even with a token', async () => {
		const withdrawal = await tools.wallet.sendRequestWithdrawalEmail(
			subaccount.id,
			'TFQ9gxeMEkmKoxgrbnHNdu4e3VdNL11vyy',
			1,
			'usdt',
			'v2',
			{
				network: 'trx',
				skipValidate: true,
				ip: '1.1.1.1',
				domain: 'http://localhost'
			}
		);

		const response = await request()
			.post('/v2/user/confirm-withdrawal')
			.set('Authorization', `Bearer ${subBearerToken}`)
			.send({
				token: withdrawal.transaction_id
			});

		response.should.have.status(400);
		response.body.message.should.equal('Withdrawal disabled for this user');
		response.should.be.json;
	});

	it('blocks subaccount direct withdrawal with HMAC', async () => {
		const tokenModel = getModel('token');
		const token = await tokenModel.create({
			user_id: subaccount.id,
			key: crypto.randomBytes(20).toString('hex'),
			secret: crypto.randomBytes(25).toString('hex'),
			expiry: new Date(Date.now() + 60 * 60 * 1000),
			role: 'user',
			type: 'hmac',
			name: 'subaccount-withdrawal-test',
			active: true,
			revoked: false,
			can_read: true,
			can_trade: false,
			can_withdraw: true,
			whitelisted_ips: [],
			whitelisting_enabled: false
		});

		const body = {
			network: 'trx',
			address: 'TFQ9gxeMEkmKoxgrbnHNdu4e3VdNL11vyy',
			amount: 1,
			currency: 'usdt'
		};

		const expires = Math.floor(token.expiry.getTime() / 1000);
		const signature = tools.security.calculateSignature(token.secret, 'POST', '/v2/user/withdrawal', expires, body);
		const response = await request()
			.post('/v2/user/withdrawal')
			.set('Api-key', token.key)
			.set('Api-expires', expires)
			.set('Api-signature', signature)
			.send(body);

		response.should.have.status(400);
		response.body.message.should.equal('Withdrawal disabled for this user');
		response.should.be.json;
	});
});
