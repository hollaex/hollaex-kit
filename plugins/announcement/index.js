'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { postAnnouncement, deleteAnnouncement } = require('./helpers');
const bodyParser = require('body-parser');
const { logger } = require('../helpers/common');
// const { sendEmail } = require('../../mail');
// const { MAILTYPE } = require('../../mail/strings');

app.post('/plugins/announcement', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/announcement auth',
		req.auth.sub
	);

	const { title, message, type } = req.body;

	logger.info(
		'POST /plugins/announcement announcement',
		title,
		type
	);

	postAnnouncement(req.auth.sub.id, title, message, type)
		.then((announcement) => {
			logger.debug('POST /plugins/announcement success ID: ', announcement.dataValues.id);
			res.json(announcement);
		})
		.catch((error) => {
			logger.error('POST /plugins/announcement error', error.message);
			res.status(error.status || 400).json({ message: error.message });
		});
});

app.delete('/plugins/announcement/:id', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'DELETE /plugins/announcement auth',
		req.auth.sub
	);

	const id = req.params.id;

	deleteAnnouncement(id)
		.then(() => {
			logger.debug('DELETE /plugins/announcement success ID: ', id);
			res.json(`Announcement ${id} successfully deleted`);
		})
		.catch((error) => {
			logger.error('DELETE /plugins/announcement error', error.message);
			res.status(error.status || 400).json({ message: error.message });
		});
});