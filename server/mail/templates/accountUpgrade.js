'use strict';

const { Button } = require('./helpers/common');

const fetchMessage = (email, data, language, domain) => {
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

module.exports = fetchMessage;
