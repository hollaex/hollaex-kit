'use strict';
const TABLE = 'Status';

const templetes = [
	'SUSPICIOUS_LOGIN',
]

const languages = {
	'SUSPICIOUS_LOGIN': {
		'en': require('../../mail/strings/en.json').en.SUSPICIOUS_LOGIN,
	},

};

const models = require('../models');


module.exports = {
	async up(queryInterface) {

		for (const templete of templetes) {
			const statusModel = models[TABLE];
			const status = await statusModel.findOne({});

			if (!status?.email) return;
			const emailTemplates = {
				...status.email,
			};

			let hasTemplate = true;
			for (const [language, emailTemplate] of Object.entries(languages[templete])) {

				if (status.email && status.email[language] && !status.email[language].hasOwnProperty(templete)) {
					hasTemplate = false;
					emailTemplates[language] = {
						...status.email[language],
						[templete]: emailTemplate
					};
				}
			}

			if (!hasTemplate) {
				await statusModel.update(
					{ email: emailTemplates },
					{ where: { id: status.id } }
				);
			}
		}
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
