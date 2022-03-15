'use strict';


const TABLE = 'Statuses';
const COLUMN = 'email';
const LANGUAGE_DEFAULT = 'en';
const MAILTYPE = 'CONFIRM_EMAIL';

module.exports = {
	up: (queryInterface) => queryInterface.sequelize.query (
		`UPDATE public."${TABLE}"SET
		${COLUMN} = jsonb_set(${COLUMN}, '{${LANGUAGE_DEFAULT}, ${MAILTYPE}}', '${JSON.stringify(confirm_email_template)}')`
	),
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

const confirm_email_template = {
	"html": "<div><p><p> Dear ${name} </p></p><p>You have made sensitive request related to your accounts security. To verify the operation you would require to use to code below to authorize this operation.<br /><p style=\"font-size: 1.2rem; text-align: center;\">${code}</p>If you did not make this request, report this immidiately and proceed to change your crendetials as soon as possible.</p><p> Regards<br> ${api_name} team </p></div>",
	"title": "Security Verification"
}


