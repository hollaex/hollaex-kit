'use strict';

const { isPhoneSignupSyntheticUser } = require('../../utils/hollaex-tools-lib/tools/user');

describe('isPhoneSignupSyntheticUser', () => {
	it('returns true when meta.phone_signup is true', () => {
		isPhoneSignupSyntheticUser({
			email: 'real@example.com',
			meta: { phone_signup: true }
		}).should.equal(true);
	});

  it('returns true when email ends with _sms suffix', () => {
    isPhoneSignupSyntheticUser({
      email: '15551234567_sms',
      meta: {}
    }).should.equal(true);
  });

	it('returns false for normal email without meta flag', () => {
		isPhoneSignupSyntheticUser({
			email: 'user@example.com',
			meta: {}
		}).should.equal(false);
	});
});
