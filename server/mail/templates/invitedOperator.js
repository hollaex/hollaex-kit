'use strict';

const { Button } = require('./helpers/common');

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const link = `${domain}/login`;
	const INVITEDOPERATOR = require('../strings').getStringObject(language, 'INVITEDOPERATOR');
	const { invitingEmail, created, password, role } = data;
	let body;
	if (created) {
		body = `
			<p>
				${INVITEDOPERATOR.BODY.CREATED[1](role, invitingEmail)}<br />
			</p>
			<p>
				${INVITEDOPERATOR.BODY.CREATED[2]}<br />
			</p>
				<div>
					<div>${INVITEDOPERATOR.BODY.CREATED[3](email)}</div>
					<div>${INVITEDOPERATOR.BODY.CREATED[4](password)}</div>
				</div>
			</p>
			${Button(link, INVITEDOPERATOR.BODY.CREATED[5])}
		`;
	} else {
		body = `
			<p>
				${INVITEDOPERATOR.BODY.EXISTING[1](role, invitingEmail)}<br />
			</p>
			${Button(link, INVITEDOPERATOR.BODY.EXISTING[2])}
		`;
	}

	return `
		<div>
			<p>
				${INVITEDOPERATOR.GREETING(email)}
			</p>
			${body}
			<p>
				${INVITEDOPERATOR.CLOSING[1]}<br />
				${INVITEDOPERATOR.CLOSING[2]()}
			</p>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/login`;
	const INVITEDOPERATOR = require('../strings').getStringObject(language, 'INVITEDOPERATOR');
	const { invitingEmail, created, password, role } = data;
	let body;

	if (created) {
		body = `
			${INVITEDOPERATOR.BODY.CREATED[1](role, invitingEmail)}
			${INVITEDOPERATOR.BODY.CREATED[2]}
			${INVITEDOPERATOR.BODY.CREATED[3](email)}
			${INVITEDOPERATOR.BODY.CREATED[4](password)}
			${INVITEDOPERATOR.BODY.CREATED[5]}(${link})
		`;
	} else {
		body = `
			${INVITEDOPERATOR.BODY.EXISTING[1](role, invitingEmail)}
			${INVITEDOPERATOR.BODY.EXISTING[2]}(${link})
		`;
	}

	return `
		${INVITEDOPERATOR.GREETING(email)}
		${body}
		${INVITEDOPERATOR.CLOSING[1]} ${INVITEDOPERATOR.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
