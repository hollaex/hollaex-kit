'use strict';

/**
 * Resets Status.email to the static JSON email templates stored in `server/mail/strings/*.json`.
 *
 * Usage:
 *   node server/tools/setMailTemplates.js
 */

const { Status } = require('../db/models');
const { publisher } = require('../db/pubsub');
const { CONFIGURATION_CHANNEL } = require('../constants');

const templates = {
	en: require('../mail/strings/en.json').en,
	ar: require('../mail/strings/ar.json').ar,
	de: require('../mail/strings/de.json').de,
	es: require('../mail/strings/es.json').es,
	fa: require('../mail/strings/fa.json').fa,
	fr: require('../mail/strings/fr.json').fr,
	id: require('../mail/strings/id.json').id,
	ja: require('../mail/strings/ja.json').ja,
	ko: require('../mail/strings/ko.json').ko,
	mn: require('../mail/strings/mn.json').mn,
	pt: require('../mail/strings/pt.json').pt,
	tr: require('../mail/strings/tr.json').tr,
	ur: require('../mail/strings/ur.json').ur,
	vi: require('../mail/strings/vi.json').vi,
	zh: require('../mail/strings/zh.json').zh
};

const main = async () => {
	const langs = Object.keys(templates);
	if (!langs.length) {
		throw new Error('No email templates found');
	}

	const status = await Status.findOne({});
	let updatedStatus;

	if (status) {
		updatedStatus = await status.update(
			{ email: templates },
			{ fields: ['email'], returning: true }
		);
	} else {
		updatedStatus = await Status.create({ email: templates });
	}

	publisher.publish(
		CONFIGURATION_CHANNEL,
		JSON.stringify({
			type: 'update',
			data: { email: updatedStatus.email }
		})
	);

	console.log(`Mail templates are reset for languages: ${langs.join(', ')}`);
	process.exit(0);
};

main().catch((err) => {
	console.error('Error', err);
	process.exit(1);
});



