'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { findUser } = require('../helpers/user');
const { logger } = require('../helpers/common');

const REQUIRED_XHT = 100;

app.get('/plugins/activate-xht-fee', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const email = req.auth.sub.email;
	const id = req.auth.sub.id;

	logger.verbose(
		'GET /plugins/activate-xht-fee',
		id,
		email
	);

	findUser({
		where: { id },
		include: [
			{
				model: Balance,
				as: 'balance',
				attributes: {
					exclude: ['id', 'user_id', 'created_at']
				}
			}
		]
	})
		.then((user) => {
			if (user.custom_fee) {
				throw new Error('XHT fee is already activated');
			}
			if (user.balance_xht < REQUIRED_XHT) {
				throw new Error('Require minimum 100 XHT in your wallet for activating this service');
			}
			return user.update({ custom_fee: true }, { fields: ['custom_fee'], returning: true });

		})
		.then((user) => {
			return res.json({ message: 'Success'});
		})
		.catch((err) => {
			logger.error('GET /plugins/activate-xht-fee error', err);
			res.status(400).json({ message: err.message });
		});
});