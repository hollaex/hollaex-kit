'use strict';


const TABLE = 'Statuses';
const COLUMN = 'email';
const LANGUAGE_DEFAULT = 'en';
const DOC_VERIFIED = 'DOC_VERIFIED';
const DOC_REJECTED = 'DOC_REJECTED';

module.exports = {
	up: (queryInterface) => queryInterface.sequelize.query (
		`UPDATE public."${TABLE}"SET
		${COLUMN} = jsonb_set(${COLUMN}, '{${LANGUAGE_DEFAULT}, ${DOC_VERIFIED}}', '${JSON.stringify(doc_verified_email_template)}'),
		${COLUMN} = jsonb_set(${COLUMN}, '{${LANGUAGE_DEFAULT}, ${DOC_REJECTED}}', '${JSON.stringify(doc_rejected_email_template)}')`

	),
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

const doc_verified_email_template = {
	"html": "<div><p>Dear ${email} </p><p>Your uploaded KYC documents have been approved.<br>You now have access to all exchange features that require identity verification.</p><ul>${doc_information}</ul><p>To view your approved documents, visit your <a href=\"${link}\" target='_blank'>Verification page</a></p><p> Regards<br> ${api_name} team </p></div>",
	"title": "KYC Documents Approved"
};
const doc_rejected_email_template = {
	"html": "<div><p>Dear ${email} </p><p>Unfortunately, your uploaded KYC documents have been rejected.<br>The reasons for your documents being rejected are listed below.<br></p><div><ul>${doc_information}</ul></div><p>If you feel these reasons are invalid, please feel free to reply to this email.<br>Otherwise, please reupload valid documents in order to verify your identity.</p><p> Regards<br> ${api_name} team </p</div>",
	"title": "KYC Documents Rejected"
};

