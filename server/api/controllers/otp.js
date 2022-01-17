'use strict';

const { INVALID_OTP_CODE } = require('../../messages');
const { loggerOtp } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const requestOtp = (req, res) => {
	loggerOtp.verbose(req.uuid, 'controllers/otp/requestOtp', req.auth);
	const { id } = req.auth.sub;

	toolsLib.security.checkOtp(id)
		.then((otpCode) => {
			if (otpCode) {
				return otpCode.secret;
			}
			return toolsLib.security.createOtp(id);
		})
		.then((secret) => {
			loggerOtp.verbose(req.uuid, 'controllers/otp/requestOtp', secret);
			return res.json({ secret });
		})
		.catch((err) => {
			loggerOtp.error(req.uuid, 'controllers/otp/requestOtp', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.security.checkOtp(id)
		.then((otpCode) => {
			return toolsLib.security.verifyOtp(otpCode.secret, code);
		})
		.then((validOtp) => {
			loggerOtp.verbose(req.uuid, 'controllers/otp/activateOtp', validOtp);
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return toolsLib.security.setActiveUserOtp(id);
		})
		.then((user) => {
			loggerOtp.verbose(
				req.uuid,
				'controllers/otp/activateOtp',
				user.dataValues
			);
			return res.json({ message: 'OTP enabled' });
		})
		.catch((err) => {
			loggerOtp.error(req.uuid, 'controllers/otp/activateOtp', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
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

	toolsLib.security.hasUserOtpEnabled(id)
		.then((otp_enabled) => {
			if (!otp_enabled) {
				throw new Error('OTP is not enabled');
			}
			return toolsLib.security.verifyOtpBeforeAction(id, code);
		})
		.then(() => {
			return toolsLib.security.updateUserOtpEnabled(id, false);
		})
		.then(() => {
			return res.json({ message: 'OTP disabled' });
		})
		.catch((err) => {
			loggerOtp.error(
				req.uuid,
				'controllers/otp/deactivateOtp',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const deactivateOtpAdmin = (req, res) => {
	loggerOtp.verbose(
		req.uuid,
		'controllers/otp/deactivateOtpAdmin/auth',
		req.auth
	);
	const { user_id } = req.swagger.params.data.value;

	toolsLib.user.deactivateUserOtpById(user_id)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerOtp.error(
				req.uuid,
				'controllers/otp/deactivateOtpAdmin',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

module.exports = {
	requestOtp,
	activateOtp,
	deactivateOtp,
	deactivateOtpAdmin
};
