/**
 * Builds a valid WebAuthn registration credential with 'none' attestation
 * for use in passkey activation tests. Uses the same format that
 * SimpleWebAuthn's verifyRegistrationResponse expects.
 */
const crypto = require('crypto');
const cbor = require('@levischuck/tiny-cbor');

/**
 * Converts a buffer to base64url string (no padding)
 */
function toBase64Url(buffer) {
	if (typeof buffer === 'string') {
		buffer = Buffer.from(buffer, 'utf8');
	}
	return Buffer.from(buffer)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

/**
 * Creates a valid passkey registration credential for the given options.
 * @param {Object} options - Registration options from request-passkey-options
 * @param {string} options.challenge - Base64URL challenge
 * @param {string} options.rp.id - Relying party ID (e.g. 'localhost')
 * @param {string} origin - Expected origin (e.g. 'http://localhost:3000')
 * @param {string} options.user.id - WebAuthn user ID (webauthn_user_id)
 * @returns {Object} Credential in the format expected by activate-passkey
 */
function createPasskeyCredential(options, origin) {
	const rpID = options.rp?.id || 'localhost';
	const challenge = options.challenge;
	const webauthnUserId = options.user?.id;

	if (!challenge || !webauthnUserId) {
		throw new Error('options.challenge and options.user.id are required');
	}

	// Generate EC P-256 key pair for the credential
	const { publicKey } = crypto.generateKeyPairSync('ec', {
		namedCurve: 'P-256'
	});
	const exported = publicKey.export({ type: 'spki', format: 'der' });
	// SPKI ends with BIT STRING: 00 04 (uncompressed) + x (32) + y (32) = 66 bytes
	const keyBytes = Buffer.from(exported).slice(-65);
	if (keyBytes[0] !== 0x04) {
		throw new Error('Expected uncompressed point format');
	}
	const x = keyBytes.slice(1, 33);
	const y = keyBytes.slice(33, 65);

	// COSE EC2 P-256 key: Map with alg -7 (ES256)
	const coseKey = new Map([
		[1, 2],   // kty = EC2
		[3, -7],   // alg = ES256
		[-1, 1],   // crv = P-256
		[-2, new Uint8Array(x)],
		[-3, new Uint8Array(y)]
	]);
	const credentialPublicKey = new Uint8Array(cbor.encodeCBOR(coseKey));

	// Credential ID (random bytes)
	const credentialID = crypto.randomBytes(32);
	const credIDLen = credentialID.length;

	// rpIdHash = SHA-256 of rpID (ASCII)
	const rpIdHash = crypto.createHash('sha256').update(rpID, 'ascii').digest();

	// Flags: UP (0x01) + UV (0x04) + AT (0x40) = 0x45
	const flags = Buffer.alloc(1, 0x45);
	const counter = Buffer.alloc(4, 0);
	counter.writeUInt32BE(0, 0);

	// AAGUID: 16 zero bytes for 'none' attestation
	const aaguid = Buffer.alloc(16, 0);

	// authData = rpIdHash + flags + counter + aaguid + credIDLen(2) + credID + credentialPublicKey
	const credIDLenBuf = Buffer.alloc(2);
	credIDLenBuf.writeUInt16BE(credIDLen, 0);
	const authData = Buffer.concat([
		rpIdHash,
		flags,
		counter,
		aaguid,
		credIDLenBuf,
		credentialID,
		Buffer.from(credentialPublicKey)
	]);

	// attestationObject: CBOR { fmt: 'none', authData: Buffer, attStmt: {} }
	const attestationObjectMap = new Map([
		['fmt', 'none'],
		['authData', new Uint8Array(authData)],
		['attStmt', new Map()]
	]);
	const attestationObject = new Uint8Array(cbor.encodeCBOR(attestationObjectMap));

	// clientDataJSON
	const clientData = {
		type: 'webauthn.create',
		challenge,
		origin
	};
	const clientDataJSON = Buffer.from(JSON.stringify(clientData), 'utf8');

	// Credential ID as base64url (must match rawId)
	const credentialIdB64 = toBase64Url(credentialID);

	return {
		challenge,
		webauthn_user_id: webauthnUserId,
		credential: {
			id: credentialIdB64,
			rawId: credentialIdB64,
			response: {
				clientDataJSON: toBase64Url(clientDataJSON),
				attestationObject: toBase64Url(attestationObject),
				transports: []
			},
			type: 'public-key'
		}
	};
}

module.exports = { createPasskeyCredential, toBase64Url };
