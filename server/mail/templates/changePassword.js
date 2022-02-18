'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if (emailConfigurations[language] && emailConfigurations[language]['CHANGEPASSWORD']) {
		const stringDynamic = emailConfigurations[language]['CHANGEPASSWORD'];
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
	const link = `${domain}/confirm-change-password/${data.code}`;
	const CHANGEPASSWORD = require('../strings').getStringObject(language, 'CHANGEPASSWORD');
	return `
	<div>
		<p>
		${CHANGEPASSWORD.GREETING(email)}
		</p>
		<p>
		${CHANGEPASSWORD.BODY[1]}<br />
		${CHANGEPASSWORD.BODY[2]}<br />
		</p>
		${Button(link, CHANGEPASSWORD.BODY[3])}
		<p>
		${CHANGEPASSWORD.BODY[4]}
		</p>
		<p>
		${CHANGEPASSWORD.BODY[5](data.ip)}
		</p>
		<p>
		${CHANGEPASSWORD.CLOSING[1]}<br />
		${CHANGEPASSWORD.CLOSING[2]()}
		</p>
	</div>
  `;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/change-password-confirm/${data.code}`;
	const CHANGEPASSWORD = require('../strings').getStringObject(language, 'CHANGEPASSWORD');
	return `
	${CHANGEPASSWORD.GREETING(email)}.
	${CHANGEPASSWORD.BODY[1]}
	${CHANGEPASSWORD.BODY[2]}
	${CHANGEPASSWORD.BODY[3]}(${link})
	${CHANGEPASSWORD.BODY[4]}
	${CHANGEPASSWORD.BODY[5](data.ip)}
	${CHANGEPASSWORD.CLOSING[1]}
	${CHANGEPASSWORD.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/confirm-change-password/${data.code}`;
	const CHANGEPASSWORD = require('../strings').getStringObject(language, 'CHANGEPASSWORD');
	return `
    <div>
      <p>
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : CHANGEPASSWORD.GREETING(email)}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : CHANGEPASSWORD.BODY[1]}<br />
        ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : CHANGEPASSWORD.BODY[2]}<br />        
      </p>
      ${Button(link, (stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : CHANGEPASSWORD.BODY[3])}
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : CHANGEPASSWORD.BODY[4]}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.ip) : CHANGEPASSWORD.BODY[5](data.ip)}
      </p>
      <p>
      	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : CHANGEPASSWORD.CLOSING[1]}<br />
        	${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : CHANGEPASSWORD.CLOSING[2]()}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/change-password-confirm/${data.code}`;
	const CHANGEPASSWORD = require('../strings').getStringObject(language, 'CHANGEPASSWORD');
	return `
    ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : CHANGEPASSWORD.GREETING(email)}.
    ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : CHANGEPASSWORD.BODY[1]}
    ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : CHANGEPASSWORD.BODY[2]}
    ${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : CHANGEPASSWORD.BODY[3]}(${link})
	 ${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : CHANGEPASSWORD.BODY[4]}
	 ${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.ip) : CHANGEPASSWORD.BODY[5](data.ip)}
	 ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : CHANGEPASSWORD.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : CHANGEPASSWORD.CLOSING[2]()}

  `;
};

module.exports = fetchMessage;
