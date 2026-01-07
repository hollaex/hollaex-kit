'use strict';
const TABLE = 'Status';
const models = require('../models');

const languageCodes = ['en','ar','de','es','fa','fr','id','ja','ko','pt','vi','zh','tr','ur','mn'];

const getTemplate = (lang) => {
	try {
		const file = require(`../../mail/strings/${lang}.json`);
		const obj = file[lang];
		return obj && obj.SUBACCOUNT_REMOVED ? obj.SUBACCOUNT_REMOVED : null;
	} catch (e) {
		return null;
	}
};

module.exports = {
	async up() {
		const statusModel = models[TABLE];
		const status = await statusModel.findOne({});
		if (!status?.email) return;

		const emailTemplates = { ...status.email };
		let needsUpdate = false;
		const enTemplate = getTemplate('en');

		for (const lang of languageCodes) {
			const existing = status.email[lang];
			if (!existing) continue;
			if (!existing.SUBACCOUNT_REMOVED) {
				const tmpl = getTemplate(lang) || enTemplate;
				if (tmpl) {
					needsUpdate = true;
					emailTemplates[lang] = {
						...existing,
						SUBACCOUNT_REMOVED: tmpl
					};
				}
			}
		}

		if (needsUpdate) {
			await statusModel.update(
				{ email: emailTemplates },
				{ where: { id: status.id } }
			);
		}
	},
	down: () => Promise.resolve()
};


