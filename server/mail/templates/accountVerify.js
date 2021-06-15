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
    const ACCOUNTVERIFY = require('../strings').getStringObject(language, 'ACCOUNTVERIFY');
	return `
        <div>
            <p>
                ${ACCOUNTVERIFY.GREETING(email)}
            </p>
            <p>
                ${ACCOUNTVERIFY.BODY[1]}
            </p>
            ${Button(link, ACCOUNTVERIFY.BODY[2])}
            <p>
                ${ACCOUNTVERIFY.CLOSING[1]}<br />
                ${ACCOUNTVERIFY.CLOSING[2]()}
            </p>
        </div>
    `;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/trade`;
    const ACCOUNTVERIFY = require('../strings').getStringObject(language, 'ACCOUNTVERIFY');
	return `
        ${ACCOUNTVERIFY.GREETING(email)}
        ${ACCOUNTVERIFY.BODY[1]}
        ${ACCOUNTVERIFY.BODY[2]}(${link})
        ${ACCOUNTVERIFY.CLOSING[1]} ${ACCOUNTVERIFY.CLOSING[2]()}
    `;
};

module.exports = fetchMessage;
