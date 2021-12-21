'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['ACCOUNTUPGRADE']) {
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
	return `
        <div>
            <p>
                ${stringDynamic.GREETING.format(email)}
            </p>
            <p>
                ${stringDynamic.BODY[1].format(data)}
            </p>
            ${Button(link, stringDynamic.BODY[2])}
            <p>
                ${stringDynamic.CLOSING[1]}<br />
                ${stringDynamic.CLOSING[2].format(API_NAME())}
            </p>
        </div>
    `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/trade`;
	return `
        ${stringDynamic.GREETING.format(email)}
        ${stringDynamic.BODY[1].format(data)}
        ${stringDynamic.BODY[2]}(${link})
        ${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2].format(API_NAME())}
    `;
};

module.exports = fetchMessage;
