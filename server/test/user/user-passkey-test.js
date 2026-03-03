const {
	request,
	loginAs,
	getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');
const { createPasskeyCredential } = require('../helpers/passkey-credential');

const email = 'ali+1@hollaex.com';

describe('tests for /user passkey endpoints', function () {
	let user, bearerToken;

	before(async () => {
		user = await tools.user.getUserByEmail(email);
		user.should.be.an('object');
		bearerToken = await loginAs(user);
		bearerToken.should.be.a('string');
	});

	describe('GET /user/request-passkey-options', function () {
		it('Integration Test - should return registration options with challenge, rp, and user', async () => {
			const response = await request()
				.get('/v2/user/request-passkey-options')
				.set('Authorization', `Bearer ${bearerToken}`);

			response.should.have.status(200);
			response.should.be.json;
			response.body.should.have.property('challenge');
			response.body.challenge.should.be.a('string');
			response.body.challenge.length.should.be.above(0);
			response.body.should.have.property('rp');
			response.body.rp.should.have.property('name');
			response.body.rp.should.have.property('id');
			response.body.should.have.property('user');
			response.body.user.should.have.property('id');
			response.body.user.should.have.property('name');
			response.body.user.should.have.property('displayName');
		});

		it('Integration Test - should return 401 without auth', async () => {
			const response = await request()
				.get('/v2/user/request-passkey-options');

			response.should.have.status(401);
			response.should.be.json;
		});
	});

	describe('POST /user/activate-passkey', function () {
		it('Integration Test - should return 400 when missing challenge', async () => {
			const optionsRes = await request()
				.get('/v2/user/request-passkey-options')
				.set('Authorization', `Bearer ${bearerToken}`);

			optionsRes.should.have.status(200);
			const webauthnUserId = optionsRes.body.user.id;

			const response = await request()
				.post('/v2/user/activate-passkey')
				.set('Authorization', `Bearer ${bearerToken}`)
				.send({
					challenge: '',
					webauthn_user_id: webauthnUserId,
					credential: { id: 'x', rawId: 'eA', response: {}, type: 'public-key' }
				});

			response.should.have.status(400);
			response.should.be.json;
			response.body.should.have.property('message');
		});

		it('Integration Test - should return 400 when missing webauthn_user_id', async () => {
			const optionsRes = await request()
				.get('/v2/user/request-passkey-options')
				.set('Authorization', `Bearer ${bearerToken}`);

			optionsRes.should.have.status(200);
			const challenge = optionsRes.body.challenge;

			const response = await request()
				.post('/v2/user/activate-passkey')
				.set('Authorization', `Bearer ${bearerToken}`)
				.send({
					challenge,
					webauthn_user_id: '',
					credential: { id: 'x', rawId: 'eA', response: {}, type: 'public-key' }
				});

			response.should.have.status(400);
			response.should.be.json;
			response.body.should.have.property('message');
		});

		it('Integration Test - should return 400 when missing credential', async () => {
			const optionsRes = await request()
				.get('/v2/user/request-passkey-options')
				.set('Authorization', `Bearer ${bearerToken}`);

			optionsRes.should.have.status(200);
			const challenge = optionsRes.body.challenge;
			const webauthnUserId = optionsRes.body.user.id;

			const response = await request()
				.post('/v2/user/activate-passkey')
				.set('Authorization', `Bearer ${bearerToken}`)
				.send({
					challenge,
					webauthn_user_id: webauthnUserId,
					credential: null
				});

			response.should.have.status(400);
			response.should.be.json;
			response.body.should.have.property('message');
		});

		it('Integration Test - should return 400 for invalid/malformed credential', async () => {
			const optionsRes = await request()
				.get('/v2/user/request-passkey-options')
				.set('Authorization', `Bearer ${bearerToken}`);

			optionsRes.should.have.status(200);
			const challenge = optionsRes.body.challenge;
			const webauthnUserId = optionsRes.body.user.id;

			const toBase64Url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

			const response = await request()
				.post('/v2/user/activate-passkey')
				.set('Authorization', `Bearer ${bearerToken}`)
				.send({
					challenge,
					webauthn_user_id: webauthnUserId,
					credential: {
						id: 'fake-credential-id',
						rawId: toBase64Url('fake'),
						response: {
							clientDataJSON: toBase64Url(JSON.stringify({
								type: 'webauthn.create',
								challenge: challenge,
								origin: 'http://localhost'
							})),
							attestationObject: toBase64Url('invalid-attestation')
						},
						type: 'public-key'
					}
				});

			response.should.have.status(400);
			response.should.be.json;
			response.body.should.have.property('message');
		});

		it('Integration Test - should return 401 without auth', async () => {
			const response = await request()
				.post('/v2/user/activate-passkey')
				.send({
					challenge: 'test-challenge',
					webauthn_user_id: 'test-user-id',
					credential: { id: 'x', rawId: 'eA', response: {}, type: 'public-key' }
				});

			response.should.have.status(401);
			response.should.be.json;
		});

		it('Integration Test - should successfully activate passkey', async () => {
			const origin = process.env.DOMAIN || 'http://localhost:3000';

			const optionsRes = await request()
				.get('/v2/user/request-passkey-options')
				.set('Authorization', `Bearer ${bearerToken}`)
				.set('Origin', origin);

			optionsRes.should.have.status(200);
			const options = optionsRes.body;

			const payload = createPasskeyCredential(options, origin);

			console.log('payload', payload);

			const response = await request()
				.post('/v2/user/activate-passkey')
				.set('Authorization', `Bearer ${bearerToken}`)
				.set('Origin', origin)
				.send(payload);

			response.should.have.status(200);
			response.should.be.json;
			response.body.message.should.equal('Passkey created successfully');

			const passkeys = await tools.database.findAll('passkey', { where: { user_id: user.id } });
			passkeys.length.should.be.above(0);
			passkeys.some((pk) => pk.credential_id === payload.credential.id).should.be.true;
		});
	});
});
