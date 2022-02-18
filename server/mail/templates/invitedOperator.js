'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['INVITEDOPERATOR']) {
		const stringDynamic = emailConfigurations[language]['INVITEDOPERATOR'];
		return {
			html: htmlDynamic(email, data, language, domain, stringDynamic),
			text: textDynamic(email, data, language, domain, stringDynamic)
		};
	}
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/login`;
	const { invitingEmail, created, password, role } = data;
	const INVITEDOPERATOR = require('../strings').getStringObject(language, 'INVITEDOPERATOR');

	let body;
	if (created) {
		body = `
			<p>
				${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[1]) ? stringDynamic.BODY.CREATED[1].format(role, invitingEmail, API_NAME()) : INVITEDOPERATOR.BODY.CREATED[1](role, invitingEmail)}<br />
			</p>
			<p>
				${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[2]) ? stringDynamic.BODY.CREATED[2] : INVITEDOPERATOR.BODY.CREATED[2]}<br />
			</p>
				<div>
					<div>${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[3]) ? stringDynamic.BODY.CREATED[3].format(email) : INVITEDOPERATOR.BODY.CREATED[3](email)}</div>
					<div>${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[4]) ? stringDynamic.BODY.CREATED[4].format(password) : INVITEDOPERATOR.BODY.CREATED[4](password)}</div>
				</div>
			</p>
			${Button(link, (stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[5]) ? stringDynamic.BODY.CREATED[5] : INVITEDOPERATOR.BODY.CREATED[5])}
		`;
	} else {
		body = `
			<p>
				${(stringDynamic.BODY && stringDynamic.BODY.EXISTING && stringDynamic.BODY.EXISTING[1]) ? stringDynamic.BODY.EXISTING[1].format(role, invitingEmail, API_NAME()) : INVITEDOPERATOR.BODY.EXISTING[1](role, invitingEmail)}<br />
			</p>
			${Button(link, (stringDynamic.BODY && stringDynamic.BODY.EXISTING && stringDynamic.BODY.EXISTING[2]) ? stringDynamic.BODY.EXISTING[2] : INVITEDOPERATOR.BODY.EXISTING[2])}
		`;
	}

	return `
		<div>
			<p>
				${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : INVITEDOPERATOR.GREETING(email)}
			</p>
			${body}
			<p>
        		${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : INVITEDOPERATOR.CLOSING[1]}<br />
        		${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : INVITEDOPERATOR.CLOSING[2]()}
      	</p>
		</div>
	`;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/login`;
	const INVITEDOPERATOR = require('../strings').getStringObject(language, 'INVITEDOPERATOR');
	const { invitingEmail, created, password, role } = data;
	let body;

	if (created) {
		body = `
			${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[1]) ? stringDynamic.BODY.CREATED[1].format(role, invitingEmail, API_NAME()) : INVITEDOPERATOR.BODY.CREATED[1](role, invitingEmail)}
			${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[2]) ? stringDynamic.BODY.CREATED[2] : INVITEDOPERATOR.BODY.CREATED[2]}
			${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[3]) ? stringDynamic.BODY.CREATED[3].format(email) : INVITEDOPERATOR.BODY.CREATED[3](email)}
			${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[4]) ? stringDynamic.BODY.CREATED[4].format(password) : INVITEDOPERATOR.BODY.CREATED[4](password)}
			${(stringDynamic.BODY && stringDynamic.BODY.CREATED && stringDynamic.BODY.CREATED[5]) ? stringDynamic.BODY.CREATED[5] : INVITEDOPERATOR.BODY.CREATED[5]}(${link})
		`;
	} else {
		body = `
			${(stringDynamic.BODY && stringDynamic.BODY.EXISTING && stringDynamic.BODY.EXISTING[1]) ? stringDynamic.BODY.EXISTING[1].format(role, invitingEmail, API_NAME()) : INVITEDOPERATOR.BODY.EXISTING[1](role, invitingEmail)}
			${(stringDynamic.BODY && stringDynamic.BODY.EXISTING && stringDynamic.BODY.EXISTING[2]) ? stringDynamic.BODY.EXISTING[2] : INVITEDOPERATOR.BODY.EXISTING[2]}(${link})
		`;
	}

	return `
		${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : INVITEDOPERATOR.GREETING(email)}
		${body}
    	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : INVITEDOPERATOR.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : INVITEDOPERATOR.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
