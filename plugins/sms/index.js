'use strict';

const app = require('../index');
const { verifyToken, checkScopes, findUser } = require('../common');
const PhoneNumber = require('awesome-phonenumber');
const bodyParser = require('body-parser');
const { createSMSCode, storeSMSCode, checkSMSCode, deleteSMSCode, sendSMS, updateUserPhoneNumber } = require('./helpers');
const { DEFAULT_LANGUAGE } = require('../../constants');
const { SMS } = require('../../mail/strings').languageFile(DEFAULT_LANGUAGE);
const {
	SMS_INVALID_PHONE,
	SMS_SUCCESS,
	PHONE_VERIFIED
} = require('./messages');

app.get('/plugins/sms/verify', verifyToken, (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const phoneNumber = new PhoneNumber(req.body.phone);
	const { id } = req.auth.sub;

	if (!phoneNumber.isValid()) {
		return res.status(400).json({ message: SMS_INVALID_PHONE });
	}

	const phone = phoneNumber.getNumber();
	const code = createSMSCode();

	sendSMS(phone, {
		message: SMS.verificationCode(code)
	})
		.then((data) => {
			return storeSMSCode(id, phone, code);
		})
		.then((data) => {
			res.json({ message: SMS_SUCCESS });
		})
		.catch((error) => {
			return res.status(error.statusCode || 400).json({ message: error.message });
		});
});

app.post('/plugins/sms/verify', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { id } = req.auth.sub;
	const { code } = req.body;
	const phoneNumber = new PhoneNumber(req.body.phone);

	if (!phoneNumber.isValid()) {
		return res.status(400).json({ message: SMS_INVALID_PHONE });
	}

	const phone = phoneNumber.getNumber();

	checkSMSCode(id, phone, code)
		.then((data) => {
			return findUser({
				where: { id }, attributes: ['id', 'phone_number']
			})
		})
		.then((user) => {
			return updateUserPhoneNumber(user, phone);
		})
		.then(() => {
			return deleteSMSCode(id);
		})
		.then((data) => {
			res.json({ message: PHONE_VERIFIED });
		})
		.catch((error) => {
			return res.status(error.statusCode || 400).json({ message: error.message });
		});
});