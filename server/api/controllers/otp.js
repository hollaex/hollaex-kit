'use strict';

const {
	createOtp,
	findUserOtp,
	verifyOtp,
	setActiveUserOtp,
	verifyOtpBeforeAction,
	hasUserOtpEnabled,
	updateUserOtpEnabled
} = require('../helpers/otp');
const { INVALID_OTP_CODE } = require('../../messages');
const { loggerOtp } = require('../../config/logger');

const checkOtp = (user_id) => {
	return hasUserOtpEnabled(user_id).then((otp_enabled) => {
		if (otp_enabled) {
			throw new Error('OTP is already enabled');
		}
		return findUserOtp(user_id);
	});
};

const requestOtp = (req, res) => {
	loggerOtp.verbose(req.uuid, 'controllers/otp/requestOtp', req.auth);
	const { id } = req.auth.sub;

	checkOtp(id)
		.then((otpCode) => {
			if (otpCode) {
				return otpCode.secret;
			}
			return createOtp(id);
		})
		.then((secret) => {
			loggerOtp.verbose(req.uuid, 'controllers/otp/requestOtp', secret);
			res.json({ secret });
		})
		.catch((err) => {
			loggerOtp.error(req.uuid, 'controllers/otp/requestOtp', err.message);
			res.status(400).json({ message: err.message });
		});
};

const activateOtp = (req, res) => {
	loggerOtp.verbose(req.uuid, 'controllers/otp/activateOtp', req.auth);
	const { id } = req.auth.sub;
	const { code } = req.swagger.params.data.value;
	loggerOtp.verbose(
		req.uuid,
		'controllers/otp/activateOtp/code',
		req.swagger.params.data
	);

	checkOtp(id)
		.then((otpCode) => {
			return verifyOtp(otpCode.secret, code);
		})
		.then((validOtp) => {
			loggerOtp.verbose(req.uuid, 'controllers/otp/activateOtp', validOtp);
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return setActiveUserOtp(id);
		})
		.then((user) => {
			loggerOtp.verbose(
				req.uuid,
				'controllers/otp/activateOtp',
				user.dataValues
			);
			res.json({ message: 'OTP enabled' });
		})
		.catch((err) => {
			loggerOtp.error(req.uuid, 'controllers/otp/activateOtp', err.message);
			res.status(400).json({ message: err.message });
		});
};

const deactivateOtp = (req, res) => {
	loggerOtp.verbose(req.uuid, 'controllers/otp/deactivateOtp', req.auth);
	const { id } = req.auth.sub;
	const { code } = req.swagger.params.data.value;
	loggerOtp.verbose(
		req.uuid,
		'controllers/otp/deactivateOtp/code',
		req.swagger.params.data
	);

	hasUserOtpEnabled(id)
		.then((otp_enabled) => {
			if (!otp_enabled) {
				throw new Error('OTP is not enabled');
			}
			return verifyOtpBeforeAction(id, code);
		})
		.then(() => {
			return updateUserOtpEnabled(id, false);
		})
		.then(() => {
			res.json({ message: 'OTP disabled' });
		})
		.catch((err) => {
			loggerOtp.error(
				req.uuid,
				'controllers/otp/deactivateOtp',
				err.message
			);
			res.status(400).json({ message: err.message });
		});
};

module.exports = {
	requestOtp,
	activateOtp,
	deactivateOtp
};
