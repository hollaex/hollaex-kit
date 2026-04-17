'use strict';

const { SERVER_PATH } = require('../constants');
const {
	EVENTS_CHANNEL,
	DEFAULT_VERIFICATION_METHOD
} = require(`${SERVER_PATH}/constants`);
const { publisher } = require('./database/redis');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { getKitConfig } = require('./common');
const { isSmsPluginActive } = require('./plugin');
const { logger } = require(`${SERVER_PATH}/config/logger`);

const getEffectiveVerificationMethod = async (user, deps = {}) => {
	const _getKitConfig = deps.getKitConfig || getKitConfig;
	const _isSmsPluginActive = deps.isSmsPluginActive || isSmsPluginActive;

	const stored =
		user?.settings?.verification_method || DEFAULT_VERIFICATION_METHOD;

	if (stored !== 'sms') return 'email';
	if (!_getKitConfig()?.features?.sms_verification) return 'email';
	if (!user?.phone_number) return 'email';

	let active;
	try {
		active = await _isSmsPluginActive();
	} catch (err) {
		// A transient DB / runtime failure while checking plugin availability
		// must never block the user from receiving their verification code.
		// Degrade safely to email so delivery still happens via sendEmail().
		logger.error(
			'tools/verification/getEffectiveVerificationMethod isSmsPluginActive failed, falling back to email',
			err.message
		);
		return 'email';
	}
	if (!active) return 'email';
	return 'sms';
};

const sendVerificationCode = async (user, {
	action_type,
	verification_code,
	emailType,
	emailData = {},
	domain
}) => {
	if (!user) {
		throw new Error('sendVerificationCode: user is required');
	}
	if (!action_type) {
		throw new Error('sendVerificationCode: action_type is required');
	}
	if (!verification_code) {
		throw new Error('sendVerificationCode: verification_code is required');
	}

	// Callers may invoke this fire-and-forget to keep critical paths (e.g. the
	// withdrawal HTTP response) off this function's DB / SMTP / Redis work.
	// Every step below catches its own failures so the returned promise cannot
	// reject once the validation block above has passed.

	let method;
	try {
		method = await getEffectiveVerificationMethod(user);
	} catch (err) {
		logger.error(
			'tools/verification/sendVerificationCode resolve method failed, defaulting to email',
			err.message
		);
		method = 'email';
	}

	if (method === 'email' && emailType) {
		try {
			sendEmail(emailType, user.email, emailData, user.settings, domain);
		} catch (err) {
			logger.error(
				'tools/verification/sendVerificationCode email dispatch failed',
				err.message
			);
		}
	}

	try {
		publisher.publish(EVENTS_CHANNEL, JSON.stringify({
			type: 'user_verification',
			data: {
				user_id: user.id,
				verification_method: method,
				action_type,
				verification_code,
				phone_number: method === 'sms' ? user.phone_number : undefined
			}
		}));
	} catch (err) {
		logger.error(
			'tools/verification/sendVerificationCode publish failed',
			err.message
		);
	}

	return { method };
};

module.exports = {
	getEffectiveVerificationMethod,
	sendVerificationCode
};
