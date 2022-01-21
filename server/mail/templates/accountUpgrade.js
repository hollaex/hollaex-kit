'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if (emailConfigurations[language] && emailConfigurations[language]['ACCOUNTUPGRADE']) {
		const stringDynamic = emailConfigurations[language]['ACCOUNTUPGRADE'];
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
	const link = `${domain}/trade`;
	const ACCOUNTUPGRADE = require('../strings').getStringObject(language, 'ACCOUNTUPGRADE');
	return `
        <div>
            <p>
                ${ACCOUNTUPGRADE.GREETING(email)}
            </p>
            <p>
                ${ACCOUNTUPGRADE.BODY[1](data)}
            </p>
            ${Button(link, ACCOUNTUPGRADE.BODY[2])}
            <p>
                ${ACCOUNTUPGRADE.CLOSING[1]}<br />
                ${ACCOUNTUPGRADE.CLOSING[2]()}
            </p>
        </div>
    `;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/trade`;
	const ACCOUNTUPGRADE = require('../strings').getStringObject(language, 'ACCOUNTUPGRADE');
	return `
        ${ACCOUNTUPGRADE.GREETING(email)}
        ${ACCOUNTUPGRADE.BODY[1](data)}
        ${ACCOUNTUPGRADE.BODY[2]}(${link})
        ${ACCOUNTUPGRADE.CLOSING[1]} ${ACCOUNTUPGRADE.CLOSING[2]()}
    `;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/trade`;
	const ACCOUNTUPGRADE = require('../strings').getStringObject(language, 'ACCOUNTUPGRADE');
	return `
        <div>
            <p>
                ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : ACCOUNTUPGRADE.GREETING(email)}
            </p>
            <p>
                ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data) : ACCOUNTUPGRADE.BODY[1](data)}
            </p>
            ${Button(link, (stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : ACCOUNTUPGRADE.BODY[2])}
            <p>
                 	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : ACCOUNTUPGRADE.CLOSING[1]}<br />
        				${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : ACCOUNTUPGRADE.CLOSING[2]()}
            </p>
        </div>
    `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/trade`;
	const ACCOUNTUPGRADE = require('../strings').getStringObject(language, 'ACCOUNTUPGRADE');
	return `
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : ACCOUNTUPGRADE.GREETING(email)}
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data) : ACCOUNTUPGRADE.BODY[1](data)}
        ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : ACCOUNTUPGRADE.BODY[2]}(${link})
        ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : ACCOUNTUPGRADE.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : ACCOUNTUPGRADE.CLOSING[2]()}
    `;
};

module.exports = fetchMessage;
