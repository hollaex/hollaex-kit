'use strict';


const TABLE = 'Statuses';
const COLUMN = 'email';
const LANGUAGE_DEFAULT = 'en';
const MAILTYPE = 'DOC_REJECTED';

module.exports = {
	up: (queryInterface) => {
		return queryInterface.sequelize.query (
			`UPDATE public."${TABLE}"SET
		${COLUMN} = jsonb_set(${COLUMN}, '{${LANGUAGE_DEFAULT}, ${MAILTYPE}}', '${JSON.stringify(doc_rejected_email_template)}')`
		)
	},
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

const doc_rejected_email_template = {
	"html": "<div><p>Dear ${email} </p><p>Unfortunately, your uploaded KYC documents have been rejected.<br>The reasons for your documents being rejected are listed below.<br></p><div><ul>${doc_information}</ul></div><p>If you feel these reasons are invalid, please feel free to reply to this email.<br>Otherwise, please reupload valid documents in order to verify your identity.</p><p> Regards<br> ${api_name} team </p</div>",
	"title": "KYC Documents Rejected"
};

