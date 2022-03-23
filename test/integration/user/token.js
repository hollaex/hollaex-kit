const {
	request,
	getTestUser,
	loginAs,
	otpCodeFor,
	emailCodeFor,
	tools,
	sleep
} = require('../helpers');

describe('Token Management', async () => {
	var user, bearerToken, hmacToken;

	before(async () => {
		user = await getTestUser();
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});

	it('should create an HMAC token', async () => {
		const response = await request()
			.post('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				name: 'Test Token',
				otp_code: await otpCodeFor(user),
				email_code: await emailCodeFor(user, bearerToken),
			});

		response.should.have.status(200);
		response.should.be.json;
		response.body.should.have.property('apiKey');
		response.body.should.have.property('secret');

		hmacToken = response.body;
	});

	it('should fetch HMAC tokens', async () => {
		const response = await request()
			.get('/v2/user/tokens')
			.set('Authorization', `Bearer ${bearerToken}`);

		response.should.have.status(200);
		response.should.be.json;
		response.body.data.should.be.an('array');

		const target = response.body.data.find((token) => hmacToken.apiKey === token.apiKey);
		hmacToken.expiry = Date.parse(target.expiry);
		hmacToken.id = target.id;
	});

	it('should update the HMAC token with permissions', async () => {
		const response = await request()
			.put('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				token_id: hmacToken.id,
				otp_code: await otpCodeFor(user),
				email_code: await emailCodeFor(user, bearerToken),
				permissions: {
					can_read: true,
					can_trade: true,
					can_withdraw: true
				},
				whitelisting_enabled: false
			});

		response.should.have.status(200);
		response.should.be.json;
	});

	it('should be able to use read permission', async () => {
		const expires = hmacToken.expiry / 1000;
		const signature = tools.security.calculateSignature(hmacToken.secret, 'GET', '/v2/user', expires);

		const response = await request()
			.get('/v2/user')
			.set('Api-key', hmacToken.apiKey)
			.set('Api-expires', expires)
			.set('Api-signature', signature);

		response.should.have.status(200);
		response.should.be.json;
	});

	// TODO check the rest of the newly given permissions

	it('should delete the HMAC token', async () => {
		const response = await request()
			.delete('/v2/user/token')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				token_id: hmacToken.id,
				otp_code: await otpCodeFor(user)
			});

		response.should.have.status(200);
	});

	it('should deny authorization if the revoked token is used', async () => {
		const expires = hmacToken.expiry / 1000;
		const signature = tools.security.calculateSignature(hmacToken.secret, 'GET', '/v2/user', expires);
		const response = await request()
			.get('/v2/user')
			.set('Api-key', hmacToken.apiKey)
			.set('Api-expires', expires)
			.set('Api-signature', signature);

		response.should.have.status(403);
	});
});
