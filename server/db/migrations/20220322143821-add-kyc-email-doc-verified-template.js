'use strict';


const TABLE = 'Statuses';
const COLUMN = 'email';
const LANGUAGE_DEFAULT = 'en';
const MAILTYPE = 'DOC_VERIFIED';

module.exports = {
	up: (queryInterface) => {
		return queryInterface.sequelize.query (
			`UPDATE public."${TABLE}"SET
		${COLUMN} = jsonb_set(${COLUMN}, '{${LANGUAGE_DEFAULT}, ${MAILTYPE}}', '${JSON.stringify(doc_verified_email_template)}')`
		)
	},
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

const doc_verified_email_template = {
	"html": "<div><p>Dear ${email} </p><p>Your uploaded KYC documents have been approved.<br>You now have access to all exchange features that require identity verification.</p><ul>${doc_information}</ul><p>To view your approved documents, visit your <a href=\"${link}\" target=\"_blank\">Verification page</a></p><p> Regards<br> ${api_name} team </p></div>",
	"title": "KYC Documents Approved"
};

